"""
Admin configuration for orders app
"""
from django.contrib import admin
from .models import Order, OrderItem, Cart, CartItem, Wishlist


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_name', 'product_sku', 'unit_price', 'quantity', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'user', 'status', 'total',
        'is_paid', 'created_at'
    ]
    list_filter = ['status', 'is_paid', 'created_at']
    search_fields = ['order_number', 'user__username', 'shipping_name', 'shipping_phone']
    inlines = [OrderItemInline]
    readonly_fields = ['order_number', 'user', 'subtotal', 'total', 'created_at', 'updated_at']
    
    fieldsets = (
        ('اطلاعات سفارش', {
            'fields': ('order_number', 'user', 'status', 'created_at', 'updated_at')
        }),
        ('اطلاعات ارسال', {
            'fields': (
                'shipping_name', 'shipping_address', 'shipping_city',
                'shipping_state', 'shipping_postal_code', 'shipping_phone'
            )
        }),
        ('مبالغ', {
            'fields': ('subtotal', 'shipping_cost', 'tax', 'discount', 'total')
        }),
        ('پرداخت', {
            'fields': ('is_paid', 'paid_at', 'payment_method')
        }),
        ('ردیابی', {
            'fields': ('tracking_number', 'shipped_at', 'delivered_at')
        }),
        ('یادداشت‌ها', {
            'fields': ('notes', 'admin_notes')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'unit_price', 'subtotal']
    list_filter = ['created_at']
    search_fields = ['order__order_number', 'product_name', 'product_sku']


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    search_fields = ['user__username']
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity', 'created_at']
    list_filter = ['created_at']
    search_fields = ['cart__user__username', 'product__name']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    search_fields = ['user__username']
    filter_horizontal = ['products']
