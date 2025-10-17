"""
Views for excel_import app
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import ExcelImportLog, ProductImportError
from .serializers import (
    ExcelImportSerializer,
    ExcelImportLogSerializer,
    ProductImportErrorSerializer,
)
from .services import ExcelImportService
from .tasks import process_excel_import


class ExcelImportViewSet(viewsets.ModelViewSet):
    """ViewSet for Excel imports"""

    queryset = ExcelImportLog.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == "create":
            return ExcelImportSerializer
        return ExcelImportLogSerializer

    def get_serializer_context(self):
        """Pass request to serializer context"""
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def create(self, request, *args, **kwargs):
        """Upload and process Excel file"""
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        # Create import log with user
        import_log = serializer.save()

        # Process file asynchronously using Celery
        # If Celery is not set up, process synchronously
        try:
            process_excel_import.delay(import_log.id)
            message = "فایل با موفقیت آپلود شد و در حال پردازش است"
        except Exception as celery_error:
            # Process synchronously if Celery is not available
            try:
                service = ExcelImportService(import_log.file, import_log)
                success = service.process()

                if success:
                    message = "فایل با موفقیت پردازش شد"
                else:
                    message = "خطا در پردازش فایل"
            except Exception as process_error:
                import_log.status = "failed"
                import_log.error_message = str(process_error)
                import_log.save()
                return Response(
                    {"error": "خطا در پردازش فایل", "detail": str(process_error)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return Response(
            {
                "message": message,
                "import_log": ExcelImportLogSerializer(import_log).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"])
    def errors(self, request, pk=None):
        """Get errors for a specific import"""
        import_log = self.get_object()
        errors = import_log.errors.all()

        serializer = ProductImportErrorSerializer(errors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def retry(self, request, pk=None):
        """Retry a failed import"""
        import_log = self.get_object()

        if import_log.status != "failed":
            return Response(
                {"error": "فقط واردات ناموفق قابل تکرار هستند"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Reset status
        import_log.status = "pending"
        import_log.error_message = None
        import_log.save()

        # Process again
        try:
            process_excel_import.delay(import_log.id)
            message = "پردازش مجدد آغاز شد"
        except:
            service = ExcelImportService(import_log.file, import_log)
            service.process()
            message = "فایل مجدداً پردازش شد"

        return Response({"message": message})

    @action(detail=False, methods=["get"])
    def recent(self, request):
        """Get recent imports"""
        recent_imports = self.queryset.order_by("-created_at")[:10]
        serializer = self.get_serializer(recent_imports, many=True)
        return Response(serializer.data)
