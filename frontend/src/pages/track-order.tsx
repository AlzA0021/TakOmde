import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Breadcrumb from '@/components/Breadcrumb';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

type TrackForm = {
  order_number: string;
  phone: string;
};

export default function TrackOrder() {
  const router = useRouter();
  const [searching, setSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackForm>();

  const onSubmit = async (data: TrackForm) => {
    setSearching(true);

    // TODO: Implement order tracking API
    setTimeout(() => {
      // Check if order exists in user's orders
      router.push('/orders');
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'پیگیری سفارش' }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiPackage className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">پیگیری سفارش</h1>
          <p className="text-gray-600 text-lg">
            وضعیت سفارش خود را با وارد کردن اطلاعات زیر پیگیری کنید
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شماره سفارش *
                </label>
                <input
                  type="text"
                  {...register('order_number', { required: 'شماره سفارش الزامی است' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="مثال: ORD-12345"
                  dir="ltr"
                />
                {errors.order_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.order_number.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  شماره سفارش را می‌توانید در ایمیل یا پیامک ارسالی پیدا کنید
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تماس *
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'شماره تماس الزامی است',
                    pattern: {
                      value: /^09\d{9}$/,
                      message: 'شماره تماس معتبر نیست',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="09123456789"
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  شماره تماس ثبت شده هنگام خرید
                </p>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-bold flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال جستجو...
                  </>
                ) : (
                  <>
                    <FiSearch />
                    پیگیری سفارش
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiPackage className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">سفارش ثبت شد</h3>
            <p className="text-sm text-gray-600">سفارش شما با موفقیت ثبت شده</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiTruck className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">در حال ارسال</h3>
            <p className="text-sm text-gray-600">سفارش شما در مسیر ارسال است</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">تحویل داده شد</h3>
            <p className="text-sm text-gray-600">سفارش به دست شما رسیده</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-3">نکات مهم:</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                پس از ثبت سفارش، ایمیل و پیامک حاوی شماره سفارش برای شما ارسال می‌شود
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>می‌توانید از پنل کاربری خود نیز سفارشات را پیگیری کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                پس از ارسال مرسوله، کد رهگیری پستی برای شما پیامک می‌شود
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>برای سوالات بیشتر با پشتیبانی تماس بگیرید: 021-12345678</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
