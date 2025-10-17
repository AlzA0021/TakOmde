import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await api.auth.login(data);
      const { access, refresh } = response.data;

      // Save tokens
      Cookies.set('access_token', access, { expires: 7 });
      Cookies.set('refresh_token', refresh, { expires: 30 });

      // Get user profile
      const profileResponse = await api.auth.getProfile();
      setUser(profileResponse.data);

      toast.success('خوش آمدید!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'نام کاربری یا رمز عبور اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">ورود به حساب کاربری</h1>
          <p className="text-gray-600 mt-2">به پیک‌بازار خوش آمدید</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">
                نام کاربری یا ایمیل
              </label>
              <input
                type="text"
                {...register('username', { required: 'نام کاربری الزامی است' })}
                className="input"
                placeholder="نام کاربری خود را وارد کنید"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">رمز عبور</label>
              <input
                type="password"
                {...register('password', { required: 'رمز عبور الزامی است' })}
                className="input"
                placeholder="رمز عبور خود را وارد کنید"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'ورود'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              حساب کاربری ندارید؟{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
