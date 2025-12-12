import { useRef, useMemo } from "react"
import type { SideObject } from "@floating-ui/react"

/**
 * Menu reference management Hook
 *
 * Unify the management of all references needed in menu components:
 * - Scroll container reference
 * - List item reference array
 * - List content reference array
 * - Timer reference
 * - Select specific reference (overflow, allowSelect, etc.)
 */

export interface MenuRefsConfig {
  /** Whether to use Select type (requires additional selection related references) */
  isSelect?: boolean
}

export interface MenuRefsResult {
  allowMouseUpRef?: React.MutableRefObject<boolean>
  allowSelectRef?: React.MutableRefObject<boolean>
  // Utility functions
  clearSelectTimeout: () => void

  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>

  labelsRef: React.MutableRefObject<Array<string | null>>
  // Select specific reference (only exists when isSelect=true)
  overflowRef?: React.MutableRefObject<SideObject | null>
  resetRefs: () => void

  // General reference - use MutableRefObject to be compatible with FloatingUI
  scrollRef: React.MutableRefObject<HTMLDivElement | null>
  // Timer reference
  selectTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>
}

export function useMenuRefs(config: MenuRefsConfig = {}): MenuRefsResult {
  const { isSelect = false } = config

  // General reference - use MutableRefObject to be compatible with FloatingUI
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const elementsRef = useRef<Array<HTMLElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  // Select specific reference
  const overflowRef = useRef<SideObject | null>(null)
  const allowSelectRef = useRef<boolean>(false)
  const allowMouseUpRef = useRef<boolean>(true)

  // Utility functions
  const clearSelectTimeout = () => {
    if (selectTimeoutRef.current) {
      clearTimeout(selectTimeoutRef.current)
      selectTimeoutRef.current = undefined
    }
  }

  const resetRefs = () => {
    // Clear timer
    clearSelectTimeout()

    // Reset array references
    elementsRef.current = []
    labelsRef.current = []

    // Reset Select specific reference
    if (isSelect) {
      if (allowSelectRef.current) {
        allowSelectRef.current = false
      }
      if (!allowMouseUpRef.current) {
        allowMouseUpRef.current = true
      }
    }
  }

  // Build result object
  const result: MenuRefsResult = useMemo(() => {
    const baseResult = {
      // General reference
      scrollRef,
      elementsRef,
      labelsRef,
      selectTimeoutRef,

      // Utility functions
      clearSelectTimeout,
      resetRefs,
    }

    // If Select type, add additional references
    if (isSelect) {
      return {
        ...baseResult,
        overflowRef,
        allowSelectRef,
        allowMouseUpRef,
      }
    }

    return baseResult
  }, [isSelect])

  return result
}
