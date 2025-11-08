# راهنمای سریع: دیپلوی روی PythonAnywhere

## خلاصه 10 مرحله‌ای

### 1️⃣ ثبت‌نام (2 دقیقه)
```
www.pythonanywhere.com → Pricing & Signup → Beginner (Free)
Username: yourusername (این در URL شما خواهد بود)
```

---

### 2️⃣ ایجاد MySQL Database (2 دقیقه)
```
Dashboard → Databases Tab
Create database: pickbazar
Set MySQL password: <یک رمز قوی>

نتیجه:
Database: yourusername$pickbazar
User: yourusername
Host: yourusername.mysql.pythonanywhere-services.com
```

---

### 3️⃣ Clone پروژه (1 دقیقه)
```bash
Dashboard → Consoles → Bash

cd ~
git clone https://github.com/YOUR_USERNAME/TakOmde.git
cd TakOmde
```

---

### 4️⃣ Virtual Environment (3 دقیقه)
```bash
mkvirtualenv --python=python3.10 pickbazar-env
cd ~/TakOmde/backend
pip install -r requirements.txt
```

---

### 5️⃣ تنظیم .env (3 دقیقه)
```bash
cd ~/TakOmde/backend
cp .env.pythonanywhere .env
nano .env
```

محتوا:
```bash
SECRET_KEY=<تولید کنید با دستور زیر>
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com

DB_ENGINE=django.db.backends.mysql
DB_NAME=yourusername$pickbazar
DB_USER=yourusername
DB_PASSWORD=<رمز MySQL>
DB_HOST=yourusername.mysql.pythonanywhere-services.com

CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

تولید SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

ذخیره: `Ctrl+X` → `Y` → `Enter`

---

### 6️⃣ Migration و Setup (2 دقیقه)
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

---

### 7️⃣ ایجاد Web App (2 دقیقه)
```
Dashboard → Web Tab → Add a new web app
→ Next (domain رایگان)
→ Manual configuration
→ Python 3.10
→ Next
```

---

### 8️⃣ تنظیم Web App (5 دقیقه)

#### Virtualenv:
```
/home/yourusername/.virtualenvs/pickbazar-env
```

#### Code Section:
- **Source code**: `/home/yourusername/TakOmde/backend`
- **Working directory**: `/home/yourusername/TakOmde/backend`

#### WSGI Configuration:
کلیک روی لینک WSGI → پاک کردن همه → جایگزین با:

```python
import os
import sys

path = '/home/yourusername/TakOmde/backend'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'pickbazar_shop.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

Save!

#### Static Files:
- URL: `/static/` → Directory: `/home/yourusername/TakOmde/backend/staticfiles`
- URL: `/media/` → Directory: `/home/yourusername/TakOmde/backend/media`

---

### 9️⃣ Reload و تست (1 دقیقه)
```
Web Tab → دکمه سبز "Reload yourusername.pythonanywhere.com"

تست:
✅ https://yourusername.pythonanywhere.com/api/
✅ https://yourusername.pythonanywhere.com/admin/
✅ https://yourusername.pythonanywhere.com/swagger/
```

---

### 🔟 دیپلوی Frontend (Vercel) (5 دقیقه)
```
vercel.com → New Project → TakOmde
Root Directory: frontend
Environment Variables:
  NEXT_PUBLIC_API_URL=https://yourusername.pythonanywhere.com/api
→ Deploy
```

سپس CORS را در Backend به‌روز کنید:
```bash
nano ~/TakOmde/backend/.env
CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
```

Web Tab → Reload

---

## ✅ تمام!

- **Backend**: `https://yourusername.pythonanywhere.com`
- **Frontend**: `https://your-project.vercel.app`

---

## مشکلات رایج

### 502 Bad Gateway
→ Error log را چک کنید (Web Tab)
→ مسیرها و virtualenv را بررسی کنید

### DisallowedHost
→ ALLOWED_HOSTS در .env را چک کنید
→ Reload کنید

### Can't connect to MySQL
→ اطلاعات Database در .env را دوباره بررسی کنید

### خطای CORS
→ CORS_ALLOWED_ORIGINS را دقیق با https:// وارد کنید
→ Reload

---

## دستورات مهم

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

### مشاهده Logs:
```
Web Tab → Error log / Server log
```

### Backup:
```bash
mysqldump -u yourusername -h yourusername.mysql.pythonanywhere-services.com -p yourusername$pickbazar > backup.sql
```

---

## مستندات کامل

برای جزئیات بیشتر: [PYTHONANYWHERE_DEPLOYMENT.md](./PYTHONANYWHERE_DEPLOYMENT.md)

---

**زمان کل: ~25 دقیقه** ⏱️
