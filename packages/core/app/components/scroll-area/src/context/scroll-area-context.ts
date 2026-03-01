import { createContext, useContext } from "react"
import type {
  ScrollAreaConfigContextType,
  ScrollAreaContextType,
  ScrollAreaStateContextType,
} from "../types"

export const ScrollAreaStateContext = createContext<ScrollAreaStateContextType | null>(null)
export const ScrollAreaConfigContext = createContext<ScrollAreaConfigContextType | null>(null)

const ERROR_MESSAGE = "ScrollArea compound components must be used within ScrollArea"

/**
 * Access only the frequently-changing state (scrollState, isHovering, isScrolling).
 * Use this in components that need to react to scroll position changes.
 */
export function useScrollAreaStateContext() {
  const context = useContext(ScrollAreaStateContext)
  if (!context) {
    throw new Error(ERROR_MESSAGE)
  }
  return context
}

/**
 * Access only the rarely-changing config (orientation, setters, refs, IDs).
 * Use this in components that do NOT need scrollState — they won't re-render on scroll.
 */
export function useScrollAreaConfigContext() {
  const context = useContext(ScrollAreaConfigContext)
  if (!context) {
    throw new Error(ERROR_MESSAGE)
  }
  return context
}

/**
 * Combined hook for components that need both state and config (Scrollbar, Thumb, Corner).
 * Maintains backward compatibility with existing useScrollAreaContext() usage.
 */
export function useScrollAreaContext(): ScrollAreaContextType {
  const state = useScrollAreaStateContext()
  const config = useScrollAreaConfigContext()
  return { ...state, ...config }
}
