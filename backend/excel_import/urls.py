"""
URLs for excel_import app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExcelImportViewSet

router = DefaultRouter()
router.register('', ExcelImportViewSet, basename='excel-import')

urlpatterns = [
    path('', include(router.urls)),
]
