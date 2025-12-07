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

  // 自动清空验证消息
  useEffect(() => {
    if (validationMessage) {
      const timeout = setTimeout(() => {
        setValidationMessage(null)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [validationMessage])

  // 合并受控与非受控打开状态
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
