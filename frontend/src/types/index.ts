// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  avatar?: string;
  is_verified: boolean;
  created_at: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  short_description?: string;
  category: number;
  category_name: string;
  price: string;
  sale_price?: string;
  final_price: string;
  discount_percentage: number;
  stock_quantity: number;
  is_in_stock: boolean;
  is_low_stock?: boolean;
  is_on_sale: boolean;
  is_featured: boolean;
  unit: string;
  weight?: string;
  primary_image?: string;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  reviews?: Review[];
  average_rating?: number;
  reviews_count?: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
}

export interface ProductAttribute {
  id: number;
  attribute: number;
  attribute_name: string;
  value: string;
}

export interface Review {
  id: number;
  user: number;
  user_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: number;
  children?: Category[];
  is_active: boolean;
  created_at: string;
}

// Cart Types
export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_items: number;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_detail: Product;
  quantity: number;
  unit_price: string;
  subtotal: string;
  created_at: string;
}

// Wishlist Types
export interface Wishlist {
  id: number;
  user: number;
  products: Product[];
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: number;
  order_number: string;
  user: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_phone: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  discount: string;
  total: string;
  status: OrderStatus;
  notes?: string;
  admin_notes?: string;
  is_paid: boolean;
  paid_at?: string;
  payment_method?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_sku: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
  created_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Address Types
export interface Address {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface Payment {
  id: number;
  order: number;
  order_number: string;
  gateway: PaymentGateway;
  amount: string;
  status: PaymentStatus;
  authority?: string;
  ref_id?: string;
  tracking_code?: string;
  created_at: string;
  paid_at?: string;
}

export type PaymentGateway = 'zarinpal' | 'paypint' | 'saman' | 'mellat';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

// Pagination Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface CheckoutForm {
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_phone: string;
  notes?: string;
  payment_method: PaymentGateway;
}
