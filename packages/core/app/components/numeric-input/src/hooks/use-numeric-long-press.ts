import { useCallback, useRef } from "react"

/**
 * Hook for handling long press on numeric input increment/decrement buttons.
 * Triggers the callback immediately on press, then repeatedly after a delay.
 *
 * @param callback - Function to call on press and during long press
 * @param delay - Interval between repeated calls (default: 150ms)
 * @param initialDelay - Delay before starting repeated calls (default: 400ms)
 */
export function useNumericLongPress(callback: () => void, delay = 50, initialDelay = 400) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const onMouseDown = useCallback(() => {
    callback()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(callback, delay)
    }, initialDelay)
  }, [callback, delay, initialDelay])

  const onMouseUp = clear
  const onMouseLeave = clear

  return { onMouseDown, onMouseUp, onMouseLeave }
}
