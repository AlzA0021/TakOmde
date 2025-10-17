"""
Models for payments app
"""
from django.db import models
from orders.models import Order


class Payment(models.Model):
    """Payment Model"""
    GATEWAY_CHOICES = [
        ('zarinpal', 'زرین‌پال'),
        ('paypint', 'پی‌پینگ'),
        ('saman', 'سامان'),
        ('mellat', 'ملت'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'در انتظار پرداخت'),
        ('processing', 'در حال پردازش'),
        ('completed', 'پرداخت موفق'),
        ('failed', 'پرداخت ناموفق'),
        ('cancelled', 'لغو شده'),
        ('refunded', 'بازگشت وجه'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Gateway specific fields
    authority = models.CharField(max_length=200, blank=True, null=True, help_text='Authority from payment gateway')
    ref_id = models.CharField(max_length=200, blank=True, null=True, help_text='Reference ID from gateway')
    tracking_code = models.CharField(max_length=200, blank=True, null=True)
    
    # Response data
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'payments'
        verbose_name = 'پرداخت'
        verbose_name_plural = 'پرداخت‌ها'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.id} - Order {self.order.order_number} - {self.status}"


class PaymentLog(models.Model):
    """Log of all payment gateway communications"""
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=50, help_text='request, verify, refund, etc.')
    request_data = models.JSONField(default=dict, blank=True)
    response_data = models.JSONField(default=dict, blank=True)
    status_code = models.IntegerField(null=True, blank=True)
    is_successful = models.BooleanField(default=False)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payment_logs'
        verbose_name = 'لاگ پرداخت'
        verbose_name_plural = 'لاگ‌های پرداخت'
        ordering = ['-created_at']

    def __str__(self):
        return f"Log {self.id} - {self.action} - {self.created_at}"
