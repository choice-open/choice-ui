import { useCallback, useEffect, useState } from "react"

/**
 * 处理键盘修饰键状态的钩子
 * @param disabled 是否禁用键盘监听
 * @returns 修饰键状态
 */
export function useModifierKeys(disabled: boolean = false) {
  const [shiftPressed, setShiftPressed] = useState(false)
  const [metaPressed, setMetaPressed] = useState(false)

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setShiftPressed(true)
    }
    if (e.metaKey || e.altKey) {
      setMetaPressed(true)
    }
  }, [])

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setShiftPressed(false)
    }
    if (!e.metaKey && !e.altKey) {
      setMetaPressed(false)
    }
  }, [])

  useEffect(() => {
    if (disabled) return

    document.body.addEventListener("keydown", onKeyDown)
    document.body.addEventListener("keyup", onKeyUp)
    return () => {
      document.body.removeEventListener("keydown", onKeyDown)
      document.body.removeEventListener("keyup", onKeyUp)
    }
  }, [disabled, onKeyDown, onKeyUp])

  return { shiftPressed, metaPressed }
}
