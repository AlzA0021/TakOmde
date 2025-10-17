"""
URLs for payments app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, zarinpal_verify, paypint_verify

router = DefaultRouter()
router.register('', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('verify/', zarinpal_verify, name='zarinpal_verify'),
    path('paypint/verify/', paypint_verify, name='paypint_verify'),
]
