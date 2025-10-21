import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiShoppingBag, FiCreditCard, FiMapPin } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api-client';
import { useCartStore, useAuthStore } from '@/store';
import { CheckoutForm, PaymentGateway } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function Checkout() {
  const router = useRouter();
  const { cart, setCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutForm>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await api.cart.get();
      setCart(response.data);

      if (response.data.items.length === 0) {
        toast.error('سبد خرید شما خالی است');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('خطا در بارگذاری سبد خرید');
    } finally {
      setCartLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    try {
      // Create order
      const orderResponse = await api.orders.create({
        shipping_name: data.shipping_name,
        shipping_address: data.shipping_address,
        shipping_city: data.shipping_city,
        shipping_state: data.shipping_state,
        shipping_postal_code: data.shipping_postal_code,
        shipping_phone: data.shipping_phone,
        notes: data.notes,
      });

      const order = orderResponse.data;

      // Request payment
      const paymentResponse = await api.payments.request({
        order_id: order.id,
        payment_method: data.payment_method,
      });

      // Redirect to payment gateway
      if (paymentResponse.data.payment_url) {
        window.location.href = paymentResponse.data.payment_url;
      } else {
        toast.error('خطا در ایجاد درخواست پرداخت');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.error || 'خطا در ثبت سفارش');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const shippingCost = Number(cart.subtotal) >= 500000 ? 0 : 30000;
  const total = Number(cart.subtotal) + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <FiArrowLeft />
            بازگشت به سبد خرید
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">تکمیل خرید</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FiMapPin className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">اطلاعات ارسال</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام و نام خانوادگی گیرنده *
                    </label>
                    <input
                      type="text"
                      {...register('shipping_name', { required: 'نام گیرنده الزامی است' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="نام کامل گیرنده"
                    />
                    {errors.shipping_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شماره تماس *
                    </label>
                    <input
                      type="tel"
                      {...register('shipping_phone', {
                        required: 'شماره تماس الزامی است',
                        pattern: {
                          value: /^09\d{9}$/,
                          message: 'شماره تماس معتبر نیست',
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="09123456789"
                      dir="ltr"
                    />
                    {errors.shipping_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      استان *
                    </label>
                    <input
                      type="text"
                      {...register('shipping_state', { required: 'استان الزامی است' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="تهران"
                    />
                    {errors.shipping_state && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شهر *
                    </label>
                    <input
                      type="text"
                      {...register('shipping_city', { required: 'شهر الزامی است' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="تهران"
                    />
                    {errors.shipping_city && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_city.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس کامل *
                    </label>
                    <textarea
                      {...register('shipping_address', { required: 'آدرس الزامی است' })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="آدرس دقیق محل تحویل..."
                    />
                    {errors.shipping_address && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد پستی *
                    </label>
                    <input
                      type="text"
                      {...register('shipping_postal_code', {
                        required: 'کد پستی الزامی است',
                        pattern: {
                          value: /^\d{10}$/,
                          message: 'کد پستی باید 10 رقم باشد',
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="1234567890"
                      dir="ltr"
                      maxLength={10}
                    />
                    {errors.shipping_postal_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shipping_postal_code.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    یادداشت (اختیاری)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="توضیحات تکمیلی..."
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FiCreditCard className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">روش پرداخت</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      value="zarinpal"
                      {...register('payment_method', { required: 'انتخاب روش پرداخت الزامی است' })}
                      className="mt-1"
                      defaultChecked
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">زرین‌پال</div>
                      <div className="text-sm text-gray-600 mt-1">
                        پرداخت آنلاین با تمامی کارت‌های عضو شتاب
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      value="paypint"
                      {...register('payment_method')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">پی‌پینگ</div>
                      <div className="text-sm text-gray-600 mt-1">
                        پرداخت سریع و امن با درگاه پی‌پینگ
                      </div>
                    </div>
                  </label>
                </div>

                {errors.payment_method && (
                  <p className="text-red-500 text-sm mt-2">{errors.payment_method.message}</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FiShoppingBag className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">خلاصه سفارش</h2>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {item.product_detail.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.quantity} × {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        {formatPrice(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>جمع کل ({cart.total_items} کالا)</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>هزینه ارسال</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">رایگان</span>
                    ) : (
                      <span>{formatPrice(shippingCost.toString())}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 mb-6">
                  <span className="font-bold text-gray-900 text-lg">مبلغ قابل پرداخت</span>
                  <span className="font-bold text-primary text-xl">
                    {formatPrice(total.toString())}
                  </span>
                </div>

                {/* Info Box */}
                {shippingCost === 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-green-800">
                      ✅ ارسال رایگان برای سفارش‌های بالای 500 هزار تومان
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-blue-800">
                      💡 با خرید {formatPrice((500000 - Number(cart.subtotal)).toString())} تومان بیشتر، ارسال
                      رایگان!
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال انتقال...
                    </div>
                  ) : (
                    'پرداخت و ثبت نهایی'
                  )}
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  با کلیک بر روی دکمه پرداخت، شما{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    قوانین و مقررات
                  </Link>{' '}
                  را می‌پذیرید
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
