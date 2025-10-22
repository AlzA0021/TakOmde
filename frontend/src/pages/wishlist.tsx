import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingCart, FiTrash2, FiPackage } from 'react-icons/fi';
import { api } from '@/lib/api-client';
import { useAuthStore, useCartStore, useWishlistStore } from '@/store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@/components/Breadcrumb';

export default function Wishlist() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const { wishlist, removeFromWishlist, loadWishlist } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/wishlist');
      return;
    }
    loadWishlistProducts();
  }, [isAuthenticated, wishlist]);

  const loadWishlistProducts = async () => {
    try {
      setLoading(true);
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Load all wishlist products
      const productPromises = wishlist.map((id) => api.products.getById(id));
      const responses = await Promise.allSettled(productPromises);

      const loadedProducts = responses
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map((result) => result.value.data);

      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading wishlist products:', error);
      toast.error('خطا در بارگذاری لیست علاقه‌مندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await api.wishlist.remove(productId);
      removeFromWishlist(productId);
      toast.success('از لیست علاقه‌مندی‌ها حذف شد');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('خطا در حذف از لیست علاقه‌مندی‌ها');
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity > 0) {
      addToCart(product);
      toast.success('محصول به سبد خرید اضافه شد');
    } else {
      toast.error('محصول موجود نیست');
    }
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    products.forEach((product) => {
      if (product.stock_quantity > 0) {
        addToCart(product);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success(`${addedCount} محصول به سبد خرید اضافه شد`);
    } else {
      toast.error('هیچ محصول موجودی برای افزودن به سبد وجود ندارد');
    }
  };

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
        <Breadcrumb
          items={[
            { label: 'لیست علاقه‌مندی‌ها' },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">لیست علاقه‌مندی‌ها</h1>
              <p className="text-gray-600">
                {products.length > 0 ? `${products.length} محصول در لیست علاقه‌مندی‌های شما` : 'لیست علاقه‌مندی‌های شما خالی است'}
              </p>
            </div>
            {products.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <FiShoppingCart />
                افزودن همه به سبد خرید
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Content */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FiHeart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              لیست علاقه‌مندی‌های شما خالی است
            </h3>
            <p className="text-gray-600 mb-6">
              محصولات مورد علاقه خود را اضافه کنید تا بعداً به آن‌ها دسترسی داشته باشید
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FiPackage />
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: Add All Button */}
            <div className="md:hidden mb-4">
              <button
                onClick={handleAddAllToCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <FiShoppingCart />
                افزودن همه به سبد خرید
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <Link href={`/products/${product.slug}`} className="block relative">
                    <div className="relative w-full h-64 bg-gray-100">
                      {product.primary_image ? (
                        <Image
                          src={product.primary_image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {product.is_on_sale && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          تخفیف
                        </span>
                      )}
                      {product.stock_quantity === 0 && (
                        <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
                          ناموجود
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-bold text-gray-900 mb-2 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 mb-3">{product.category_name}</p>

                    {/* Price */}
                    <div className="mb-4">
                      {product.is_on_sale && product.sale_price ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          {product.price && product.sale_price && (
                            <span className="text-xs text-red-600 font-medium">
                              {Math.round(((product.price - product.sale_price) / product.price) * 100)}% تخفیف
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <FiShoppingCart size={16} />
                        <span className="text-sm">افزودن به سبد</span>
                      </button>

                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="حذف از لیست"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
