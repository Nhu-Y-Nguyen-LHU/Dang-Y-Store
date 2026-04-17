'use client';

import { useEffect, useState } from 'react';

/**
 * Generic hydration guard: returns true after the first client effect.
 * Useful to avoid SSR/CSR mismatch when reading localStorage-backed state.
 */
export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
}
