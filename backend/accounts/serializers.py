"""
Serializers for accounts app
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserAddress

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'address', 'city', 'postal_code',
            'avatar', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'phone_number', 'password', 'password_confirm',
            'first_name', 'last_name'
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "رمز عبور و تکرار آن باید یکسان باشد"})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserAddressSerializer(serializers.ModelSerializer):
    """Serializer for user addresses"""
    
    class Meta:
        model = UserAddress
        fields = [
            'id', 'title', 'address', 'city', 'state',
            'postal_code', 'phone_number', 'is_default', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "رمز عبور جدید و تکرار آن باید یکسان باشد"})
        return data
