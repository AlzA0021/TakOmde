"""
Serializers for excel_import app
"""
from rest_framework import serializers
from .models import ExcelImportLog, ProductImportError


class ExcelImportSerializer(serializers.ModelSerializer):
    """Serializer for Excel import"""
    file = serializers.FileField()
    
    class Meta:
        model = ExcelImportLog
        fields = ['id', 'file', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']
    
    def validate_file(self, value):
        """Validate uploaded file"""
        # Check file extension
        if not value.name.endswith(('.xlsx', '.xls')):
            raise serializers.ValidationError('فقط فایل‌های اکسل (.xlsx, .xls) مجاز هستند')
        
        # Check file size (10MB max)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError('حجم فایل نباید بیشتر از 10 مگابایت باشد')
        
        return value
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class ProductImportErrorSerializer(serializers.ModelSerializer):
    """Serializer for product import errors"""
    
    class Meta:
        model = ProductImportError
        fields = [
            'id', 'row_number', 'sku', 'product_name',
            'error_type', 'error_message', 'created_at'
        ]


class ExcelImportLogSerializer(serializers.ModelSerializer):
    """Detailed serializer for import logs"""
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    errors = ProductImportErrorSerializer(many=True, read_only=True)
    
    class Meta:
        model = ExcelImportLog
        fields = [
            'id', 'file', 'uploaded_by', 'uploaded_by_name', 'status',
            'total_rows', 'successful_imports', 'failed_imports',
            'error_message', 'error_details', 'json_data',
            'created_at', 'completed_at', 'errors'
        ]
        read_only_fields = [
            'uploaded_by', 'status', 'total_rows', 'successful_imports',
            'failed_imports', 'error_message', 'error_details', 'json_data',
            'created_at', 'completed_at'
        ]
