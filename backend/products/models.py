"""
Models for products app
"""

from django.db import models
from django.utils.text import slugify
from .utils import generate_unique_slug


class Category(models.Model):
    """Product Category"""

    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "categories"
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Category, self.name, self)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Product Model"""

    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    sku = models.CharField(
        max_length=100, unique=True, help_text="کد کالا از نرم‌افزار حسابداری"
    )
    description = models.TextField(blank=True, null=True)
    short_description = models.CharField(max_length=500, blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="products"
    )

    # Pricing
    price = models.DecimalField(
        max_digits=12, decimal_places=0, help_text="قیمت به تومان"
    )
    sale_price = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        null=True,
        blank=True,
        help_text="قیمت تخفیف‌خورده",
    )

    # Inventory
    stock_quantity = models.IntegerField(default=0, help_text="تعداد موجودی در انبار")
    low_stock_threshold = models.IntegerField(default=1)

    # Product details
    unit = models.CharField(max_length=50, default="عدد", help_text="واحد محصول")
    weight = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, help_text="وزن به گرم"
    )

    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    # SEO
    meta_title = models.CharField(max_length=200, blank=True, null=True)
    meta_description = models.CharField(max_length=500, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["sku"]),
            models.Index(fields=["slug"]),
            models.Index(fields=["-created_at"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Product, self.name, self)
        super().save(*args, **kwargs)

    @property
    def is_on_sale(self):
        return self.sale_price and self.sale_price < self.price

    @property
    def final_price(self):
        return self.sale_price if self.is_on_sale else self.price

    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return int(((self.price - self.sale_price) / self.price) * 100)
        return 0

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0

    @property
    def is_low_stock(self):
        return 0 < self.stock_quantity <= self.low_stock_threshold


class ProductImage(models.Model):
    """Product Images"""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_images"
        verbose_name = "تصویر محصول"
        verbose_name_plural = "تصاویر محصولات"
        ordering = ["order", "-is_primary"]

    def __str__(self):
        return f"{self.product.name} - Image {self.id}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            # Remove primary from other images of same product
            ProductImage.objects.filter(product=self.product, is_primary=True).update(
                is_primary=False
            )
        super().save(*args, **kwargs)


class ProductAttribute(models.Model):
    """Product Attributes (like color, size, etc.)"""

    name = models.CharField(max_length=100)

    class Meta:
        db_table = "product_attributes"
        verbose_name = "ویژگی محصول"
        verbose_name_plural = "ویژگی‌های محصول"

    def __str__(self):
        return self.name


class ProductAttributeValue(models.Model):
    """Values for product attributes"""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="attributes"
    )
    attribute = models.ForeignKey(ProductAttribute, on_delete=models.CASCADE)
    value = models.CharField(max_length=200)

    class Meta:
        db_table = "product_attribute_values"
        verbose_name = "مقدار ویژگی"
        verbose_name_plural = "مقادیر ویژگی‌ها"
        unique_together = ["product", "attribute"]

    def __str__(self):
        return f"{self.product.name} - {self.attribute.name}: {self.value}"


class ProductReview(models.Model):
    """Product Reviews"""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="reviews"
    )
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "product_reviews"
        verbose_name = "نظر محصول"
        verbose_name_plural = "نظرات محصولات"
        ordering = ["-created_at"]
        unique_together = ["product", "user"]

    def __str__(self):
        return f"{self.user.username} - {self.product.name} - {self.rating}★"
