import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { ReactEditor } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import {
  ContextInputFooter,
  ContextInputHeader,
  CopyButton,
  InsertMentionsButton,
  Mention,
  MentionMenu,
  type MentionMenuRef,
  SlateEditor,
} from "./components"
import { ContextInputEditorContext, useContextInput, useMentions, useSlateEditor } from "./hooks"
import { contextInputTv } from "./tv"
import type { ContextInputProps, ContextInputRef, MentionItem } from "./types"

interface ContextInputComponent
  extends React.ForwardRefExoticComponent<
    ContextInputProps & React.RefAttributes<ContextInputRef>
  > {
  CopyButton: typeof CopyButton
  Footer: typeof ContextInputFooter
  Header: typeof ContextInputHeader
  InsertMentionsButton: typeof InsertMentionsButton
  Mention: typeof Mention
}

// 主要的 ContextInput 组件
const ContextInputBase = forwardRef<ContextInputRef, ContextInputProps>(function ContextInputBase(
  {
    value,
    placeholder = "Type someone...",
    disabled = false,
    readOnly = false,
    maxLength,
    autoFocus = false,
    className,
    customMentionComponent,
    triggers = [],
    maxSuggestions = 10,
    variant = "default",
    mentionPrefix = "@",
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
    afterElement,
    beforeElement,
    root,
    ...props
  },
  ref,
) {
  // 创建编辑器实例
  const editor = useSlateEditor(maxLength)

  // MentionMenu ref
  const mentionMenuRef = useRef<MentionMenuRef>(null)

  // 暴露 focus 方法给外部
  useImperativeHandle(ref, () => ({
    focus: () => {
      ReactEditor.focus(editor)
    },
  }))

  const handleFocusClick = useEventCallback(() => {
    ReactEditor.focus(editor)
  })

  // 分离 header 和 footer children - 使用 useMemo 优化性能
  const { header, footer, otherChildren } = useMemo(() => {
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
  const hasHeader = !!header
  const hasFooter = !!footer

  // Context input 状态管理
  const { slateValue, handleChange } = useContextInput({
    value,
    onChange: readOnly ? undefined : onChange,
    editor,
    autoFocus,
  })

  // 处理 mention 搜索关闭
  const handleSearchClose = useEventCallback(() => {
    // 关闭时重新 focus 编辑器
    ReactEditor.focus(editor)
  })

  // Mentions hook
  const mentions = useMentions({
    editor,
    triggers,
    maxSuggestions,
    mentionPrefix,
    onMentionSelect,
    onSearchClose: handleSearchClose,
  })

  // 键盘事件处理
  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    // 先尝试让 MentionMenu 处理键盘事件
    if (mentionMenuRef.current?.handleKeyDown(event)) {
      return
    }

    // 处理其他键盘事件
    onKeyDown?.(event)
  })

  // 处理建议选择
  const handleSuggestionSelect = useEventCallback((mention: MentionItem, index: number) => {
    mentions.selectMention(index)
  })

  // 获取建议位置 - 缓存计算结果以优化性能
  const suggestionPosition = useMemo(() => mentions.getSuggestionPosition(), [mentions])

  // 样式对象缓存
  const tv = useMemo(
    () => contextInputTv({ hasHeader, hasFooter, size, disabled, variant }),
    [hasHeader, hasFooter, size, disabled, variant],
  )

  return (
    <ContextInputEditorContext.Provider value={editor}>
      {beforeElement}
      <div className={tv.container({ className })}>
        {header}
        <SlateEditor
          size={size}
          hasHeader={hasHeader}
          hasFooter={hasFooter}
          editor={editor}
          slateValue={slateValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          autoFocus={autoFocus}
          variant={variant}
          mentionPrefix={mentionPrefix}
          customMentionComponent={customMentionComponent}
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
      {afterElement}
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
ContextInput.Mention = Mention

export { ContextInput }
