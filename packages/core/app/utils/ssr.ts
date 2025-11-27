/**
 * Check if code is running in browser environment
 */
export const isBrowser = typeof window !== "undefined"

/**
 * SSR-safe window access helper
 */
export function getWindow(): Window | undefined {
  return isBrowser ? window : undefined
}

/**
 * SSR-safe document access helper
 */
export function getDocument(): Document | undefined {
  return isBrowser ? document : undefined
}
