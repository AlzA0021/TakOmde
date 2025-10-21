import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiMapPin } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store';
import { Address } from '@/types';

type AddressForm = {
  title: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
};

export default function Addresses() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressForm>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/addresses');
      return;
    }
    loadAddresses();
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      const response = await api.auth.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('خطا در بارگذاری آدرس‌ها');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AddressForm) => {
    setSubmitting(true);
    try {
      if (editingAddress) {
        await api.auth.updateAddress(editingAddress.id, data);
        toast.success('آدرس با موفقیت به‌روزرسانی شد');
      } else {
        await api.auth.createAddress(data);
        toast.success('آدرس جدید اضافه شد');
      }
      loadAddresses();
      setShowForm(false);
      setEditingAddress(null);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در ثبت آدرس');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    reset({
      title: address.title,
      address: address.address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      phone_number: address.phone_number,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این آدرس اطمینان دارید؟')) return;

    try {
      await api.auth.deleteAddress(id);
      toast.success('آدرس حذف شد');
      loadAddresses();
    } catch (error) {
      toast.error('خطا در حذف آدرس');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.auth.setDefaultAddress(id);
      toast.success('آدرس پیش‌فرض تنظیم شد');
      loadAddresses();
    } catch (error) {
      toast.error('خطا در تنظیم آدرس پیش‌فرض');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    reset();
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
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">آدرس‌های من</h1>
            <p className="text-gray-600">مدیریت آدرس‌های ارسال سفارش</p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FiPlus />
              افزودن آدرس جدید
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">
              {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان آدرس *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'عنوان آدرس الزامی است' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="مثلاً: منزل، محل کار، ..."
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    استان *
                  </label>
                  <input
                    type="text"
                    {...register('state', { required: 'استان الزامی است' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="تهران"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شهر *
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'شهر الزامی است' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="تهران"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    آدرس کامل *
                  </label>
                  <textarea
                    {...register('address', { required: 'آدرس الزامی است' })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="آدرس دقیق محل تحویل..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    کد پستی *
                  </label>
                  <input
                    type="text"
                    {...register('postal_code', {
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
                  {errors.postal_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره تماس *
                  </label>
                  <input
                    type="tel"
                    {...register('phone_number', {
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
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-medium"
                >
                  {submitting
                    ? 'در حال ذخیره...'
                    : editingAddress
                    ? 'به‌روزرسانی آدرس'
                    : 'افزودن آدرس'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FiMapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">هنوز آدرسی ثبت نکرده‌اید</h3>
            <p className="text-gray-600 mb-6">
              برای سفارش محصولات، ابتدا یک آدرس برای ارسال اضافه کنید
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <FiPlus />
                افزودن اولین آدرس
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-lg shadow-sm p-6 ${
                  address.is_default ? 'border-2 border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{address.title}</h3>
                      {address.is_default && (
                        <span className="px-3 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-1">
                          <FiCheck className="w-3 h-3" />
                          پیش‌فرض
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-gray-700">
                      <p>{address.address}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state}
                      </p>
                      <p className="text-sm text-gray-600">کد پستی: {address.postal_code}</p>
                      <p className="text-sm text-gray-600" dir="ltr">
                        تلفن: {address.phone_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ویرایش"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 text-sm text-primary hover:underline font-medium"
                  >
                    انتخاب به عنوان آدرس پیش‌فرض
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
