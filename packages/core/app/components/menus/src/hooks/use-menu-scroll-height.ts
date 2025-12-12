import { useEffect } from "react"

/**
 * Menu scroll container height setting Hook
 *
 * Ensure the scroll container is correctly set to the parent element height, as a complement to the size middleware
 * Similar logic exists in all menu components, unified extraction here
 *
 * Features:
 * - Ensure the scroll container is correctly inherited from the parent element height after opening and positioning
 * - Use requestAnimationFrame to ensure the DOM is updated, avoiding timing conflicts with the size middleware
 */

export interface MenuScrollHeightConfig {
  /** Whether to open */
  isControlledOpen: boolean
  /** Whether to be positioned */
  isPositioned: boolean
  /** Scroll container reference */
  scrollRef: React.RefObject<HTMLDivElement>
}

/**
 * Set scroll container height
 * This hook will ensure the scroll container is correctly set to the parent element height after opening and positioning
 */
export function useMenuScrollHeight(config: MenuScrollHeightConfig): void {
  const { isControlledOpen, isPositioned, scrollRef } = config

  useEffect(() => {
    if (!isControlledOpen || !isPositioned) return

    // Use requestAnimationFrame to ensure the DOM is updated, avoiding timing conflicts with the size middleware
    const rafId = requestAnimationFrame(() => {
      if (scrollRef.current) {
        const parent = scrollRef.current.parentElement
        // Only apply styles when the parent element has a height, to avoid unnecessary DOM operations
        if (parent?.style.height) {
          scrollRef.current.style.height = "100%"
          scrollRef.current.style.maxHeight = "100%"
        }
      }
    })

    return () => cancelAnimationFrame(rafId)
  }, [isControlledOpen, isPositioned, scrollRef])
}
