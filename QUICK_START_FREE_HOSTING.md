# راهنمای سریع: دیپلوی روی هاست‌های رایگان

## خلاصه مراحل

### 1. Backend روی Render.com (15 دقیقه)

#### مرحله 1: ایجاد Database
```
Render Dashboard → New + → PostgreSQL
Name: pickbazar-db
Plan: Free
→ کپی Internal Database URL
```

#### مرحله 2: ایجاد Redis
```
Render Dashboard → New + → Redis
Name: pickbazar-redis
Plan: Free
→ کپی Internal Redis URL
```

#### مرحله 3: ایجاد Web Service
```
Render Dashboard → New + → Web Service
Repository: انتخاب repository خود
Root Directory: backend
Environment: Python 3
Build Command: pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
Start Command: gunicorn pickbazar_shop.wsgi:application --bind 0.0.0.0:$PORT
Plan: Free
```

#### مرحله 4: Environment Variables
```bash
SECRET_KEY=<تولید کنید: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DEBUG=False
ALLOWED_HOSTS=.onrender.com
DATABASE_URL=<از مرحله 1>
REDIS_URL=<از مرحله 2>
CORS_ALLOWED_ORIGINS=<بعداً تنظیم می‌شود>
```

✅ Backend URL: `https://pickbazar-backend.onrender.com`

---

### 2. Frontend روی Vercel (5 دقیقه)

#### مرحله 1: Import Project
```
Vercel Dashboard → New Project
Repository: انتخاب repository
Root Directory: frontend
Framework: Next.js (auto-detect)
```

#### مرحله 2: Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://pickbazar-backend.onrender.com/api
NEXT_PUBLIC_SITE_NAME=فروشگاه پیک بازار
NEXT_PUBLIC_SITE_DESCRIPTION=فروشگاه آنلاین محصولات
```

✅ Frontend URL: `https://your-project.vercel.app`

---

### 3. اتصال Frontend و Backend

برگردید به Render و CORS را به‌روز کنید:
```bash
CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
```

---

## تست نهایی

1. **Backend**: https://pickbazar-backend.onrender.com/api/
2. **Admin**: https://pickbazar-backend.onrender.com/admin/
3. **Frontend**: https://your-project.vercel.app

---

## مشکلات رایج

### Backend خیلی کند است
- اولین بار 30-60 ثانیه طول می‌کشد (Sleep Mode)
- راه‌حل: صبر کنید یا از UptimeRobot استفاده کنید

### خطای CORS
- مطمئن شوید URL Frontend در CORS_ALLOWED_ORIGINS درست است
- Backend را Redeploy کنید

### تصاویر آپلود نمی‌شوند
- Render سیستم فایل Read-only دارد
- راه‌حل: استفاده از Cloudinary (رایگان)

---

## مستندات کامل

برای جزئیات بیشتر: [FREE_HOSTING_DEPLOYMENT.md](./FREE_HOSTING_DEPLOYMENT.md)
