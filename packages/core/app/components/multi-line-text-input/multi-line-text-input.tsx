import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { createEditor, Descendant, Editor, Node, Transforms } from "slate"
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import { tcx } from "~/utils/tcx"
import { ScrollArea } from "../scroll-area"
import { TextareaTv } from "./tv"

/**
 * @deprecated Use Textarea instead.
 */
export interface MultiLineTextInputProps {
  className?: string
  disabled?: boolean
  id?: string
  maxRows?: number
  minRows?: number
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  selected?: boolean
  value?: string
  variant?: "default" | "dark" | "reset"
}

function stringToSlateValue(value?: string): Descendant[] {
  return [
    {
      type: "paragraph",
      children: [{ text: value ?? "" }],
    },
  ]
}

function slateValueToString(value: Descendant[]): string {
  // 只取第一个段落的文本
  return value && value.length > 0 ? Node.string(value[0] as Node) : ""
}

// 提取渲染函数到组件外部
const renderElement = (props: RenderElementProps) => (
  <p
    {...props.attributes}
    className="text-balance break-all hyphens-auto"
  >
    {props.children}
  </p>
)
const renderLeaf = (props: RenderLeafProps) => <span {...props.attributes}>{props.children}</span>

export const MultiLineTextInput = forwardRef<HTMLDivElement, MultiLineTextInputProps>(
  (
    {
      id,
      value = "",
      onChange,
      minRows = 3,
      maxRows = 8,
      variant = "default",
      selected,
      disabled,
      readOnly,
      className,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const editor = useMemo(() => withReact(createEditor()), [])

    // 缓存 Slate 值的计算，避免不必要的重新计算
    const slateValue = useMemo(() => stringToSlateValue(value), [value])

    const [internalValue, setInternalValue] = useState<Descendant[]>(() => slateValue)
    const prevValueRef = useRef(value)
    const hasSelectedOnFocus = useRef(false)
    const isUpdatingFromProps = useRef(false)

    // 外部 value 变化时同步到编辑器
    useEffect(() => {
      if (value !== prevValueRef.current) {
        // 检查编辑器当前内容是否已经匹配，避免不必要的更新
        const currentContent = slateValueToString(editor.children)
        if (currentContent === value) {
          prevValueRef.current = value
          return
        }

        setInternalValue(slateValue)

        // 使用 Slate 的 Transforms API 正确更新编辑器内容
        isUpdatingFromProps.current = true
        Editor.withoutNormalizing(editor, () => {
          // 直接使用 insertText 替换整个编辑器内容
          // at 选项会自动删除指定范围的内容并插入新文本
          Transforms.insertText(editor, value || "", {
            at: {
              anchor: Editor.start(editor, []),
              focus: Editor.end(editor, []),
            },
          })
        })
        isUpdatingFromProps.current = false

        prevValueRef.current = value
        hasSelectedOnFocus.current = false // value 变化时允许再次全选
      }
    }, [value, editor, slateValue])

    // 编辑器内容变化时，触发 onChange
    const handleChange = (val: Descendant[]) => {
      // 避免在从 props 更新时触发 onChange，防止循环
      if (isUpdatingFromProps.current) {
        return
      }

      setInternalValue(val)
      const str = slateValueToString(val)
      if (str !== value) {
        onChange?.(str)
      }
    }

    // 计算高度样式
    const lineHeight = 24
    const minHeight = minRows * lineHeight
    const maxHeight = maxRows * lineHeight

    const styles = TextareaTv({ variant, disabled, selected, readOnly })

    // focus 时全选内容
    const handleFocus = () => {
      if (!hasSelectedOnFocus.current) {
        Transforms.select(editor, {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        })
        hasSelectedOnFocus.current = true
      }
    }

    return (
      <ScrollArea
        className={tcx(styles, className)}
        tabIndex={0}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        {...rest}
      >
        <ScrollArea.Viewport
          style={{
            minHeight: minHeight,
            maxHeight: maxHeight,
          }}
        >
          <ScrollArea.Content className="flex flex-col">
            <Slate
              editor={editor}
              initialValue={internalValue}
              onChange={handleChange}
            >
              <Editable
                ref={ref}
                id={id}
                className="min-w-0"
                style={{
                  outline: "none",
                  background: "transparent",
                  minHeight: minHeight,
                }}
                readOnly={disabled || readOnly}
                placeholder={placeholder}
                onPaste={(e) => {
                  // 只允许粘贴纯文本
                  e.preventDefault()
                  const text = e.clipboardData.getData("text/plain")
                  editor.insertText(text)
                }}
                onFocus={handleFocus}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
                autoCorrect="on"
                autoCapitalize="sentences"
                tabIndex={0}
              />
            </Slate>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
)

MultiLineTextInput.displayName = "MultiLineTextInput"
