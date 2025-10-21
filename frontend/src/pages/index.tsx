import { useState, useEffect } from 'react';
import ProductCard from '@/components/Product/ProductCard';
import { api } from '@/lib/api-client';
import { Product, Category } from '@/types';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featured, onSale, cats] = await Promise.all([
        api.products.getFeatured(),
        api.products.getOnSale(),
        api.products.getCategories(),
      ]);

      setFeaturedProducts(featured.data.slice(0, 8));
      setOnSaleProducts(onSale.data.slice(0, 8));
      setCategories(cats.data.slice(0, 6));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-primary-50 to-white py-16">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              خرید آنلاین
              <span className="text-primary"> آسان</span> و
              <span className="text-accent"> سریع</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              بهترین محصولات را با قیمت مناسب از فروشگاه پیک‌بازار تهیه کنید
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              مشاهده محصولات
              <FiArrowLeft />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">دسته‌بندی‌ها</h2>
              <Link
                href="/categories"
                className="text-primary hover:underline flex items-center gap-1"
              >
                مشاهده همه
                <FiArrowLeft />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">{category.name[0]}</span>
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">محصولات ویژه</h2>
              <Link
                href="/products?featured=true"
                className="text-primary hover:underline flex items-center gap-1"
              >
                مشاهده همه
                <FiArrowLeft />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* On Sale Products */}
      {onSaleProducts.length > 0 && (
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">تخفیف‌های ویژه</h2>
              <Link
                href="/products?on_sale=true"
                className="text-primary hover:underline flex items-center gap-1"
              >
                مشاهده همه
                <FiArrowLeft />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {onSaleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold mb-2">ارسال سریع</h3>
              <p className="text-gray-600 text-sm">
                ارسال رایگان برای سفارش‌های بالای 500 هزار تومان
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="font-bold mb-2">پرداخت امن</h3>
              <p className="text-gray-600 text-sm">
                پرداخت آنلاین با درگاه‌های معتبر بانکی
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="font-bold mb-2">ضمانت بازگشت</h3>
              <p className="text-gray-600 text-sm">
                7 روز ضمانت بازگشت کالا
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
