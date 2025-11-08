import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUser, FiLock, FiHeart, FiPackage, FiLogOut, FiSave } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api-client';
import { useAuthStore, useWishlistStore } from '@/store';
import { User } from '@/types';
import Cookies from 'js-cookie';
import ProductCard from '@/components/Product/ProductCard';

type ProfileForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address?: string;
  city?: string;
  postal_code?: string;
};

type PasswordForm = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, user, setUser } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'wishlist' | 'orders'>(
    'profile'
  );
  const [loading, setLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileForm>();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm<PasswordForm>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const response = await api.auth.getProfile();
      setUser(response.data);
      resetProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const onSubmitProfile = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const response = await api.auth.updateProfile(data);
      setUser(response.data);
      toast.success('اطلاعات شما با موفقیت به‌روزرسانی شد');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در به‌روزرسانی اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordForm) => {
    if (data.new_password !== data.confirm_password) {
      toast.error('رمز عبور جدید و تکرار آن مطابقت ندارند');
      return;
    }

    setLoading(true);
    try {
      await api.auth.changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
      });
      toast.success('رمز عبور شما با موفقیت تغییر کرد');
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
    router.push('/');
    toast.success('با موفقیت خارج شدید');
  };

  // Helper function to get wishlist count
  const getWishlistCount = () => {
    if (!wishlist) return 0;
    const wishlistAny = wishlist as any;
    
    if (Array.isArray(wishlist)) {
      return wishlist.length;
    }
    
    if (wishlistAny.products && Array.isArray(wishlistAny.products)) {
      return wishlistAny.products.length;
    }
    
    if (wishlistAny.items && Array.isArray(wishlistAny.items)) {
      return wishlistAny.items.length;
    }
    
    if (typeof wishlistAny.count === 'number') {
      return wishlistAny.count;
    }
    
    return 0;
  };

  // Helper function to get wishlist products
  const getWishlistProducts = () => {
    if (!wishlist) return [];
    const wishlistAny = wishlist as any;
    
    if (Array.isArray(wishlist)) {
      return wishlist;
    }
    
    if (wishlistAny.products && Array.isArray(wishlistAny.products)) {
      return wishlistAny.products;
    }
    
    if (wishlistAny.items && Array.isArray(wishlistAny.items)) {
      return wishlistAny.items;
    }
    
    return [];
  };

  const wishlistCount = getWishlistCount();
  const wishlistProducts = getWishlistProducts();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user.first_name?.[0] || user.username[0].toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiUser />
                  اطلاعات حساب
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'password'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiLock />
                  تغییر رمز عبور
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiHeart />
                  علاقه‌مندی‌ها
                  {wishlistCount > 0 && (
                    <span className="mr-auto bg-accent text-white text-xs px-2 py-1 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => router.push('/orders')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiPackage />
                  سفارش‌های من
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut />
                  خروج از حساب
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">اطلاعات حساب کاربری</h2>

                <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام *
                      </label>
                      <input
                        type="text"
                        {...registerProfile('first_name', { required: 'نام الزامی است' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {profileErrors.first_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileErrors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام خانوادگی *
                      </label>
                      <input
                        type="text"
                        {...registerProfile('last_name', { required: 'نام خانوادگی الزامی است' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {profileErrors.last_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileErrors.last_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ایمیل *
                      </label>
                      <input
                        type="email"
                        {...registerProfile('email', {
                          required: 'ایمیل الزامی است',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'ایمیل معتبر نیست',
                          },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        dir="ltr"
                      />
                      {profileErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شماره تماس
                      </label>
                      <input
                        type="tel"
                        {...registerProfile('phone_number')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
                      <input
                        type="text"
                        {...registerProfile('city')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        کد پستی
                      </label>
                      <input
                        type="text"
                        {...registerProfile('postal_code')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        dir="ltr"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                      <textarea
                        {...registerProfile('address')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        ذخیره تغییرات
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">تغییر رمز عبور</h2>

                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رمز عبور فعلی *
                      </label>
                      <input
                        type="password"
                        {...registerPassword('old_password', {
                          required: 'رمز عبور فعلی الزامی است',
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {passwordErrors.old_password && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordErrors.old_password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رمز عبور جدید *
                      </label>
                      <input
                        type="password"
                        {...registerPassword('new_password', {
                          required: 'رمز عبور جدید الزامی است',
                          minLength: {
                            value: 8,
                            message: 'رمز عبور باید حداقل 8 کاراکتر باشد',
                          },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {passwordErrors.new_password && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordErrors.new_password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تکرار رمز عبور جدید *
                      </label>
                      <input
                        type="password"
                        {...registerPassword('confirm_password', {
                          required: 'تکرار رمز عبور الزامی است',
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {passwordErrors.confirm_password && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordErrors.confirm_password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <FiLock />
                        تغییر رمز عبور
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">علاقه‌مندی‌ها</h2>

                {wishlistProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FiHeart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      لیست علاقه‌مندی‌های شما خالی است
                    </h3>
                    <p className="text-gray-600">
                      محصولاتی که دوست دارید را به لیست علاقه‌مندی‌ها اضافه کنید
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}