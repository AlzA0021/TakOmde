import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Product } from '@/types';
import ProductCard from '@/components/Product/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import { FiTag, FiTrendingDown, FiClock, FiPercent } from 'react-icons/fi';

export default function SpecialOffers() {
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sale' | 'featured'>('sale');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const [saleResponse, featuredResponse] = await Promise.all([
        api.products.getOnSale(),
        api.products.getFeatured(),
      ]);

      setOnSaleProducts(saleResponse.data);
      setFeaturedProducts(featuredResponse.data);
    } catch (error) {
      console.error('Error loading special offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayProducts = activeTab === 'sale' ? onSaleProducts : featuredProducts;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'پیشنهادات ویژه' }]} />

        {/* Hero Section */}
        <div className="bg-gradient-to-l from-accent to-accent-600 text-white rounded-2xl p-12 mb-8 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiTag className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">پیشنهادات ویژه</h1>
          <p className="text-xl text-accent-50 max-w-2xl mx-auto">
            بهترین تخفیف‌ها و پیشنهادات شگفت‌انگیز را از دست ندهید!
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-accent-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiTrendingDown className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{onSaleProducts.length}</h3>
            <p className="text-gray-600">محصول تخفیف‌دار</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiPercent className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">تا ۷۰%</h3>
            <p className="text-gray-600">تخفیف شگفت‌انگیز</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-yellow-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiClock className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">محدود</h3>
            <p className="text-gray-600">تا اتمام موجودی</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('sale')}
            className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all ${
              activeTab === 'sale'
                ? 'bg-accent text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiTrendingDown />
              <span>تخفیف‌های ویژه ({onSaleProducts.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('featured')}
            className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all ${
              activeTab === 'featured'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiTag />
              <span>محصولات ویژه ({featuredProducts.length})</span>
            </div>
          </button>
        </div>

        {/* Products Grid */}
        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FiTag className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              در حال حاضر پیشنهاد ویژه‌ای وجود ندارد
            </h3>
            <p className="text-gray-600 mb-6">
              به زودی پیشنهادات شگفت‌انگیز جدیدی اضافه خواهد شد
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Info Banner */}
            <div className="mt-12 bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">نکته مهم!</h3>
              <p className="text-blue-50 max-w-2xl mx-auto">
                تخفیف‌ها محدود به موجودی انبار هستند. برای استفاده از بهترین پیشنهادات،
                همین الان سفارش خود را ثبت کنید.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
