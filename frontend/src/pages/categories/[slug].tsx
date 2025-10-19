import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Product, Category } from '@/types';
import ProductCard from '@/components/Product/ProductCard';
import { FiChevronLeft, FiGrid, FiList } from 'react-icons/fi';

export default function CategoryDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [ordering, setOrdering] = useState('-created_at');

  useEffect(() => {
    if (slug) {
      fetchCategoryData();
    }
  }, [slug, ordering]);

  const fetchCategoryData = async () => {
    try {
      // دریافت اطلاعات دسته‌بندی
      const categoryResponse = await api.products.getCategoryBySlug(slug as string);
      setCategory(categoryResponse.data);

      // دریافت محصولات این دسته‌بندی
      const productsResponse = await api.products.getAll({
        category: categoryResponse.data.id,
        ordering: ordering,
      });
      setProducts(productsResponse.data.results || productsResponse.data);

      // دریافت زیردسته‌ها
      const categoriesResponse = await api.products.getCategories();
      const allCategories = categoriesResponse.data;
      const subs = allCategories.filter(
        (cat: Category) => cat.parent === categoryResponse.data.id
      );
      setSubCategories(subs);
    } catch (error) {
      console.error('Error fetching category data:', error);
      router.push('/categories');
    } finally {
      setLoading(false);
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

  if (!category) {
    return null;
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-primary">دسته‌بندی‌ها</Link>
        <span>/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{products.length} محصول</span>
              {subCategories.length > 0 && (
                <span>{subCategories.length} زیردسته</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Categories */}
      {subCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">زیردسته‌های {category.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subCategories.map((subCat) => (
              <Link
                key={subCat.id}
                href={`/categories/${subCat.slug}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xl">{subCat.name[0]}</span>
                </div>
                <p className="font-medium text-sm">{subCat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {products.length} محصول در این دسته‌بندی
        </p>

        <div className="flex items-center gap-4">
          {/* View Mode */}
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'
              }`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'
              }`}
            >
              <FiList />
            </button>
          </div>

          {/* Sort */}
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="input min-w-[200px]"
          >
            <option value="-created_at">جدیدترین</option>
            <option value="price">قیمت: کم به زیاد</option>
            <option value="-price">قیمت: زیاد به کم</option>
            <option value="name">نام: الف تا ی</option>
          </select>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FiGrid className="text-6xl text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">محصولی یافت نشد</h3>
          <p className="text-gray-600 mb-6">
            در حال حاضر محصولی در این دسته‌بندی وجود ندارد
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
