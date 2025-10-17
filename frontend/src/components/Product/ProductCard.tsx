import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setCart } = useCartStore();
  const { wishlist, setWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isInWishlist = mounted && wishlist?.products.some(p => p.id === product.id);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    setIsAddingToCart(true);
    try {
      await api.cart.addItem({ product_id: product.id, quantity: 1 });
      const response = await api.cart.get();
      setCart(response.data);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در افزودن به سبد خرید');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    try {
      if (isInWishlist) {
        await api.wishlist.removeProduct({ product_id: product.id });
        toast.success('محصول از علاقه‌مندی‌ها حذف شد');
      } else {
        await api.wishlist.addProduct({ product_id: product.id });
        toast.success('محصول به علاقه‌مندی‌ها اضافه شد');
      }

      const response = await api.wishlist.get();
      setWishlist(response.data);
    } catch (error) {
      toast.error('خطا در عملیات');
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      suppressHydrationWarning
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={getImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.on_sale && (
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
              فروش ویژه
            </span>
          )}
          {product.featured && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              ویژه
            </span>
          )}
        </div>

        {/* Actions - فقط بعد از mount نمایش داده می‌شود */}
        {mounted && isAuthenticated && (
          <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform ${
                isInWishlist ? 'text-accent' : 'text-gray-600'
              }`}
              aria-label="افزودن به علاقه‌مندی‌ها"
            >
              <FiHeart className={isInWishlist ? 'fill-current' : ''} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {product.category && (
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            {product.on_sale && product.sale_price ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-accent">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Cart Button - فقط بعد از mount نمایش داده می‌شود */}
          {mounted && (
            <button
              onClick={addToCart}
              disabled={isAddingToCart || !product.in_stock}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="افزودن به سبد خرید"
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiShoppingCart />
              )}
            </button>
          )}
        </div>

        {!product.in_stock && (
          <p className="text-sm text-accent mt-2">ناموجود</p>
        )}
      </div>
    </Link>
  );
}
