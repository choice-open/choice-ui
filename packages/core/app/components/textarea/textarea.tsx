import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { useEventCallback, useUnmount } from "usehooks-ts"
import { tcx } from "~/utils"
import { ScrollArea } from "../scroll-area"
import { ResizeHandle } from "./components"
import { TextareaTv } from "./tv"
import type { TextareaProps } from "./types"

// 提取常量到组件外部，避免重复声明
const TEXTAREA_CONSTANTS = {
  lineHeight: 16,
  padding: 8,
  border: 2,
} as const

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      className,
      disabled,
      readOnly,
      selected,
      value,
      variant = "default",
      resize = "auto",
      minRows = 3,
      maxRows,
      onBlur,
      onChange,
      onFocus,
      onIsEditingChange,
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
      e.target.select()
      onFocus?.(e)
      onIsEditingChange?.(true)
    })

    const handleBlur = useEventCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(e)
      onIsEditingChange?.(false)
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
      }),
      [restWithoutStyle, value, disabled, readOnly, tx, handleChange, handleFocus, handleBlur],
    )

    // 使用提取的常量
    const heightConstraints = useMemo(() => {
      const { lineHeight, padding, border } = TEXTAREA_CONSTANTS

      const minHeight = minRows ? minRows * lineHeight + padding + border : undefined
      const maxHeight = maxRows ? maxRows * lineHeight + padding + border : undefined

      return { minHeight, maxHeight }
    }, [minRows, maxRows])

    // TextareaAutosize props (用于 resize="auto")
    const textareaAutosizeProps = useMemo(
      () => ({
        ...baseTextareaProps,
        minRows,
        maxRows: undefined, // 在 ScrollArea 中不限制 maxRows
      }),
      [baseTextareaProps, minRows],
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
        return { height: `${height + 4}px` }
      }

      if (resize === false && rest.rows) {
        const { lineHeight, padding, border } = TEXTAREA_CONSTANTS
        const fixedHeight = rest.rows * lineHeight + padding + border
        return { height: `${fixedHeight}px` }
      }

      return undefined
    }, [resize, heightConstraints, rest.rows, viewportHeight])

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

    return (
      <div className={tcx(containerClasses, "relative")}>
        <ScrollArea type="scroll">
          <ScrollArea.Viewport
            ref={viewportRef}
            className={tx.viewport()}
            style={viewportStyle}
          >
            <ScrollArea.Content style={contentStyle}>
              <TextareaAutosize {...textareaAutosizeProps} />
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

Textarea.displayName = "Textarea"
