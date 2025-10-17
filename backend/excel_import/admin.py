"""
Admin configuration for excel_import app
"""
from django.contrib import admin
from .models import ExcelImportLog, ProductImportError


class ProductImportErrorInline(admin.TabularInline):
    model = ProductImportError
    extra = 0
    can_delete = False
    
    fields = ['row_number', 'sku', 'product_name', 'error_type', 'error_message']
    readonly_fields = fields


@admin.register(ExcelImportLog)
class ExcelImportLogAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'uploaded_by', 'status', 'total_rows',
        'successful_imports', 'failed_imports', 'created_at'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['uploaded_by__username', 'error_message']
    readonly_fields = [
        'uploaded_by', 'status', 'total_rows', 'successful_imports',
        'failed_imports', 'error_message', 'error_details', 'json_data',
        'created_at', 'completed_at'
    ]
    inlines = [ProductImportErrorInline]
    
    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('file', 'uploaded_by', 'status', 'created_at', 'completed_at')
        }),
        ('آمار', {
            'fields': ('total_rows', 'successful_imports', 'failed_imports')
        }),
        ('خطاها', {
            'fields': ('error_message', 'error_details'),
            'classes': ('collapse',)
        }),
        ('داده JSON', {
            'fields': ('json_data',),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductImportError)
class ProductImportErrorAdmin(admin.ModelAdmin):
    list_display = ['import_log', 'row_number', 'sku', 'error_type', 'created_at']
    list_filter = ['error_type', 'created_at']
    search_fields = ['sku', 'product_name', 'error_message']
    readonly_fields = [
        'import_log', 'row_number', 'sku', 'product_name',
        'error_type', 'error_message', 'created_at'
    ]
