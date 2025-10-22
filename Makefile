.PHONY: help build up down restart logs ps clean backup restore deploy deploy-prod

help: ## نمایش راهنمای دستورات
	@echo "دستورات موجود:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build کردن ایمیج‌های Docker
	docker-compose build

build-no-cache: ## Build کردن ایمیج‌ها بدون استفاده از cache
	docker-compose build --no-cache

up: ## اجرای سرویس‌ها در background
	docker-compose up -d

down: ## توقف و حذف کانتینرها
	docker-compose down

down-volumes: ## توقف و حذف کانتینرها و volumes
	docker-compose down -v

restart: ## Restart کردن تمام سرویس‌ها
	docker-compose restart

restart-backend: ## Restart کردن Backend
	docker-compose restart backend

restart-frontend: ## Restart کردن Frontend
	docker-compose restart frontend

logs: ## نمایش لاگ تمام سرویس‌ها
	docker-compose logs -f

logs-backend: ## نمایش لاگ Backend
	docker-compose logs -f backend

logs-frontend: ## نمایش لاگ Frontend
	docker-compose logs -f frontend

logs-nginx: ## نمایش لاگ Nginx
	docker-compose logs -f nginx

ps: ## نمایش وضعیت سرویس‌ها
	docker-compose ps

shell-backend: ## دسترسی به Shell Backend
	docker-compose exec backend /bin/bash

shell-db: ## دسترسی به PostgreSQL
	docker-compose exec db psql -U postgres -d pickbazar_db

migrate: ## اجرای Django migrations
	docker-compose exec backend python manage.py migrate

makemigrations: ## ایجاد migrations جدید
	docker-compose exec backend python manage.py makemigrations

collectstatic: ## جمع‌آوری static files
	docker-compose exec backend python manage.py collectstatic --noinput

createsuperuser: ## ایجاد Django superuser
	docker-compose exec backend python manage.py createsuperuser

clean: ## پاکسازی کانتینرها، ایمیج‌ها و volumes استفاده نشده
	docker system prune -a

backup: ## پشتیبان‌گیری از دیتابیس و media
	./backup.sh

restore: ## بازیابی از backup (استفاده: make restore FILE=path/to/backup.sql.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "لطفاً فایل backup را مشخص کنید: make restore FILE=path/to/backup.sql.gz"; \
	else \
		./restore.sh $(FILE); \
	fi

deploy: ## دیپلوی Development
	./deploy.sh

deploy-prod: ## دیپلوی Production
	./deploy-production.sh

test-backend: ## اجرای تست‌های Backend
	docker-compose exec backend python manage.py test

install: ## نصب اولیه پروژه
	@echo "نصب اولیه پروژه..."
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; fi
	@if [ ! -f frontend/.env ]; then cp frontend/.env.example frontend/.env; fi
	@echo "فایل‌های .env ایجاد شدند. لطفاً آنها را ویرایش کنید."
	@echo "سپس دستور 'make deploy' را اجرا کنید."

dev: ## اجرای پروژه در حالت Development
	docker-compose up

status: ## نمایش وضعیت کامل سیستم
	@echo "========================================="
	@echo "وضعیت سرویس‌ها:"
	@echo "========================================="
	@docker-compose ps
	@echo ""
	@echo "========================================="
	@echo "استفاده از منابع:"
	@echo "========================================="
	@docker stats --no-stream
