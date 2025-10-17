# پروژه React PickBazar با RTL و فارسی

یک فروشگاه آنلاین کامل با Next.js، React و Tailwind CSS با پشتیبانی کامل از زبان فارسی و راست‌چین

## ویژگی‌ها

### ✅ راست‌چین (RTL) کامل
- تمام صفحات راست‌چین
- فونت فارسی Vazir
- سازگار با Tailwind RTL

### ✅ اتصال کامل به Django Backend
- تمام API endpoints پیاده‌سازی شده
- مدیریت توکن JWT
- Refresh token خودکار

### ✅ مدیریت استیت
- Zustand برای state management
- Cookies برای توکن‌ها
- Local storage برای کش

### ✅ ویژگی‌های فروشگاهی
- صفحه اصلی با محصولات ویژه
- لیست محصولات با فیلتر و جستجو
- جزئیات محصول
- سبد خرید
- لیست علاقه‌مندی
- چک‌اوت و پرداخت
- پروفایل کاربر
- سفارشات

## نصب و راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
npm install
# یا
yarn install
```

### 2. تنظیمات محیط

فایل `.env.local` بسازید:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. اجرای پروژه

```bash
npm run dev
# یا
yarn dev
```

پروژه روی `http://localhost:3000` اجرا می‌شود.

## ساختار پروژه

```
src/
├── components/          # کامپوننت‌های React
│   ├── Layout/         # هدر، فوتر، ساید‌بار
│   ├── Product/        # کارت محصول
│   └── ...
├── lib/                # کتابخانه‌ها و توابع کمکی
│   ├── api-client.ts   # کلاینت Axios
│   └── utils.ts        # توابع کمکی
├── pages/              # صفحات Next.js
│   ├── index.tsx       # صفحه اصلی
│   ├── products/       # محصولات
│   ├── auth/           # احراز هویت
│   └── ...
├── store/              # Zustand stores
├── styles/             # استایل‌های CSS
└── types/              # TypeScript types
```

## API Client

تمام درخواست‌های API در `src/lib/api-client.ts` تعریف شده‌اند:

```typescript
import { api } from '@/lib/api-client';

// محصولات
const products = await api.products.getAll();

// سبد خرید
await api.cart.addItem({ product_id: 1, quantity: 2 });

// سفارش
await api.orders.create(orderData);
```

## State Management

### Auth Store

```typescript
import { useAuthStore } from '@/store';

const { user, isAuthenticated, setUser, logout } = useAuthStore();
```

### Cart Store

```typescript
import { useCartStore } from '@/store';

const { cart, setCart } = useCartStore();
```

### UI Store

```typescript
import { useUIStore } from '@/store';

const { toggleCart, toggleSidebar } = useUIStore();
```

## کامپوننت‌های اصلی

### Layout

```tsx
<Layout>
  <YourContent />
</Layout>
```

### ProductCard

```tsx
<ProductCard product={product} />
```

### CartSidebar

سبد خرید کشویی در سمت چپ صفحه

### Header

شامل منو، جستجو، سبد خرید و پروفایل

## توابع کمکی

```typescript
import { formatPrice, getImageUrl, validatePhoneNumber } from '@/lib/utils';

// فرمت قیمت به تومان
const price = formatPrice(25000); // "25,000 تومان"

// URL تصویر
const imgUrl = getImageUrl('/media/products/image.jpg');

// اعتبارسنجی شماره تلفن ایرانی
const isValid = validatePhoneNumber('09123456789');
```

## Styling

پروژه از Tailwind CSS استفاده می‌کند:

```tsx
<div className="container mx-auto px-4">
  <h1 className="text-2xl font-bold text-primary">عنوان</h1>
</div>
```

### رنگ‌های اصلی

- `primary`: سبز (#009f7f)
- `accent`: قرمز (#ff6b6b)
- `gray-*`: خاکستری‌های مختلف

## فونت فارسی

پروژه از فونت Vazir استفاده می‌کند. فایل‌های فونت در `src/fonts/` قرار دارند.

## TypeScript Types

تمام type ها در `src/types/index.ts` تعریف شده‌اند:

```typescript
import { Product, User, Cart, Order } from '@/types';
```

## مدیریت خطاها

خطاها به صورت خودکار با toast نمایش داده می‌شوند:

```typescript
import { toast } from 'react-hot-toast';

toast.success('عملیات موفق');
toast.error('خطا در عملیات');
```

## Authentication

### ورود

```typescript
const response = await api.auth.login({ username, password });
const { access, refresh } = response.data;

// ذخیره توکن‌ها
Cookies.set('access_token', access);
Cookies.set('refresh_token', refresh);

// دریافت پروفایل
const profile = await api.auth.getProfile();
setUser(profile.data);
```

### خروج

```typescript
logout(); // از store
```

## Deployment

### Build

```bash
npm run build
npm start
```

### Environment Variables

در production حتماً این متغیرها را تنظیم کنید:

```env
NEXT_PUBLIC_API_URL=https://api.yoursite.com/api
```

## مرورگرهای پشتیبانی شده

- Chrome/Edge (آخرین نسخه)
- Firefox (آخرین نسخه)
- Safari (آخرین نسخه)

## نکات مهم

1. **RTL**: همه استایل‌ها راست‌چین هستند
2. **فارسی**: تمام متن‌ها فارسی
3. **Responsive**: کاملاً ریسپانسیو
4. **Performance**: بهینه‌سازی شده با Next.js

## مشکلات رایج

### خطای CORS

مطمئن شوید Django backend شما `CORS_ALLOWED_ORIGINS` را تنظیم کرده:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### خطای توکن

اگر توکن منقضی شد، به صورت خودکار refresh می‌شود.

### تصاویر

مطمئن شوید URL تصاویر در `next.config.js` درست تنظیم شده.

## پشتیبانی

برای سوالات و مشکلات، Issue جدید ایجاد کنید.

---

**ساخته شده با ❤️ برای Django Backend**
