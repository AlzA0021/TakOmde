import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'همه' },
    { id: 'order', label: 'سفارش و خرید' },
    { id: 'payment', label: 'پرداخت' },
    { id: 'shipping', label: 'ارسال' },
    { id: 'return', label: 'بازگشت کالا' },
    { id: 'account', label: 'حساب کاربری' },
  ];

  const faqs: FAQItem[] = [
    {
      category: 'order',
      question: 'چگونه سفارش ثبت کنم؟',
      answer:
        'برای ثبت سفارش ابتدا محصول مورد نظر خود را به سبد خرید اضافه کنید. سپس وارد صفحه سبد خرید شوید و روی دکمه "تکمیل خرید" کلیک کنید. در صفحه بعد اطلاعات ارسال را وارد کرده و روش پرداخت را انتخاب کنید.',
    },
    {
      category: 'order',
      question: 'آیا می‌توانم سفارش خود را تغییر دهم؟',
      answer:
        'اگر سفارش شما هنوز ارسال نشده است، می‌توانید با تماس با پشتیبانی یا از طریق پنل کاربری خود، تغییرات را اعمال کنید.',
    },
    {
      category: 'order',
      question: 'حداقل مبلغ سفارش چقدر است؟',
      answer: 'حداقل مبلغ سفارش محدودیتی ندارد و می‌توانید با هر مبلغی خرید کنید.',
    },
    {
      category: 'payment',
      question: 'روش‌های پرداخت چیست؟',
      answer:
        'شما می‌توانید از طریق درگاه‌های آنلاین زرین‌پال و پی‌پینگ با تمامی کارت‌های عضو شتاب پرداخت کنید.',
    },
    {
      category: 'payment',
      question: 'آیا پرداخت امن است؟',
      answer:
        'بله، تمامی پرداخت‌ها از طریق درگاه‌های معتبر بانکی انجام می‌شود و اطلاعات کارت بانکی شما کاملاً ایمن است.',
    },
    {
      category: 'payment',
      question: 'پرداختم انجام شد اما سفارش ثبت نشد، چه کنم؟',
      answer:
        'در صورتی که پرداخت انجام شده باشد اما سفارش ثبت نشود، مبلغ به صورت خودکار ظرف 72 ساعت به حساب شما بازگردانده می‌شود. همچنین می‌توانید با پشتیبانی تماس بگیرید.',
    },
    {
      category: 'shipping',
      question: 'هزینه ارسال چقدر است؟',
      answer:
        'برای سفارش‌های بالای 500 هزار تومان ارسال رایگان است. برای سفارش‌های زیر این مبلغ، هزینه ارسال 30 هزار تومان است.',
    },
    {
      category: 'shipping',
      question: 'مدت زمان ارسال چقدر است؟',
      answer:
        'به طور معمول سفارش‌ها ظرف 2 تا 5 روز کاری به دست شما می‌رسد. برای شهرستان‌ها ممکن است تا 7 روز کاری طول بکشد.',
    },
    {
      category: 'shipping',
      question: 'چگونه سفارش خود را پیگیری کنم؟',
      answer:
        'پس از ارسال سفارش، کد رهگیری مرسوله برای شما پیامک می‌شود. همچنین می‌توانید از بخش "سفارش‌های من" در پنل کاربری، وضعیت سفارش را مشاهده کنید.',
    },
    {
      category: 'shipping',
      question: 'آیا ارسال به سراسر کشور انجام می‌شود؟',
      answer: 'بله، ما به تمامی نقاط کشور ارسال داریم.',
    },
    {
      category: 'return',
      question: 'آیا می‌توانم کالا را برگردانم؟',
      answer:
        'بله، در صورتی که کالا معیوب یا مغایر با توضیحات باشد، می‌توانید ظرف 7 روز کاری آن را برگردانید.',
    },
    {
      category: 'return',
      question: 'شرایط بازگشت کالا چیست؟',
      answer:
        'کالا باید در بسته‌بندی اصلی و دست‌نخورده باشد. لوازم جانبی و هدایای همراه نیز باید موجود باشد.',
    },
    {
      category: 'return',
      question: 'هزینه بازگشت کالا با کیست؟',
      answer:
        'در صورتی که کالا معیوب یا مغایر باشد، هزینه بازگشت با فروشگاه است. در صورت پشیمانی خریدار، هزینه ارسال برعهده خریدار می‌باشد.',
    },
    {
      category: 'return',
      question: 'پس از بازگشت کالا، پول من چه زمانی برگردانده می‌شود؟',
      answer:
        'پس از دریافت و بررسی کالا، در صورت تایید، وجه ظرف 3 تا 7 روز کاری به حساب شما واریز خواهد شد.',
    },
    {
      category: 'account',
      question: 'چگونه ثبت‌نام کنم؟',
      answer:
        'روی دکمه "ورود/ثبت‌نام" در بالای صفحه کلیک کنید و فرم ثبت‌نام را تکمیل کنید.',
    },
    {
      category: 'account',
      question: 'رمز عبور خود را فراموش کرده‌ام، چه کنم؟',
      answer:
        'در صفحه ورود روی "فراموشی رمز عبور" کلیک کنید و دستورالعمل‌ها را دنبال کنید. لینک بازیابی رمز برای شما ایمیل خواهد شد.',
    },
    {
      category: 'account',
      question: 'چگونه اطلاعات حساب کاربری خود را تغییر دهم؟',
      answer:
        'پس از ورود به حساب کاربری، از منوی کاربری به بخش "پروفایل" بروید و اطلاعات خود را ویرایش کنید.',
    },
  ];

  const filteredFAQs =
    activeCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">سوالات متداول</h1>
          <p className="text-gray-600 text-lg">
            پاسخ سوالات رایج شما در اینجا موجود است
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveIndex(null);
              }}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 flex-1">{faq.question}</span>
                {activeIndex === index ? (
                  <FiChevronUp className="w-5 h-5 text-primary flex-shrink-0 mr-4" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mr-4" />
                )}
              </button>

              {activeIndex === index && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            پاسخ سوال خود را پیدا نکردید؟
          </h3>
          <p className="text-gray-700 mb-6">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
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
