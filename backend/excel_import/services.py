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
    COLUMN_MAPPING = {
        'کد کالا': 'sku',
        'نام کالا': 'name',
        'موجودی': 'stock_quantity',
        'قیمت': 'price',
        'قیمت فروش': 'sale_price',
        'واحد': 'unit',
        'دسته‌بندی': 'category',
        'توضیحات': 'description',
    }
    
    def __init__(self, excel_file, import_log):
        self.excel_file = excel_file
        self.import_log = import_log
        self.errors = []
        self.json_data = []
    
    def process(self):
        """Main processing method"""
        try:
            self.import_log.status = 'processing'
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
            self.import_log.status = 'success'
            self.import_log.completed_at = timezone.now()
            self.import_log.json_data = self.json_data
            self.import_log.save()
            
            return True
            
        except Exception as e:
            self.import_log.status = 'failed'
            self.import_log.error_message = str(e)
            self.import_log.completed_at = timezone.now()
            self.import_log.save()
            return False
    
    def read_excel(self):
        """Read Excel file and return DataFrame"""
        try:
            # Try reading with openpyxl (for .xlsx)
            df = pd.read_excel(self.excel_file, engine='openpyxl')
            self.import_log.total_rows = len(df)
            self.import_log.save()
            return df
        except Exception as e:
            try:
                # Try reading with xlrd (for .xls)
                df = pd.read_excel(self.excel_file, engine='xlrd')
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
        self.json_data = df_renamed.to_dict('records')
        
        # Clean data
        for item in self.json_data:
            # Remove NaN values
            item = {k: v for k, v in item.items() if pd.notna(v)}
            
            # Convert numeric strings to numbers
            if 'price' in item:
                try:
                    item['price'] = float(str(item['price']).replace(',', ''))
                except:
                    pass
            
            if 'sale_price' in item:
                try:
                    item['sale_price'] = float(str(item['sale_price']).replace(',', ''))
                except:
                    pass
            
            if 'stock_quantity' in item:
                try:
                    item['stock_quantity'] = int(float(str(item['stock_quantity']).replace(',', '')))
                except:
                    item['stock_quantity'] = 0
    
    @transaction.atomic
    def update_products(self):
        """Update products in database"""
        successful = 0
        failed = 0
        
        for idx, row_data in enumerate(self.json_data, start=2):  # Start from 2 (1 is header)
            try:
                sku = row_data.get('sku')
                if not sku:
                    self.log_error(idx, None, None, 'missing_sku', 'کد کالا وجود ندارد')
                    failed += 1
                    continue
                
                # Get or create product
                product, created = Product.objects.get_or_create(
                    sku=sku,
                    defaults={
                        'name': row_data.get('name', f'محصول {sku}'),
                        'stock_quantity': row_data.get('stock_quantity', 0),
                        'price': row_data.get('price', 0),
                        'unit': row_data.get('unit', 'عدد'),
                    }
                )
                
                # Update existing product
                if not created:
                    # Update stock and price from Excel
                    if 'stock_quantity' in row_data:
                        product.stock_quantity = row_data['stock_quantity']
                    
                    if 'price' in row_data:
                        product.price = row_data['price']
                    
                    if 'sale_price' in row_data:
                        product.sale_price = row_data['sale_price']
                    
                    if 'name' in row_data:
                        product.name = row_data['name']
                    
                    if 'unit' in row_data:
                        product.unit = row_data['unit']
                    
                    if 'description' in row_data:
                        product.description = row_data['description']
                    
                    # Handle category
                    if 'category' in row_data:
                        category_name = row_data['category']
                        category, _ = Category.objects.get_or_create(
                            name=category_name,
                            defaults={'is_active': True}
                        )
                        product.category = category
                    
                    product.save()
                
                successful += 1
                
            except Exception as e:
                self.log_error(
                    idx,
                    row_data.get('sku'),
                    row_data.get('name'),
                    'update_error',
                    str(e)
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
            error_message=error_message
        )
