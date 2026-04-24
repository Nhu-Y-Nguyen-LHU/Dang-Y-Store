'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalWishlistItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
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
    }),
    {
      name: 'dang-y-wishlist',
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
      partialize: (state) => ({ wishlistIds: state.wishlistIds }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
