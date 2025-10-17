"""
Celery tasks for excel_import app
"""
from celery import shared_task
from .models import ExcelImportLog
from .services import ExcelImportService


@shared_task
def process_excel_import(import_log_id):
    """Process Excel import asynchronously"""
    try:
        import_log = ExcelImportLog.objects.get(id=import_log_id)
        service = ExcelImportService(import_log.file, import_log)
        service.process()
        return f"Import {import_log_id} completed"
    except ExcelImportLog.DoesNotExist:
        return f"Import log {import_log_id} not found"
    except Exception as e:
        return f"Error processing import {import_log_id}: {str(e)}"
