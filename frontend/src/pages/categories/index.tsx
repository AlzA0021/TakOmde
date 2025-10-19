import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Category } from '@/types';
import { FiChevronLeft } from 'react-icons/fi';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.products.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // گروه‌بندی دسته‌بندی‌ها بر اساس parent - اصلاح شده
  const parentCategories = categories?.filter(cat => !cat.parent) || [];
  const childCategories = categories?.filter(cat => cat.parent) || [];

  const getChildrenForParent = (parentId: number) => {
    return childCategories.filter(cat => cat.parent === parentId);
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">دسته‌بندی محصولات</h1>
        <p className="text-gray-600">محصولات مورد نظر خود را از دسته‌بندی‌های مختلف انتخاب کنید</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">دسته‌بندی‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Parent Categories with Children */}
          {parentCategories.map((parent) => {
            const children = getChildrenForParent(parent.id);
            
            return (
              <div key={parent.id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Parent Category Header */}
                <Link
                  href={`/categories/${parent.slug}`}
                  className="group flex items-center justify-between mb-4 hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{parent.name[0]}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{parent.name}</h2>
                      {parent.description && (
                        <p className="text-sm text-gray-600">{parent.description}</p>
                      )}
                    </div>
                  </div>
                  <FiChevronLeft className="text-xl group-hover:translate-x-[-4px] transition-transform" />
                </Link>

                {/* Children Categories */}
                {children.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">{child.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {child.name}
                          </p>
                          {child.product_count !== undefined && (
                            <p className="text-xs text-gray-500">
                              {child.product_count} محصول
                            </p>
                          )}
                        </div>
                        <FiChevronLeft className="text-gray-400 flex-shrink-0 group-hover:translate-x-[-2px] transition-transform" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* All Categories Grid (if no hierarchy) */}
          {parentCategories.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">{category.name[0]}</span>
                  </div>
                  <h3 className="font-bold mb-1">{category.name}</h3>
                  {category.product_count !== undefined && (
                    <p className="text-sm text-gray-500">{category.product_count} محصول</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
