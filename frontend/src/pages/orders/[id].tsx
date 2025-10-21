import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiMapPin,
  FiPhone,
  FiUser,
  FiCreditCard,
} from 'react-icons/fi';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: any; color: string; bg: string }
> = {
  pending: {
    label: 'در انتظار پرداخت',
    icon: FiClock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  processing: {
    label: 'در حال پردازش',
    icon: FiPackage,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  shipped: {
    label: 'ارسال شده',
    icon: FiTruck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  delivered: {
    label: 'تحویل داده شده',
    icon: FiCheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  cancelled: {
    label: 'لغو شده',
    icon: FiXCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  refunded: {
    label: 'مرجوع شده',
    icon: FiXCircle,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
  },
};

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/orders');
      return;
    }
    if (id) {
      loadOrder();
    }
  }, [isAuthenticated, id]);

  const loadOrder = async () => {
    try {
      const response = await api.orders.getById(Number(id));
      setOrder(response.data);
    } catch (error) {
      console.error('Error loading order:', error);
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusTimeline = () => {
    if (!order) return [];

    const timeline = [
      {
        status: 'pending',
        label: 'ثبت سفارش',
        date: order.created_at,
        completed: true,
      },
      {
        status: 'processing',
        label: 'در حال پردازش',
        date: order.is_paid ? order.paid_at : null,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status),
      },
      {
        status: 'shipped',
        label: 'ارسال شده',
        date: order.shipped_at,
        completed: ['shipped', 'delivered'].includes(order.status),
      },
      {
        status: 'delivered',
        label: 'تحویل داده شده',
        date: order.delivered_at,
        completed: order.status === 'delivered',
      },
    ];

    return timeline;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;
  const timeline = getStatusTimeline();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <FiArrowRight />
            بازگشت به سفارش‌ها
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                جزئیات سفارش #{order.order_number}
              </h1>
              <p className="text-gray-600">ثبت شده در {formatDate(order.created_at)}</p>
            </div>
            <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${statusInfo.bg}`}>
              <StatusIcon className={`${statusInfo.color}`} />
              <span className={`font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {order.status !== 'cancelled' && order.status !== 'refunded' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">وضعیت سفارش</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute right-4 top-0 h-full w-0.5 bg-gray-200" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.status} className="relative flex items-start gap-4">
                    {/* Timeline Dot */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {item.completed && <FiCheckCircle className="w-5 h-5" />}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 pb-8">
                      <h3
                        className={`font-bold mb-1 ${
                          item.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {item.label}
                      </h3>
                      {item.date && (
                        <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">آیتم‌های سفارش</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{item.product_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">کد کالا: {item.product_sku}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          قیمت واحد: {formatPrice(item.unit_price)}
                        </span>
                        <span className="text-gray-600">تعداد: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FiMapPin className="text-primary" />
                </div>
                <h2 className="text-xl font-bold">آدرس تحویل</h2>
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-2">
                  <FiUser className="mt-1 text-gray-400" />
                  <div>
                    <p className="font-medium">{order.shipping_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FiPhone className="mt-1 text-gray-400" />
                  <div>
                    <p dir="ltr" className="text-left">
                      {order.shipping_phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FiMapPin className="mt-1 text-gray-400" />
                  <div>
                    <p>{order.shipping_address}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.shipping_city}, {order.shipping_state}
                    </p>
                    <p className="text-sm text-gray-600">
                      کد پستی: {order.shipping_postal_code}
                    </p>
                  </div>
                </div>
              </div>

              {order.tracking_number && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTruck className="text-blue-600" />
                    <h3 className="font-bold text-blue-900">کد رهگیری مرسوله</h3>
                  </div>
                  <p className="font-mono text-lg font-bold text-blue-900">
                    {order.tracking_number}
                  </p>
                </div>
              )}

              {order.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">یادداشت:</h3>
                  <p className="text-gray-700 text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 space-y-6">
              {/* Payment Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FiCreditCard className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">اطلاعات پرداخت</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>جمع کل ({order.items.length} کالا)</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>هزینه ارسال</span>
                    <span>
                      {Number(order.shipping_cost) === 0 ? (
                        <span className="text-green-600">رایگان</span>
                      ) : (
                        formatPrice(order.shipping_cost)
                      )}
                    </span>
                  </div>

                  {Number(order.tax) > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>مالیات</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                  )}

                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">مبلغ کل</span>
                      <span className="font-bold text-xl text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">وضعیت پرداخت</span>
                      {order.is_paid ? (
                        <span className="text-green-600 font-medium">پرداخت شده</span>
                      ) : (
                        <span className="text-red-600 font-medium">پرداخت نشده</span>
                      )}
                    </div>
                    {order.is_paid && order.paid_at && (
                      <p className="text-xs text-gray-500 mt-1 text-left">
                        {formatDate(order.paid_at)}
                      </p>
                    )}
                  </div>

                  {order.payment_method && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">روش پرداخت</span>
                      <span className="text-gray-900">
                        {order.payment_method === 'zarinpal'
                          ? 'زرین‌پال'
                          : order.payment_method === 'paypint'
                          ? 'پی‌پینگ'
                          : order.payment_method}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {order.status === 'pending' && (
                <button
                  onClick={async () => {
                    if (confirm('آیا از لغو این سفارش اطمینان دارید؟')) {
                      try {
                        // TODO: Add cancel order API
                        router.push('/orders');
                      } catch (error) {
                        console.error('Error cancelling order:', error);
                      }
                    }
                  }}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  لغو سفارش
                </button>
              )}

              <Link
                href="/orders"
                className="block text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                بازگشت به لیست سفارش‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
