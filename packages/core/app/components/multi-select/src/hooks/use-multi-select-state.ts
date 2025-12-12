import { useEffect, useState } from "react"

export interface UseMultiSelectStateProps {
  controlledOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useMultiSelectState({ controlledOpen, onOpenChange }: UseMultiSelectStateProps) {
  const [open, setOpen] = useState(false)
  const [touch, setTouch] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)

  // Auto clear validation message
  useEffect(() => {
    if (validationMessage) {
      const timeout = setTimeout(() => {
        setValidationMessage(null)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [validationMessage])

  // Merge controlled and uncontrolled open state
  const isControlledOpen = controlledOpen !== undefined ? controlledOpen : open

  return {
    open,
    setOpen,
    touch,
    setTouch,
    scrollTop,
    setScrollTop,
    activeIndex,
    setActiveIndex,
    validationMessage,
    setValidationMessage,
    isControlledOpen,
  }
}
