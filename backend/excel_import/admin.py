"""
Admin configuration for excel_import app
"""

from django.contrib import admin
from .models import ExcelImportLog, ProductImportError
from .services import ExcelImportService


class ProductImportErrorInline(admin.TabularInline):
    model = ProductImportError
    extra = 0
    can_delete = False

    fields = ["row_number", "sku", "product_name", "error_type", "error_message"]
    readonly_fields = fields


@admin.register(ExcelImportLog)
class ExcelImportLogAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "uploaded_by",
        "status",
        "total_rows",
        "successful_imports",
        "failed_imports",
        "created_at",
    ]
    list_filter = ["status", "created_at"]
    search_fields = ["uploaded_by__username", "error_message"]
    readonly_fields = [
        "uploaded_by",
        "status",
        "total_rows",
        "successful_imports",
        "failed_imports",
        "error_message",
        "error_details",
        "json_data",
        "created_at",
        "completed_at",
    ]
    inlines = [ProductImportErrorInline]

    fieldsets = (
        (
            "اطلاعات اصلی",
            {"fields": ("file", "uploaded_by", "status", "created_at", "completed_at")},
        ),
        ("آمار", {"fields": ("total_rows", "successful_imports", "failed_imports")}),
        (
            "خطاها",
            {"fields": ("error_message", "error_details"), "classes": ("collapse",)},
        ),
        ("داده JSON", {"fields": ("json_data",), "classes": ("collapse",)}),
    )

    def save_model(self, request, obj, form, change):
        """
        تنظیم uploaded_by به کاربر جاری
        این متد هنگام ذخیره از admin panel فراخوانی می‌شود
        """
        if not obj.pk:  # فقط برای رکورد جدید
            obj.uploaded_by = request.user

        # ذخیره object
        super().save_model(request, obj, form, change)

        # اگر فایل جدید است، آن را پردازش کن
        if not change:  # فقط برای رکورد جدید
            try:
                service = ExcelImportService(obj.file, obj)
                service.process()
            except Exception as e:
                obj.status = "failed"
                obj.error_message = f"خطا در پردازش فایل: {str(e)}"
                obj.save()

    def has_add_permission(self, request):
        """
        فقط کاربران staff می‌توانند فایل اضافه کنند
        """
        return request.user.is_staff

    def has_change_permission(self, request, obj=None):
        """
        فقط کاربران staff می‌توانند تغییر دهند
        """
        return request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        """
        فقط کاربران staff می‌توانند حذف کنند
        """
        return request.user.is_staff


@admin.register(ProductImportError)
class ProductImportErrorAdmin(admin.ModelAdmin):
    list_display = ["import_log", "row_number", "sku", "error_type", "created_at"]
    list_filter = ["error_type", "created_at"]
    search_fields = ["sku", "product_name", "error_message"]
    readonly_fields = [
        "import_log",
        "row_number",
        "sku",
        "product_name",
        "error_type",
        "error_message",
        "created_at",
    ]

    def has_add_permission(self, request):
        """
        جلوگیری از اضافه کردن دستی خطاها
        """
        return False
