import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCartStore } from '@/store';
import { api } from '@/lib/api-client';
import { formatPrice, getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, setCart } = useCartStore();

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      if (quantity === 0) {
        await api.cart.removeItem({ item_id: itemId });
        toast.success('محصول از سبد خرید حذف شد');
      } else {
        await api.cart.updateItem({ item_id: itemId, quantity });
      }
      
      const response = await api.cart.get();
      setCart(response.data);
    } catch (error) {
      toast.error('خطا در به‌روزرسانی سبد خرید');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.cart.removeItem({ item_id: itemId });
      const response = await api.cart.get();
      setCart(response.data);
      toast.success('محصول از سبد خرید حذف شد');
    } catch (error) {
      toast.error('خطا در حذف محصول');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          exit={{ x: -400 }}
          transition={{ type: 'tween' }}
          className="fixed left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">سبد خرید</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">سبد خرید شما خالی است</p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                >
                  مشاهده محصولات
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={getImageUrl(item.product_detail.primary_image)}
                        alt={item.product_detail.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product_detail.slug}`}
                        onClick={onClose}
                        className="font-medium hover:text-primary line-clamp-2"
                      >
                        {item.product_detail.name}
                      </Link>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-200 rounded-r-lg"
                          >
                            <FiMinus className="text-sm" />
                          </button>
                          <span className="px-3 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-200 rounded-l-lg"
                          >
                            <FiPlus className="text-sm" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <p className="text-primary font-bold mt-2">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>جمع کل:</span>
                <span className="text-primary">{formatPrice(cart.subtotal)}</span>
              </div>
              
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary-600 font-medium"
              >
                تسویه حساب
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
