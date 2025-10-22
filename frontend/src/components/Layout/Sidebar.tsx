import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHome, FiShoppingBag, FiGrid, FiTag, FiPhone, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useAuthStore } from '@/store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, user } = useAuthStore();

  const menuItems = [
    { href: '/', label: 'صفحه اصلی', icon: FiHome },
    { href: '/products', label: 'محصولات', icon: FiShoppingBag },
    { href: '/categories', label: 'دسته‌بندی‌ها', icon: FiGrid },
    { href: '/special-offers', label: 'پیشنهادات ویژه', icon: FiTag },
    { href: '/contact', label: 'تماس با ما', icon: FiPhone },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: 'tween' }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">منو</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {user.first_name?.[0] || user.username[0]}
                </div>
                <div>
                  <p className="font-medium">{user.first_name || user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="text-xl text-gray-600" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FiUser className="text-xl text-gray-600" />
                      <span>پروفایل</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FiShoppingBag className="text-xl text-gray-600" />
                      <span>سفارش‌های من</span>
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <FiUser className="text-xl" />
                    <span>ورود / ثبت‌نام</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
