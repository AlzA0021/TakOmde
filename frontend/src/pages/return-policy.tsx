import Breadcrumb from '@/components/Breadcrumb';
import { FiPackage, FiClock, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'رویه بازگشت کالا' }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiRefreshCw className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">رویه بازگشت کالا</h1>
          <p className="text-gray-600 text-lg">
            ۷ روز ضمانت بازگشت کالا برای تمامی محصولات
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiClock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">۷ روز</h3>
            <p className="text-gray-600">مهلت بازگشت کالا</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">رایگان</h3>
            <p className="text-gray-600">هزینه بازگشت (کالای معیوب)</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiPackage className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">۳-۷ روز</h3>
            <p className="text-gray-600">بازگشت وجه</p>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiCheckCircle className="text-green-600" />
            شرایط بازگشت کالا
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">۱</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">مهلت زمانی</h3>
                <p className="text-gray-600">
                  کالا باید ظرف ۷ روز از تاریخ تحویل بازگردانده شود. پس از این مدت، امکان
                  بازگشت کالا وجود ندارد.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">۲</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">بسته‌بندی اصلی</h3>
                <p className="text-gray-600">
                  کالا باید در بسته‌بندی اصلی، دست‌نخورده، و بدون هیچگونه خدشه‌ای باشد.
                  پلمپ و برچسب‌های اصلی باید سالم باشند.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">۳</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">لوازم جانبی</h3>
                <p className="text-gray-600">
                  تمامی لوازم جانبی، کابل‌ها، دفترچه راهنما، و هدایای همراه کالا باید موجود
                  باشند.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">۴</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">فاکتور خرید</h3>
                <p className="text-gray-600">
                  فاکتور خرید باید همراه کالا برگردانده شود. بدون فاکتور، امکان بازگشت کالا
                  وجود ندارد.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiRefreshCw className="text-primary" />
            مراحل بازگشت کالا
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  ۱
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">ثبت درخواست</h3>
                <p className="text-gray-600">
                  با پشتیبانی تماس بگیرید و دلیل بازگشت کالا را اعلام کنید. شماره سفارش خود را
                  در دسترس داشته باشید.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  ۲
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">بررسی درخواست</h3>
                <p className="text-gray-600">
                  کارشناسان ما درخواست شما را بررسی می‌کنند و در صورت تایید، کد مرجوع صادر
                  می‌شود.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  ۳
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">ارسال کالا</h3>
                <p className="text-gray-600">
                  کالا را بسته‌بندی کرده و با کد مرجوع، به آدرس اعلام شده ارسال کنید. در
                  صورت معیوب بودن، هزینه ارسال با ما است.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  ۴
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">بازگشت وجه</h3>
                <p className="text-gray-600">
                  پس از دریافت و بررسی کالا، وجه ظرف ۳ تا ۷ روز کاری به حساب شما واریز
                  می‌شود یا کالای جایگزین ارسال می‌گردد.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exceptions */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
            <FiAlertCircle />
            کالاهای غیرقابل بازگشت
          </h3>
          <ul className="space-y-2 text-sm text-red-800">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>لوازم بهداشتی و آرایشی که پلمپ آن‌ها باز شده باشد</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>نرم‌افزارها و محصولات دیجیتال</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>کالاهای فسادپذیر و خوراکی</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>کالاهای سفارشی و شخصی‌سازی شده</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>کالاهایی که بیش از ۷ روز از تحویل آن‌ها گذشته باشد</span>
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">سوالی درباره بازگشت کالا دارید؟</h3>
          <p className="text-gray-700 mb-6">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-bold"
            >
              تماس با پشتیبانی
            </a>
            <a
              href="tel:02112345678"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary-50 transition-colors font-bold"
            >
              021-1234-5678
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
