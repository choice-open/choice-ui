import { useState, useCallback, useEffect } from "react"

/**
 * 处理键盘修饰键状态的钩子
 * @param disabled 是否禁用键盘监听
 * @returns 修饰键状态
 */
export function useModifierKeys(disabled: boolean = false) {
  const [shiftPressed, setShiftPressed] = useState(false)
  const [metaPressed, setMetaPressed] = useState(false)
  const [ctrlPressed, setCtrlPressed] = useState(false)

  // 使用更可靠的方法检测修饰键状态
  const updateModifierStates = useCallback((e: KeyboardEvent | MouseEvent) => {
    setShiftPressed(e.shiftKey)
    setMetaPressed(e.metaKey || e.altKey)
    setCtrlPressed(e.ctrlKey)
  }, [])

  // 处理键盘事件
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      updateModifierStates(e)
    },
    [updateModifierStates],
  )

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      updateModifierStates(e)
    },
    [updateModifierStates],
  )

  // 处理鼠标事件，确保在点击时也能更新状态
  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      updateModifierStates(e)
    },
    [updateModifierStates],
  )

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      updateModifierStates(e)
    },
    [updateModifierStates],
  )

  // 处理焦点事件，确保在焦点变化时也能更新状态
  const onFocus = useCallback(
    (e: FocusEvent) => {
      // 当元素获得焦点时，检查当前的修饰键状态
      if (e.target instanceof HTMLElement) {
        // 创建一个虚拟事件来获取当前状态
        const virtualEvent = new KeyboardEvent("keydown", {
          shiftKey: false,
          metaKey: false,
          ctrlKey: false,
          altKey: false,
        })
        updateModifierStates(virtualEvent)
      }
    },
    [updateModifierStates],
  )

  // 处理窗口失去焦点事件，重置所有修饰键状态
  const onBlur = useCallback(() => {
    setShiftPressed(false)
    setMetaPressed(false)
    setCtrlPressed(false)
  }, [])

  useEffect(() => {
    if (disabled) return

    // 使用 window 而不是 document.body，确保能捕获所有事件
    window.addEventListener("keydown", onKeyDown, true)
    window.addEventListener("keyup", onKeyUp, true)
    window.addEventListener("mousedown", onMouseDown, true)
    window.addEventListener("mouseup", onMouseUp, true)
    window.addEventListener("focus", onFocus, true)
    window.addEventListener("blur", onBlur, true)

    return () => {
      window.removeEventListener("keydown", onKeyDown, true)
      window.removeEventListener("keyup", onKeyUp, true)
      window.removeEventListener("mousedown", onMouseDown, true)
      window.removeEventListener("mouseup", onMouseUp, true)
      window.removeEventListener("focus", onFocus, true)
      window.removeEventListener("blur", onBlur, true)
    }
  }, [disabled, onKeyDown, onKeyUp, onMouseDown, onMouseUp, onFocus, onBlur])

  return { shiftPressed, metaPressed, ctrlPressed }
}
