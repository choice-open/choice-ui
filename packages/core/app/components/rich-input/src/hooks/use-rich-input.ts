import { debounce } from "lodash-es"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Descendant, Editor, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import type { UseRichInputProps } from "../types"

/**
 * Rich Input 受控组件逻辑处理
 * 参考 context-input 的实现，解决 Slate 非受控组件的问题
 */
export const useRichInput = ({
  value,
  onChange,
  editor,
  autoFocus,
  autoMoveToEnd,
}: UseRichInputProps) => {
  const isUpdatingRef = useRef(false)

  // 内部状态 - 跟踪 Slate 编辑器的值
  const [slateValue, setSlateValue] = useState<Descendant[]>(() => {
    return value || ([{ type: "paragraph", children: [{ text: "" }] }] as unknown as Descendant[])
  })

  // 监听外部 value 变化，同步到编辑器
  useEffect(() => {
    if (!editor || !value || isUpdatingRef.current) {
      return
    }

    // 检查是否需要更新（避免不必要的更新）
    const needsUpdate = JSON.stringify(editor.children) !== JSON.stringify(value)

    if (needsUpdate) {
      // 使用官方推荐的重置方法
      Editor.withoutNormalizing(editor, () => {
        // 直接替换 editor.children
        editor.children = value

        // 根据 autoMoveToEnd 决定光标位置
        if (autoMoveToEnd) {
          // 将光标移动到最后
          const endPoint = Editor.end(editor, [])
          Transforms.select(editor, endPoint)
        }

        // 触发变化事件以更新视图
        editor.onChange()
      })

      // 如果开启了 autoFocus，在更新后重新聚焦
      if (autoFocus) {
        // 使用 setTimeout 确保 DOM 更新后再聚焦
        setTimeout(() => {
          ReactEditor.focus(editor)
        }, 0)
      }

      setSlateValue(value)
    }
  }, [value, editor, autoFocus, autoMoveToEnd])

  // 防抖的 onChange 回调，避免频繁触发
  const debouncedOnChange = useMemo(
    () =>
      debounce((newValue: Descendant[]) => {
        onChange?.(newValue)
      }, 100),
    [onChange],
  )

  // 处理编辑器值变化
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      // 防止循环更新
      isUpdatingRef.current = true

      setSlateValue(newValue)

      // 调用外部 onChange
      debouncedOnChange(newValue)

      // 重置更新标志
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    },
    [debouncedOnChange],
  )

  // 优化的 onChange 处理函数，使用 useEventCallback
  const optimizedHandleChange = useEventCallback((newValue: Descendant[]) => {
    handleChange(newValue)
  })

  return {
    slateValue,
    handleChange: optimizedHandleChange,
  }
}
