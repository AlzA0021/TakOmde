#!/usr/bin/env bash
# اسکریپت Start برای Render.com

set -o errexit

echo "Starting Gunicorn server..."
gunicorn pickbazar_shop.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120
