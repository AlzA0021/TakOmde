#!/bin/bash

# اسکریپت بازیابی از backup

set -e

if [ "$#" -ne 1 ]; then
    echo "استفاده: ./restore.sh <backup-file>"
    echo "مثال: ./restore.sh ./backups/db_backup_20250101_120000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ فایل backup یافت نشد: $BACKUP_FILE"
    exit 1
fi

echo "========================================="
echo "♻️  شروع بازیابی از backup"
echo "========================================="
echo "⚠️  هشدار: این عملیات داده‌های موجود را جایگزین می‌کند!"
read -p "آیا مطمئن هستید؟ (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ عملیات لغو شد."
    exit 0
fi

# استخراج فایل backup
echo "📦 استخراج فایل backup..."
TEMP_FILE="/tmp/restore_$(date +%s).sql"
gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"

# بازیابی دیتابیس
echo "📊 بازیابی دیتابیس..."
docker-compose exec -T db psql -U postgres -d pickbazar_db < "$TEMP_FILE"

# حذف فایل موقت
rm "$TEMP_FILE"

echo ""
echo "✅ بازیابی با موفقیت انجام شد!"
