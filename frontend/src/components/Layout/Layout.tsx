import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import CartSidebar from './CartSidebar';
import { useUIStore } from '@/store';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, isCartOpen, closeSidebar, closeCart } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Header />
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
      
      {/* Overlay */}
      {(isSidebarOpen || isCartOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            closeSidebar();
            closeCart();
          }}
        />
      )}
    </div>
  );
}
