# راهنمای دیپلوی پروژه روی هاست‌های رایگان

این راهنما مراحل کامل دیپلوی پروژه پیک بازار را روی هاست‌های رایگان شرح می‌دهد.

## انتخاب هاست‌ها

برای این پروژه از ترکیب زیر استفاده می‌کنیم:

### 1. **Render.com** - برای Backend
- ✅ PostgreSQL رایگان
- ✅ Redis رایگان
- ✅ پشتیبانی از Django
- ✅ SSL رایگان
- ⚠️ محدودیت: 750 ساعت در ماه رایگان

### 2. **Vercel** - برای Frontend
- ✅ Next.js Hosting رایگان
- ✅ CDN سریع
- ✅ SSL رایگان
- ✅ Deployment خودکار از GitHub
- ✅ بدون محدودیت زمانی

---

## مرحله 1️⃣: دیپلوی Backend روی Render.com

### قدم 1: ثبت‌نام در Render

1. به آدرس [render.com](https://render.com) بروید
2. با GitHub اکانت خود ثبت‌نام کنید
3. به Repository پروژه دسترسی دهید

### قدم 2: ایجاد PostgreSQL Database

1. از Dashboard Render، روی **"New +"** کلیک کنید
2. **"PostgreSQL"** را انتخاب کنید
3. تنظیمات زیر را وارد کنید:
   - **Name**: `pickbazar-db`
   - **Database**: `pickbazar_db`
   - **User**: `pickbazar_user` (یا هر نامی که می‌خواهید)
   - **Region**: انتخاب نزدیک‌ترین region
   - **Plan**: **Free**
4. روی **"Create Database"** کلیک کنید
5. ⚠️ **مهم**: `Internal Database URL` را کپی کنید (برای مرحله بعد نیاز دارید)

### قدم 3: ایجاد Redis

1. از Dashboard، روی **"New +"** کلیک کنید
2. **"Redis"** را انتخاب کنید
3. تنظیمات:
   - **Name**: `pickbazar-redis`
   - **Plan**: **Free**
4. روی **"Create Redis"** کلیک کنید
5. ⚠️ **مهم**: `Internal Redis URL` را کپی کنید

### قدم 4: ایجاد Web Service برای Backend

1. از Dashboard، روی **"New +"** کلیک کنید
2. **"Web Service"** را انتخاب کنید
3. Repository خود را وصل کنید و انتخاب کنید
4. تنظیمات زیر را وارد کنید:

#### Basic Settings:
- **Name**: `pickbazar-backend`
- **Region**: همان region دیتابیس
- **Branch**: `main` (یا branch اصلی شما)
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**:
  ```bash
  pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
  ```
- **Start Command**:
  ```bash
  gunicorn pickbazar_shop.wsgi:application --bind 0.0.0.0:$PORT
  ```

#### Advanced Settings:
- **Plan**: **Free**

### قدم 5: تنظیم Environment Variables

در بخش **"Environment"** متغیرهای زیر را اضافه کنید:

```bash
# Django Settings
SECRET_KEY=<یک کلید امنیتی قوی تولید کنید>
DEBUG=False
ALLOWED_HOSTS=.onrender.com

# Database - از URL کپی شده استفاده کنید
DATABASE_URL=<Internal Database URL که کپی کردید>

# Redis - از URL کپی شده استفاده کنید
REDIS_URL=<Internal Redis URL که کپی کردید>

# CORS - بعد از دیپلوی frontend به‌روز می‌شود
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Payment Gateways (اختیاری - بعداً می‌توانید تنظیم کنید)
ZARINPAL_MERCHANT_ID=
ZARINPAL_CALLBACK_URL=

# SMS Provider (اختیاری)
KAVENEGAR_API_KEY=
GHASEDAK_API_KEY=
```

#### 🔐 تولید SECRET_KEY:
در ترمینال لوکال خود اجرا کنید:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### قدم 6: Deploy Backend

1. روی **"Create Web Service"** کلیک کنید
2. Render شروع به build و deploy می‌کند (حدود 5-10 دقیقه طول می‌کشد)
3. پس از Deploy موفق، URL backend شما این شکلی خواهد بود:
   ```
   https://pickbazar-backend.onrender.com
   ```
4. ⚠️ **مهم**: این URL را کپی کنید (برای تنظیم Frontend نیاز دارید)

### قدم 7: ایجاد Superuser

پس از deploy موفق، از بخش **"Shell"** در Dashboard Render:

```bash
python manage.py createsuperuser
```

یا می‌توانید از قبل در `docker-entrypoint.sh` این کار را انجام دهید.

### ✅ بررسی Backend:

سرویس‌های زیر باید کار کنند:
- API: `https://pickbazar-backend.onrender.com/api/`
- Admin: `https://pickbazar-backend.onrender.com/admin/`
- Swagger: `https://pickbazar-backend.onrender.com/swagger/`

---

## مرحله 2️⃣: دیپلوی Frontend روی Vercel

### قدم 1: ثبت‌نام در Vercel

1. به آدرس [vercel.com](https://vercel.com) بروید
2. با GitHub اکانت خود وارد شوید
3. به Repository دسترسی دهید

### قدم 2: ایجاد پروژه جدید

1. روی **"Add New..."** → **"Project"** کلیک کنید
2. Repository پروژه را انتخاب کنید
3. روی **"Import"** کلیک کنید

### قدم 3: تنظیمات پروژه

#### Framework Preset:
- **Framework**: Next.js (تشخیص خودکار)

#### Root Directory:
- **Root Directory**: `frontend` ⚠️ **مهم**

#### Build Settings:
- **Build Command**: `npm run build` (پیش‌فرض)
- **Output Directory**: `.next` (پیش‌فرض)
- **Install Command**: `npm install` (پیش‌فرض)

#### Environment Variables:

در بخش **"Environment Variables"** متغیرهای زیر را اضافه کنید:

```bash
NEXT_PUBLIC_API_URL=https://pickbazar-backend.onrender.com/api
=فروشگاه پیک بازار
NEXT_PUBLIC_SITE_DESCRIPTION=فروشگاه آنلاین محصولات
```

⚠️ **توجه**: `https://pickbazar-backend.onrender.com` را با URL واقعی backend خود جایگزین کنید.

### قدم 4: Deploy Frontend

1. روی **"Deploy"** کلیک کنید
2. Vercel شروع به build و deploy می‌کند (2-3 دقیقه)
3. پس از deploy موفق، URL frontend شما:
   ```
   https://your-project-name.vercel.app
   ```

---

## مرحله 3️⃣: اتصال Frontend و Backend

### به‌روزرسانی CORS در Backend

1. برگردید به Dashboard Render
2. به Web Service Backend بروید
3. بخش **"Environment"** را باز کنید
4. متغیر `CORS_ALLOWED_ORIGINS` را به‌روز کنید:
   ```
   CORS_ALLOWED_ORIGINS=https://your-project-name.vercel.app
   ```NEXT_PUBLIC_SITE_NAME
5. روی **"Save Changes"** کلیک کنید
6. Backend به صورت خودکار redeploy می‌شود

---

## مرحله 4️⃣: Celery Worker (اختیاری)

⚠️ **توجه**: در پلن رایگان Render، Celery Worker محدودیت دارد. اگر نیازی به کارهای Background ندارید، این مرحله را رد کنید.

### ایجاد Background Worker:

1. از Dashboard Render، **"New +"** → **"Background Worker"**
2. Repository و Branch مشابه backend را انتخاب کنید
3. تنظیمات:
   - **Name**: `pickbazar-celery`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `celery -A pickbazar_shop worker -l info`
4. همان Environment Variables backend را کپی کنید
5. Deploy کنید

---

## مرحله 5️⃣: بررسی و تست

### ✅ Checklist نهایی:

#### Backend:
- [ ] API در `https://pickbazar-backend.onrender.com/api/` کار می‌کند
- [ ] Admin Panel در `https://pickbazar-backend.onrender.com/admin/` قابل دسترسی است
- [ ] Swagger Docs در `https://pickbazar-backend.onrender.com/swagger/` نمایش داده می‌شود
- [ ] می‌توانید با superuser وارد Admin شوید
- [ ] Database متصل است (بدون خطای دیتابیس)

#### Frontend:
- [ ] سایت در `https://your-project.vercel.app` باز می‌شود
- [ ] صفحه اصلی درست نمایش داده می‌شود
- [ ] اتصال به API کار می‌کند (بدون خطای CORS)
- [ ] محصولات نمایش داده می‌شوند (در صورت وجود)

### تست اتصال Frontend-Backend:

1. وارد Frontend شوید
2. Developer Tools → Console را باز کنید
3. به دنبال خطاهای CORS یا Network باشید
4. اگر API درست کار کند، محصولات باید نمایش داده شوند

---

## مشکلات رایج و راه‌حل‌ها

### ❌ مشکل 1: Backend بعد از مدتی Sleep می‌شود

**دلیل**: در پلن رایگان Render، سرویس‌ها بعد از 15 دقیقه عدم استفاده sleep می‌شوند.

**راه‌حل**:
- اولین بار که کاربر وارد سایت می‌شود، ممکن است 30-60 ثانیه طول بکشد
- می‌توانید از سرویس‌های Uptime Monitoring مثل [UptimeRobot](https://uptimerobot.com) استفاده کنید
- یا Upgrade به پلن پولی کنید

### ❌ مشکل 2: خطای CORS

**دلیل**: Frontend نمی‌تواند به Backend دسترسی داشته باشد.

**راه‌حل**:
1. مطمئن شوید `CORS_ALLOWED_ORIGINS` در Environment Variables Backend درست است
2. URL Frontend را دقیقاً کپی کنید (با https://)
3. Backend را Redeploy کنید

### ❌ مشکل 3: Static Files نمایش داده نمی‌شوند

**دلیل**: Whitenoise درست تنظیم نشده.

**راه‌حل**:
1. مطمئن شوید `whitenoise` در requirements.txt است
2. `collectstatic` در Build Command اجرا شود
3. Middleware Whitenoise در settings.py فعال باشد

### ❌ مشکل 4: Database Migration خطا می‌دهد

**دلیل**: DATABASE_URL درست تنظیم نشده.

**راه‌حل**:
1. دوباره `Internal Database URL` را از Render کپی کنید
2. در Environment Variables قرار دهید
3. Redeploy کنید

### ❌ مشکل 5: Media Files آپلود نمی‌شوند

**دلیل**: Render سیستم فایل Read-only دارد و فایل‌های آپلود شده بعد از Restart پاک می‌شوند.

**راه‌حل**:
- از **Cloudinary** برای ذخیره تصاویر استفاده کنید (رایگان)
- یا از **AWS S3** (پلن رایگان محدود)

#### نصب و تنظیم Cloudinary:

```bash
# اضافه کردن به requirements.txt
cloudinary==1.41.0
django-cloudinary-storage==0.3.0
```

در `settings.py`:
```python
import cloudinary

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'your-cloud-name',
    'API_KEY': 'your-api-key',
    'API_SECRET': 'your-api-secret'
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

---

## محدودیت‌های پلن رایگان

### Render.com:
- ✅ 750 ساعت رایگان در ماه
- ✅ PostgreSQL: 1GB Storage
- ✅ Redis: 25MB
- ⚠️ Sleep بعد از 15 دقیقه بی‌فعالیت
- ⚠️ Build time محدود

### Vercel:
- ✅ Unlimited Deployments
- ✅ 100GB Bandwidth/ماه
- ✅ بدون Sleep
- ⚠️ Serverless Function Timeout: 10 ثانیه

---

## Upgrade به پلن پولی (اختیاری)

اگر پروژه شما ترافیک بالایی دارد:

### Render Pro:
- $7/ماه برای Web Service
- بدون Sleep
- 400 ساعت رایگان در ماه

### Vercel Pro:
- $20/ماه
- 1TB Bandwidth
- Priority Support

---

## نکات مهم امنیتی

### ✅ Before Going Live:

1. **SECRET_KEY**: حتماً یک کلید امنیتی قوی و منحصر به فرد استفاده کنید
2. **DEBUG=False**: در production همیشه Debug را غیرفعال کنید
3. **ALLOWED_HOSTS**: فقط دامنه‌های مجاز را اضافه کنید
4. **Database Password**: از رمز عبور قوی استفاده کنید
5. **API Keys**: هرگز API Keys را در کد commit نکنید
6. **HTTPS**: همیشه از HTTPS استفاده کنید (Render و Vercel پیش‌فرض دارند)

---

## منابع و لینک‌های مفید

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## پشتیبانی

اگر به مشکل برخوردید:
1. لاگ‌های Render را بررسی کنید (بخش Logs در Dashboard)
2. Console Browser را بررسی کنید (F12 → Console)
3. به مستندات رسمی مراجعه کنید
4. در صورت نیاز با تیم پشتیبانی Render/Vercel تماس بگیرید

---

## خلاصه دستورات سریع

### تولید SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### تست Backend لوکال:
```bash
cd backend
python manage.py runserver
```

### تست Frontend لوکال:
```bash
cd frontend
npm run dev
```

### ایجاد Superuser:
```bash
python manage.py createsuperuser
```

---

**موفق باشید! 🚀**
