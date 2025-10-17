"""
URLs for products app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, ProductReviewViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('reviews', ProductReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
