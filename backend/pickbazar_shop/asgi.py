"""
ASGI config for pickbazar_shop project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pickbazar_shop.settings')

application = get_asgi_application()
