'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

export function formatCurrencyVND(value: number) {
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat('vi-VN').format(rounded);
  return `${formatted}đ`;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cart: CartItem[];

  // Wishlist (persisted)
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalWishlistItems: () => number;

  // UI state (not persisted)
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Hydration guard for Next.js
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Derived (computed via get() for performance)
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      wishlistIds: [],
      toggleWishlist: (productId) => {
        if (!productId) return;

        set((state) => {
          const exists = state.wishlistIds.includes(productId);
          const nextWishlistIds = exists
            ? state.wishlistIds.filter((id) => id !== productId)
            : [...state.wishlistIds, productId];

          return { wishlistIds: nextWishlistIds };
        });
      },
      isWishlisted: (productId) => {
        return get().wishlistIds.includes(productId);
      },
      totalWishlistItems: () => {
        return get().wishlistIds.length;
      },

      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (product, quantity = 1) => {
        if (quantity <= 0) return;

        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.product.id === product.id,
          );

          if (existingIndex === -1) {
            return {
              cart: [...state.cart, { product, quantity }],
              isCartOpen: true,
            };
          }

          const nextCart = state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );

          return { cart: nextCart, isCartOpen: true };
        });

        toast.success('Món đồ quý giá đã được thêm vào giỏ hàng của bạn.');
      },

      removeItem: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        const nextQuantity = Math.max(0, Math.floor(quantity));

        set((state) => {
          if (nextQuantity === 0) {
            return {
              cart: state.cart.filter((item) => item.product.id !== productId),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: nextQuantity }
                : item,
            ),
          };
        });
      },

      clearCart: () => set({ cart: [] }),

      totalItems: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: 'dang-y-cart',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return undefined as any;
        return window.localStorage;
      }),
      partialize: (state) => ({ cart: state.cart, wishlistIds: state.wishlistIds }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
