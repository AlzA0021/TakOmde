# راهنمای کامل دیپلوی پروژه روی PythonAnywhere

این راهنما مراحل کامل دیپلوی پروژه پیک بازار را روی **PythonAnywhere** شرح می‌دهد.

---

## چرا PythonAnywhere؟

### ✅ مزایا:
- هاست رایگان برای Django
- پشتیبانی عالی از Python و Django
- MySQL Database رایگان (100MB)
- HTTPS رایگان
- Console مستقیم و آسان
- بدون نیاز به Docker
- مناسب برای پروژه‌های کوچک و متوسط

### ⚠️ محدودیت‌های پلن رایگان:
- 512MB فضای دیسک
- یک Web App
- MySQL Database: 100MB
- بدون Always-on Tasks (Celery کار نمی‌کند)
- محدودیت API calls به سایت‌های خارجی
- سایت بعد از 3 ماه عدم فعالیت غیرفعال می‌شود

---

## قبل از شروع

### پیش‌نیازها:
- [x] اکانت PythonAnywhere (رایگان)
- [x] اکانت GitHub
- [x] پروژه روی GitHub push شده باشد

---

## مرحله 1️⃣: ثبت‌نام و تنظیمات اولیه

### قدم 1: ثبت‌نام

1. به آدرس [www.pythonanywhere.com](https://www.pythonanywhere.com) بروید
2. روی **"Pricing & Signup"** کلیک کنید
3. **"Create a Beginner account"** را انتخاب کنید (رایگان)
4. فرم ثبت‌نام را پر کنید:
   - **Username**: یک نام کاربری انتخاب کنید (مثلاً `yourusername`)
   - این username در URL شما استفاده می‌شود: `yourusername.pythonanywhere.com`
5. ایمیل را تأیید کنید

### قدم 2: ورود به Dashboard

1. وارد حساب کاربری شوید
2. به **Dashboard** بروید

---

## مرحله 2️⃣: ایجاد و تنظیم MySQL Database

### قدم 1: ایجاد Database

1. از Dashboard، به تب **"Databases"** بروید
2. در بخش **"Create a new database"**:
   - **Database name**: `pickbazar` را وارد کنید
   - نام کامل database: `yourusername$pickbazar` خواهد بود
3. روی **"Create"** کلیک کنید

### قدم 2: تنظیم Password

1. در همان صفحه، بخش **"MySQL password"** را پیدا کنید
2. یک رمز عبور قوی وارد کنید
3. روی **"Set MySQL password"** کلیک کنید
4. ⚠️ **مهم**: این رمز را یادداشت کنید!

### اطلاعات Database شما:

```
Database Name: yourusername$pickbazar
Username: yourusername
Password: <رمزی که تنظیم کردید>
Host: yourusername.mysql.pythonanywhere-services.com
```

---

## مرحله 3️⃣: Clone کردن پروژه از GitHub

### قدم 1: باز کردن Console

1. از Dashboard، به تب **"Consoles"** بروید
2. روی **"Bash"** کلیک کنید تا یک Console جدید باز شود

### قدم 2: Clone پروژه

در Console اجرا کنید:

```bash
# رفتن به Home Directory
cd ~

# Clone پروژه از GitHub
git clone https://github.com/YOUR_GITHUB_USERNAME/TakOmde.git

# ورود به دایرکتوری پروژه
cd TakOmde
```

⚠️ **توجه**: `YOUR_GITHUB_USERNAME` را با username GitHub خود جایگزین کنید.

---

## مرحله 4️⃣: ایجاد Virtual Environment و نصب وابستگی‌ها

### قدم 1: ایجاد Virtual Environment

```bash
# ایجاد virtualenv با Python 3.10
mkvirtualenv --python=python3.10 pickbazar-env

# virtualenv به صورت خودکار فعال می‌شود
# اگر فعال نشد:
workon pickbazar-env
```

### قدم 2: نصب وابستگی‌ها

```bash
cd ~/TakOmde/backend

# نصب تمام پکیج‌ها
pip install -r requirements.txt
```

این کار 2-5 دقیقه طول می‌کشد.

---

## مرحله 5️⃣: تنظیم فایل Environment Variables

### قدم 1: ایجاد فایل .env

```bash
cd ~/TakOmde/backend

# کپی فایل نمونه
cp .env.pythonanywhere .env

# ویرایش فایل
nano .env
```

### قدم 2: ویرایش متغیرها

محتوای `.env` را با اطلاعات زیر پر کنید:

```bash
# Django Settings
SECRET_KEY=<یک کلید امنیتی قوی>
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com

# Database - MySQL
DB_ENGINE=django.db.backends.mysql
DB_NAME=AlzA$pickbazar
DB_USER=AlzA
DB_PASSWORD=<0021AlzA080>
DB_HOST=yourusername.mysql.pythonanywhere-services.com

# CORS Settings
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

# Payment & SMS (اختیاری - بعداً تنظیم کنید)
ZARINPAL_MERCHANT_ID=
KAVENEGAR_API_KEY=
```

#### 🔐 تولید SECRET_KEY:

در همان Console:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

خروجی را کپی کرده و در `SECRET_KEY` قرار دهید.

⚠️ **مهم**:
- `yourusername` را با username PythonAnywhere خود جایگزین کنید
- `DEBUG=False` باشد
- `ALLOWED_HOSTS` را دقیق وارد کنید

### قدم 3: ذخیره فایل

در nano:
- `Ctrl + X` برای خروج
- `Y` برای تأیید ذخیره
- `Enter` برای تأیید نام فایل

---

## مرحله 6️⃣: Migration و Static Files

### قدم 1: اجرای Migrations

```bash
cd ~/TakOmde/backend

# بررسی اتصال به دیتابیس
python manage.py migrate
```

اگر خطایی نداشتید، دیتابیس با موفقیت تنظیم شده است! ✅

### قدم 2: ایجاد Superuser

```bash
python manage.py createsuperuser
```

اطلاعات زیر را وارد کنید:
- **Phone number**: `09123456789` (یا هر شماره‌ای)
- **Password**: یک رمز عبور قوی
- **Full name**: نام خود

### قدم 3: جمع‌آوری Static Files

```bash
python manage.py collectstatic --noinput
```

---

## مرحله 7️⃣: تنظیم Web App

### قدم 1: ایجاد Web App

1. از Dashboard، به تب **"Web"** بروید
2. روی **"Add a new web app"** کلیک کنید
3. روی **"Next"** کلیک کنید (دامنه رایگان)
4. **"Manual configuration"** را انتخاب کنید (نه Django!)
5. **Python 3.10** را انتخاب کنید
6. روی **"Next"** کلیک کنید

### قدم 2: تنظیم Virtualenv

در صفحه Web App:

1. بخش **"Virtualenv"** را پیدا کنید
2. در قسمت **"Enter path to a virtualenv"**:
   ```
   /home/yourusername/.virtualenvs/pickbazar-env
   ```
3. روی تیک آبی کلیک کنید

⚠️ `yourusername` را با username خود جایگزین کنید.

### قدم 3: تنظیم Source Code

در بخش **"Code"**:

1. **Source code**:
   ```
   /home/yourusername/TakOmde/backend
   ```
2. **Working directory**:
   ```
   /home/yourusername/TakOmde/backend
   ```

### قدم 4: تنظیم WSGI Configuration

1. در بخش **"Code"** لینک **"WSGI configuration file"** را پیدا کنید
2. روی آن کلیک کنید (یک ادیتور باز می‌شود)
3. **تمام محتوا** را پاک کنید
4. محتوای زیر را جایگزین کنید:

```python
import os
import sys
from pathlib import Path

# مسیر پروژه
path = '/home/yourusername/TakOmde/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# تنظیم Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'pickbazar_shop.settings'

# Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

⚠️ **مهم**: `yourusername` را با username خود جایگزین کنید!

5. روی **"Save"** کلیک کنید (بالای صفحه)

### قدم 5: تنظیم Static Files

در صفحه Web App، به بخش **"Static files"** بروید:

#### Static Files:
- **URL**: `/static/`
- **Directory**: `/home/yourusername/TakOmde/backend/staticfiles`

#### Media Files:
- **URL**: `/media/`
- **Directory**: `/home/yourusername/TakOmde/backend/media`

⚠️ `yourusername` را جایگزین کنید.

---

## مرحله 8️⃣: Reload و تست Web App

### قدم 1: Reload

1. برگردید به بالای صفحه Web App
2. روی دکمه سبز بزرگ **"Reload yourusername.pythonanywhere.com"** کلیک کنید
3. صبر کنید تا "Reload complete" نشان دهد

### قدم 2: تست سایت

سرویس‌های زیر را باز کنید:

1. **صفحه اصلی API**:
   ```
   https://yourusername.pythonanywhere.com/api/
   ```

2. **Admin Panel**:
   ```
   https://yourusername.pythonanywhere.com/admin/
   ```
   با superuser که ساختید وارد شوید

3. **Swagger Documentation**:
   ```
   https://yourusername.pythonanywhere.com/swagger/
   ```

اگر همه باز شدند، Backend شما کامل است! ✅

---

## مرحله 9️⃣: دیپلوی Frontend روی Vercel

### قدم 1: تنظیم Vercel

مراحل دقیقاً مانند [راهنمای قبلی](./FREE_HOSTING_DEPLOYMENT.md) است:

1. به [vercel.com](https://vercel.com) بروید
2. با GitHub وارد شوید
3. **New Project** → Repository TakOmde را انتخاب کنید
4. **Root Directory**: `frontend`
5. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_API_URL=https://yourusername.pythonanywhere.com/api
   NEXT_PUBLIC_SITE_NAME=فروشگاه پیک بازار
   NEXT_PUBLIC_SITE_DESCRIPTION=فروشگاه آنلاین محصولات
   ```
6. روی **"Deploy"** کلیک کنید

### قدم 2: به‌روزرسانی CORS

پس از deploy Frontend:

1. به Console PythonAnywhere برگردید
2. فایل `.env` را ویرایش کنید:
   ```bash
   nano ~/TakOmde/backend/.env
   ```
3. `CORS_ALLOWED_ORIGINS` را به‌روز کنید:
   ```
   CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
4. ذخیره کنید (`Ctrl+X`, `Y`, `Enter`)
5. در Web Tab، روی **"Reload"** کلیک کنید

---

## مرحله 🔟: بررسی نهایی

### ✅ Checklist:

- [ ] Backend API کار می‌کند: `https://yourusername.pythonanywhere.com/api/`
- [ ] Admin Panel قابل دسترسی است
- [ ] Swagger Docs نمایش داده می‌شود
- [ ] می‌توانید با superuser وارد Admin شوید
- [ ] Frontend در Vercel deploy شده است
- [ ] Frontend به Backend متصل است (بدون خطای CORS)
- [ ] محصولات در Frontend نمایش داده می‌شوند (در صورت وجود)

---

## مشکلات رایج و راه‌حل‌ها

### ❌ خطای "502 Bad Gateway"

**دلیل**: WSGI configuration یا virtualenv اشتباه است.

**راه‌حل**:
1. به Web Tab بروید
2. بخش **"Error log"** را بررسی کنید
3. مطمئن شوید مسیرها درست هستند
4. مطمئن شوید virtualenv فعال است
5. Reload کنید

### ❌ خطای "DisallowedHost"

**دلیل**: `ALLOWED_HOSTS` در `.env` درست نیست.

**راه‌حل**:
```bash
nano ~/TakOmde/backend/.env
# مطمئن شوید:
ALLOWED_HOSTS=yourusername.pythonanywhere.com
```
سپس Reload کنید.

### ❌ خطای "OperationalError: (2003, Can't connect to MySQL server)"

**دلیل**: اطلاعات Database در `.env` اشتباه است.

**راه‌حل**:
1. از Databases Tab اطلاعات را دوباره بررسی کنید
2. مطمئن شوید رمز عبور درست است
3. Format دقیق:
   ```
   DB_NAME=yourusername$pickbazar
   DB_USER=yourusername
   DB_HOST=yourusername.mysql.pythonanywhere-services.com
   ```

### ❌ Static Files لود نمی‌شوند

**دلیل**: Static files mapping درست نیست.

**راه‌حل**:
1. مطمئن شوید `collectstatic` اجرا شده
2. در Web Tab، Static files را دوباره چک کنید
3. Reload کنید

### ❌ خطای CORS

**دلیل**: `CORS_ALLOWED_ORIGINS` درست تنظیم نشده.

**راه‌حل**:
1. URL Frontend را دقیقاً کپی کنید (با https://)
2. در `.env` قرار دهید
3. Reload کنید

### ❌ Media Files آپلود نمی‌شوند

**دلیل**: مسیر Media یا دسترسی‌ها درست نیست.

**راه‌حل**:
```bash
# ایجاد دایرکتوری media
mkdir -p ~/TakOmde/backend/media

# تنظیم دسترسی‌ها
chmod 755 ~/TakOmde/backend/media
```

---

## مدیریت و به‌روزرسانی

### Pull کردن تغییرات جدید از GitHub

```bash
# در Console PythonAnywhere
cd ~/TakOmde
git pull origin main

# فعال کردن virtualenv
workon pickbazar-env

# نصب dependencies جدید (در صورت وجود)
cd backend
pip install -r requirements.txt

# اجرای migrations جدید
python manage.py migrate

# جمع‌آوری static files
python manage.py collectstatic --noinput

# سپس در Web Tab روی Reload کلیک کنید
```

### مشاهده Logs

1. به **Web Tab** بروید
2. لینک‌های زیر را کلیک کنید:
   - **Error log**: خطاهای Python/Django
   - **Server log**: درخواست‌های HTTP
   - **Access log**: تمام درخواست‌ها

### Backup گرفتن از Database

```bash
# در Console
cd ~
mysqldump -u yourusername -h yourusername.mysql.pythonanywhere-services.com -p yourusername$pickbazar > backup.sql
```

رمز عبور MySQL را وارد کنید.

### Restore کردن Backup

```bash
mysql -u yourusername -h yourusername.mysql.pythonanywhere-services.com -p yourusername$pickbazar < backup.sql
```

---

## محدودیت‌های مهم PythonAnywhere Free

### ⚠️ توجه داشته باشید:

1. **Celery کار نمی‌کند**:
   - پلن رایگان از Always-on tasks پشتیبانی نمی‌کند
   - باید کارهای background را دستی اجرا کنید یا به پلن پولی upgrade کنید

2. **محدودیت فضا**:
   - 512MB کل فضای دیسک
   - 100MB Database
   - برای Media Files از Cloudinary استفاده کنید

3. **محدودیت API Calls**:
   - فقط می‌توانید به سایت‌های Whitelist شده PythonAnywhere درخواست بزنید
   - برای SMS و Payment باید API‌های ایرانی در whitelist باشند

4. **زمان CPU**:
   - محدودیت CPU seconds در روز (معمولاً کافی است)

5. **عدم فعالیت**:
   - پس از 3 ماه عدم login، اکانت غیرفعال می‌شود

---

## Upgrade به پلن پولی (اختیاری)

اگر نیاز به امکانات بیشتر دارید:

### PythonAnywhere Hacker Plan ($5/ماه):
- ✅ 1GB فضای دیسک
- ✅ 512MB RAM
- ✅ Always-on tasks (Celery)
- ✅ بدون محدودیت API calls
- ✅ دامنه سفارشی

---

## مقایسه با Render.com

| ویژگی | PythonAnywhere | Render.com |
|-------|----------------|------------|
| Database | MySQL (100MB) | PostgreSQL (1GB) |
| Sleep Mode | ندارد | دارد (15 دقیقه) |
| Setup | راحت‌تر | پیچیده‌تر |
| Celery | نه (پلن رایگان) | بله |
| Redis | نه | بله (25MB) |
| فضای دیسک | 512MB | بیشتر |
| مناسب برای | پروژه‌های ساده | پروژه‌های پیچیده |

---

## نکات امنیتی

### ✅ Before Going Live:

1. **SECRET_KEY**: حتماً یک کلید قوی و منحصر به فرد
2. **DEBUG=False**: همیشه در production
3. **ALLOWED_HOSTS**: دقیقاً دامنه PythonAnywhere خود
4. **Database Password**: رمز عبور قوی
5. **Backup منظم**: هفتگی از database و media
6. **HTTPS**: PythonAnywhere به صورت پیش‌فرض HTTPS دارد

---

## لینک‌های مفید

- [PythonAnywhere Help](https://help.pythonanywhere.com/)
- [Django on PythonAnywhere](https://help.pythonanywhere.com/pages/DeployExistingDjangoProject/)
- [PythonAnywhere Forums](https://www.pythonanywhere.com/forums/)

---

## خلاصه دستورات

### تولید SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Clone و Setup:
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/TakOmde.git
cd TakOmde/backend
mkvirtualenv --python=python3.10 pickbazar-env
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### به‌روزرسانی:
```bash
cd ~/TakOmde
git pull origin main
workon pickbazar-env
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
# سپس Reload در Web Tab
```

---

**موفق باشید! 🚀**

Backend شما الان روی PythonAnywhere و Frontend روی Vercel در دسترس است!

- **Backend**: `https://yourusername.pythonanywhere.com`
- **Frontend**: `https://your-project.vercel.app`
