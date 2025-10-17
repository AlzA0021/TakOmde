"""
Serializers for payments app
"""
from rest_framework import serializers
from .models import Payment, PaymentLog


class PaymentSerializer(serializers.ModelSerializer):
    """Payment Serializer"""
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_number', 'gateway', 'amount', 'status',
            'authority', 'ref_id', 'tracking_code', 'created_at', 'paid_at'
        ]
        read_only_fields = [
            'status', 'authority', 'ref_id', 'tracking_code', 'created_at', 'paid_at'
        ]


class PaymentRequestSerializer(serializers.Serializer):
    """Serializer for payment request"""
    order_id = serializers.IntegerField()
    gateway = serializers.ChoiceField(choices=['zarinpal', 'paypint', 'saman', 'mellat'])


class PaymentLogSerializer(serializers.ModelSerializer):
    """Payment Log Serializer"""
    
    class Meta:
        model = PaymentLog
        fields = [
            'id', 'payment', 'action', 'request_data', 'response_data',
            'status_code', 'is_successful', 'error_message', 'created_at'
        ]
