import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '@/components/Product/ProductCard';
import { api } from '@/lib/api-client';
import { Product } from '@/types';
import { FiFilter } from 'react-icons/fi';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    min_price: '',
    max_price: '',
    on_sale: false,
    in_stock: false,
    ordering: '-created_at',
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== false) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await api.products.getAll(params);
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">محصولات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <FiFilter />
              <h2 className="text-lg font-bold">فیلترها</h2>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">جستجو</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input"
                  placeholder="نام محصول..."
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">محدوده قیمت</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.min_price}
                    onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                    className="input"
                    placeholder="از"
                  />
                  <input
                    type="number"
                    value={filters.max_price}
                    onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                    className="input"
                    placeholder="تا"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.on_sale}
                    onChange={(e) => setFilters({ ...filters, on_sale: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">فقط تخفیف‌دار</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.in_stock}
                    onChange={(e) => setFilters({ ...filters, in_stock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">فقط موجود</span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium mb-2">مرتب‌سازی</label>
                <select
                  value={filters.ordering}
                  onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
                  className="input"
                >
                  <option value="-created_at">جدیدترین</option>
                  <option value="price">قیمت: کم به زیاد</option>
                  <option value="-price">قیمت: زیاد به کم</option>
                  <option value="name">نام: الف تا ی</option>
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    min_price: '',
                    max_price: '',
                    on_sale: false,
                    in_stock: false,
                    ordering: '-created_at',
                  })
                }
                className="w-full btn btn-secondary"
              >
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">محصولی یافت نشد</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">{products.length} محصول یافت شد</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
