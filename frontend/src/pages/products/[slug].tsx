import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useAuthStore, useCartStore } from '@/store';
import { toast } from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiShare2, FiCheck, FiX, FiMinus, FiPlus } from 'react-icons/fi';

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await api.products.getBySlug(slug as string);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('محصول یافت نشد');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد شوید');
      router.push('/auth/login');
      return;
    }

    if (!product?.is_in_stock) {
      toast.error('این محصول موجود نیست');
      return;
    }

    setAdding(true);
    try {
      await api.cart.addItem({
        product_id: product.id,
        quantity: quantity,
      });

      const cartResponse = await api.cart.get();
      setCart(cartResponse.data);

      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در افزودن به سبد خرید');
    } finally {
      setAdding(false);
    }
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('لینک کپی شد');
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Extract image URLs from ProductImage objects or use primary_image
  const images = product.images && product.images.length > 0
    ? product.images.map(img => typeof img === 'string' ? img : img.image)
    : [product.primary_image].filter(Boolean);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">محصولات</Link>
        {product.category_name && (
          <>
            <span>/</span>
            <Link href={`/categories/${product.category}`} className="hover:text-primary">
              {product.category_name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.is_on_sale && (
              <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full font-medium">
                {product.discount_percentage}% تخفیف
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            {product.sku && (
              <p className="text-sm text-gray-500">کد محصول: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-lg p-6">
            {product.is_on_sale ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.sale_price || product.final_price)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-sm text-green-600">
                  شما {formatPrice(Number(product.price) - Number(product.final_price))} تومان صرفه‌جویی می‌کنید
                </p>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.final_price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.is_in_stock ? (
              <>
                <FiCheck className="text-green-600" />
                <span className="text-green-600 font-medium">موجود در انبار</span>
                {product.stock_quantity && (
                  <span className="text-gray-500">({product.stock_quantity} عدد)</span>
                )}
              </>
            ) : (
              <>
                <FiX className="text-red-600" />
                <span className="text-red-600 font-medium">ناموجود</span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-bold mb-2">توضیحات محصول</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          {product.is_in_stock && (
            <div>
              <label className="block font-medium mb-2">تعداد:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border rounded-lg px-3 py-2"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={addToCart}
              disabled={!product.is_in_stock || adding}
              className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  <FiShoppingCart />
                  {product.is_in_stock ? 'افزودن به سبد خرید' : 'ناموجود'}
                </>
              )}
            </button>

            <button
              onClick={shareProduct}
              className="btn btn-secondary"
              title="اشتراک‌گذاری"
            >
              <FiShare2 />
            </button>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-3 text-sm">
            {product.category_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">دسته‌بندی:</span>
                <Link
                  href={`/categories/${product.category}`}
                  className="text-primary hover:underline"
                >
                  {product.category_name}
                </Link>
              </div>
            )}
            {product.unit && (
              <div className="flex justify-between">
                <span className="text-gray-600">واحد:</span>
                <span>{product.unit}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      {(product.meta_description || product.meta_keywords) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">اطلاعات تکمیلی</h2>
          {product.meta_description && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">توضیحات کامل</h3>
              <p className="text-gray-600 leading-relaxed">{product.meta_description}</p>
            </div>
          )}
          {product.meta_keywords && (
            <div>
              <h3 className="font-bold mb-2">کلمات کلیدی</h3>
              <div className="flex flex-wrap gap-2">
                {product.meta_keywords.split(',').map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
