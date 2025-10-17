import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in Toman
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fa-IR').format(numPrice) + ' تومان';
}

// Convert Persian/Arabic numbers to English
export function toEnglishDigits(str: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  return str
    .split('')
    .map((char) => {
      const persianIndex = persianNumbers.indexOf(char);
      if (persianIndex !== -1) return persianIndex.toString();

      const arabicIndex = arabicNumbers.indexOf(char);
      if (arabicIndex !== -1) return arabicIndex.toString();

      return char;
    })
    .join('');
}

// Validate Iranian phone number
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^09[0-9]{9}$/;
  const englishPhone = toEnglishDigits(phone);
  return phoneRegex.test(englishPhone);
}

// Validate Iranian postal code
export function validatePostalCode(postalCode: string): boolean {
  const postalRegex = /^\d{10}$/;
  const englishPostal = toEnglishDigits(postalCode);
  return postalRegex.test(englishPostal);
}

// Get image URL
export function getImageUrl(path?: string): string {
  if (!path) return '/images/placeholder.png';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${path}`;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Format date in Persian
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Order status translation
export function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'در انتظار پرداخت',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل داده شده',
    cancelled: 'لغو شده',
    refunded: 'بازگشت وجه',
  };
  return statusMap[status] || status;
}

// Order status color
export function getOrderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

// Calculate discount percentage
export function calculateDiscount(price: number, salePrice: number): number {
  return Math.round(((price - salePrice) / price) * 100);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Storage helpers
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return null;
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting to storage:', error);
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },
};
