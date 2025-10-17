# راهنمای استفاده از API

## فایل نمونه اکسل

برای تست ورود اکسل، یک فایل Excel با ساختار زیر بسازید:

### ستون‌های مورد نیاز:

| کد کالا | نام کالا        | موجودی | قیمت  | قیمت فروش | واحد | دسته‌بندی  | توضیحات          |
|---------|------------------|--------|-------|-----------|------|------------|------------------|
| PRD001  | لپ‌تاپ ایسوس    | 25     | 25000000 | 23000000 | عدد  | الکترونیک | لپ‌تاپ گیمینگ    |
| PRD002  | موس بی‌سیم      | 150    | 250000   | 220000   | عدد  | الکترونیک | موس لاجیتک      |
| PRD003  | کیبورد مکانیکی  | 80     | 1500000  | 1350000  | عدد  | الکترونیک | کیبورد RGB       |

## نمونه‌های درخواست API

### 1. ثبت‌نام کاربر

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123",
    "phone_number": "09123456789",
    "first_name": "علی",
    "last_name": "احمدی"
  }'
```

### 2. ورود و دریافت توکن

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "SecurePass123"
  }'
```

پاسخ:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. دریافت لیست محصولات

```bash
curl -X GET http://localhost:8000/api/products/products/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. جستجوی محصولات

```bash
# جستجو بر اساس نام
curl -X GET "http://localhost:8000/api/products/products/?search=لپ‌تاپ"

# فیلتر بر اساس دسته‌بندی
curl -X GET "http://localhost:8000/api/products/products/?category=1"

# فیلتر بر اساس قیمت
curl -X GET "http://localhost:8000/api/products/products/?min_price=1000000&max_price=5000000"

# محصولات تخفیف‌دار
curl -X GET "http://localhost:8000/api/products/products/?on_sale=true"

# محصولات موجود
curl -X GET "http://localhost:8000/api/products/products/?in_stock=true"
```

### 5. افزودن به سبد خرید

```bash
curl -X POST http://localhost:8000/api/orders/cart/add_item/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 6. مشاهده سبد خرید

```bash
curl -X GET http://localhost:8000/api/orders/cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. ثبت سفارش

```bash
curl -X POST http://localhost:8000/api/orders/orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_name": "علی احمدی",
    "shipping_address": "تهران، خیابان ولیعصر، پلاک 123",
    "shipping_city": "تهران",
    "shipping_state": "تهران",
    "shipping_postal_code": "1234567890",
    "shipping_phone": "09123456789",
    "notes": "لطفاً با دقت بسته‌بندی شود",
    "payment_method": "zarinpal"
  }'
```

### 8. درخواست پرداخت

```bash
curl -X POST http://localhost:8000/api/payments/request/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "gateway": "zarinpal"
  }'
```

پاسخ:
```json
{
  "success": true,
  "payment_url": "https://www.zarinpal.com/pg/StartPay/A00000000000000000000000000123456789",
  "payment_id": 1,
  "authority": "A00000000000000000000000000123456789"
}
```

### 9. آپلود فایل اکسل (فقط ادمین)

```bash
curl -X POST http://localhost:8000/api/excel-import/ \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -F "file=@products.xlsx"
```

### 10. مشاهده وضعیت ورود اکسل

```bash
curl -X GET http://localhost:8000/api/excel-import/1/ \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### 11. مشاهده خطاهای ورود اکسل

```bash
curl -X GET http://localhost:8000/api/excel-import/1/errors/ \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### 12. افزودن نظر برای محصول

```bash
curl -X POST http://localhost:8000/api/products/products/laptop-asus/review/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "محصول عالی، کاملاً راضی هستم!"
  }'
```

### 13. افزودن به لیست علاقه‌مندی

```bash
curl -X POST http://localhost:8000/api/orders/wishlist/add_product/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1
  }'
```

### 14. مشاهده لیست علاقه‌مندی

```bash
curl -X GET http://localhost:8000/api/orders/wishlist/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## کدهای وضعیت پاسخ

- `200 OK` - درخواست موفق
- `201 Created` - ایجاد موفق
- `400 Bad Request` - خطا در درخواست
- `401 Unauthorized` - نیاز به احراز هویت
- `403 Forbidden` - دسترسی ممنوع
- `404 Not Found` - یافت نشد
- `500 Internal Server Error` - خطای سرور

## نکات مهم

1. همه درخواست‌ها باید `Content-Type: application/json` داشته باشند
2. برای درخواست‌های احراز هویت شده، هدر `Authorization: Bearer TOKEN` اضافه کنید
3. توکن‌ها 7 روز اعتبار دارند
4. برای آپلود فایل، از `multipart/form-data` استفاده کنید

## تست با Postman

می‌توانید از Postman برای تست APIها استفاده کنید:

1. Collection جدید بسازید
2. درخواست‌های بالا را اضافه کنید
3. متغیر `access_token` را برای استفاده مجدد تعریف کنید

## نمونه پاسخ‌های API

### لیست محصولات:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/products/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "لپ‌تاپ ایسوس",
      "slug": "laptop-asus",
      "sku": "PRD001",
      "price": "25000000",
      "sale_price": "23000000",
      "final_price": "23000000",
      "discount_percentage": 8,
      "stock_quantity": 25,
      "is_in_stock": true,
      "is_on_sale": true,
      "category_name": "الکترونیک",
      "primary_image": "http://localhost:8000/media/products/laptop.jpg"
    }
  ]
}
```

### سبد خرید:
```json
{
  "id": 1,
  "user": 1,
  "items": [
    {
      "id": 1,
      "product": 1,
      "product_detail": {
        "name": "لپ‌تاپ ایسوس",
        "slug": "laptop-asus",
        "price": "23000000"
      },
      "quantity": 2,
      "unit_price": "23000000",
      "subtotal": "46000000"
    }
  ],
  "total_items": 2,
  "subtotal": "46000000"
}
```

### سفارش:
```json
{
  "id": 1,
  "order_number": "ORD-A1B2C3D4",
  "status": "pending",
  "total": "46030000",
  "items": [
    {
      "product_name": "لپ‌تاپ ایسوس",
      "quantity": 2,
      "unit_price": "23000000",
      "subtotal": "46000000"
    }
  ],
  "created_at": "2025-01-15T10:30:00Z"
}
```
