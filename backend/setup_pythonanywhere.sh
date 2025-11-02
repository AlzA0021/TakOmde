#!/bin/bash

# اسکریپت Setup برای PythonAnywhere
# این فایل را در Console PythonAnywhere اجرا کنید

echo "========================================="
echo "شروع نصب پروژه پیک بازار"
echo "========================================="

# نصب virtualenv
echo "📦 ایجاد Virtual Environment..."
mkvirtualenv --python=python3.10 pickbazar-env

# فعال کردن virtualenv
workon pickbazar-env

# نصب وابستگی‌ها
echo "📥 نصب وابستگی‌ها..."
cd ~/TakOmde/backend
pip install -r requirements.txt

# نصب mysqlclient برای MySQL
pip install mysqlclient

# ایجاد فایل .env از .env.example
if [ ! -f .env ]; then
    echo "📝 ایجاد فایل .env..."
    cp .env.example .env
    echo "⚠️  لطفاً فایل .env را ویرایش کنید!"
fi

# اجرای migrations
echo "🗃️  اجرای migrations..."
python manage.py migrate

# جمع‌آوری static files
echo "📦 جمع‌آوری static files..."
python manage.py collectstatic --noinput

echo ""
echo "========================================="
echo "✅ نصب با موفقیت انجام شد!"
echo "========================================="
echo ""
echo "مراحل بعدی:"
echo "1. فایل .env را ویرایش کنید"
echo "2. در Web Tab PythonAnywhere، Web App را تنظیم کنید"
echo "3. WSGI configuration را به‌روز کنید"
echo "4. Static files را تنظیم کنید"
echo ""
