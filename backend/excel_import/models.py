"""
Models for excel_import app
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ExcelImportLog(models.Model):
    """Log of Excel imports"""
    STATUS_CHOICES = [
        ('pending', 'در حال پردازش'),
        ('processing', 'در حال پردازش'),
        ('success', 'موفق'),
        ('failed', 'ناموفق'),
    ]
    
    file = models.FileField(upload_to='excel_imports/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Statistics
    total_rows = models.IntegerField(default=0)
    successful_imports = models.IntegerField(default=0)
    failed_imports = models.IntegerField(default=0)
    
    # Error tracking
    error_message = models.TextField(blank=True, null=True)
    error_details = models.JSONField(default=dict, blank=True)
    
    # JSON data
    json_data = models.JSONField(default=list, blank=True, help_text='داده‌های تبدیل شده به JSON')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'excel_import_logs'
        verbose_name = 'لاگ ورود اکسل'
        verbose_name_plural = 'لاگ‌های ورود اکسل'
        ordering = ['-created_at']

    def __str__(self):
        return f"Import {self.id} - {self.status} - {self.created_at}"


class ProductImportError(models.Model):
    """Errors encountered during product import"""
    import_log = models.ForeignKey(ExcelImportLog, on_delete=models.CASCADE, related_name='errors')
    row_number = models.IntegerField()
    sku = models.CharField(max_length=100, blank=True, null=True)
    product_name = models.CharField(max_length=300, blank=True, null=True)
    error_type = models.CharField(max_length=100)
    error_message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_import_errors'
        verbose_name = 'خطای ورود محصول'
        verbose_name_plural = 'خطاهای ورود محصول'
        ordering = ['row_number']

    def __str__(self):
        return f"Row {self.row_number} - {self.error_type}"
