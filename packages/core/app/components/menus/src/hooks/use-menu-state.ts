import { useState, useId, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"

/**
 * Basic menu state management Hook
 *
 * Handle common state for all menu components:
 * - open/close state and controlled logic
 * - activeIndex state
 * - touch interaction state
 * - scrollTop state
 * - Unique ID generation
 * - State change callback
 */

export interface MenuStateConfig {
  /** Whether to disable */
  disabled?: boolean
  /** Open state change callback */
  onOpenChange?: (open: boolean) => void
  /** Controlled open state */
  open?: boolean
}

export interface MenuStateResult {
  activeIndex: number | null
  // Handle function
  handleOpenChange: (newOpen: boolean) => void
  isControlledOpen: boolean
  // Unique identifier
  menuId: string
  // State
  open: boolean

  scrollTop: number
  setActiveIndex: (index: number | null) => void
  // State setting function
  setOpen: (open: boolean) => void
  setScrollTop: (scrollTop: number) => void

  setTouch: (touch: boolean) => void

  touch: boolean
  triggerId: string
}

export function useMenuState(config: MenuStateConfig = {}): MenuStateResult {
  const { open: controlledOpen, onOpenChange, disabled = false } = config

  // Basic state
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [touch, setTouch] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  // Unique ID generation
  const baseId = useId()
  const menuId = `menu-${baseId}`
  const triggerId = `trigger-${baseId}`

  // Controlled/uncontrolled state merge
  const isControlledOpen = controlledOpen !== undefined ? controlledOpen : open

  // State change handling - use useEventCallback to ensure stable references
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    // If the component is disabled, do not allow opening
    if (disabled && newOpen) {
      return
    }

    // Update uncontrolled state
    if (controlledOpen === undefined) {
      setOpen(newOpen)
    }

    // Trigger callback
    onOpenChange?.(newOpen)
  })

  // Return state and handle function
  const result: MenuStateResult = useMemo(
    () => ({
      // State
      open,
      activeIndex,
      touch,
      scrollTop,
      isControlledOpen,

      // State setting function
      setOpen,
      setActiveIndex,
      setTouch,
      setScrollTop,

      // Handle function
      handleOpenChange,

      // Unique identifier
      menuId,
      triggerId,
    }),
    [open, activeIndex, touch, scrollTop, isControlledOpen, handleOpenChange, menuId, triggerId],
  )

  return result
}
