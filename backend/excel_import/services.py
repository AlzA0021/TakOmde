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
    کلاس دسته‌بندی خودکار محصولات (با قوانین بهینه‌سازی شده)
    """
    
    def __init__(self):
        """تعریف قوانین دسته‌بندی"""
        
        # قوانین بر اساس کلمات کلیدی در نام محصول (Rule-based Classification)
        self.keyword_rules = {
            # ۱. ظروف یکبار مصرف و بسته‌بندی (بیشترین حجم در فایل شما)
            'ظروف یکبار مصرف و بسته‌بندی': [
                'آرکا', 'آرما', 'پلی', 'هات دلیوری', 'ظرف', 'لیوان', 'بشقاب', 
                'کاسه', 'کارد', 'قاشق', 'چنگال', 'نی', 'سفره', 'فويل', 'پاکت',
                'سلفون', 'نایلون', 'رول'
            ],
            
            # ۲. ابزار و لوازم نظافت (تجهیزات و نه مواد شیمیایی)
            'ابزار و لوازم نظافت': [
                'آب جمع کن', 'آب جع کن', 'مهسان', 'برس', 'تی شویی', 'زمین شوی', 
                'دستمال نظافت', 'جارو', 'سطل', 'رخت آویز', 'اسکاج'
            ],
            
            # ۳. مواد شوینده و پاک کننده (شیمیایی)
            'شوینده ها و پاک کننده ها': [
                'پودر لباسشویی', 'مایع ظرف', 'شوینده', 'پاک کننده', 'سفید کننده', 
                'اسپری', 'بوگیر', 'جرم گیر', 'واکس', 'چربی گیر', 'براق کننده'
            ],
            
            # ۴. بهداشت فردی و عمومی (کالاهای حساس)
            'بهداشت فردی و عمومی': [
                'پوشک', 'نوار بهداشتی', 'حوله', 'صابون', 'شامپو', 'دستمال مرطوب', 
                'کاغذ توالت', 'خمیر دندان', 'ایزی لایف'
            ],
            
            # ۵. لوازم خانگی و آشپزخانه متفرقه
            'لوازم خانگی و آشپزخانه': [
                'سطل', 'سبد', 'باکس', 'قفسه', 'رخت', 'گیره', 'طناب', 'کیسه'
            ],
            
            # ۶. مواد غذایی (در صورت وجود در آینده)
            'مواد غذایی': ['چای', 'قهوه', 'شکر', 'نمک', 'ادویه', 'سس', 'روغن']
        }
        
        # قوانین بر اساس پیشوند کد کالا (3 رقم اول) - به عنوان فیلتر دوم
        self.code_prefix_rules = {
            '104': 'ابزار و لوازم نظافت',
            '102': 'ظروف یکبار مصرف و بسته‌بندی',
            '101': 'بهداشت فردی و عمومی',
            '103': 'شوینده ها و پاک کننده ها',
            '900': 'متفرقه',
        }
        
        # دسته‌بندی پیش‌فرض
        self.default_category = 'سایر محصولات'
        
        # سلسله مراتب دسته‌بندی (Parent -> Children)
        self.category_hierarchy = {
            'محصولات خانگی': [
                'ظروف یکبار مصرف و بسته‌بندی',
                'ابزار و لوازم نظافت',
                'لوازم خانگی و آشپزخانه'
            ],
            'بهداشت و شوینده': [
                'بهداشت فردی و عمومی',
                'شوینده ها و پاک کننده ها'
            ],
            'عمومی': [
                'مواد غذایی',
                'سایر محصولات',
                'متفرقه'
            ]
        }
    
    def classify(self, product_name: str, product_code: str = None) -> Tuple[str, Optional[str]]:
        """
        دسته‌بندی یک محصول بر اساس نام و کد
        """
        if not product_name or product_name == 'nan':
            return self.default_category, None
        
        product_name_lower = str(product_name).lower().strip()
        
        # 1. بررسی بر اساس کلمات کلیدی (اولویت بالاتر)
        category_scores = {}
        for category, keywords in self.keyword_rules.items():
            score = 0
            for keyword in keywords:
                if keyword.lower() in product_name_lower:
                    score += 1
            if score > 0:
                category_scores[category] = score
        
        if category_scores:
            best_category = max(category_scores, key=category_scores.get)
            parent_category = self._find_parent_category(best_category)
            return best_category, parent_category
        
        # 2. بررسی بر اساس کد کالا (اولویت دوم)
        if product_code:
            product_code_str = str(product_code).strip()
            for prefix, category in self.code_prefix_rules.items():
                if product_code_str.startswith(prefix):
                    parent_category = self._find_parent_category(category)
                    return category, parent_category
        
        # دسته پیش‌فرض
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
        self.created_categories = set() 

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
            # ذخیره کل داده‌های پردازش شده در log (اختیاری)
            # self.import_log.json_data = self.json_data 
            
            # ذخیره آمار دسته‌بندی
            category_stats = self._get_category_statistics()
            self.import_log.error_details = {
                'category_statistics': category_stats,
                'created_categories': list(self.created_categories)
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
            # خواندن فایل برای پیدا کردن ردیف header واقعی
            df_temp = pd.read_excel(self.excel_file.path, header=None) 
            
            header_row = None
            for idx, row in df_temp.iterrows():
                # تبدیل مقادیر سطر به رشته برای جستجو
                row_values = row.astype(str).values
                # اگر 'کد کالا' یا 'نام کالا' در ردیف باشد، این header است
                if any('کد کالا' in str(val) for val in row_values) and any('نام کالا' in str(val) for val in row_values):
                    header_row = idx
                    break
            
            # اگر header پیدا شد، دوباره بخوان
            if header_row is not None:
                df = pd.read_excel(self.excel_file.path, header=header_row)
            else:
                 # اگر header پیدا نشد، ردیف اول را به عنوان header در نظر بگیر
                df = pd.read_excel(self.excel_file.path)
            
            # حذف ستون‌های اضافی unnamed
            df = df.loc[:, ~df.columns.astype(str).str.contains('^Unnamed')]
            
            # حذف ردیف‌های خالی
            df = df.dropna(how='all')
            
            self.import_log.total_rows = len(df)
            self.import_log.save()
            
            return df

        except Exception as e:
            self.import_log.status = "failed"
            self.import_log.error_message = f"خطا در خواندن فایل اکسل: {str(e)}"
            self.import_log.save()
            return None

    def convert_to_json(self, df):
        """Convert DataFrame to JSON format with data cleaning and categorization"""
        cleaned_data = []
        
        # نقشه برداری ستون‌ها (بر اساس فایل ارسالی شما)
        column_map = {}
        for col in df.columns:
            col_lower = str(col).strip().lower()
            if 'کد کالا' in col_lower or 'کد' in col_lower:
                column_map['sku'] = col
            elif 'نام کالا' in col_lower or 'نام' in col_lower:
                column_map['name'] = col
            elif 'همه انبارها' in col_lower or 'موجودی' in col_lower:
                column_map['stock_quantity'] = col
            # 'آخرین خرید' در فایل شما به عنوان قیمت پایه استفاده می‌شود
            elif 'آخرین خرید' in col_lower:
                column_map['price'] = col 
            elif 'واحد' in col_lower:
                column_map['unit'] = col
            # برای فیلدهای غیرموجود در فایل شما، به عنوان پشتیبان باقی می‌ماند
            elif 'قیمت فروش' in col_lower:
                column_map['sale_price'] = col 

        for idx, row in df.iterrows():
            clean_item = {}
            
            # SKU (ضروری)
            if 'sku' in column_map:
                sku = row[column_map['sku']]
                if pd.notna(sku):
                    # تبدیل SKU به رشته و حذف احتمالی .0 برای اعداد
                    clean_item["sku"] = str(int(sku)) if str(sku).endswith('.0') else str(sku).strip()
                else:
                    # اگر SKU نداره، نمی‌توانیم محصول را ردیابی کنیم
                    self.log_error(idx + 1, None, None, "missing_sku", "کد کالا وجود ندارد")
                    continue
            else:
                self.log_error(idx + 1, None, None, "missing_sku_column", "ستون 'کد کالا' در فایل پیدا نشد")
                continue
            
            # نام محصول
            if 'name' in column_map:
                name = row[column_map['name']]
                clean_item["name"] = str(name).strip() if pd.notna(name) else f"محصول {clean_item['sku']}"
            else:
                clean_item["name"] = f"محصول {clean_item['sku']}"
            
            # --- پاکسازی و تبدیل داده‌های عددی ---
            
            # قیمت (آخرین خرید)
            clean_item["price"] = 0
            if 'price' in column_map:
                try:
                    price_value = row[column_map['price']]
                    if pd.notna(price_value):
                        price_str = str(price_value)
                        # حذف هر چیزی غیر از عدد و نقطه (مثل کاما و فضای خالی)
                        cleaned_price = re.sub(r'[^\d.]', '', price_str)
                        clean_item["price"] = float(cleaned_price) if cleaned_price else 0
                except Exception as e:
                    self.log_error(idx + 1, clean_item["sku"], clean_item["name"], "price_data_error", f"خطا در تبدیل قیمت: {e}")
                    clean_item["price"] = 0
            
            # موجودی
            clean_item["stock_quantity"] = 0
            if 'stock_quantity' in column_map:
                try:
                    stock = row[column_map['stock_quantity']]
                    # ابتدا تبدیل به float برای مدیریت اعداد اعشاری، سپس تبدیل به int
                    clean_item["stock_quantity"] = int(float(stock)) if pd.notna(stock) and float(stock) >= 0 else 0
                except Exception as e:
                    self.log_error(idx + 1, clean_item["sku"], clean_item["name"], "stock_data_error", f"خطا در تبدیل موجودی: {e}")
                    clean_item["stock_quantity"] = 0
            
            # قیمت فروش (اختیاری)
            clean_item["sale_price"] = None
            if 'sale_price' in column_map:
                try:
                    sale_price = row[column_map['sale_price']]
                    if pd.notna(sale_price):
                         sale_price_str = str(sale_price)
                         cleaned_sale_price = re.sub(r'[^\d.]', '', sale_price_str)
                         clean_item["sale_price"] = float(cleaned_sale_price) if cleaned_sale_price else None
                except:
                    clean_item["sale_price"] = None
            
            # واحد
            if 'unit' in column_map:
                unit = row[column_map['unit']]
                clean_item["unit"] = str(unit).strip() if pd.notna(unit) else "عدد"
            else:
                clean_item["unit"] = "عدد"
            
            # --- دسته‌بندی خودکار ---
            category, parent_category = self.classifier.classify(
                clean_item["name"], 
                clean_item["sku"]
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
                    # این حالت نباید رخ دهد چون در convert_to_json فیلتر شده است
                    continue 

                product_name = row_data.get("name", f"محصول {sku}")

                # 1. ایجاد/دریافت دسته‌بندی‌ها
                category_name = row_data.get("category", "سایر محصولات")
                parent_category_name = row_data.get("parent_category")
                
                # ایجاد دسته والد (در صورت وجود)
                parent_category = None
                if parent_category_name:
                    parent_category, parent_created = Category.objects.get_or_create(
                        name=parent_category_name,
                        defaults={
                            "is_active": True,
                            "slug": slugify(parent_category_name, allow_unicode=True)
                        }
                    )
                    if parent_created:
                        self.created_categories.add(parent_category_name)
                
                # ایجاد دسته اصلی (فرزند)
                category, cat_created = Category.objects.get_or_create(
                    name=category_name,
                    defaults={
                        "is_active": True,
                        "parent": parent_category,
                        "slug": slugify(category_name, allow_unicode=True)
                    }
                )
                if cat_created:
                    self.created_categories.add(category_name)

                # 2. ایجاد یا به روزرسانی محصول
                product, created = Product.objects.get_or_create(
                    sku=sku,
                    defaults={
                        "name": product_name,
                        "stock_quantity": row_data.get("stock_quantity", 0),
                        "price": row_data.get("price", 0),
                        "unit": row_data.get("unit", "عدد"),
                        "category": category,
                        "slug": slugify(f"{product_name}-{sku}", allow_unicode=True)
                    },
                )

                # 3. به روزرسانی محصول موجود
                if not created:
                    # فیلدهایی که باید در هر واردات به‌روز شوند
                    product.stock_quantity = row_data.get("stock_quantity", 0)
                    product.price = row_data.get("price", 0)
                    product.name = row_data.get("name")
                    product.unit = row_data.get("unit", "عدد")
                    product.category = category # به‌روزرسانی دسته‌بندی با منطق جدید
                    
                    if row_data.get("sale_price"):
                         product.sale_price = row_data["sale_price"]

                    product.save()

                successful += 1

            except Exception as e:
                self.log_error(
                    idx + 1,
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
            category = product.get('category', 'سایر محصولات')
            parent = product.get('parent_category')
            
            category_counts[category] = category_counts.get(category, 0) + 1
            
            if parent:
                parent_category_counts[parent] = parent_category_counts.get(parent, 0) + 1
        
        return {
            'categories': category_counts,
            'parent_categories': parent_category_counts,
            'total_products': len(self.json_data)
        }