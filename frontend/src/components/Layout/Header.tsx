import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiShoppingCart, FiUser, FiHeart, FiSearch } from 'react-icons/fi';
import { useAuthStore, useCartStore, useUIStore } from '@/store';
import { useEffect } from 'react';
import { api } from '@/lib/api-client';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const { toggleSidebar, toggleCart, toggleSearch } = useUIStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await api.cart.get();
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            <span className="text-primary">پیک</span>
            <span className="text-accent">بازار</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="جستجوی محصولات..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => toggleSearch()}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiMenu className="text-2xl" />
            </button>

            {/* Mobile Search */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiSearch className="text-2xl" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <FiHeart className="text-2xl" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <FiShoppingCart className="text-2xl" />
              {cart && cart.total_items > 0 && (
                <span className="absolute -top-1 -left-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.total_items}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <FiUser className="text-2xl" />
                  <span className="hidden md:block">{user?.first_name || user?.username}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                  >
                    پروفایل
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    سفارش‌ها
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    علاقه‌مندی‌ها
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-b-lg text-red-600"
                  >
                    خروج
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <FiUser />
                <span className="hidden md:block">ورود / ثبت‌نام</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 py-3 border-t">
          <Link href="/" className="hover:text-primary transition-colors">
            صفحه اصلی
          </Link>
          <Link href="/products" className="hover:text-primary transition-colors">
            محصولات
          </Link>
          <Link href="/categories" className="hover:text-primary transition-colors">
            دسته‌بندی‌ها
          </Link>
          <Link href="/offers" className="hover:text-primary transition-colors">
            پیشنهادات ویژه
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            درباره ما
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            تماس با ما
          </Link>
        </nav>
      </div>
    </header>
  );
}
