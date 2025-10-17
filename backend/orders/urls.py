"""
URLs for orders app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CartViewSet, WishlistViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')
router.register('cart', CartViewSet, basename='cart')
router.register('wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
]
