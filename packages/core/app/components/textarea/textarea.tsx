import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback, useUnmount } from "usehooks-ts"
import { tcx } from "~/utils"
import { ScrollArea } from "../scroll-area"
import { ResizeHandle, TextareaAutosize } from "./components"
import { TextareaTv } from "./tv"
import type { TextareaContentProps, TextareaProps } from "./types"

// 提取常量到组件外部，避免重复声明
const DEFAULT_TEXTAREA_CONSTANTS = {
  lineHeight: 16,
  padding: 4, // py-1 = 4px top + 4px bottom
  border: 0, // border 已经包含在 box-sizing 中
} as const

// Content component for compound pattern
const TextareaContent = forwardRef<HTMLTextAreaElement, TextareaContentProps>(
  function TextareaContent(props, ref) {
    const { className, style, onChange, ...rest } = props
    // Convert style to TextareaAutosize compatible format
    const autosizeStyle = style
      ? { ...style, height: style.height as number | undefined }
      : undefined
    // Convert onChange handler
    const handleChange = onChange
      ? (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)
      : undefined
    return (
      <TextareaAutosize
        ref={ref}
        className={className}
        style={autosizeStyle}
        onChange={handleChange}
        {...rest}
      />
    )
  },
)

TextareaContent.displayName = "Textarea.Content"

// Main Textarea component
const TextareaBase = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TextareaBase(props, ref) {
    const {
      allowNewline = true,
      className,
      disabled,
      readOnly,
      selected,
      value,
      variant = "default",
      resize = "auto",
      minRows = 3,
      maxRows,
      lineHeight = DEFAULT_TEXTAREA_CONSTANTS.lineHeight,
      padding = DEFAULT_TEXTAREA_CONSTANTS.padding,
      onBlur,
      onChange,
      onFocus,
      onIsEditingChange,
      children,
      focusSelection = "all",
      ...rest
    } = props

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [viewportHeight, setViewportHeight] = useState<number>()

    // 添加依赖数组
    useImperativeHandle(ref, () => textareaRef.current!, [])

    useUnmount(() => {
      onIsEditingChange?.(false)
    })

    // 使用 useMemo 缓存样式计算
    const tx = useMemo(() => {
      return TextareaTv({ variant, selected, disabled, readOnly, resize, isDragging })
    }, [variant, selected, disabled, readOnly, resize, isDragging])

    const handleChange = useEventCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value)
    })

    const handleFocus = useEventCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      // Handle different focus selection modes
      if (focusSelection === "all") {
        e.target.select()
      } else if (focusSelection === "end") {
        // Use setTimeout to ensure the value is rendered before setting selection
        const textarea = e.target
        setTimeout(() => {
          const length = textarea.value.length
          textarea.setSelectionRange(length, length)
        }, 0)
      }
      // focusSelection === "none" - don't change selection

      onFocus?.(e)
      onIsEditingChange?.(true)
    })

    const handleBlur = useEventCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(e)
      onIsEditingChange?.(false)
    })

    const handleKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Prevent newline if allowNewline is false
      if (!allowNewline && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
      }
      // Pass through original onKeyDown if exists
      rest.onKeyDown?.(e)
    })

    const { style, ...restWithoutStyle } = rest

    const baseTextareaProps = useMemo(
      () => ({
        ...restWithoutStyle,
        ref: textareaRef,
        "data-1p-ignore": true,
        spellCheck: false,
        autoComplete: "off",
        value,
        disabled,
        readOnly,
        className: tx.textarea(),
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
      }),
      [
        restWithoutStyle,
        value,
        disabled,
        readOnly,
        tx,
        handleChange,
        handleFocus,
        handleBlur,
        handleKeyDown,
      ],
    )

    // 使用提取的常量
    const heightConstraints = useMemo(() => {
      // padding * 2 因为是上下两边
      const minHeight = minRows ? minRows * lineHeight + padding * 2 : undefined
      const maxHeight = maxRows ? maxRows * lineHeight + padding * 2 : undefined

      return { minHeight, maxHeight }
    }, [minRows, maxRows, lineHeight, padding])

    // TextareaAutosize props (用于 resize="auto")
    const textareaAutosizeProps = useMemo(
      () => ({
        ...baseTextareaProps,
        minRows,
        maxRows: undefined, // 在 ScrollArea 中不限制 maxRows
        style: {
          lineHeight: `${lineHeight}px`,
          padding: `${padding}px`,
        },
      }),
      [baseTextareaProps, minRows, lineHeight, padding],
    )

    const containerClasses = useMemo(() => tcx(tx.container(), className), [tx, className])

    // 简化拖拽处理逻辑
    const handleMouseDown = useEventCallback((e: React.MouseEvent) => {
      if (resize !== "handle" || disabled || readOnly) return

      e.preventDefault()
      setIsDragging(true)

      const startY = e.clientY
      const startHeight = viewportRef.current?.offsetHeight || heightConstraints.minHeight || 100

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY
        let newHeight = startHeight + deltaY

        // 应用 minRows 和 maxRows 约束
        if (heightConstraints.minHeight) {
          newHeight = Math.max(newHeight, heightConstraints.minHeight)
        }
        if (heightConstraints.maxHeight) {
          newHeight = Math.min(newHeight, heightConstraints.maxHeight)
        }

        setViewportHeight(newHeight)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    })

    // 简化 ScrollArea viewport 样式计算
    const viewportStyle = useMemo(() => {
      if (resize === "auto") {
        return heightConstraints.maxHeight
          ? { maxHeight: `${heightConstraints.maxHeight}px` }
          : undefined
      }

      if (resize === "handle") {
        const height = viewportHeight || heightConstraints.minHeight || 100
        return { height: `${height}px` }
      }

      if (resize === false && rest.rows) {
        const fixedHeight = rest.rows * lineHeight + padding * 2
        return { height: `${fixedHeight}px` }
      }

      return undefined
    }, [resize, heightConstraints, rest.rows, viewportHeight, lineHeight, padding])

    // 使用 useMemo 缓存 ScrollArea.Content 的样式
    const contentStyle = useMemo(
      () => ({
        minHeight: viewportHeight || heightConstraints.minHeight,
      }),
      [viewportHeight, heightConstraints.minHeight],
    )

    // 使用 ref 来管理 body cursor，避免频繁 DOM 操作
    const bodyRef = useRef<HTMLElement>()
    useEffect(() => {
      if (!bodyRef.current) {
        bodyRef.current = document.body
      }

      bodyRef.current.style.cursor = isDragging ? "ns-resize" : ""
    }, [isDragging])

    // 清理事件监听器
    useEffect(() => {
      return () => {
        if (bodyRef.current) {
          bodyRef.current.style.cursor = ""
        }
      }
    }, [])

    // Check if using compound pattern (has Textarea.Content child)
    const hasContentChild = useMemo(() => {
      let foundContent = false
      Children.forEach(children, (child) => {
        if (isValidElement(child) && child.type === TextareaContent) {
          foundContent = true
        }
      })
      return foundContent
    }, [children])

    // Render the content (either children with props passed down, or default TextareaAutosize)
    const renderContent = () => {
      if (hasContentChild) {
        return Children.map(children, (child) => {
          if (isValidElement(child) && child.type === TextareaContent) {
            // Merge props properly: child props should extend but not completely override parent props
            // Important: onFocus, onBlur, onChange from textareaAutosizeProps contain focusSelection logic
            // Also important: lineHeight and padding must be passed as inline styles
            const mergedStyle = {
              lineHeight: `${lineHeight}px`,
              padding: `${padding}px`,
              ...child.props.style,
            }

            return (
              <TextareaAutosize
                {...textareaAutosizeProps}
                {...child.props}
                className={tcx(tx.textarea(), child.props.className)}
                style={mergedStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            )
          }
          return child
        })
      }
      return <TextareaAutosize {...textareaAutosizeProps} />
    }

    return (
      <div className={tcx(containerClasses, "relative")}>
        <ScrollArea type="scroll">
          <ScrollArea.Viewport
            ref={viewportRef}
            className={tx.viewport()}
            style={viewportStyle}
          >
            <ScrollArea.Content
              className={tx.content()}
              style={contentStyle}
            >
              {renderContent()}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>

        {resize === "handle" && (
          <ResizeHandle
            className={tx.resizeHandle()}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    )
  },
)

TextareaBase.displayName = "Textarea"

// Create compound component with proper type declaration
type TextareaComponent = typeof TextareaBase & {
  Content: typeof TextareaContent
}

export const Textarea = Object.assign(TextareaBase, {
  Content: TextareaContent,
}) as TextareaComponent
