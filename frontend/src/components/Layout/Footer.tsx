import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaTelegram, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
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

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} پیک‌بازار. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
