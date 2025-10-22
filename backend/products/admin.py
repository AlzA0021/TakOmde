"""
Admin configuration for products app
"""
from django.contrib import admin
from .models import (
    Category, Product, ProductImage, ProductAttribute,
    ProductAttributeValue, ProductReview
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    # Note: slug is auto-generated from name (Persian to English)
    # You can override it manually if needed


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'sku', 'category', 'price', 'sale_price',
        'stock_quantity', 'is_active', 'is_featured', 'created_at'
    ]
    list_filter = ['is_active', 'is_featured', 'category', 'created_at']
    search_fields = ['name', 'sku', 'description']
    # Note: slug is auto-generated from name (Persian to English)
    # You can override it manually if needed
    list_editable = ['price', 'sale_price', 'stock_quantity', 'is_active', 'is_featured']
    inlines = [ProductImageInline, ProductAttributeValueInline]
    
    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('name', 'slug', 'sku', 'category')
        }),
        ('توضیحات', {
            'fields': ('description', 'short_description')
        }),
        ('قیمت و موجودی', {
            'fields': ('price', 'sale_price', 'stock_quantity', 'low_stock_threshold', 'unit', 'weight')
        }),
        ('وضعیت', {
            'fields': ('is_active', 'is_featured')
        }),
        ('سئو', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_primary', 'order', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['product__name', 'alt_text']


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(ProductAttributeValue)
class ProductAttributeValueAdmin(admin.ModelAdmin):
    list_display = ['product', 'attribute', 'value']
    list_filter = ['attribute']
    search_fields = ['product__name', 'value']


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'rating', 'created_at']
    search_fields = ['product__name', 'user__username', 'comment']
    list_editable = ['is_approved']
    actions = ['approve_reviews', 'reject_reviews']

    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f'{queryset.count()} نظر تایید شد')
    approve_reviews.short_description = 'تایید نظرات انتخاب شده'

    def reject_reviews(self, request, queryset):
        queryset.update(is_approved=False)
        self.message_user(request, f'{queryset.count()} نظر رد شد')
    reject_reviews.short_description = 'رد نظرات انتخاب شده'
