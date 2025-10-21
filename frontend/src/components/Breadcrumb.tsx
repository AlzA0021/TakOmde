import Link from 'next/link';
import { FiHome, FiChevronLeft } from 'react-icons/fi';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 py-4" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-primary transition-colors"
        aria-label="خانه"
      >
        <FiHome className="w-4 h-4" />
        <span>خانه</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FiChevronLeft className="w-4 h-4 text-gray-400" />

          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
