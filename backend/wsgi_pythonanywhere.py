"""
WSGI config for pickbazar_shop project - PythonAnywhere Configuration

این فایل برای دیپلوی روی PythonAnywhere استفاده می‌شود.
"""

import os
import sys
from pathlib import Path

# مسیر پروژه را به sys.path اضافه کنید
path = '/home/YOUR_USERNAME/TakOmde/backend'  # مسیر را با username خود جایگزین کنید
if path not in sys.path:
    sys.path.insert(0, path)

# تنظیم Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'pickbazar_shop.settings'

# فعال کردن virtual environment
# virtualenv_path = '/home/YOUR_USERNAME/.virtualenvs/pickbazar-env'
# activate_this = os.path.join(virtualenv_path, 'bin', 'activate_this.py')
# exec(open(activate_this).read(), {'__file__': activate_this})

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
