import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { api } from '@/lib/api-client';
import { Payment } from '@/types';

export default function PaymentSuccess() {
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (router.isReady) {
      verifyPayment();
    }
  }, [router.isReady]);

  const verifyPayment = async () => {
    try {
      const { Authority, Status } = router.query;

      if (!Authority || !Status) {
        setError('اطلاعات پرداخت ناقص است');
        setLoading(false);
        return;
      }

      const response = await api.payments.verify({
        Authority,
        Status
      });

      setPayment(response.data);
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setError(err.response?.data?.error || 'خطا در تایید پرداخت');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">خطا در تایید پرداخت</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              بازگشت به صفحه اصلی
              <FiArrowLeft />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            پرداخت موفق
          </h1>
          <p className="text-gray-600 mb-8">
            سفارش شما با موفقیت ثبت شد
          </p>

          {/* Payment Details */}
          {payment && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-right">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">شماره سفارش:</span>
                  <span className="font-bold text-gray-900">{payment.order_number}</span>
                </div>

                {payment.tracking_code && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">کد رهگیری:</span>
                    <span className="font-mono text-gray-900">{payment.tracking_code}</span>
                  </div>
                )}

                {payment.ref_id && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">شماره مرجع:</span>
                    <span className="font-mono text-gray-900">{payment.ref_id}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">مبلغ پرداختی:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {Number(payment.amount).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-right">
            <p className="text-sm text-blue-800">
              📧 ایمیل تایید سفارش برای شما ارسال شد. می‌توانید از قسمت سفارش‌های من، وضعیت سفارش خود را پیگیری کنید.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              مشاهده سفارش‌های من
              <FiArrowLeft />
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              بازگشت به صفحه اصلی
              <FiArrowLeft />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
