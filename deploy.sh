#!/bin/bash

# اسکریپت دیپلوی پروژه پیک بازار
# این اسکریپت تمام سرویس‌ها را build و اجرا می‌کند

set -e

echo "========================================="
echo "🚀 شروع دیپلوی پروژه پیک بازار"
echo "========================================="

# بررسی وجود Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker نصب نشده است. لطفاً ابتدا Docker را نصب کنید."
    exit 1
fi

# بررسی وجود Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose نصب نشده است. لطفاً ابتدا Docker Compose را نصب کنید."
    exit 1
fi

# بررسی وجود فایل‌های .env
echo "📋 بررسی فایل‌های تنظیمات..."
if [ ! -f backend/.env ]; then
    echo "⚠️  فایل backend/.env یافت نشد. از .env.example استفاده می‌شود."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "⚠️  فایل frontend/.env یافت نشد. از .env.example استفاده می‌شود."
    cp frontend/.env.example frontend/.env
fi

# توقف و حذف کانتینرهای قبلی
echo "🛑 توقف و حذف کانتینرهای قبلی..."
docker-compose down -v

# Build کردن ایمیج‌ها
echo "🔨 Build کردن ایمیج‌ها..."
docker-compose build --no-cache

# اجرای سرویس‌ها
echo "▶️  اجرای سرویس‌ها..."
docker-compose up -d

# صبر برای آماده شدن سرویس‌ها
echo "⏳ در حال انتظار برای آماده شدن سرویس‌ها..."
sleep 10

# نمایش وضعیت سرویس‌ها
echo ""
echo "========================================="
echo "✅ دیپلوی با موفقیت انجام شد!"
echo "========================================="
echo ""
docker-compose ps
echo ""
echo "📌 دسترسی به سرویس‌ها:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000/api"
echo "   - Django Admin: http://localhost:8000/admin"
echo "   - Swagger Docs: http://localhost:8000/swagger"
echo ""
echo "📝 برای مشاهده لاگ‌ها:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 برای توقف سرویس‌ها:"
echo "   docker-compose down"
echo ""
