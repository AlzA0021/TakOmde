"""
Admin configuration for payments app
"""
from django.contrib import admin
from .models import Payment, PaymentLog


class PaymentLogInline(admin.TabularInline):
    model = PaymentLog
    extra = 0
    readonly_fields = [
        'action', 'request_data', 'response_data',
        'status_code', 'is_successful', 'error_message', 'created_at'
    ]
    can_delete = False


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'order', 'gateway', 'amount', 'status',
        'ref_id', 'created_at', 'paid_at'
    ]
    list_filter = ['gateway', 'status', 'created_at', 'paid_at']
    search_fields = ['order__order_number', 'authority', 'ref_id', 'tracking_code']
    readonly_fields = [
        'order', 'gateway', 'amount', 'authority', 'ref_id',
        'tracking_code', 'gateway_response', 'created_at', 'updated_at', 'paid_at'
    ]
    inlines = [PaymentLogInline]
    
    fieldsets = (
        ('اطلاعات پرداخت', {
            'fields': ('order', 'gateway', 'amount', 'status')
        }),
        ('اطلاعات درگاه', {
            'fields': ('authority', 'ref_id', 'tracking_code', 'gateway_response')
        }),
        ('تاریخ‌ها', {
            'fields': ('created_at', 'updated_at', 'paid_at')
        }),
    )


@admin.register(PaymentLog)
class PaymentLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'payment', 'action', 'is_successful', 'status_code', 'created_at']
    list_filter = ['action', 'is_successful', 'created_at']
    search_fields = ['payment__order__order_number', 'error_message']
    readonly_fields = [
        'payment', 'action', 'request_data', 'response_data',
        'status_code', 'is_successful', 'error_message', 'created_at'
    ]
