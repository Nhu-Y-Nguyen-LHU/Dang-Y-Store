'use client';

import { useSyncExternalStore } from 'react';

/**
 * Generic hydration guard: returns true after the first client effect.
 * Useful to avoid SSR/CSR mismatch when reading localStorage-backed state.
 */
export function useHasHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
