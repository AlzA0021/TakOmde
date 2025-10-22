import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiSearch, FiUser, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useAuthStore, useCartStore, useWishlistStore, useUIStore } from '@/store';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const { toggleSidebar, toggleCart, toggleSearch } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      toast.success('خروج موفق');
      router.push('/');
    } catch (error) {
      toast.error('خطا در خروج');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // پیشگیری از نمایش محتوای نادرست در سرور
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className="text-xl font-bold hidden md:block">بنکداری شقایق</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FiMenu className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="منو"
          >
            <FiMenu className="text-2xl" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-xl font-bold hidden md:block">بنکداری شقایق</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="flex items-center w-full bg-gray-100 rounded-lg px-4 py-2">
              <FiSearch className="text-gray-500 text-xl ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در محصولات..."
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="جستجو"
            >
              <FiSearch className="text-2xl" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg relative"
                aria-label="علاقه‌مندی‌ها"
              >
                <FiHeart className="text-2xl" />
                {wishlist && wishlist.products.length > 0 && (
                  <span className="absolute -top-1 -left-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.products.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
              aria-label="سبد خرید"
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
