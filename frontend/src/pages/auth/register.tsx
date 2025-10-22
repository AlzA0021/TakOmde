import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await api.auth.register(data);
      toast.success('ثبت‌نام با موفقیت انجام شد! لطفاً وارد شوید');
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.username?.[0] ||
                          error.response?.data?.email?.[0] ||
                          error.response?.data?.detail ||
                          'خطا در ثبت‌نام';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">ثبت‌نام در بنکداری شقایق</h1>
          <p className="text-gray-600 mt-2">اطلاعات خود را وارد کنید</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام</label>
                <input
                  type="text"
                  {...register('first_name', { required: 'نام الزامی است' })}
                  className="input"
                  placeholder="نام خود را وارد کنید"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نام خانوادگی</label>
                <input
                  type="text"
                  {...register('last_name', { required: 'نام خانوادگی الزامی است' })}
                  className="input"
                  placeholder="نام خانوادگی"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">نام کاربری</label>
              <input
                type="text"
                {...register('username', {
                  required: 'نام کاربری الزامی است',
                  minLength: { value: 3, message: 'نام کاربری باید حداقل 3 کاراکتر باشد' }
                })}
                className="input"
                placeholder="نام کاربری خود را وارد کنید"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">ایمیل</label>
              <input
                type="email"
                {...register('email', {
                  required: 'ایمیل الزامی است',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'ایمیل نامعتبر است'
                  }
                })}
                className="input"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">شماره موبایل</label>
              <input
                type="tel"
                {...register('phone_number', {
                  required: 'شماره موبایل الزامی است',
                  pattern: {
                    value: /^09[0-9]{9}$/,
                    message: 'شماره موبایل معتبر وارد کنید (مثال: 09123456789)'
                  }
                })}
                className="input"
                placeholder="09123456789"
                dir="ltr"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">رمز عبور</label>
              <input
                type="password"
                {...register('password', {
                  required: 'رمز عبور الزامی است',
                  minLength: { value: 8, message: 'رمز عبور باید حداقل 8 کاراکتر باشد' }
                })}
                className="input"
                placeholder="رمز عبور خود را وارد کنید"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">تکرار رمز عبور</label>
              <input
                type="password"
                {...register('password_confirm', {
                  required: 'تکرار رمز عبور الزامی است',
                  validate: value => value === password || 'رمز عبور و تکرار آن یکسان نیستند'
                })}
                className="input"
                placeholder="رمز عبور را مجدداً وارد کنید"
              />
              {errors.password_confirm && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirm.message}</p>
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
                'ثبت‌نام'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
