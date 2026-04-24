'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, ProductVariant } from '@/types/product';
import type { StateStorage } from 'zustand/middleware';
import { toast } from 'sonner';

export function formatCurrencyVND(value: number) {
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat('vi-VN').format(rounded);
  return `${formatted}đ`;
}

export interface CartItem {
  lineId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  stockLimit: number | null;
  variantId?: string;
  variantName?: string;
}

type AddItemOptions = {
  unitPrice?: number;
  stockLimit?: number | null;
  variant?: ProductVariant | null;
};

interface CartState {
  cart: CartItem[];

  // Hydration guard for Next.js
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  // Actions
  addItem: (product: Product, quantity?: number, options?: AddItemOptions) => void;
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

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (product, quantity = 1, options) => {
        if (quantity <= 0) return;

        const variant = options?.variant ?? null;
        const lineId = `${product.id}:${variant?.id ?? 'default'}`;
        const stockLimit = options?.stockLimit ?? variant?.stock ?? null;
        const unitPrice = options?.unitPrice ?? variant?.price ?? product.price;
        const variantName = variant?.name;
        const addState: { status: 'added' | 'maxed' | 'out' } = { status: 'added' };

        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.lineId === lineId || item.product.id === product.id,
          );

          if (stockLimit !== null && stockLimit <= 0) {
            addState.status = 'out';
            return state;
          }

          if (existingIndex === -1) {
            const nextQuantity = stockLimit === null ? quantity : Math.min(quantity, stockLimit);
            return {
              cart: [
                ...state.cart,
                {
                  lineId,
                  product,
                  quantity: nextQuantity,
                  unitPrice,
                  stockLimit,
                  variantId: variant?.id,
                  variantName,
                },
              ],
            };
          }

          const existingItem = state.cart[existingIndex];
          const rawNextQuantity = existingItem.quantity + quantity;
          const nextQuantity =
            existingItem.stockLimit === null
              ? rawNextQuantity
              : Math.min(rawNextQuantity, existingItem.stockLimit);

          if (nextQuantity === existingItem.quantity && existingItem.stockLimit !== null) {
            addState.status = 'maxed';
            return state;
          }

          const nextCart = state.cart.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: nextQuantity }
              : item,
          );

          return { cart: nextCart };
        });

        if (addState.status === 'out') {
          toast.error('Biến thể đã hết hàng.');
          return;
        }

        if (addState.status === 'maxed') {
          toast.info(`Số lượng tối đa còn lại: ${stockLimit}`);
          return;
        }

        toast.success('Món đồ quý giá đã được thêm vào giỏ hàng của bạn.');
      },

      removeItem: (productId) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.lineId !== productId && item.product.id !== productId,
          ),
        }));
      },

      updateQuantity: (productId, quantity) => {
        const nextQuantity = Math.max(0, Math.floor(quantity));

        set((state) => {
          const existing = state.cart.find(
            (item) => item.lineId === productId || item.product.id === productId,
          );
          if (!existing) return state;

          const boundedQuantity =
            existing.stockLimit === null
              ? nextQuantity
              : Math.min(nextQuantity, existing.stockLimit);

          if (nextQuantity === 0) {
            return {
              cart: state.cart.filter(
                (item) => item.lineId !== productId && item.product.id !== productId,
              ),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.lineId === productId || item.product.id === productId
                ? { ...item, quantity: boundedQuantity }
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
          (sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity,
          0,
        );
      },
    }),
    {
      name: 'dang-y-cart',
      storage: createJSONStorage((): StateStorage => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return window.localStorage;
      }),
      partialize: (state) => ({ cart: state.cart }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
