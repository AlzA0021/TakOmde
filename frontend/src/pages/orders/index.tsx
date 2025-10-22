import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiHome } from 'react-icons/fi';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string; bg: string }> =
  {
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

export default function Orders() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/orders');
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      const response = await api.orders.getAll();
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سفارش‌های من</h1>
          <p className="text-gray-600">تاریخچه و وضعیت سفارش‌های شما</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FiPackage className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
            <p className="text-gray-600 mb-6">با خرید از فروشگاه، سفارش‌های شما اینجا نمایش داده می‌شوند</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FiHome />
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-600">شماره سفارش</p>
                          <p className="font-bold text-gray-900">{order.order_number}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-300" />
                        <div>
                          <p className="text-sm text-gray-600">تاریخ ثبت</p>
                          <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-300" />
                        <div>
                          <p className="text-sm text-gray-600">مبلغ کل</p>
                          <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg}`}>
                        <StatusIcon className={`${statusInfo.color}`} />
                        <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              کد کالا: {item.product_sku}
                            </p>
                          </div>
                          <div className="text-left ml-4">
                            <p className="text-gray-700">
                              {item.quantity} × {formatPrice(item.unit_price)}
                            </p>
                            <p className="font-bold text-gray-900 mt-1">
                              {formatPrice(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">آدرس تحویل</h4>
                      <p className="text-gray-700 text-sm">
                        {order.shipping_name} - {order.shipping_phone}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {order.shipping_address}, {order.shipping_city}, {order.shipping_state}
                      </p>
                      <p className="text-gray-600 text-sm">کد پستی: {order.shipping_postal_code}</p>
                    </div>

                    {/* Tracking Info */}
                    {order.tracking_number && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <FiTruck className="text-blue-600" />
                          <div>
                            <p className="text-sm text-blue-800 font-medium">کد رهگیری مرسوله</p>
                            <p className="font-mono text-blue-900 font-bold">
                              {order.tracking_number}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        جزئیات سفارش
                      </Link>

                      {order.status === 'pending' && (
                        <button
                          onClick={async () => {
                            if (
                              confirm('آیا از لغو این سفارش اطمینان دارید؟')
                            ) {
                              try {
                                await api.orders.getById(order.id);
                                loadOrders();
                              } catch (error) {
                                console.error('Error cancelling order:', error);
                              }
                            }
                          }}
                          className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          لغو سفارش
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
