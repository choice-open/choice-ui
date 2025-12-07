import { useRef, useState, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import type { MentionItemProps, UseMentionsOptions } from "../types"

const EMPTY_ITEMS: MentionItemProps[] = []

export function useMarkdownMentions({
  items = EMPTY_ITEMS,
  onSelect,
  onChange,
  disabled,
  readOnly,
}: UseMentionsOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [query, setQuery] = useState("")
  const [mentionStart, setMentionStart] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const filteredItems = useMemo(() => {
    // 如果没有 items，直接返回空数组（缓存的引用）
    if (!items || items.length === 0) {
      return EMPTY_ITEMS
    }

    if (!query.trim()) {
      return items
    }

    const lowerQuery = query.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) || item.id.toLowerCase().includes(lowerQuery),
    )
  }, [items, query])

  const getCaretCoordinates = useEventCallback(
    (textarea: HTMLTextAreaElement, position: number) => {
      // 创建一个隐藏的 div 来模拟 textarea 的布局
      const div = document.createElement("div")
      const style = getComputedStyle(textarea)

      // 复制所有影响布局的样式属性
      const properties = [
        "direction",
        "boxSizing",
        "width",
        "height",
        "overflowX",
        "overflowY",
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "borderStyle",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "fontStyle",
        "fontVariant",
        "fontWeight",
        "fontStretch",
        "fontSize",
        "fontSizeAdjust",
        "lineHeight",
        "fontFamily",
        "textAlign",
        "textTransform",
        "textIndent",
        "textDecoration",
        "letterSpacing",
        "wordSpacing",
        "tabSize",
        "MozTabSize",
      ]

      properties.forEach((prop) => {
        div.style.setProperty(prop, style.getPropertyValue(prop))
      })

      // 设置定位和可见性
      div.style.position = "absolute"
      div.style.visibility = "hidden"
      div.style.whiteSpace = "pre-wrap"
      div.style.wordWrap = "break-word"
      div.style.overflow = "hidden"

      // 设置宽度为 textarea 的 clientWidth（不包括滚动条）
      div.style.width = `${textarea.clientWidth}px`

      // 将文本内容分割为光标前和光标后
      const textBefore = textarea.value.substring(0, position)
      const textAfter = textarea.value.substring(position)

      // 创建光标标记元素
      const marker = document.createElement("span")
      marker.style.width = "1px"
      marker.style.height = "1px"
      marker.style.display = "inline-block"
      marker.textContent = "\u200B" // 零宽空格，用于标记位置

      // 构建内容：光标前的文本 + 标记 + 光标后的文本
      div.textContent = textBefore
      div.appendChild(marker)
      if (textAfter) {
        const afterSpan = document.createElement("span")
        afterSpan.textContent = textAfter
        div.appendChild(afterSpan)
      }

      // 添加到 DOM 以计算位置
      document.body.appendChild(div)

      // 获取位置信息
      const textareaRect = textarea.getBoundingClientRect()
      const markerRect = marker.getBoundingClientRect()
      const divRect = div.getBoundingClientRect()

      // 计算光标位置
      // x: textarea 左边缘 + 标记相对于 div 的偏移（考虑 padding）+ 8px 偏移（露出 @ 符号）
      // y: textarea 顶部 + 标记相对于 div 的垂直偏移 + 行高
      // 注意：markerRect 是相对于 viewport 的，divRect 也是相对于 viewport 的
      // 所以 markerRect.left - divRect.left 就是标记相对于 div 的偏移
      const coordinates = {
        x: textareaRect.left + (markerRect.left - divRect.left) + 8, // 右侧偏移 8px，露出 @ 符号
        y:
          textareaRect.top +
          (markerRect.top - divRect.top) +
          markerRect.height +
          window.scrollY +
          8, // 添加8px间距（4px + 4px）和scrollY
      }

      // 清理
      document.body.removeChild(div)

      return coordinates
    },
  )

  const handleInputChange = useEventCallback(
    (value: string, textarea: HTMLTextAreaElement, onChange?: (value: string) => void) => {
      if (disabled || readOnly) {
        return
      }

      const cursorPosition = textarea.selectionStart
      const textBeforeCursor = value.substring(0, cursorPosition)

      const match = textBeforeCursor.match(/@(\w*)$/)

      if (match) {
        const start = cursorPosition - match[0].length
        setMentionStart(start)
        setQuery(match[1] || "")

        const coordinates = getCaretCoordinates(textarea, cursorPosition)
        setPosition(coordinates)
        setIsOpen(true)
      } else {
        setIsOpen(false)
        setQuery("")
        setMentionStart(null)
        setPosition(null)
      }

      onChange?.(value)
    },
  )

  const handleSelect = useEventCallback((item: MentionItemProps) => {
    if (!textareaRef.current || mentionStart === null) {
      return
    }

    const textarea = textareaRef.current
    const value = textarea.value
    const cursorPosition = textarea.selectionStart

    const textBeforeMention = value.substring(0, mentionStart)
    const textAfterCursor = value.substring(cursorPosition)

    const insertText = onSelect ? onSelect(item, query) : `@${item.label} `

    const newValue = textBeforeMention + insertText + textAfterCursor
    const newCursorPosition = textBeforeMention.length + insertText.length

    setIsOpen(false)
    setQuery("")
    setMentionStart(null)
    setPosition(null)

    onChange?.(newValue)

    textarea.value = newValue
    textarea.setSelectionRange(newCursorPosition, newCursorPosition)

    const inputEvent = new Event("input", { bubbles: true, cancelable: true })
    textarea.dispatchEvent(inputEvent)

    setTimeout(() => {
      textarea.focus()
    }, 0)
  })

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen || disabled || readOnly) {
      return
    }

    const isIMEComposing = event.nativeEvent.isComposing || event.keyCode === 229
    if (isIMEComposing) {
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      closeMentionSearch()
    }
  })

  const closeMentionSearch = useEventCallback(() => {
    setIsOpen(false)
    setQuery("")
    setMentionStart(null)
    setPosition(null)
  })

  return {
    isOpen,
    position,
    query,
    filteredItems,
    handleInputChange,
    handleSelect,
    handleKeyDown,
    closeMentionSearch,
    setTextareaRef: (ref: HTMLTextAreaElement | null) => {
      textareaRef.current = ref
    },
  }
}
