import { ScrollArea } from "@choiceform/scroll-area"
import React, { useCallback, useMemo } from "react"
import type { Descendant } from "slate"
import {
  Editable,
  type ReactEditor,
  type RenderElementProps,
  type RenderLeafProps,
  type RenderPlaceholderProps,
  Slate,
} from "slate-react"
import { contextInputTv } from "../tv"
import type { ContextInputProps } from "../types"
import { Mention } from "./mention"

interface SlateEditorProps
  extends Pick<
    ContextInputProps,
    | "placeholder"
    | "disabled"
    | "readOnly"
    | "autoFocus"
    | "variant"
    | "renderMention"
    | "mentionPrefix"
    | "customMentionComponent"
    | "onFocus"
    | "onBlur"
    | "className"
    | "maxLength"
  > {
  children?: React.ReactNode
  editor: ReactEditor
  footer?: React.ReactNode
  hasFooter: boolean
  hasHeader: boolean
  minHeight: number
  onChange: (value: Descendant[]) => void
  onCompositionEnd?: (event: React.CompositionEvent) => void
  onCompositionStart?: (event: React.CompositionEvent) => void
  onKeyDown: (event: React.KeyboardEvent) => void
  size: "default" | "large"
  slateValue: Descendant[]
}

const SlateEditorComponent = React.forwardRef<HTMLDivElement, SlateEditorProps>(
  function SlateEditor(
    {
      editor,
      slateValue,
      placeholder = "Type someone...",
      disabled = false,
      readOnly = false,
      autoFocus = false,
      variant = "default",
      renderMention,
      mentionPrefix,
      customMentionComponent,
      className,
      maxLength,
      minHeight = 80,
      onChange,
      onKeyDown,
      onCompositionStart,
      onCompositionEnd,
      onFocus,
      onBlur,
      hasHeader,
      hasFooter,
      size,
      children,
      ...props
    },
    ref,
  ) {
    // 缓存样式计算
    const tv = useMemo(
      () => contextInputTv({ variant, disabled, hasHeader, hasFooter, size }),
      [variant, disabled, hasHeader, hasFooter, size],
    )

    // 渲染 Mention 元素
    const renderElement = useCallback(
      (props: RenderElementProps) => {
        const { attributes, children, element } = props

        if ((element as unknown as { type: string }).type === "mention") {
          // 使用自定义 Mention 组件或默认的 Mention 组件
          const MentionComponent = customMentionComponent || Mention
          return (
            <MentionComponent
              {...props}
              renderMention={renderMention}
              mentionPrefix={mentionPrefix}
              variant={variant}
            />
          )
        }

        return <div {...attributes}>{children}</div>
      },
      [customMentionComponent, renderMention, mentionPrefix, variant],
    )

    // 渲染叶子节点
    const renderLeaf = useCallback((props: RenderLeafProps) => {
      return <span {...props.attributes}>{props.children}</span>
    }, [])

    // 缓存 placeholder 渲染函数以避免重复创建
    const renderPlaceholder = useCallback(
      ({ children }: RenderPlaceholderProps) => <p className={tv.placeholder()}>{children}</p>,
      [tv],
    )

    // 键盘事件处理
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        // 先让父组件处理 mentions 相关逻辑
        onKeyDown(event)
      },
      [onKeyDown],
    )

    return (
      <ScrollArea
        scrollbarMode={size === "large" ? "large-y" : "default"}
        className={tv.scrollArea()}
        {...props}
      >
        <ScrollArea.Viewport className={tv.viewport()}>
          <ScrollArea.Content className={tv.scrollContainer()}>
            {children}
            <Slate
              editor={editor}
              initialValue={slateValue}
              onChange={onChange}
            >
              <Editable
                ref={ref}
                spellCheck={false}
                className={tv.editor()}
                placeholder={placeholder}
                renderPlaceholder={renderPlaceholder}
                readOnly={disabled || readOnly}
                autoFocus={autoFocus}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={handleKeyDown}
                onCompositionStart={onCompositionStart}
                onCompositionEnd={onCompositionEnd}
                onFocus={onFocus}
                onBlur={onBlur}
                style={{
                  minHeight,
                }}
              />
            </Slate>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
)

// 使用 React.memo 优化渲染性能
export const SlateEditor = React.memo(SlateEditorComponent, (prevProps, nextProps) => {
  // 自定义比较逻辑以优化性能
  return (
    prevProps.editor === nextProps.editor &&
    prevProps.slateValue === nextProps.slateValue &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.readOnly === nextProps.readOnly &&
    prevProps.autoFocus === nextProps.autoFocus &&
    prevProps.variant === nextProps.variant &&
    prevProps.renderMention === nextProps.renderMention &&
    prevProps.mentionPrefix === nextProps.mentionPrefix &&
    prevProps.customMentionComponent === nextProps.customMentionComponent &&
    prevProps.className === nextProps.className &&
    prevProps.maxLength === nextProps.maxLength &&
    prevProps.minHeight === nextProps.minHeight &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.onKeyDown === nextProps.onKeyDown &&
    prevProps.onCompositionStart === nextProps.onCompositionStart &&
    prevProps.onCompositionEnd === nextProps.onCompositionEnd &&
    prevProps.onFocus === nextProps.onFocus &&
    prevProps.onBlur === nextProps.onBlur &&
    prevProps.hasHeader === nextProps.hasHeader &&
    prevProps.hasFooter === nextProps.hasFooter &&
    prevProps.size === nextProps.size &&
    prevProps.children === nextProps.children
  )
})
