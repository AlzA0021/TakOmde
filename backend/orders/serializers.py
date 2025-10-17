"""
Serializers for orders app
"""
from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem, Wishlist
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Order Item Serializer"""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'unit_price', 'quantity', 'subtotal'
        ]
        read_only_fields = ['product_name', 'product_sku', 'unit_price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """Order Serializer"""
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'shipping_name', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_phone',
            'subtotal', 'shipping_cost', 'tax', 'discount', 'total',
            'status', 'notes', 'is_paid', 'paid_at', 'payment_method',
            'tracking_number', 'shipped_at', 'delivered_at',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = [
            'order_number', 'user', 'subtotal', 'total',
            'is_paid', 'paid_at', 'shipped_at', 'delivered_at', 'created_at', 'updated_at'
        ]


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating orders from cart"""
    shipping_address_id = serializers.IntegerField(required=False)
    shipping_name = serializers.CharField(max_length=200)
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    shipping_phone = serializers.CharField(max_length=15)
    notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.CharField(max_length=50)


class CartItemSerializer(serializers.ModelSerializer):
    """Cart Item Serializer"""
    product_detail = ProductListSerializer(source='product', read_only=True)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=0, read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=0, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_detail', 'quantity', 'unit_price', 'subtotal', 'created_at']
        read_only_fields = ['unit_price', 'subtotal', 'created_at']


class CartSerializer(serializers.ModelSerializer):
    """Cart Serializer"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=0, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class WishlistSerializer(serializers.ModelSerializer):
    """Wishlist Serializer"""
    products = ProductListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
