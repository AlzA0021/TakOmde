import Breadcrumb from '@/components/Breadcrumb';
import { FiShoppingCart, FiCreditCard, FiTruck, FiCheckCircle, FiUser, FiSearch } from 'react-icons/fi';

export default function ShoppingGuide() {
  const steps = [
    {
      icon: FiSearch,
      title: 'جستجو و انتخاب محصول',
      description:
        'محصول مورد نظر خود را از طریق جستجو، دسته‌بندی‌ها، یا پیشنهادات ویژه پیدا کنید.',
      details: [
        'از نوار جستجو برای یافتن سریع محصول استفاده کنید',
        'دسته‌بندی‌ها را مرور کنید',
        'فیلترها را برای یافتن محصول مناسب اعمال کنید',
        'تصاویر، توضیحات، و قیمت‌ها را بررسی کنید',
      ],
    },
    {
      icon: FiShoppingCart,
      title: 'افزودن به سبد خرید',
      description: 'محصولات را به سبد خرید اضافه کنید و تعداد آن‌ها را مشخص کنید.',
      details: [
        'روی دکمه "افزودن به سبد خرید" کلیک کنید',
        'تعداد محصول را انتخاب کنید',
        'سبد خرید خود را مشاهده کنید',
        'می‌توانید خرید را ادامه دهید یا محصولات بیشتری اضافه کنید',
      ],
    },
    {
      icon: FiUser,
      title: 'ورود یا ثبت‌نام',
      description: 'برای ادامه خرید، وارد حساب کاربری خود شوید یا ثبت‌نام کنید.',
      details: [
        'اگر قبلاً ثبت‌نام کرده‌اید، وارد شوید',
        'در غیر این صورت، یک حساب کاربری جدید ایجاد کنید',
        'اطلاعات خود را کامل و صحیح وارد کنید',
        'رمز عبور قوی انتخاب کنید',
      ],
    },
    {
      icon: FiTruck,
      title: 'تکمیل اطلاعات ارسال',
      description: 'آدرس تحویل کالا و اطلاعات گیرنده را وارد کنید.',
      details: [
        'نام و شماره تماس گیرنده را وارد کنید',
        'آدرس کامل و دقیق را بنویسید',
        'کد پستی 10 رقمی را درست وارد کنید',
        'می‌توانید آدرس را برای خریدهای بعدی ذخیره کنید',
      ],
    },
    {
      icon: FiCreditCard,
      title: 'پرداخت',
      description: 'روش پرداخت را انتخاب کرده و پرداخت را انجام دهید.',
      details: [
        'درگاه پرداخت را انتخاب کنید (زرین‌پال یا پی‌پینگ)',
        'به درگاه بانکی منتقل می‌شوید',
        'اطلاعات کارت و رمز دوم را وارد کنید',
        'پرداخت را تایید کنید',
      ],
    },
    {
      icon: FiCheckCircle,
      title: 'تایید سفارش',
      description: 'پس از پرداخت موفق، سفارش شما ثبت و ارسال می‌شود.',
      details: [
        'کد رهگیری برای شما پیامک می‌شود',
        'ایمیل تایید سفارش دریافت می‌کنید',
        'می‌توانید وضعیت سفارش را پیگیری کنید',
        'کالا ظرف 2 تا 7 روز ارسال می‌شود',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'راهنمای خرید' }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiShoppingCart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">راهنمای خرید</h1>
          <p className="text-gray-600 text-lg">
            خرید آنلاین آسان در 6 قدم ساده
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-l from-primary to-primary-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-sm text-primary-100 mb-1">مرحله {index + 1}</div>
                      <h2 className="text-2xl font-bold">{step.title}</h2>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">{step.description}</p>

                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3 text-gray-600">
                        <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            💡 نکات مفید
          </h3>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <p>
                <strong>ثبت‌نام کنید:</strong> با ایجاد حساب کاربری، می‌توانید خریدهای
                خود را پیگیری کنید و از تخفیف‌های ویژه اعضا استفاده کنید.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <p>
                <strong>مقایسه کنید:</strong> قبل از خرید، محصولات مشابه را مقایسه کنید
                و بهترین گزینه را انتخاب کنید.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <p>
                <strong>نظرات را بخوانید:</strong> نظرات سایر خریداران می‌تواند در
                تصمیم‌گیری شما کمک کند.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <p>
                <strong>از تخفیف‌ها استفاده کنید:</strong> بخش پیشنهادات ویژه را بررسی
                کنید و از تخفیف‌ها بهره‌مند شوید.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <p>
                <strong>خرید بالای 500 هزار تومان:</strong> برای سفارش‌های بالای این
                مبلغ، ارسال رایگان است.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <p>
                <strong>پشتیبانی 24/7:</strong> در صورت هرگونه سوال، با پشتیبانی تماس
                بگیرید.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">سوالات متداول</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/faq"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">چگونه سفارش ثبت کنم؟</h4>
              <p className="text-sm text-gray-600">مراحل ثبت سفارش را ببینید</p>
            </a>

            <a
              href="/faq"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">روش‌های پرداخت چیست؟</h4>
              <p className="text-sm text-gray-600">درگاه‌های پرداخت را بشناسید</p>
            </a>

            <a
              href="/faq"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">مدت زمان ارسال چقدر است؟</h4>
              <p className="text-sm text-gray-600">زمان تحویل کالا را بدانید</p>
            </a>

            <a
              href="/return-policy"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-1">آیا می‌توانم کالا را برگردانم؟</h4>
              <p className="text-sm text-gray-600">شرایط بازگشت کالا</p>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-l from-primary to-primary-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">آماده شروع خرید هستید؟</h3>
          <p className="text-primary-50 mb-6">
            هزاران محصول با بهترین قیمت‌ها منتظر شما هستند
          </p>
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-bold"
          >
            <FiShoppingCart />
            شروع خرید
          </a>
        </div>
      </div>
    </div>
  );
}
