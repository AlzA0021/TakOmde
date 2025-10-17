# پروژه PickBazar Django Shop

یک سایت فروشگاهی کامل با Django REST Framework برای استفاده با قالب React PickBazar

## ویژگی‌ها

### ✅ مدیریت محصولات
- دسته‌بندی محصولات
- تصاویر محصولات
- ویژگی‌های محصولات
- نظرات و امتیازدهی
- مدیریت موجودی

### ✅ ورود اکسل و تبدیل به JSON
- آپلود فایل اکسل از پنل ادمین
- تبدیل خودکار به JSON
- به‌روزرسانی خودکار محصولات و موجودی
- لاگ کامل عملیات
- پشتیبانی از فایل‌های .xlsx و .xls

### ✅ سیستم سفارش‌گذاری
- سبد خرید
- لیست علاقه‌مندی
- مدیریت آدرس‌های کاربر
- ثبت سفارش

### ✅ درگاه‌های پرداخت ایرانی
- زرین‌پال (Zarinpal)
- پی‌پینگ (PayPing)
- امکان افزودن درگاه‌های دیگر

### ✅ سامانه پیامک ایرانی
- کاوه‌نگار (Kavenegar)
- قاصدک (Ghasedak)
- ارسال اعلان سفارش و پرداخت

### ✅ احراز هویت
- JWT Authentication
- ثبت‌نام و ورود
- پروفایل کاربری

## نصب و راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
pip install -r requirements.txt
```

### 2. تنظیمات محیط

فایل `.env.example` را کپی کنید:

```bash
cp .env.example .env
```

و مقادیر زیر را در `.env` تنظیم کنید:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# درگاه زرین‌پال
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_CALLBACK_URL=http://localhost:8000/api/payments/verify/

# درگاه پی‌پینگ
PAYPINT_TOKEN=your-paypint-token
PAYPINT_CALLBACK_URL=http://localhost:8000/api/payments/paypint/verify/

# سامانه پیامک کاوه‌نگار
KAVENEGAR_API_KEY=your-kavenegar-api-key
KAVENEGAR_SENDER=your-sender-number

# سامانه پیامک قاصدک
GHASEDAK_API_KEY=your-ghasedak-api-key
```

### 3. مهاجرت دیتابیس

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. ایجاد سوپریوزر

```bash
python manage.py createsuperuser
```

### 5. اجرای سرور

```bash
python manage.py runserver
```

سرور روی `http://localhost:8000` اجرا می‌شود.

## استفاده از ورود اکسل

### ساختار فایل اکسل

فایل اکسل شما باید شامل ستون‌های زیر باشد:

| کد کالا | نام کالا | موجودی | قیمت | قیمت فروش | واحد | دسته‌بندی | توضیحات |
|---------|-----------|---------|------|-----------|------|-----------|---------|
| PRD001  | محصول 1  | 100     | 50000| 45000     | عدد  | الکترونیک | ...     |

### آپلود از پنل ادمین

1. وارد پنل ادمین شوید: `http://localhost:8000/admin`
2. به بخش "Excel Import" بروید
3. روی "Add Excel Import Log" کلیک کنید
4. فایل اکسل را آپلود کنید
5. فایل به صورت خودکار پردازش می‌شود

### آپلود از API

```bash
POST /api/excel-import/
Content-Type: multipart/form-data

file: [فایل اکسل]
```

پاسخ:
```json
{
  "message": "فایل با موفقیت آپلود شد و در حال پردازش است",
  "import_log": {
    "id": 1,
    "status": "processing",
    "total_rows": 100,
    "successful_imports": 0,
    "failed_imports": 0
  }
}
```

## API Endpoints

### احراز هویت
- `POST /api/auth/register/` - ثبت‌نام
- `POST /api/auth/login/` - ورود
- `POST /api/auth/token/refresh/` - تازه‌سازی توکن
- `GET /api/auth/profile/` - دریافت پروفایل
- `PUT /api/auth/profile/` - ویرایش پروفایل

### محصولات
- `GET /api/products/products/` - لیست محصولات
- `GET /api/products/products/{slug}/` - جزئیات محصول
- `GET /api/products/products/featured/` - محصولات ویژه
- `GET /api/products/products/on_sale/` - محصولات تخفیف‌دار
- `GET /api/products/categories/` - دسته‌بندی‌ها

### سبد خرید
- `GET /api/orders/cart/` - دریافت سبد خرید
- `POST /api/orders/cart/add_item/` - افزودن به سبد
- `POST /api/orders/cart/update_item/` - به‌روزرسانی
- `POST /api/orders/cart/remove_item/` - حذف از سبد
- `POST /api/orders/cart/clear/` - خالی کردن سبد

### سفارشات
- `GET /api/orders/orders/` - لیست سفارشات
- `POST /api/orders/orders/` - ثبت سفارش جدید
- `GET /api/orders/orders/{id}/` - جزئیات سفارش

### پرداخت
- `POST /api/payments/request/` - درخواست پرداخت
- `GET /api/payments/verify/` - تایید پرداخت زرین‌پال
- `GET /api/payments/paypint/verify/` - تایید پرداخت پی‌پینگ

### ورود اکسل
- `GET /api/excel-import/` - لیست واردات
- `POST /api/excel-import/` - آپلود فایل جدید
- `GET /api/excel-import/{id}/` - جزئیات ورود
- `GET /api/excel-import/{id}/errors/` - خطاهای ورود
- `POST /api/excel-import/{id}/retry/` - تلاش مجدد

## مستندات API

پس از اجرای پروژه، مستندات کامل API در آدرس‌های زیر در دسترس است:

- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## اتصال به React PickBazar

### تنظیمات CORS

فایل `.env` را ویرایش کنید:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### تنظیمات در PickBazar

در فایل تنظیمات PickBazar، API URL را تنظیم کنید:

```javascript
const API_URL = 'http://localhost:8000/api';
```

## Celery (اختیاری)

برای پردازش async فایل‌های اکسل:

### نصب Redis

```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis
```

### اجرای Celery

```bash
# Terminal 1 - Redis
redis-server

# Terminal 2 - Celery Worker
celery -A pickbazar_shop worker -l info

# Terminal 3 - Django
python manage.py runserver
```

## ساختار پروژه

```
pickbazar-django-shop/
├── accounts/              # مدیریت کاربران
├── products/              # محصولات
├── orders/                # سفارشات و سبد خرید
├── payments/              # درگاه‌های پرداخت
├── excel_import/          # ورود اکسل
├── notifications/         # سامانه پیامک
├── pickbazar_shop/        # تنظیمات اصلی
├── manage.py
├── requirements.txt
└── README.md
```

## توضیحات فنی

### مدل‌های اصلی

#### Product (محصول)
- نام، توضیحات، قیمت، موجودی
- دسته‌بندی، تصاویر، ویژگی‌ها
- متا برای SEO

#### Order (سفارش)
- اطلاعات کاربر و ارسال
- آیتم‌های سفارش
- وضعیت پرداخت و ارسال

#### Payment (پرداخت)
- اتصال به درگاه‌های مختلف
- لاگ کامل تراکنش‌ها
- وضعیت پرداخت

#### ExcelImportLog (لاگ ورود اکسل)
- فایل آپلود شده
- آمار موفق/ناموفق
- داده JSON تبدیل شده
- خطاهای رخ داده

### امنیت

- JWT Authentication
- CORS Protection
- SQL Injection Protection (Django ORM)
- XSS Protection
- CSRF Protection

### بهینه‌سازی

- Database Indexing
- Query Optimization
- Pagination
- Caching (آماده برای Redis)

## رفع مشکلات رایج

### خطای CORS

مطمئن شوید `CORS_ALLOWED_ORIGINS` در `.env` به درستی تنظیم شده:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### خطای ورود اکسل

1. بررسی فرمت ستون‌ها
2. بررسی سایز فایل (حداکثر 10MB)
3. مشاهده لاگ‌های خطا در پنل ادمین

### خطای درگاه پرداخت

1. بررسی کلیدهای API در `.env`
2. در حالت توسعه، Sandbox فعال است
3. چک کردن callback URL

## مشارکت

برای مشارکت در این پروژه:

1. Fork کنید
2. یک Branch جدید بسازید
3. تغییرات را Commit کنید
4. Push کنید و Pull Request بزنید

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## پشتیبانی

برای سوالات و مشکلات، Issue جدید در GitHub ایجاد کنید.

---

**ساخته شده برای قالب PickBazar React** 🚀
