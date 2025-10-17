import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Cart, Wishlist } from '@/types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearCart: () => set({ cart: null }),
}));

interface WishlistState {
  wishlist: Wishlist | null;
  setWishlist: (wishlist: Wishlist | null) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: null,
  setWishlist: (wishlist) => set({ wishlist }),
}));

interface UIState {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  toggleSidebar: () => void;
  toggleCart: () => void;
  toggleSearch: () => void;
  closeSidebar: () => void;
  closeCart: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
