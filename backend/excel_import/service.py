"""
Service for processing Excel files and converting to JSON
با قابلیت دسته‌بندی خودکار محصولات
"""

import pandas as pd
import openpyxl
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify
from products.models import Product, Category
from .models import ExcelImportLog, ProductImportError
import json
import re
from typing import Optional, Dict, List, Tuple


class CategoryClassifier:
    """
    کلاس دسته‌بندی خودکار محصولات
    """

    def __init__(self):
        """تعریف قوانین دسته‌بندی"""

        # قوانین بر اساس کلمات کلیدی در نام محصول
        self.keyword_rules = {
            # لوازم آشپزخانه و ظروف
            "ظروف یکبار مصرف": [
                "لیوان",
                "بشقاب",
                "کاسه",
                "ظرف",
                "قاشق",
                "چنگال",
                "کارد",
                "نی",
                "سفره",
                "دستمال کاغذی",
                "فنجان",
            ],
            "آب جمع کن و ابزار نظافت": [
                "آب جع",
                "آب جمع",
                "تی شویی",
                "پارچه",
                "دستمال نظافت",
                "جارو",
            ],
            "فویل و سلفون": [
                "فویل",
                "سلفون",
                "استرچ",
                "نایلون",
                "رول",
                "آلمینیوم",
                "کاغذ کاهی",
            ],
            # محصولات بهداشتی
            "محصولات بهداشتی": [
                "توالت",
                "حوله",
                "کاغذ توالت",
                "دستمال مرطوب",
                "صابون",
                "شامپو",
                "مایع دستشویی",
                "خمیر دندان",
            ],
            # محصولات نظافتی
            "شوینده ها و پاک کننده ها": [
                "مایع ظرف",
                "پودر",
                "شوینده",
                "پاک کننده",
                "سفید کننده",
                "واکس",
                "جرم گیر",
                "چربی گیر",
                "براق کننده",
                "ابراسکاج",
            ],
            # لوازم خانگی
            "لوازم خانگی": [
                "سطل",
                "سبد",
                "باکس",
                "قفسه",
                "رخت",
                "رخت آویز",
                "گیره",
                "طناب",
                "کیسه",
                "زیپ",
                "در",
                "پد",
            ],
            # محصولات غذایی
            "مواد غذایی": [
                "چای",
                "قهوه",
                "شکر",
                "نمک",
                "ادویه",
                "سس",
                "روغن",
                "برنج",
                "ماکارونی",
                "رب",
                "کنسرو",
            ],
        }

        # قوانین بر اساس پیشوند کد کالا (3 رقم اول)
        self.code_prefix_rules = {
            "104": "ابزار و تجهیزات",
            "102": "ظروف یکبار مصرف",
            "900": "متفرقه",
            "101": "محصولات بهداشتی",
            "103": "شوینده ها و پاک کننده ها",
        }

        # دسته‌بندی پیش‌فرض
        self.default_category = "سایر محصولات"

        # سلسله مراتب دسته‌بندی (parent -> children)
        self.category_hierarchy = {
            "محصولات خانگی": [
                "ظروف یکبار مصرف",
                "آب جمع کن و ابزار نظافت",
                "فویل و سلفون",
                "لوازم خانگی",
            ],
            "محصولات بهداشتی و نظافتی": ["محصولات بهداشتی", "شوینده ها و پاک کننده ها"],
            "مواد غذایی و نوشیدنی": ["مواد غذایی"],
        }

    def classify(
        self, product_name: str, product_code: str = None
    ) -> Tuple[str, Optional[str]]:
        """
        دسته‌بندی یک محصول بر اساس نام و کد

        Args:
            product_name: نام محصول
            product_code: کد کالا (اختیاری)

        Returns:
            Tuple[str, Optional[str]]: (دسته اصلی, دسته والد)
        """
        if not product_name or product_name == "nan":
            return self.default_category, None

        product_name_lower = str(product_name).lower().strip()

        # 1. بررسی بر اساس کلمات کلیدی
        category_scores = {}
        for category, keywords in self.keyword_rules.items():
            score = 0
            for keyword in keywords:
                if keyword.lower() in product_name_lower:
                    score += 1
            if score > 0:
                category_scores[category] = score

        # انتخاب دسته با بیشترین امتیاز
        if category_scores:
            best_category = max(category_scores, key=category_scores.get)
            parent_category = self._find_parent_category(best_category)
            return best_category, parent_category

        # 2. بررسی بر اساس کد کالا
        if product_code:
            product_code_str = str(product_code).strip()
            for prefix, category in self.code_prefix_rules.items():
                if product_code_str.startswith(prefix):
                    parent_category = self._find_parent_category(category)
                    return category, parent_category

        # اگر هیچ قانونی اعمال نشد، دسته پیش‌فرض
        return self.default_category, None

    def _find_parent_category(self, category: str) -> Optional[str]:
        """پیدا کردن دسته والد برای یک دسته"""
        for parent, children in self.category_hierarchy.items():
            if category in children:
                return parent
        return None


class ExcelImportService:
    """Service to handle Excel file imports with automatic categorization"""

    def __init__(self, excel_file, import_log):
        self.excel_file = excel_file
        self.import_log = import_log
        self.errors = []
        self.json_data = []
        self.classifier = CategoryClassifier()
        self.created_categories = set()  # برای ذخیره دسته‌های ایجاد شده

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

            # Update products with automatic categorization
            self.update_products()

            # Mark as complete
            self.import_log.status = "success"
            self.import_log.completed_at = timezone.now()
            self.import_log.json_data = self.json_data

            # ذخیره آمار دسته‌بندی
            category_stats = self._get_category_statistics()
            self.import_log.error_details = {
                "category_statistics": category_stats,
                "created_categories": list(self.created_categories),
            }
            self.import_log.save()

            return True

        except Exception as e:
            self.import_log.status = "failed"
            self.import_log.error_message = str(e)
            self.import_log.completed_at = timezone.now()
            self.import_log.save()
            return False

    def read_excel(self):
        """Read Excel file - با پشتیبانی از فرمت bonakdari.xlsx"""
        try:
            # تلاش برای خواندن فایل با header پیش‌فرض
            df = pd.read_excel(self.excel_file.path)

            # پیدا کردن ردیف header واقعی
            header_row = None
            for idx, row in df.iterrows():
                row_values = row.astype(str).values
                # اگر 'کد کالا' یا 'نام کالا' در ردیف باشد، این header است
                if any("کد کالا" in str(val) for val in row_values):
                    header_row = idx
                    break

            # اگر header پیدا شد، دوباره بخوان
            if header_row is not None:
                df = pd.read_excel(self.excel_file.path, header=header_row)

            # حذف ستون‌های اضافی unnamed
            df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

            # حذف ردیف‌های خالی
            df = df.dropna(how="all")

            self.import_log.total_rows = len(df)
            self.import_log.save()

            return df

        except Exception as e:
            self.import_log.status = "failed"
            self.import_log.error_message = f"خطا در خواندن فایل اکسل: {str(e)}"
            self.import_log.save()
            return None

    def convert_to_json(self, df):
        """Convert DataFrame to JSON format"""
        cleaned_data = []

        # نقشه برداری ستون‌ها
        column_map = {}
        for col in df.columns:
            col_lower = str(col).strip().lower()
            if "کد کالا" in col or "کد" in col_lower:
                column_map["sku"] = col
            elif "نام کالا" in col or "نام" in col_lower:
                column_map["name"] = col
            elif "موجودی" in col_lower or "انبار" in col_lower:
                column_map["stock_quantity"] = col
            elif "قیمت فروش" in col_lower or "فروش" in col_lower:
                column_map["sale_price"] = col
            elif "قیمت" in col_lower:
                column_map["price"] = col
            elif "واحد" in col_lower:
                column_map["unit"] = col
            elif "آخرین خرید" in col_lower:
                column_map["last_purchase_price"] = col
            elif "سریال" in col_lower:
                column_map["serial"] = col

        for _, row in df.iterrows():
            clean_item = {}

            # SKU (ضروری)
            if "sku" in column_map:
                sku = row[column_map["sku"]]
                if pd.notna(sku):
                    clean_item["sku"] = str(sku).strip()
                else:
                    continue  # اگر SKU نداره، رد کن
            else:
                continue

            # نام محصول
            if "name" in column_map:
                name = row[column_map["name"]]
                clean_item["name"] = (
                    str(name).strip()
                    if pd.notna(name)
                    else f"محصول {clean_item['sku']}"
                )
            else:
                clean_item["name"] = f"محصول {clean_item['sku']}"

            # قیمت
            if "price" in column_map:
                try:
                    price = row[column_map["price"]]
                    clean_item["price"] = float(price) if pd.notna(price) else 0
                except:
                    clean_item["price"] = 0

            # قیمت فروش
            if "sale_price" in column_map:
                try:
                    sale_price = row[column_map["sale_price"]]
                    clean_item["sale_price"] = (
                        float(sale_price) if pd.notna(sale_price) else None
                    )
                except:
                    clean_item["sale_price"] = None

            # موجودی
            if "stock_quantity" in column_map:
                try:
                    stock = row[column_map["stock_quantity"]]
                    clean_item["stock_quantity"] = (
                        int(float(stock)) if pd.notna(stock) else 0
                    )
                except:
                    clean_item["stock_quantity"] = 0

            # واحد
            if "unit" in column_map:
                unit = row[column_map["unit"]]
                clean_item["unit"] = str(unit).strip() if pd.notna(unit) else "عدد"
            else:
                clean_item["unit"] = "عدد"

            # سریال
            if "serial" in column_map:
                serial = row[column_map["serial"]]
                clean_item["serial"] = str(serial).strip() if pd.notna(serial) else None

            # دسته‌بندی خودکار با استفاده از classifier
            category, parent_category = self.classifier.classify(
                clean_item["name"], clean_item["sku"]
            )
            clean_item["category"] = category
            clean_item["parent_category"] = parent_category

            cleaned_data.append(clean_item)

        self.json_data = cleaned_data

    @transaction.atomic
    def update_products(self):
        """Update products in database with automatic categorization"""
        successful = 0
        failed = 0

        for idx, row_data in enumerate(self.json_data, start=1):
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

                # ایجاد/دریافت دسته‌بندی
                category_name = row_data.get("category", "سایر محصولات")
                parent_category_name = row_data.get("parent_category")

                # ایجاد دسته والد (در صورت وجود)
                parent_category = None
                if parent_category_name:
                    parent_category, parent_created = Category.objects.get_or_create(
                        name=parent_category_name,
                        defaults={
                            "is_active": True,
                            "slug": slugify(parent_category_name, allow_unicode=True),
                        },
                    )
                    if parent_created:
                        self.created_categories.add(parent_category_name)

                # ایجاد دسته اصلی
                category, cat_created = Category.objects.get_or_create(
                    name=category_name,
                    defaults={
                        "is_active": True,
                        "parent": parent_category,
                        "slug": slugify(category_name, allow_unicode=True),
                    },
                )
                if cat_created:
                    self.created_categories.add(category_name)

                # Get or create product
                product, created = Product.objects.get_or_create(
                    sku=sku,
                    defaults={
                        "name": product_name,
                        "stock_quantity": row_data.get("stock_quantity", 0),
                        "price": row_data.get("price", 0),
                        "unit": row_data.get("unit", "عدد"),
                        "category": category,
                        "slug": slugify(f"{product_name}-{sku}", allow_unicode=True),
                    },
                )

                # Update existing product
                if not created:
                    # Update stock and price from Excel
                    if "stock_quantity" in row_data:
                        product.stock_quantity = row_data["stock_quantity"]

                    if "price" in row_data:
                        product.price = row_data["price"]

                    if "sale_price" in row_data and row_data["sale_price"]:
                        product.sale_price = row_data["sale_price"]

                    if (
                        "name" in row_data
                        and row_data["name"]
                        and row_data["name"] != "nan"
                    ):
                        product.name = row_data["name"]

                    if "unit" in row_data:
                        product.unit = row_data["unit"]

                    # به‌روزرسانی دسته‌بندی
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

    def _get_category_statistics(self) -> Dict:
        """دریافت آمار دسته‌بندی محصولات"""
        category_counts = {}
        parent_category_counts = {}

        for product in self.json_data:
            category = product.get("category", "سایر محصولات")
            parent = product.get("parent_category")

            category_counts[category] = category_counts.get(category, 0) + 1

            if parent:
                parent_category_counts[parent] = (
                    parent_category_counts.get(parent, 0) + 1
                )

        return {
            "categories": category_counts,
            "parent_categories": parent_category_counts,
            "total_products": len(self.json_data),
        }
