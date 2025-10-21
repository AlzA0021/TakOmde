import Link from 'next/link';
import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { FaTelegram, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('لطفاً ایمیل خود را وارد کنید');
      return;
    }

    setSubscribing(true);
    // TODO: Implement newsletter API
    setTimeout(() => {
      toast.success('با موفقیت در خبرنامه عضو شدید');
      setEmail('');
      setSubscribing(false);
    }, 1000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-l from-primary to-primary-600">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-right">
              <h3 className="text-xl font-bold mb-2">عضویت در خبرنامه</h3>
              <p className="text-primary-50">از جدیدترین تخفیف‌ها و پیشنهادات با خبر شوید</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto">
              <div className="flex gap-2 max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  dir="ltr"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {subscribing ? 'در حال ارسال...' : 'عضویت'}
                  {!subscribing && <FiSend />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              درباره پیک‌بازار
            </h3>
            <p className="text-sm leading-relaxed">
              فروشگاه آنلاین پیک‌بازار با ارائه محصولات باکیفیت و خدمات عالی،
              بهترین تجربه خرید آنلاین را برای شما فراهم می‌کند.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FaTelegram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">خدمات مشتریان</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orders/track" className="hover:text-primary transition-colors">
                  پیگیری سفارش
                </Link>
              </li>
              <li>
                <Link href="/return" className="hover:text-primary transition-colors">
                  رویه بازگشت کالا
                </Link>
              </li>
              <li>
                <Link href="/payment-guide" className="hover:text-primary transition-colors">
                  راهنمای خرید
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary transition-colors">
                  شیوه‌های ارسال
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">تماس با ما</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiPhone className="mt-1 text-primary flex-shrink-0" />
                <div>
                  <p>021-12345678</p>
                  <p>09123456789</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <FiMail className="mt-1 text-primary flex-shrink-0" />
                <p>info@pickbazar.com</p>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-1 text-primary flex-shrink-0" />
                <p>
                  تهران، خیابان ولیعصر، پلاک 123
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <p className="font-bold text-white">پرداخت امن</p>
                <p className="text-xs">تضمین امنیت اطلاعات</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <p className="font-bold text-white">ارسال سریع</p>
                <p className="text-xs">ارسال به سراسر کشور</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="font-bold text-white">ضمانت اصالت کالا</p>
                <p className="text-xs">7 روز ضمانت بازگشت</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <p className="font-bold text-white">پشتیبانی 24/7</p>
                <p className="text-xs">پاسخگویی همه روزه</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p className="mb-2">
            © {new Date().getFullYear()} فروشگاه آنلاین پیک‌بازار. تمامی حقوق محفوظ است.
          </p>
          <p className="text-xs text-gray-500">
            طراحی و توسعه با ❤️ توسط تیم پیک‌بازار
          </p>
        </div>
      </div>
    </footer>
  );
}
