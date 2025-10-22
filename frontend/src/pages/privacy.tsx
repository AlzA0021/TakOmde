import Breadcrumb from '@/components/Breadcrumb';
import { FiShield, FiLock, FiEye, FiUserCheck } from 'react-icons/fi';

export default function Privacy() {
  const sections = [
    {
      title: '۱. جمع‌آوری اطلاعات',
      icon: FiEye,
      content: [
        'ما اطلاعات شخصی شما را هنگام ثبت‌نام، خرید، یا تماس با ما جمع‌آوری می‌کنیم.',
        'اطلاعات جمع‌آوری شده شامل نام، ایمیل، شماره تلفن، و آدرس است.',
        'اطلاعات پرداخت شما مستقیماً به درگاه بانکی ارسال می‌شود و ما آن را ذخیره نمی‌کنیم.',
        'ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کنیم.',
      ],
    },
    {
      title: '۲. استفاده از اطلاعات',
      icon: FiUserCheck,
      content: [
        'پردازش و ارسال سفارشات شما',
        'ارسال ایمیل‌ها و پیامک‌های اطلاع‌رسانی',
        'بهبود کیفیت خدمات و محصولات',
        'شخصی‌سازی تجربه خرید شما',
        'تحلیل آماری برای بهبود عملکرد سایت',
      ],
    },
    {
      title: '۳. حفاظت از اطلاعات',
      icon: FiShield,
      content: [
        'ما از تکنولوژی‌های امنیتی پیشرفته برای حفاظت از داده‌های شما استفاده می‌کنیم.',
        'تمامی اطلاعات با پروتکل SSL رمزنگاری می‌شوند.',
        'دسترسی به اطلاعات شخصی محدود به کارمندان مجاز است.',
        'ما هیچگاه اطلاعات شما را به شرکت‌های ثالث نمی‌فروشیم.',
        'سیستم‌های ما به طور منظم برای امنیت بررسی می‌شوند.',
      ],
    },
    {
      title: '۴. اشتراک‌گذاری اطلاعات',
      icon: FiLock,
      content: [
        'ما اطلاعات شما را با شرکای تجاری زیر به اشتراک می‌گذاریم:',
        '- شرکت‌های پست و ارسال برای تحویل سفارش',
        '- درگاه‌های پرداخت برای پردازش تراکنش‌ها',
        '- سرویس‌های ایمیل و پیامک برای ارسال اطلاعات',
        'تمامی شرکای ما ملزم به رعایت حریم خصوصی هستند.',
      ],
    },
    {
      title: '۵. حقوق کاربران',
      icon: FiUserCheck,
      content: [
        'شما حق دارید به اطلاعات خود دسترسی داشته باشید.',
        'می‌توانید اطلاعات خود را ویرایش یا حذف کنید.',
        'می‌توانید از دریافت ایمیل‌های تبلیغاتی انصراف دهید.',
        'حق دارید از نحوه استفاده از اطلاعاتتان مطلع شوید.',
        'می‌توانید شکایت خود را به مراجع ذیربط ارسال کنید.',
      ],
    },
    {
      title: '۶. کوکی‌ها',
      icon: FiEye,
      content: [
        'ما از کوکی‌ها برای بهبود عملکرد سایت استفاده می‌کنیم.',
        'کوکی‌ها به ما کمک می‌کنند تجربه شما را شخصی‌سازی کنیم.',
        'شما می‌توانید کوکی‌ها را در مرورگر خود غیرفعال کنید.',
        'غیرفعال کردن کوکی‌ها ممکن است بر عملکرد سایت تأثیر بگذارد.',
      ],
    },
    {
      title: '۷. تغییرات در سیاست حریم خصوصی',
      icon: FiShield,
      content: [
        'ما ممکن است این سیاست را بدون اطلاع قبلی تغییر دهیم.',
        'تغییرات در این صفحه منتشر خواهد شد.',
        'استفاده مستمر از سایت به معنی پذیرش تغییرات است.',
        'توصیه می‌کنیم این صفحه را به طور منظم بررسی کنید.',
      ],
    },
    {
      title: '۸. تماس با ما',
      icon: FiUserCheck,
      content: [
        'برای سوالات درباره حریم خصوصی، با ما تماس بگیرید:',
        'ایمیل: privacy@Bonakdari_Shaghayegh.com',
        'تلفن: 021-12345678',
        'آدرس: تهران، خیابان ولیعصر، پلاک 123',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'حریم خصوصی' }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiShield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">سیاست حریم خصوصی</h1>
          <p className="text-gray-600 text-lg">
            ما متعهد به حفاظت از اطلاعات شخصی شما هستیم
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <FiLock className="text-blue-600" />
            تعهد ما به حریم خصوصی شما
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            در فروشگاه بنکداری شقایق حفاظت از اطلاعات شخصی و حریم خصوصی شما در اولویت است.
            این سند توضیح می‌دهد که چگونه اطلاعات شما را جمع‌آوری، استفاده، و محافظت
            می‌کنیم.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  {section.title}
                </h2>

                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>آخرین به‌روزرسانی: {new Date().toLocaleDateString('fa-IR')}</p>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">سوالی دارید؟</h3>
          <p className="text-gray-700 mb-6">
            برای اطلاعات بیشتر درباره حریم خصوصی، با ما تماس بگیرید
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
