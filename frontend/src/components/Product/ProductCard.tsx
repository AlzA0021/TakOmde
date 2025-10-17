import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { setCart } = useCartStore();
  const { wishlist, setWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const isInWishlist = wishlist?.products.some(p => p.id === product.id);

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
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={getImageUrl(product.primary_image)}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.is_on_sale && (
            <span className="px-2 py-1 bg-accent text-white text-xs font-medium rounded">
              {product.discount_percentage}% تخفیف
            </span>
          )}
          {!product.is_in_stock && (
            <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded">
              ناموجود
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            isInWishlist
              ? 'bg-accent text-white'
              : 'bg-white text-gray-600 hover:bg-accent hover:text-white'
          }`}
        >
          <FiHeart className={isInWishlist ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-medium line-clamp-2 h-12 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-primary font-bold text-lg">
              {formatPrice(product.final_price)}
            </p>
            {product.is_on_sale && (
              <p className="text-gray-400 text-sm line-through">
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          <button
            onClick={addToCart}
            disabled={!product.is_in_stock || isAddingToCart}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              product.is_in_stock
                ? 'bg-primary text-white hover:bg-primary-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiShoppingCart />
            )}
          </button>
        </div>

        {/* Rating */}
        {product.average_rating && product.average_rating > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < product.average_rating!
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500">
              ({product.reviews_count || 0})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
