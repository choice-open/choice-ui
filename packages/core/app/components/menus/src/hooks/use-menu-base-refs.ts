import { useRef } from "react"

/**
 * Menu base refs management Hook
 *
 * Unified management of all base refs needed by menu components:
 * - scrollRef: scroll container reference
 * - elementsRef: menu item element reference array
 * - labelsRef: menu item label reference array (for typeahead)
 * - selectTimeoutRef: select delay timer reference
 *
 * These refs are used in multiple components, unified management can maintain consistency
 */

export interface MenuBaseRefsResult {
  /** Menu item element reference array */
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>
  /** Menu item label reference array (for typeahead) */
  labelsRef: React.MutableRefObject<Array<string | null>>
  /** Scroll container reference */
  scrollRef: React.RefObject<HTMLDivElement>
  /** Select delay timer reference */
  selectTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>
}

/**
 * Create menu base refs
 */
export function useMenuBaseRefs(): MenuBaseRefsResult {
  const scrollRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<Array<HTMLElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  return {
    scrollRef,
    elementsRef,
    labelsRef,
    selectTimeoutRef,
  }
}
