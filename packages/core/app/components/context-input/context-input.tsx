import React, { forwardRef, useCallback, useRef } from "react"
import { ReactEditor } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import {
  ContextInputFooter,
  ContextInputHeader,
  CopyButton,
  InsertMentionsButton,
  MentionMenu,
  type MentionMenuRef,
  SlateEditor,
} from "./components"
import { ContextInputEditorContext, useContextInput, useMentions, useSlateEditor } from "./hooks"
import { contextInputTv } from "./tv"
import type { ContextInputProps, MentionItem } from "./types"

interface ContextInputComponent
  extends React.ForwardRefExoticComponent<ContextInputProps & React.RefAttributes<HTMLDivElement>> {
  CopyButton: typeof CopyButton
  Footer: typeof ContextInputFooter
  Header: typeof ContextInputHeader
  InsertMentionsButton: typeof InsertMentionsButton
}

// 主要的 ContextInput 组件
const ContextInputBase = forwardRef<HTMLDivElement, ContextInputProps>(function ContextInputBase(
  {
    value,
    placeholder = "Type someone...",
    disabled = false,
    maxLength,
    autoFocus = false,
    className,
    triggers = [],
    maxSuggestions = 10,
    variant = "default",
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
    onMentionSelect,
    renderMention,
    renderSuggestion,
    children,
    size = "default",
    minHeight = 80,
    ...props
  },
  ref,
) {
  // 创建编辑器实例
  const editor = useSlateEditor(maxLength)

  // MentionMenu ref
  const mentionMenuRef = useRef<MentionMenuRef>(null)

  const handleFocusClick = useEventCallback(() => {
    ReactEditor.focus(editor)
  })

  // 分离 header 和 footer children
  const separateChildren = useCallback(() => {
    let header: React.ReactNode = null
    let footer: React.ReactNode = null
    const otherChildren: React.ReactNode[] = []

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === ContextInputHeader) {
          header = React.cloneElement(child, {
            ...child.props,
            size: size as "default" | "large",
            handleClick: handleFocusClick,
          })
        } else if (child.type === ContextInputFooter) {
          // 自动传递 size 属性给 footer
          footer = React.cloneElement(child, {
            ...child.props,
            size: size as "default" | "large",
            handleClick: handleFocusClick,
          })
        } else {
          otherChildren.push(child)
        }
      } else {
        otherChildren.push(child)
      }
    })

    return { header, footer, otherChildren }
  }, [children, size, handleFocusClick])

  const { header, footer, otherChildren } = separateChildren()
  const hasHeader = !!header
  const hasFooter = !!footer

  // Context input 状态管理
  const { slateValue, handleChange } = useContextInput({
    value,
    onChange,
    editor,
    autoFocus,
  })

  // 处理 mention 搜索关闭
  const handleSearchClose = useCallback(() => {
    // 关闭时重新 focus 编辑器
    ReactEditor.focus(editor)
  }, [editor])

  // Mentions hook
  const mentions = useMentions({
    editor,
    triggers,
    maxSuggestions,
    onMentionSelect,
    onSearchClose: handleSearchClose,
  })

  // 键盘事件处理
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // 先尝试让 MentionMenu 处理键盘事件
      if (mentionMenuRef.current?.handleKeyDown(event)) {
        return
      }

      // 处理其他键盘事件
      onKeyDown?.(event)
    },
    [onKeyDown],
  )

  // 处理建议选择
  const handleSuggestionSelect = useCallback(
    (mention: MentionItem, index: number) => {
      mentions.selectMention(index)
    },
    [mentions],
  )

  // 获取建议位置
  const suggestionPosition = mentions.getSuggestionPosition()

  const tv = contextInputTv({ hasHeader, hasFooter, size, disabled, variant })

  return (
    <ContextInputEditorContext.Provider value={editor}>
      <div className={tv.container({ className })}>
        {header}
        <SlateEditor
          ref={ref}
          size={size}
          hasHeader={hasHeader}
          hasFooter={hasFooter}
          editor={editor}
          slateValue={slateValue}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          variant={variant}
          renderMention={renderMention}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onFocus={onFocus}
          onBlur={onBlur}
          minHeight={minHeight}
          {...props}
        >
          {otherChildren}
        </SlateEditor>
        {footer}
      </div>
      <MentionMenu
        ref={mentionMenuRef}
        isOpen={mentions.searchState.isSearching && !!suggestionPosition}
        onClose={mentions.closeMentionSearch}
        suggestions={mentions.searchState.suggestions}
        loading={mentions.searchState.loading}
        position={suggestionPosition}
        onSelect={handleSuggestionSelect}
        renderSuggestion={renderSuggestion}
      />
    </ContextInputEditorContext.Provider>
  )
})

const ContextInput = ContextInputBase as ContextInputComponent
ContextInput.Header = ContextInputHeader
ContextInput.Footer = ContextInputFooter
ContextInput.CopyButton = CopyButton
ContextInput.InsertMentionsButton = InsertMentionsButton

export { ContextInput }
