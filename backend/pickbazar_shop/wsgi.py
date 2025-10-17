"""
WSGI config for pickbazar_shop project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pickbazar_shop.settings')

application = get_wsgi_application()
