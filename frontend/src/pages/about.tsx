import { FiCheckCircle, FiUsers, FiTrendingUp, FiAward, FiHeart } from 'react-icons/fi';

export default function About() {
  const stats = [
    { icon: FiUsers, label: 'مشتریان راضی', value: '50,000+' },
    { icon: FiCheckCircle, label: 'سفارش تکمیل شده', value: '100,000+' },
    { icon: FiAward, label: 'محصول منحصربه‌فرد', value: '5,000+' },
    { icon: FiTrendingUp, label: 'سال تجربه', value: '5+' },
  ];

  const values = [
    {
      icon: '🎯',
      title: 'کیفیت',
      description: 'ارائه محصولات با بالاترین کیفیت و تضمین اصالت کالا',
    },
    {
      icon: '⚡',
      title: 'سرعت',
      description: 'ارسال سریع و به موقع سفارشات به تمام نقاط کشور',
    },
    {
      icon: '💎',
      title: 'تنوع',
      description: 'گستردگی در محصولات و برندهای معتبر داخلی و خارجی',
    },
    {
      icon: '🤝',
      title: 'اعتماد',
      description: 'ایجاد رابطه‌ای شفاف و صادقانه با مشتریان',
    },
    {
      icon: '📞',
      title: 'پشتیبانی',
      description: 'پاسخگویی 24/7 و حل مشکلات مشتریان',
    },
    {
      icon: '💰',
      title: 'قیمت مناسب',
      description: 'ارائه بهترین قیمت‌ها با تخفیف‌های ویژه',
    },
  ];

  const team = [
    {
      name: 'علی احمدی',
      role: 'مدیرعامل',
      image: '👨‍💼',
    },
    {
      name: 'سارا محمدی',
      role: 'مدیر فروش',
      image: '👩‍💼',
    },
    {
      name: 'رضا کریمی',
      role: 'مدیر فنی',
      image: '👨‍💻',
    },
    {
      name: 'مریم رضایی',
      role: 'مدیر پشتیبانی',
      image: '👩‍💻',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-l from-primary to-primary-600 text-white py-20">
        <div className="container text-center">
          <h1 className="text-5xl font-bold mb-6">درباره بنکداری شقایق</h1>
          <p className="text-xl text-primary-50 max-w-3xl mx-auto">
            ما با افتخار بیش از 5 سال است که در خدمت شما هستیم و با ارائه محصولات
            باکیفیت و خدمات عالی، بهترین تجربه خرید آنلاین را برای شما فراهم می‌کنیم.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">داستان ما</h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                فروشگاه آنلاین بنکداری شقایق در سال 1398 با هدف ارائه خدمات فروش آنلاین
                محصولات با کیفیت و متنوع به مشتریان عزیز آغاز به کار کرد. از همان ابتدا،
                هدف ما فراهم کردن بستری مطمئن و آسان برای خرید آنلاین بوده است.
              </p>

              <p>
                در این مدت، با تلاش و پشتکار تیم متخصص خود، توانسته‌ایم اعتماد هزاران
                مشتری را جلب کنیم. ما معتقدیم که موفقیت ما در گرو رضایت شما مشتریان
                عزیز است و همواره تلاش می‌کنیم تا با ارائه بهترین محصولات، قیمت‌های
                مناسب، و خدمات پس از فروش عالی، همراه قابل اعتمادی برای شما باشیم.
              </p>

              <p>
                امروزه بنکداری شقایق یکی از پیشروترین فروشگاه‌های آنلاین در کشور است که با
                داشتن بیش از 5000 محصول در دسته‌بندی‌های مختلف، همچنان در حال رشد و
                توسعه است. ما با کمک شما و با ارائه خدماتی بهتر، به مسیر خود ادامه
                می‌دهیم.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">ارزش‌های ما</h2>
          <p className="text-gray-600 text-lg">
            اصولی که ما را در مسیر موفقیت هدایت می‌کنند
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">تیم ما</h2>
            <p className="text-gray-600 text-lg">
              افرادی که با تلاش و انگیزه، بنکداری شقایق را می‌سازند
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
                  {member.image}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container py-16">
        <div className="bg-gradient-to-l from-primary to-primary-600 rounded-2xl p-12 text-white text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiHeart className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">ماموریت ما</h2>
          <p className="text-xl text-primary-50 max-w-3xl mx-auto leading-relaxed">
            هدف ما ارائه بهترین تجربه خرید آنلاین به مشتریان است. ما می‌خواهیم با
            فراهم کردن محصولات باکیفیت، قیمت‌های مناسب، ارسال سریع و پشتیبانی عالی،
            اولین انتخاب شما برای خرید آنلاین باشیم.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            آماده شروع خرید هستید؟
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            هزاران محصول منتظر شما هستند
          </p>
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-lg font-bold"
          >
            مشاهده محصولات
          </a>
        </div>
      </div>
    </div>
  );
}
