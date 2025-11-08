import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          Cookies.set('access_token', access);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle other errors
    const status = error.response?.status;
    if (status === 403) {
      toast.error('شما دسترسی به این بخش ندارید');
    } else if (status === 404) {
      toast.error('مورد درخواستی یافت نشد');
    } else if (status && status >= 500) {
      toast.error('خطای سرور. لطفاً بعداً تلاش کنید');
    }

    return Promise.reject(error);
  }
);

export default client;

// API Methods
export const api = {
  // Auth
  auth: {
    login: (data: { username: string; password: string }) =>
      client.post('/auth/login/', data),
    register: (data: any) => client.post('/auth/register/', data),
    getProfile: () => client.get('/auth/profile/'),
    updateProfile: (data: any) => client.put('/auth/profile/', data),
    changePassword: (data: any) => client.post('/auth/change-password/', data),

    // Addresses
    getAddresses: () => client.get('/auth/addresses/'),
    createAddress: (data: any) => client.post('/auth/addresses/', data),
    updateAddress: (id: number, data: any) => client.put(`/auth/addresses/${id}/`, data),
    deleteAddress: (id: number) => client.delete(`/auth/addresses/${id}/`),
    setDefaultAddress: (id: number) => client.post(`/auth/addresses/${id}/set_default/`),
  },

  // Products
  products: {
    getAll: (params?: any) => client.get('/products/products/', { params }),
    getBySlug: (slug: string) => client.get(`/products/products/${slug}/`),
    getFeatured: () => client.get('/products/products/featured/'),
    getOnSale: () => client.get('/products/products/on_sale/'),
    getCategories: () => client.get('/products/categories/'),
    getCategoryBySlug: (slug: string) => client.get(`/products/categories/${slug}/`),
    search: (query: string) => client.get('/products/products/', { params: { search: query } }),
  },

  // Cart
  cart: {
    get: () => client.get('/orders/cart/'),
    addItem: (data: { product_id: number; quantity: number }) =>
      client.post('/orders/cart/add_item/', data),
    updateItem: (data: { item_id: number; quantity: number }) =>
      client.post('/orders/cart/update_item/', data),
    removeItem: (data: { item_id: number }) =>
      client.post('/orders/cart/remove_item/', data),
    clear: () => client.post('/orders/cart/clear/'),
  },

  // Orders
  orders: {
    getAll: () => client.get('/orders/orders/'),
    getById: (id: number) => client.get(`/orders/orders/${id}/`),
    create: (data: any) => client.post('/orders/orders/', data),
  },

  // Payments
  payments: {
    request: (data: { order_id: number; payment_method: string }) =>
      client.post('/payments/request/', data),
    verify: (params: any) => client.get('/payments/verify/', { params }),
  },

  // Wishlist
  wishlist: {
    get: () => client.get('/orders/wishlist/'),
    add: (productId: number) => client.post('/orders/wishlist/add/', { product_id: productId }),
    remove: (productId: number) => client.post('/orders/wishlist/remove/', { product_id: productId }),
  },
};