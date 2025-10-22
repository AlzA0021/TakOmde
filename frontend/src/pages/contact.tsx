import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaTelegram, FaInstagram, FaWhatsapp } from 'react-icons/fa';

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    // TODO: Implement contact form API
    setTimeout(() => {
      toast.success('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');
      reset();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">تماس با ما</h1>
          <p className="text-gray-600 text-lg">
            ما آماده پاسخگویی به سوالات و پیشنهادات شما هستیم
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">فرم تماس</h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'نام الزامی است' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="نام کامل خود را وارد کنید"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل *
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'ایمیل الزامی است',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'ایمیل معتبر نیست',
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="email@example.com"
                      dir="ltr"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      موضوع *
                    </label>
                    <select
                      {...register('subject', { required: 'انتخاب موضوع الزامی است' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">موضوع را انتخاب کنید</option>
                      <option value="order">سوال درباره سفارش</option>
                      <option value="product">سوال درباره محصول</option>
                      <option value="payment">مشکل در پرداخت</option>
                      <option value="shipping">مشکل در ارسال</option>
                      <option value="return">بازگشت کالا</option>
                      <option value="complaint">شکایت</option>
                      <option value="suggestion">پیشنهاد</option>
                      <option value="other">سایر</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    پیام شما *
                  </label>
                  <textarea
                    {...register('message', {
                      required: 'پیام الزامی است',
                      minLength: {
                        value: 10,
                        message: 'پیام باید حداقل 10 کاراکتر باشد',
                      },
                    })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="پیام خود را اینجا بنویسید..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      ارسال پیام
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">اطلاعات تماس</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">تلفن</h4>
                      <p className="text-gray-600 text-sm" dir="ltr">
                        021-12345678
                      </p>
                      <p className="text-gray-600 text-sm" dir="ltr">
                        09123456789
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">ایمیل</h4>
                      <p className="text-gray-600 text-sm" dir="ltr">
                        info@Bonakdari_Shaghayegh.com
                      </p>
                      <p className="text-gray-600 text-sm" dir="ltr">
                        support@Bonakdari_Shaghayegh.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">آدرس</h4>
                      <p className="text-gray-600 text-sm">
                        تهران، خیابان ولیعصر، پلاک 123، طبقه 4، واحد 12
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiClock className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">ساعات کاری</h4>
                      <p className="text-gray-600 text-sm">شنبه تا چهارشنبه: 9 صبح تا 6 عصر</p>
                      <p className="text-gray-600 text-sm">پنج‌شنبه: 9 صبح تا 1 بعدازظهر</p>
                      <p className="text-gray-600 text-sm">جمعه: تعطیل</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">شبکه‌های اجتماعی</h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTelegram className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Quick Response */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-primary mb-2">پاسخگویی سریع</h3>
                <p className="text-sm text-primary-800">
                  تیم پشتیبانی ما به صورت 24/7 آماده پاسخگویی به سوالات شما در تلگرام و
                  واتساپ است.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FiMapPin className="w-12 h-12 mx-auto mb-2" />
                <p>نقشه موقعیت مکانی</p>
                <p className="text-sm mt-1">(در نسخه نهایی نقشه نمایش داده می‌شود)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
