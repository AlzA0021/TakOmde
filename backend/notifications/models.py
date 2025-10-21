# Notifications models
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SMSLog(models.Model):
    """Log all SMS notifications sent through the system"""

    PROVIDER_CHOICES = [
        ('kavenegar', 'Kavenegar'),
        ('ghasedak', 'Ghasedak'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('delivered', 'Delivered'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sms_logs',
        verbose_name='کاربر'
    )
    phone_number = models.CharField(max_length=15, verbose_name='شماره تلفن')
    message = models.TextField(verbose_name='متن پیام')
    provider = models.CharField(
        max_length=20,
        choices=PROVIDER_CHOICES,
        verbose_name='ارائه‌دهنده'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='وضعیت'
    )
    message_id = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name='شناسه پیام'
    )
    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='هزینه'
    )
    error_message = models.TextField(
        null=True,
        blank=True,
        verbose_name='پیام خطا'
    )
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name='زمان ارسال')
    delivered_at = models.DateTimeField(null=True, blank=True, verbose_name='زمان تحویل')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')

    class Meta:
        verbose_name = 'گزارش پیامک'
        verbose_name_plural = 'گزارش‌های پیامک'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['phone_number']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"SMS to {self.phone_number} - {self.status}"


class NotificationTemplate(models.Model):
    """Templates for different notification types"""

    TYPE_CHOICES = [
        ('order_created', 'سفارش ایجاد شد'),
        ('order_shipped', 'سفارش ارسال شد'),
        ('order_delivered', 'سفارش تحویل داده شد'),
        ('order_cancelled', 'سفارش لغو شد'),
        ('payment_success', 'پرداخت موفق'),
        ('payment_failed', 'پرداخت ناموفق'),
        ('low_stock', 'موجودی کم'),
        ('verification_code', 'کد تایید'),
    ]

    name = models.CharField(max_length=100, verbose_name='نام')
    type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        unique=True,
        verbose_name='نوع'
    )
    sms_template = models.TextField(
        null=True,
        blank=True,
        help_text='از متغیرهای {variable_name} استفاده کنید',
        verbose_name='قالب پیامک'
    )
    email_subject = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name='موضوع ایمیل'
    )
    email_template = models.TextField(
        null=True,
        blank=True,
        verbose_name='قالب ایمیل'
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')

    class Meta:
        verbose_name = 'قالب اعلان'
        verbose_name_plural = 'قالب‌های اعلان'
        ordering = ['name']

    def __str__(self):
        return self.name
