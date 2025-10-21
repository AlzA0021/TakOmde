import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiXCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

export default function PaymentFailed() {
  const router = useRouter();
  const { error, order_id } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiXCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            پرداخت ناموفق
          </h1>
          <p className="text-gray-600 mb-8">
            متأسفانه پرداخت شما انجام نشد
          </p>

          {/* Error Details */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-right">
              <p className="text-sm text-red-800 font-medium mb-2">دلیل خطا:</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Common Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-right">
            <h3 className="font-bold text-gray-900 mb-3">دلایل احتمالی:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>موجودی کافی در حساب نبود</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>اطلاعات کارت بانکی اشتباه وارد شد</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>رمز دوم یا CVV2 اشتباه بود</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>اتصال اینترنت قطع شد</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>پرداخت توسط کاربر لغو شد</span>
              </li>
            </ul>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-right">
            <p className="text-sm text-blue-800">
              💡 نگران نباشید! هیچ مبلغی از حساب شما کسر نشده است. می‌توانید دوباره تلاش کنید.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {order_id && (
              <button
                onClick={() => router.push(`/checkout?retry=${order_id}`)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <FiRefreshCw />
                تلاش مجدد برای پرداخت
              </button>
            )}

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              بازگشت به سبد خرید
              <FiArrowLeft />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              بازگشت به صفحه اصلی
              <FiArrowLeft />
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              در صورت بروز مشکل با پشتیبانی تماس بگیرید
            </p>
            <a
              href="tel:02112345678"
              className="text-primary hover:underline font-medium mt-1 inline-block"
            >
              021-1234-5678
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
