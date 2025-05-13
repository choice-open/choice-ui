import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { createEditor, Descendant, Node, Transforms, Editor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import { TextareaTv } from "./tv"
import { Scroll } from "../scroll/scroll"
import { tcx } from "~/utils/tcx"
import { mergeRefs } from "~/utils"

export interface MultiLineTextInputProps {
  value?: string
  onChange?: (value: string) => void
  minRows?: number
  maxRows?: number
  variant?: "default" | "dark" | "reset"
  selected?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  placeholder?: string
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

export const MultiLineTextInput = forwardRef<HTMLDivElement, MultiLineTextInputProps>(
  (
    {
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
    const [internalValue, setInternalValue] = useState<Descendant[]>(() =>
      stringToSlateValue(value),
    )
    const prevValueRef = useRef(value)
    const hasSelectedOnFocus = useRef(false)

    // 外部 value 变化时同步到编辑器
    useEffect(() => {
      if (value !== prevValueRef.current) {
        const slateVal = stringToSlateValue(value)
        setInternalValue(slateVal)
        prevValueRef.current = value
        hasSelectedOnFocus.current = false // value 变化时允许再次全选
      }
    }, [value])

    // 编辑器内容变化时，触发 onChange
    const handleChange = (val: Descendant[]) => {
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
      <Scroll
        className={tcx(styles, className)}
        tabIndex={0}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        {...rest}
      >
        <Scroll.Viewport
          style={{
            minHeight: minHeight,
            maxHeight: maxHeight,
          }}
        >
          <Slate
            editor={editor}
            initialValue={internalValue}
            onChange={handleChange}
          >
            <Editable
              ref={ref}
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
              renderElement={(props) => <p {...props.attributes}>{props.children}</p>}
              renderLeaf={(props) => <span {...props.attributes}>{props.children}</span>}
              spellCheck
              autoCorrect="on"
              autoCapitalize="sentences"
              tabIndex={0}
            />
          </Slate>
        </Scroll.Viewport>
      </Scroll>
    )
  },
)

MultiLineTextInput.displayName = "MultiLineTextInput"
