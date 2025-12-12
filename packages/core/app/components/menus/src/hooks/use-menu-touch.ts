import { useCallback } from "react"
import { useEventCallback } from "usehooks-ts"

/**
 * Menu touch interaction Hook
 *
 * Handle menu component touch interaction logic:
 * - Touch state detection
 * - Touch start event handling
 * - Pointer move event handling
 * - Touch-related event handlers
 */

export interface MenuTouchConfig {
  /** Set touch state */
  setTouch: (touch: boolean) => void
  /** Touch state */
  touch: boolean
}

export interface MenuTouchResult {
  /** Get touch-related reference properties */
  getTouchProps: () => {
    onPointerMove: (event: React.PointerEvent) => void
    onTouchStart: () => void
  }
  /** Pointer move event handler */
  handlePointerMove: (event: React.PointerEvent) => void
  /** Touch start event handler */
  handleTouchStart: () => void
}

export function useMenuTouch(config: MenuTouchConfig): MenuTouchResult {
  const { touch, setTouch } = config

  // Touch start handling - use useEventCallback to ensure stable references
  const handleTouchStart = useEventCallback(() => {
    if (!touch) {
      setTouch(true)
    }
  })

  // Pointer move handling - differentiate touch and non-touch input
  const handlePointerMove = useEventCallback((event: React.PointerEvent) => {
    // If it is not a touch input, update the state
    if (event.pointerType !== "touch" && touch) {
      setTouch(false)
    }
  })

  // Get touch-related properties - use useCallback instead of useEventCallback
  const getTouchProps = useCallback(
    () => ({
      onTouchStart: handleTouchStart,
      onPointerMove: handlePointerMove,
    }),
    [handleTouchStart, handlePointerMove],
  )

  return {
    handleTouchStart,
    handlePointerMove,
    getTouchProps,
  }
}
