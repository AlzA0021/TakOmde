# راهنمای دیپلوی پروژه پیک بازار

این راهنما مراحل دیپلوی پروژه را با استفاده از Docker و Docker Compose شرح می‌دهد.

## پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر نصب شده‌اند:

- Docker (نسخه 20.10 یا بالاتر)
- Docker Compose (نسخه 1.29 یا بالاتر)
- Git

## ساختار پروژه

```
TakOmde/
├── backend/                 # Django Backend
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── requirements.txt
│   ├── .env.example
│   └── .env.production
├── frontend/                # Next.js Frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── .env.production
├── nginx/                   # Nginx Configuration
│   ├── nginx.conf
│   └── conf.d/
│       └── pickbazar.conf
├── docker-compose.yml       # Docker Compose Configuration
├── deploy.sh               # اسکریپت دیپلوی Development
├── deploy-production.sh    # اسکریپت دیپلوی Production
├── backup.sh              # اسکریپت پشتیبان‌گیری
└── restore.sh             # اسکریپت بازیابی
```

## راه‌اندازی محیط Development

### 1. کلون کردن پروژه

```bash
git clone <repository-url>
cd TakOmde
```

### 2. تنظیم فایل‌های محیطی

برای Backend:
```bash
cd backend
cp .env.example .env
# فایل .env را ویرایش کرده و مقادیر مورد نیاز را وارد کنید
cd ..
```

برای Frontend:
```bash
cd frontend
cp .env.example .env
# فایل .env را ویرایش کرده و مقادیر مورد نیاز را وارد کنید
cd ..
```

### 3. اجرای دیپلوی Development

```bash
./deploy.sh
```

این اسکریپت به صورت خودکار:
- فایل‌های .env را کپی می‌کند (در صورت عدم وجود)
- کانتینرهای قبلی را متوقف می‌کند
- ایمیج‌های جدید را Build می‌کند
- سرویس‌ها را اجرا می‌کند

### 4. دسترسی به سرویس‌ها

پس از اجرای موفق، می‌توانید به سرویس‌ها دسترسی داشته باشید:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin
- **API Documentation (Swagger)**: http://localhost:8000/swagger
- **API Documentation (ReDoc)**: http://localhost:8000/redoc

## راه‌اندازی محیط Production

### 1. تنظیم فایل‌های Production

```bash
# ویرایش فایل‌های .env.production
nano backend/.env.production
nano frontend/.env.production
```

**نکات مهم برای Production:**

#### Backend (.env.production):
- `SECRET_KEY`: یک کلید امنیتی قوی و منحصر به فرد تولید کنید
- `DEBUG=False`: حتماً Debug را غیرفعال کنید
- `ALLOWED_HOSTS`: دامنه‌های مجاز خود را وارد کنید
- `DB_PASSWORD`: یک رمز عبور قوی برای دیتابیس
- تنظیمات پرداخت و SMS را با اطلاعات واقعی پر کنید

#### Frontend (.env.production):
- `NEXT_PUBLIC_API_URL`: آدرس API واقعی را وارد کنید
- `NEXT_PUBLIC_SITE_URL`: آدرس سایت را وارد کنید

### 2. تنظیم Nginx برای Production

فایل `nginx/conf.d/pickbazar.conf` را ویرایش کنید:

```bash
nano nginx/conf.d/pickbazar.conf
```

- `server_name` را با دامنه واقعی خود جایگزین کنید
- برای فعال‌سازی HTTPS، بخش SSL را uncomment کنید
- گواهی SSL خود را در `nginx/ssl/` قرار دهید

### 3. اجرای دیپلوی Production

```bash
./deploy-production.sh
```

این اسکریپت:
- آخرین تغییرات را از Git دریافت می‌کند
- فایل‌های .env.production را کپی می‌کند
- ایمیج‌های جدید را Build می‌کند
- Migrations را اجرا می‌کند
- Static files را جمع‌آوری می‌کند
- سرویس‌ها را Restart می‌کند

## مدیریت سرویس‌ها

### مشاهده وضعیت سرویس‌ها

```bash
docker-compose ps
```

### مشاهده لاگ‌ها

```bash
# لاگ تمام سرویس‌ها
docker-compose logs -f

# لاگ یک سرویس خاص
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Restart کردن سرویس‌ها

```bash
# Restart تمام سرویس‌ها
docker-compose restart

# Restart یک سرویس خاص
docker-compose restart backend
```

### توقف سرویس‌ها

```bash
# توقف سرویس‌ها (بدون حذف volumes)
docker-compose stop

# توقف و حذف کانتینرها (بدون حذف volumes)
docker-compose down

# توقف و حذف کامل (شامل volumes)
docker-compose down -v
```

## پشتیبان‌گیری و بازیابی

### پشتیبان‌گیری

```bash
./backup.sh
```

این اسکریپت:
- از دیتابیس PostgreSQL backup می‌گیرد
- از فایل‌های media backup می‌گیرد
- فایل‌ها را در دایرکتوری `backups/` ذخیره می‌کند
- backup‌های قدیمی‌تر از 7 روز را حذف می‌کند

### بازیابی

```bash
./restore.sh ./backups/db_backup_YYYYMMDD_HHMMSS.sql.gz
```

## دستورات مفید Django

### اجرای دستورات Django در کانتینر

```bash
# Migration
docker-compose exec backend python manage.py migrate

# ایجاد Superuser
docker-compose exec backend python manage.py createsuperuser

# جمع‌آوری Static Files
docker-compose exec backend python manage.py collectstatic

# اجرای Shell
docker-compose exec backend python manage.py shell

# مشاهده لیست Users
docker-compose exec backend python manage.py shell -c "from accounts.models import User; print(User.objects.all())"
```

### دسترسی به دیتابیس PostgreSQL

```bash
docker-compose exec db psql -U postgres -d pickbazar_db
```

## نکات امنیتی

1. **Secret Keys**: همیشه از کلیدهای امنیتی قوی استفاده کنید
2. **Debug Mode**: در production حتماً `DEBUG=False` باشد
3. **Passwords**: از رمزهای عبور قوی برای دیتابیس استفاده کنید
4. **HTTPS**: در production حتماً از HTTPS استفاده کنید
5. **Firewall**: فقط پورت‌های لازم (80, 443) را باز کنید
6. **Backup**: به صورت منظم backup بگیرید
7. **Updates**: به صورت منظم dependencies را به‌روزرسانی کنید

## عیب‌یابی

### مشکل در اتصال به دیتابیس

```bash
# بررسی وضعیت دیتابیس
docker-compose logs db

# Restart دیتابیس
docker-compose restart db
```

### مشکل در Build کردن ایمیج‌ها

```bash
# پاک کردن cache و build مجدد
docker-compose build --no-cache
```

### مشکل در فضای دیسک

```bash
# پاک کردن ایمیج‌ها و volumes استفاده نشده
docker system prune -a
docker volume prune
```

### مشکل در Nginx

```bash
# تست تنظیمات Nginx
docker-compose exec nginx nginx -t

# Reload تنظیمات Nginx
docker-compose exec nginx nginx -s reload
```

## به‌روزرسانی پروژه

```bash
# دریافت آخرین تغییرات
git pull origin main

# Build و اجرای مجدد
docker-compose down
docker-compose build
docker-compose up -d

# اجرای migrations
docker-compose exec backend python manage.py migrate

# جمع‌آوری static files
docker-compose exec backend python manage.py collectstatic --noinput
```

## پشتیبانی

در صورت بروز مشکل، می‌توانید:
1. لاگ‌های سرویس‌ها را بررسی کنید
2. به مستندات رسمی Docker و Django مراجعه کنید
3. با تیم توسعه تماس بگیرید

## منابع مفید

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
