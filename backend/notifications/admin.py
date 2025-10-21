from django.contrib import admin
from .models import SMSLog, NotificationTemplate


@admin.register(SMSLog)
class SMSLogAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'provider', 'status', 'sent_at', 'created_at']
    list_filter = ['provider', 'status', 'created_at']
    search_fields = ['phone_number', 'message', 'message_id']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('user', 'phone_number', 'message')
        }),
        ('اطلاعات ارسال', {
            'fields': ('provider', 'status', 'message_id', 'cost')
        }),
        ('زمان‌بندی', {
            'fields': ('sent_at', 'delivered_at')
        }),
        ('خطا', {
            'fields': ('error_message',),
            'classes': ('collapse',)
        }),
        ('سایر', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'is_active', 'created_at']
    list_filter = ['type', 'is_active', 'created_at']
    search_fields = ['name', 'type']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('name', 'type', 'is_active')
        }),
        ('قالب پیامک', {
            'fields': ('sms_template',)
        }),
        ('قالب ایمیل', {
            'fields': ('email_subject', 'email_template'),
            'classes': ('collapse',)
        }),
        ('سایر', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
