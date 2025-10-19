import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Product, Category } from '@/types';
import ProductCard from '@/components/Product/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

interface Filters {
  search: string;
  category: string;
  min_price: string;
  max_price: string;
  on_sale: boolean;
  in_stock: boolean;
  ordering: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
    on_sale: false,
    in_stock: false,
    ordering: '-created_at',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await api.products.getCategories();
      console.log('Categories response:', response);
      
      // تمام دسته‌بندی‌ها را بگیرید
      let allCategories = [];
      if (Array.isArray(response.data)) {
        allCategories = response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        allCategories = response.data.results;
      } else if (response.data) {
        allCategories = response.data;
      }

      // فقط parent categories برای select dropdown
      const parentCategories = (allCategories || []).filter(cat => !cat.parent);
      console.log('Parent categories:', parentCategories);
      
      setCategories(parentCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.on_sale) params.on_sale = 'true';
      if (filters.in_stock) params.in_stock = 'true';
      if (filters.ordering) params.ordering = filters.ordering;

      const response = await api.products.getAll(params);
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      on_sale: false,
      in_stock: false,
      ordering: '-created_at',
    });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.on_sale) count++;
    if (filters.in_stock) count++;
    return count;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">محصولات</h1>
          <p className="text-gray-600">
            {loading ? 'در حال بارگذاری...' : `${products.length} محصول یافت شد`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
        >
          <FiFilter />
          فیلترها
          {activeFiltersCount() > 0 && (
            <span className="bg-accent rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFiltersCount()}
            </span>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">فیلترها</h2>
              {activeFiltersCount() > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <FiX />
                  پاک کردن
                </button>
              )}
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

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  دسته‌بندی
                  {categoriesLoading && <span className="text-xs text-gray-400"> (در حال بارگذاری...)</span>}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="input"
                  disabled={categoriesLoading}
                >
                  <option value="">همه دسته‌بندی‌ها</option>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.parent ? `-- ${category.name}` : category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>دسته‌بندی‌ای یافت نشد</option>
                  )}
                </select>
                {!categoriesLoading && categories.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    هیچ دسته‌بندی‌ای وجود ندارد
                  </p>
                )}
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">محدوده قیمت (تومان)</label>
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.on_sale}
                    onChange={(e) => setFilters({ ...filters, on_sale: e.target.checked })}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-sm">فقط تخفیف‌دار</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.in_stock}
                    onChange={(e) => setFilters({ ...filters, in_stock: e.target.checked })}
                    className="w-4 h-4 accent-primary cursor-pointer"
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
                  <option value="-name">نام: ی تا الف</option>
                </select>
              </div>

              {/* Apply Button for Mobile */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full btn btn-primary"
              >
                اعمال فیلترها
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
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FiFilter className="text-6xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-600 mb-6">
                متأسفانه محصولی با این فیلترها پیدا نشد
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay for mobile filters */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
