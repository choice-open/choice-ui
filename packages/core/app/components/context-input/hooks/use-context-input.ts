import { debounce } from "lodash-es"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Descendant, Editor, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import type { ContextInputValue, MentionMatch } from "../types"
import { extractMentionContext, extractTextWithMentions, parseTextWithMentions } from "../utils"

interface UseContextInputProps {
  autoFocus?: boolean
  editor?: Editor
  onChange?: (value: ContextInputValue) => void
  value?: ContextInputValue
}

export const useContextInput = ({ value, onChange, editor, autoFocus }: UseContextInputProps) => {
  const isUpdatingRef = useRef(false)

  // 内部状态
  const [slateValue, setSlateValue] = useState<Descendant[]>(() => {
    // 从 value 初始化 Slate 值
    if (value?.text) {
      return parseTextWithMentions(value.text, value.mentions || [])
    }
    return [{ type: "paragraph", children: [{ text: "" }] }]
  })

  // 监听外部 value 变化，同步到编辑器
  useEffect(() => {
    if (!editor || !value || isUpdatingRef.current) {
      return
    }

    const newSlateValue = value.text
      ? parseTextWithMentions(value.text, value.mentions || [])
      : [{ type: "paragraph", children: [{ text: "" }] }]

    // 检查是否需要更新（避免不必要的更新）
    const currentText = extractTextWithMentions(editor.children).text
    if (currentText !== value.text) {
      // 使用官方推荐的重置方法
      Editor.withoutNormalizing(editor, () => {
        // 直接替换 editor.children
        editor.children = newSlateValue as Descendant[]

        // 受控 value 改变后，始终将光标移动到最后
        const endPoint = Editor.end(editor, [])
        Transforms.select(editor, endPoint)

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

      setSlateValue(newSlateValue as Descendant[])
    }
  }, [value, editor, autoFocus])

  // 防抖的 onChange 回调
  const debouncedOnChange = useMemo(
    () =>
      debounce((newValue: ContextInputValue) => {
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

      // 使用自定义提取函数
      const { text, mentionsData } = extractTextWithMentions(newValue)
      const mentions: MentionMatch[] = []

      // 处理 mentions 数据
      for (const { element, startIndex, endIndex } of mentionsData) {
        // 提取上下文
        const context = extractMentionContext(text, startIndex, endIndex)

        mentions.push({
          item: {
            id: element.mentionId,
            type: element.mentionType,
            label: element.mentionLabel,
            metadata: element.mentionData,
          },
          startIndex,
          endIndex,
          text: element.mentionLabel,
          context: {
            fullContext: context.fullContext,
            mentionText: context.mentionText,
          },
        })
      }

      debouncedOnChange({ text, mentions })

      // 重置更新标志
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    },
    [debouncedOnChange],
  )

  return {
    slateValue,
    handleChange,
  }
}
