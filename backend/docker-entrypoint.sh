#!/bin/bash

# خروج در صورت بروز خطا
set -e

echo "Waiting for PostgreSQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Creating superuser if not exists..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(phone_number='09123456789').exists():
    User.objects.create_superuser(
        phone_number='09123456789',
        password='admin123',
        full_name='Admin'
    )
    print("Superuser created successfully")
else:
    print("Superuser already exists")
END

echo "Starting server..."
exec "$@"
