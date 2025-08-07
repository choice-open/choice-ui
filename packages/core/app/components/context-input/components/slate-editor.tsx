import React, { useCallback } from "react"
import { Descendant, Editor, Node } from "slate"
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  Slate,
} from "slate-react"
import { ScrollArea } from "../../scroll-area"
import { contextInputTv } from "../tv"
import type { ContextInputProps } from "../types"
import { MentionElement } from "./mention-element"

interface SlateEditorProps
  extends Pick<
    ContextInputProps,
    | "placeholder"
    | "disabled"
    | "autoFocus"
    | "variant"
    | "renderMention"
    | "onFocus"
    | "onBlur"
    | "className"
    | "maxLength"
  > {
  children?: React.ReactNode
  editor: Editor
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

export const SlateEditor = React.forwardRef<HTMLDivElement, SlateEditorProps>(function SlateEditor(
  {
    editor,
    slateValue,
    placeholder = "Type someone...",
    disabled = false,
    autoFocus = false,
    variant = "default",
    renderMention,
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
  const tv = contextInputTv({ variant, disabled, hasHeader, hasFooter, size })

  // 渲染 Mention 元素
  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const { attributes, children, element } = props

      if ((element as unknown as { type: string }).type === "mention") {
        return (
          <MentionElement
            {...props}
            renderMention={renderMention}
            variant={variant}
          />
        )
      }

      return <div {...attributes}>{children}</div>
    },
    [renderMention, variant],
  )

  // 渲染叶子节点
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <span {...props.attributes}>{props.children}</span>
  }, [])

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
      ref={ref}
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
              spellCheck={false}
              className={tv.editor()}
              placeholder={placeholder}
              renderPlaceholder={({ children }: RenderPlaceholderProps) => (
                <p className={tv.placeholder()}>{children}</p>
              )}
              readOnly={disabled}
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
})
