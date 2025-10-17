"""
Serializers for products app
"""
from rest_framework import serializers
from .models import (
    Category, Product, ProductImage, ProductAttribute,
    ProductAttributeValue, ProductReview
)


class CategorySerializer(serializers.ModelSerializer):
    """Category Serializer"""
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'parent', 'children', 'is_active', 'created_at'
        ]

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []


class ProductImageSerializer(serializers.ModelSerializer):
    """Product Image Serializer"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductAttributeValueSerializer(serializers.ModelSerializer):
    """Product Attribute Value Serializer"""
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    
    class Meta:
        model = ProductAttributeValue
        fields = ['id', 'attribute', 'attribute_name', 'value']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Product Review Serializer"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'user', 'user_name', 'rating',
            'comment', 'is_approved', 'created_at'
        ]
        read_only_fields = ['user', 'is_approved']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductListSerializer(serializers.ModelSerializer):
    """Product List Serializer (for list views)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description',
            'category', 'category_name', 'price', 'sale_price',
            'final_price', 'discount_percentage', 'stock_quantity',
            'is_in_stock', 'is_on_sale', 'is_featured',
            'primary_image', 'unit'
        ]

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return self.context['request'].build_absolute_uri(primary_image.image.url)
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Product Detail Serializer (for detail view)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    attributes = ProductAttributeValueSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'short_description',
            'category', 'category_name', 'price', 'sale_price',
            'final_price', 'discount_percentage', 'stock_quantity',
            'is_in_stock', 'is_low_stock', 'is_on_sale', 'is_featured',
            'unit', 'weight', 'images', 'attributes',
            'meta_title', 'meta_description', 'reviews', 'average_rating',
            'reviews_count', 'created_at', 'updated_at'
        ]

    def get_reviews(self, obj):
        approved_reviews = obj.reviews.filter(is_approved=True)[:5]
        return ProductReviewSerializer(approved_reviews, many=True).data

    def get_average_rating(self, obj):
        approved_reviews = obj.reviews.filter(is_approved=True)
        if approved_reviews.exists():
            total = sum(review.rating for review in approved_reviews)
            return round(total / approved_reviews.count(), 1)
        return 0

    def get_reviews_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products"""
    
    class Meta:
        model = Product
        fields = [
            'name', 'sku', 'description', 'short_description',
            'category', 'price', 'sale_price', 'stock_quantity',
            'low_stock_threshold', 'unit', 'weight',
            'is_active', 'is_featured', 'meta_title', 'meta_description'
        ]
