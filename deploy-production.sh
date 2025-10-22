#!/bin/bash

# اسکریپت دیپلوی Production پروژه پیک بازار
# این اسکریپت برای محیط production استفاده می‌شود

set -e

echo "========================================="
echo "🚀 شروع دیپلوی Production پروژه پیک بازار"
echo "========================================="

# بررسی وجود Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker نصب نشده است."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose نصب نشده است."
    exit 1
fi

# بررسی فایل‌های .env.production
echo "📋 بررسی فایل‌های تنظیمات Production..."
if [ ! -f backend/.env.production ]; then
    echo "❌ فایل backend/.env.production یافت نشد!"
    exit 1
fi

if [ ! -f frontend/.env.production ]; then
    echo "❌ فایل frontend/.env.production یافت نشد!"
    exit 1
fi

# کپی فایل‌های production به .env
echo "📂 کپی فایل‌های production..."
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Pull کردن آخرین تغییرات از Git
echo "📥 دریافت آخرین تغییرات..."
git pull origin main

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
docker-compose down

# Build کردن ایمیج‌ها
echo "🔨 Build کردن ایمیج‌های جدید..."
docker-compose build --no-cache

# اجرای سرویس‌ها
echo "▶️  اجرای سرویس‌ها..."
docker-compose up -d

# اجرای migrations
echo "🗃️  اجرای migrations..."
docker-compose exec -T backend python manage.py migrate

# جمع‌آوری static files
echo "📦 جمع‌آوری static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput

# Restart کردن سرویس‌ها
echo "🔄 Restart کردن سرویس‌ها..."
docker-compose restart backend frontend

# پاکسازی ایمیج‌های قدیمی
echo "🧹 پاکسازی ایمیج‌های استفاده نشده..."
docker image prune -f

echo ""
echo "========================================="
echo "✅ دیپلوی Production با موفقیت انجام شد!"
echo "========================================="
echo ""
docker-compose ps
echo ""
echo "📝 برای مشاهده لاگ‌ها:"
echo "   docker-compose logs -f [service-name]"
echo ""
