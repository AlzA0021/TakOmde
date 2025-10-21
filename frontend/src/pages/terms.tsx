import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function Terms() {
  const sections = [
    {
      title: '۱. کلیات',
      content: [
        'این قوانین و مقررات برای تمامی کاربران فروشگاه آنلاین پیک‌بازار لازم‌الاجرا است.',
        'با استفاده از خدمات این فروشگاه، شما این قوانین را پذیرفته‌اید.',
        'فروشگاه پیک‌بازار حق تغییر این قوانین را بدون اطلاع قبلی دارد.',
      ],
    },
    {
      title: '۲. ثبت‌نام و حساب کاربری',
      content: [
        'برای خرید از فروشگاه، ثبت‌نام الزامی است.',
        'اطلاعات وارد شده باید صحیح و کامل باشد.',
        'حفظ امنیت رمز عبور بر عهده کاربر است.',
        'هرگونه فعالیت با حساب کاربری شما، مسئولیت شخص خود شما است.',
        'استفاده از اطلاعات کاربری دیگران ممنوع است.',
      ],
    },
    {
      title: '۳. قیمت‌ها و پرداخت',
      content: [
        'تمامی قیمت‌ها به تومان است و شامل مالیات بر ارزش افزوده می‌باشد.',
        'قیمت‌ها ممکن است بدون اطلاع قبلی تغییر کنند.',
        'قیمت نهایی سفارش همان قیمت در زمان ثبت سفارش است.',
        'پرداخت از طریق درگاه‌های معتبر بانکی انجام می‌شود.',
        'در صورت کنسل شدن سفارش، مبلغ ظرف ۷۲ ساعت بازگردانده می‌شود.',
      ],
    },
    {
      title: '۴. ارسال کالا',
      content: [
        'ارسال کالا پس از تایید پرداخت انجام می‌شود.',
        'زمان ارسال برای تهران ۲ تا ۴ روز و برای شهرستان‌ها ۳ تا ۷ روز کاری است.',
        'برای سفارش‌های بالای ۵۰۰ هزار تومان ارسال رایگان است.',
        'مسئولیت تحویل کالا با شرکت پست یا پیک است.',
        'در صورت عدم حضور گیرنده، کالا به آدرس پستی ارسال می‌شود.',
      ],
    },
    {
      title: '۵. بازگشت کالا',
      content: [
        'کالا باید ظرف ۷ روز از تحویل قابل بازگشت باشد.',
        'کالا باید در بسته‌بندی اصلی و دست‌نخورده باشد.',
        'در صورت معیوب بودن کالا، هزینه بازگشت با فروشگاه است.',
        'در صورت پشیمانی خریدار، هزینه ارسال برعهده خریدار است.',
        'برخی کالاها (مانند نرم‌افزار، لوازم بهداشتی) غیرقابل برگشت هستند.',
      ],
    },
    {
      title: '۶. گارانتی و خدمات پس از فروش',
      content: [
        'تمامی محصولات دارای گارانتی معتبر هستند.',
        'مدت گارانتی هر محصول در صفحه محصول ذکر شده است.',
        'برای استفاده از گارانتی باید فاکتور خرید ارائه شود.',
        'خدمات پس از فروش طبق شرایط گارانتی ارائه می‌شود.',
      ],
    },
    {
      title: '۷. حریم خصوصی',
      content: [
        'اطلاعات شخصی کاربران محرمانه است و فاش نمی‌شود.',
        'اطلاعات فقط برای بهبود خدمات استفاده می‌شود.',
        'فروشگاه متعهد به حفاظت از اطلاعات کاربران است.',
        'اطلاعات مالی از طریق درگاه‌های امن منتقل می‌شود.',
      ],
    },
    {
      title: '۸. مسئولیت‌ها',
      content: [
        'فروشگاه مسئول کیفیت و اصالت کالاهای فروخته شده است.',
        'فروشگاه مسئول خسارات ناشی از عیوب کالا نیست.',
        'کاربر مسئول صحت اطلاعات ارائه شده است.',
        'فروشگاه در قبال خسارات ناشی از قطعی سایت مسئولیتی ندارد.',
      ],
    },
    {
      title: '۹. لغو سفارش',
      content: [
        'کاربر می‌تواند قبل از ارسال کالا، سفارش را لغو کند.',
        'پس از ارسال کالا، امکان لغو سفارش وجود ندارد.',
        'در صورت لغو، مبلغ ظرف ۷۲ ساعت بازگردانده می‌شود.',
      ],
    },
    {
      title: '۱۰. حل اختلاف',
      content: [
        'در صورت بروز اختلاف، ابتدا از طریق پشتیبانی حل می‌شود.',
        'در صورت عدم حل، به مراجع قانونی مراجعه خواهد شد.',
        'قوانین جمهوری اسلامی ایران حاکم است.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">قوانین و مقررات</h1>
          <p className="text-gray-600 text-lg">
            لطفاً قبل از استفاده از خدمات، این قوانین را با دقت مطالعه فرمایید
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 flex items-start gap-4">
          <FiAlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">توجه مهم</h3>
            <p className="text-yellow-800 text-sm leading-relaxed">
              با ثبت سفارش و استفاده از خدمات فروشگاه آنلاین پیک‌بازار، شما تمامی قوانین و
              مقررات ذکر شده در این صفحه را پذیرفته‌اید. لطفاً قبل از خرید این موارد را
              به دقت مطالعه کنید.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  {index + 1}
                </span>
                {section.title}
              </h2>

              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>آخرین به‌روزرسانی: {new Date().toLocaleDateString('fa-IR')}</p>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">سوالی دارید؟</h3>
          <p className="text-gray-700 mb-6">
            در صورت ابهام یا نیاز به توضیحات بیشتر، با ما تماس بگیرید
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-bold"
          >
            تماس با پشتیبانی
          </a>
        </div>
      </div>
    </div>
  );
}
