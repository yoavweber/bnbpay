"use client"

/**
 * Executes early in the client bundle to ensure wallet libraries
 * don't hit undefined browser APIs (e.g. Safari private mode).
 */
if (typeof window !== "undefined") {
  try {
    const key = "__bnbpay_polyfill__"
    window.localStorage?.setItem?.(key, "1")
    window.localStorage?.removeItem?.(key)
  } catch {
    // Ignore storage failures; downstream libs will check availability.
  }

  if (!("globalThis" in window)) {
    (window as typeof window & { globalThis?: typeof window }).globalThis = window
  }
}
