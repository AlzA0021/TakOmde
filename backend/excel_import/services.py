"""
Service for processing Excel files and converting to JSON
"""

import pandas as pd
import openpyxl
from django.db import transaction
from django.utils import timezone
from products.models import Product, Category
from .models import ExcelImportLog, ProductImportError
import json


class ExcelImportService:
    """Service to handle Excel file imports"""

    # Expected column names (customize based on your accounting software export)
    # برای فرمت فایل bonakdari.xlsx
    COLUMN_MAPPING = {
        "کد کالا": "sku",
        "نام کالا": "name",
        "همه انبارها": "stock_quantity",
        "قیمت": "price",
        "قیمت فروش": "sale_price",
        "آخرین خرید": "last_purchase_price",
        "واحد": "unit",
        "دسته‌بندی": "category",
        "توضیحات": "description",
        "سریال": "serial",
    }

    def __init__(self, excel_file, import_log):
        self.excel_file = excel_file
        self.import_log = import_log
        self.errors = []
        self.json_data = []

    def process(self):
        """Main processing method"""
        try:
            self.import_log.status = "processing"
            self.import_log.save()

            # Read Excel file
            df = self.read_excel()

            if df is None:
                return False

            # Convert to JSON
            self.convert_to_json(df)

            # Update products
            self.update_products()

            # Mark as complete
            self.import_log.status = "success"
            self.import_log.completed_at = timezone.now()
            self.import_log.json_data = self.json_data
            self.import_log.save()

            return True

        except Exception as e:
            self.import_log.status = "failed"
            self.import_log.error_message = str(e)
            self.import_log.completed_at = timezone.now()
            self.import_log.save()
            return False

    def read_excel(self):
        """Read Excel file and return DataFrame"""
        try:
            # خواندن فایل با skiprows برای حذف ردیف‌های ابتدایی
            df = pd.read_excel(self.excel_file, engine="openpyxl", skiprows=3)

            # حذف ستون اول (Unnamed: 0) که خالی است
            if "Unnamed: 0" in df.columns:
                df = df.drop(columns=["Unnamed: 0"])

            # بررسی اینکه آیا ردیف اول header است
            first_row = df.iloc[0]
            if "واحد" in first_row.values:
                # ردیف اول header است، آن را به عنوان ستون‌ها تنظیم کن
                df.columns = first_row.values
                df = df.drop(df.index[0])
                df = df.reset_index(drop=True)

            # حذف ردیف‌های خالی
            df = df.dropna(how="all")

            self.import_log.total_rows = len(df)
            self.import_log.save()
            return df

        except Exception as e:
            try:
                # Try reading with xlrd (for .xls)
                df = pd.read_excel(self.excel_file, engine="xlrd", skiprows=3)

                # حذف ستون اول خالی
                if "Unnamed: 0" in df.columns:
                    df = df.drop(columns=["Unnamed: 0"])

                # بررسی ردیف اول
                first_row = df.iloc[0]
                if "واحد" in first_row.values:
                    df.columns = first_row.values
                    df = df.drop(df.index[0])
                    df = df.reset_index(drop=True)

                df = df.dropna(how="all")

                self.import_log.total_rows = len(df)
                self.import_log.save()
                return df
            except Exception as e2:
                self.import_log.error_message = f"خطا در خواندن فایل اکسل: {str(e2)}"
                self.import_log.save()
                return None

    def convert_to_json(self, df):
        """Convert DataFrame to JSON"""
        # Rename columns based on mapping
        df_renamed = df.rename(columns=self.COLUMN_MAPPING)

        # Convert to JSON
        self.json_data = df_renamed.to_dict("records")

        # Clean data
        cleaned_data = []
        for item in self.json_data:
            # Remove NaN values
            clean_item = {k: v for k, v in item.items() if pd.notna(v)}

            # Convert numeric strings to numbers
            if "price" in clean_item:
                try:
                    clean_item["price"] = float(
                        str(clean_item["price"]).replace(",", "")
                    )
                except:
                    pass

            if "sale_price" in clean_item:
                try:
                    clean_item["sale_price"] = float(
                        str(clean_item["sale_price"]).replace(",", "")
                    )
                except:
                    pass

            if "last_purchase_price" in clean_item:
                try:
                    # استفاده از آخرین قیمت خرید به عنوان قیمت اگر قیمت وجود ندارد
                    last_price = float(
                        str(clean_item["last_purchase_price"]).replace(",", "")
                    )
                    if "price" not in clean_item:
                        clean_item["price"] = last_price
                except:
                    pass

            if "stock_quantity" in clean_item:
                try:
                    clean_item["stock_quantity"] = int(
                        float(str(clean_item["stock_quantity"]).replace(",", ""))
                    )
                except:
                    clean_item["stock_quantity"] = 0

            cleaned_data.append(clean_item)

        self.json_data = cleaned_data

    @transaction.atomic
    def update_products(self):
        """Update products in database"""
        successful = 0
        failed = 0

        for idx, row_data in enumerate(
            self.json_data, start=2
        ):  # Start from 2 (1 is header)
            try:
                sku = row_data.get("sku")
                if not sku:
                    self.log_error(idx, None, None, "missing_sku", "کد کالا وجود ندارد")
                    failed += 1
                    continue

                # تبدیل SKU به string
                sku = str(sku).strip()

                # بررسی اینکه آیا نام محصول وجود دارد
                product_name = row_data.get("name", f"محصول {sku}")
                if not product_name or product_name == "nan":
                    product_name = f"محصول {sku}"

                # Get or create product
                product, created = Product.objects.get_or_create(
                    sku=sku,
                    defaults={
                        "name": product_name,
                        "stock_quantity": row_data.get("stock_quantity", 0),
                        "price": row_data.get("price", 0),
                        "unit": row_data.get("unit", "عدد"),
                    },
                )

                # Update existing product
                if not created:
                    # Update stock and price from Excel
                    if "stock_quantity" in row_data:
                        product.stock_quantity = row_data["stock_quantity"]

                    if "price" in row_data:
                        product.price = row_data["price"]

                    if "sale_price" in row_data:
                        product.sale_price = row_data["sale_price"]

                    if (
                        "name" in row_data
                        and row_data["name"]
                        and row_data["name"] != "nan"
                    ):
                        product.name = row_data["name"]

                    if "unit" in row_data:
                        product.unit = row_data["unit"]

                    if "description" in row_data:
                        product.description = row_data["description"]

                    # Handle category
                    if "category" in row_data:
                        category_name = row_data["category"]
                        category, _ = Category.objects.get_or_create(
                            name=category_name, defaults={"is_active": True}
                        )
                        product.category = category

                    product.save()

                successful += 1

            except Exception as e:
                self.log_error(
                    idx,
                    row_data.get("sku"),
                    row_data.get("name"),
                    "update_error",
                    str(e),
                )
                failed += 1

        # Update log statistics
        self.import_log.successful_imports = successful
        self.import_log.failed_imports = failed
        self.import_log.save()

    def log_error(self, row_number, sku, product_name, error_type, error_message):
        """Log an error"""
        ProductImportError.objects.create(
            import_log=self.import_log,
            row_number=row_number,
            sku=sku,
            product_name=product_name,
            error_type=error_type,
            error_message=error_message,
        )
