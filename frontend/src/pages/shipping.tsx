import Breadcrumb from '@/components/Breadcrumb';
import { FiTruck, FiMapPin, FiClock, FiDollarSign, FiPackage, FiCheckCircle } from 'react-icons/fi';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'شیوه‌های ارسال' }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiTruck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">شیوه‌های ارسال</h1>
          <p className="text-gray-600 text-lg">
            ارسال سریع و ایمن به سراسر کشور
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiDollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">رایگان</h3>
            <p className="text-gray-600 text-sm">بالای ۵۰۰ هزار تومان</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiClock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">۲-۴ روز</h3>
            <p className="text-gray-600 text-sm">تهران و شهرستان‌های مجاور</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiMapPin className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">سراسر کشور</h3>
            <p className="text-gray-600 text-sm">تمامی شهرها</p>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="space-y-6 mb-12">
          {/* Post */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPackage className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">پست پیشتاز</h2>
                <p className="text-gray-600 mb-4">
                  ارسال از طریق پست پیشتاز جمهوری اسلامی ایران
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">مدت زمان:</h4>
                      <p className="text-gray-600 text-sm">۳ تا ۷ روز کاری</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">هزینه:</h4>
                      <p className="text-gray-600 text-sm">۳۰ هزار تومان</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0-5" />
                    <div>
                      <h4 className="font-bold text-gray-900">بیمه:</h4>
                      <p className="text-gray-600 text-sm">دارد</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">کد رهگیری:</h4>
                      <p className="text-gray-600 text-sm">دارد</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 برای سفارش‌های بالای ۵۰۰ هزار تومان، هزینه ارسال رایگان است
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Express (Tehran) */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiTruck className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  پیک موتوری (ویژه تهران)
                </h2>
                <p className="text-gray-600 mb-4">
                  ارسال سریع در تهران از طریق پیک
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">مدت زمان:</h4>
                      <p className="text-gray-600 text-sm">۱ تا ۲ روز کاری</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">هزینه:</h4>
                      <p className="text-gray-600 text-sm">۵۰ هزار تومان</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">محدوده:</h4>
                      <p className="text-gray-600 text-sm">تهران و کرج</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900">تحویل:</h4>
                      <p className="text-gray-600 text-sm">درب منزل</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    ⚡ سریع‌ترین روش ارسال برای ساکنان تهران و کرج
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Map */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiMapPin className="text-primary" />
            پوشش ارسال
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">شهرهای اصلی (۲-۴ روز)</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  تهران، کرج، اصفهان
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  مشهد، شیراز، تبریز
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  اهواز، قم، رشت
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">سایر شهرستان‌ها (۴-۷ روز)</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  تمامی مراکز استان‌ها
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  شهرستان‌ها و شهرها
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  روستاها (از طریق پست)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-yellow-900 mb-4">نکات مهم:</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                مدت زمان ارسال از روز تایید پرداخت محاسبه می‌شود
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                در ایام تعطیل، زمان ارسال ممکن است افزایش یابد
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                کد رهگیری پستی پس از ارسال مرسوله برای شما پیامک می‌شود
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                در صورت عدم حضور گیرنده، کالا به آدرس پستی محل تحویل داده می‌شود
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                برای ارسال به مناطق دورافتاده، ممکن است هزینه اضافی دریافت شود
              </span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">سوالی درباره ارسال دارید؟</h3>
          <p className="text-gray-700 mb-6">
            با پشتیبانی ما تماس بگیرید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-bold"
            >
              تماس با پشتیبانی
            </a>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary-50 transition-colors font-bold"
            >
              سوالات متداول
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
