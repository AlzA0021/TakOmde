import Link from 'next/link';
import { FiHome, FiSearch, FiArrowRight } from 'react-icons/fi';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <div className="text-6xl mb-6">🔍</div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          متأسفانه صفحه‌ای که به دنبال آن می‌گردید وجود ندارد یا حذف شده است.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <FiHome />
            بازگشت به صفحه اصلی
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <FiSearch />
            مشاهده محصولات
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            ممکن است به دنبال این صفحات باشید:
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/categories"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-right"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📂</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">دسته‌بندی‌ها</h3>
                <p className="text-sm text-gray-600">مشاهده دسته‌بندی محصولات</p>
              </div>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-right"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">سبد خرید</h3>
                <p className="text-sm text-gray-600">مشاهده سبد خرید شما</p>
              </div>
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-right"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">سفارش‌های من</h3>
                <p className="text-sm text-gray-600">پیگیری سفارشات</p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-right"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">تماس با ما</h3>
                <p className="text-sm text-gray-600">ارتباط با پشتیبانی</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-8">
          در صورت تکرار این خطا، لطفاً با{' '}
          <Link href="/contact" className="text-primary hover:underline">
            پشتیبانی
          </Link>{' '}
          تماس بگیرید.
        </p>
      </div>
    </div>
  );
}
