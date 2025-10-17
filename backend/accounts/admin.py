"""
Admin configuration for accounts app
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserAddress


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin for User model"""
    list_display = ['username', 'email', 'phone_number', 'is_verified', 'is_staff', 'created_at']
    list_filter = ['is_verified', 'is_staff', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'phone_number', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('اطلاعات بیشتر', {
            'fields': ('phone_number', 'address', 'city', 'postal_code', 'avatar', 'is_verified')
        }),
    )


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    """Admin for UserAddress model"""
    list_display = ['user', 'title', 'city', 'is_default', 'created_at']
    list_filter = ['is_default', 'city', 'created_at']
    search_fields = ['user__username', 'title', 'address', 'city']
    raw_id_fields = ['user']
