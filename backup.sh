#!/bin/bash

# اسکریپت پشتیبان‌گیری از دیتابیس و فایل‌های media

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "========================================="
echo "💾 شروع پشتیبان‌گیری"
echo "========================================="

# ایجاد دایرکتوری backup
mkdir -p $BACKUP_DIR

# پشتیبان‌گیری از دیتابیس
echo "📊 پشتیبان‌گیری از دیتابیس PostgreSQL..."
docker-compose exec -T db pg_dump -U postgres pickbazar_db > "$BACKUP_DIR/db_backup_$DATE.sql"

# فشرده‌سازی backup دیتابیس
echo "🗜️  فشرده‌سازی backup دیتابیس..."
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

# پشتیبان‌گیری از فایل‌های media
echo "📁 پشتیبان‌گیری از فایل‌های media..."
tar -czf "$BACKUP_DIR/media_backup_$DATE.tar.gz" -C backend media/

# نمایش اطلاعات backup
echo ""
echo "✅ پشتیبان‌گیری با موفقیت انجام شد!"
echo "📂 فایل‌های backup:"
ls -lh "$BACKUP_DIR"/*_$DATE*
echo ""

# حذف backup‌های قدیمی (بیش از 7 روز)
echo "🧹 حذف backup‌های قدیمی (بیش از 7 روز)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ پاکسازی backup‌های قدیمی انجام شد."
