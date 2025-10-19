import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, useCartStore } from '@/store';
import { api } from '@/lib/api-client';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await api.cart.get();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setUpdating(itemId);
    try {
      if (quantity === 0) {
        await removeItem(itemId);
        return;
      }

      await api.cart.updateItem({ item_id: itemId, quantity });
      const response = await api.cart.get();
      setCart(response.data);
      toast.success('تعداد محصول به‌روزرسانی شد');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در به‌روزرسانی');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    setUpdating(itemId);
    try {
      await api.cart.removeItem({ item_id: itemId });
      const response = await api.cart.get();
      setCart(response.data);
      toast.success('محصول از سبد خرید حذف شد');
    } catch (error) {
      toast.error('خطا در حذف محصول');
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!confirm('آیا از پاک کردن سبد خرید اطمینان دارید؟')) return;

    try {
      await api.cart.clear();
      setCart(null);
      toast.success('سبد خرید خالی شد');
    } catch (error) {
      toast.error('خطا در خالی کردن سبد خرید');
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiShoppingCart className="text-6xl text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">سبد خرید شما خالی است</h1>
          <p className="text-gray-600 mb-6">
            هنوز محصولی به سبد خرید خود اضافه نکرده‌اید
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">سبد خرید</h1>
          <p className="text-gray-600">
            {cart.total_items} محصول در سبد خرید شما
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <FiTrash2 />
          <span>خالی کردن سبد</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm p-6 flex gap-6"
            >
              {/* Product Image */}
              <Link
                href={`/products/${item.product_detail.slug}`}
                className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={getImageUrl(item.product_detail.primary_image)}
                  alt={item.product_detail.name}
                  fill
                  className="object-cover"
                />
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product_detail.slug}`}
                  className="font-bold text-lg hover:text-primary transition-colors mb-2 block"
                >
                  {item.product_detail.name}
                </Link>

                {item.product_detail.sku && (
                  <p className="text-sm text-gray-500 mb-3">
                    کد محصول: {item.product_detail.sku}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">تعداد:</span>
                    <div className="flex items-center gap-2 border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id}
                        className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                      >
                        <FiMinus />
                      </button>
                      <span className="px-4 font-medium min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={updating === item.id}
                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>

                {/* Price */}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">قیمت واحد:</span>
                    <span className="font-medium">{formatPrice(item.unit_price)}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 mb-1">مجموع:</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6">خلاصه سفارش</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تعداد کالاها:</span>
                <span className="font-medium">{cart.total_items} عدد</span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-gray-600">مبلغ کل:</span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">هزینه ارسال:</span>
                <span className="text-green-600 font-medium">رایگان</span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t text-lg font-bold">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-primary">{formatPrice(cart.subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary-600 font-medium transition-colors"
            >
              ادامه فرآیند خرید
            </Link>

            <Link
              href="/products"
              className="block w-full py-3 mt-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
