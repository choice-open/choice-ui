import { useRef } from "react"

export function useDisableScroll({ ref }: { ref: React.RefObject<HTMLDivElement> }) {
  const isFocusRef = useRef(false)
  const isMouseEnterRef = useRef(false)
  const styleRef = useRef<HTMLElement>()
  const styleOverFlowRef = useRef<string>()

  const disableScroll = () => {
    if (isMouseEnterRef.current && isFocusRef.current) {
      const m = (el: HTMLElement | null | undefined) => {
        const parent = el?.parentElement
        const grandParent = parent?.parentElement
        if (parent && grandParent) {
          const parentRect = parent.getBoundingClientRect()
          const grandParentRect = grandParent.getBoundingClientRect()

          if (parentRect.height <= grandParentRect.height) {
            m(parent)
          } else {
            styleRef.current = grandParent
            styleOverFlowRef.current = grandParent.style.overflow
            grandParent.style.overflow = "hidden"
          }
        }
      }
      m(ref.current)
    }
  }

  const enableScroll = () => {
    if (styleRef.current) {
      styleRef.current.style.overflow = styleOverFlowRef.current ?? "default"
    }
  }

  return {
    disableScrollProps: {
      onFocus: () => {
        isFocusRef.current = true
        disableScroll()
      },
      onBlur: () => {
        isFocusRef.current = false
        enableScroll()
      },
      onMouseEnter: () => {
        isMouseEnterRef.current = true
        disableScroll()
      },
      onMouseLeave: () => {
        isMouseEnterRef.current = false
        enableScroll()
      },
    },
  }
}
