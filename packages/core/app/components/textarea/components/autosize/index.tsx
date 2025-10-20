import React, { forwardRef, useMemo, useRef } from "react"
import { isBrowser, noop } from "./utils"
import calculateNodeHeight from "./calculate-node-height"
import getSizingData, { type SizingData } from "./get-sizing-data"
import {
  useComposedRef,
  useWindowResizeListener,
  useFontsLoadedListener,
  useFormResetListener,
} from "./hooks"
import { useIsomorphicLayoutEffect } from "usehooks-ts"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

type Style = Omit<NonNullable<TextareaProps["style"]>, "maxHeight" | "minHeight"> & {
  height?: number
}

export type TextareaHeightChangeMeta = {
  rowHeight: number
}

export interface TextareaAutosizeProps extends Omit<TextareaProps, "style"> {
  cacheMeasurements?: boolean
  /** 防抖延迟（毫秒），默认为 0（无防抖） */
  debounceMs?: number
  maxRows?: number
  minRows?: number
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void
  style?: Style
}

// 防抖 hook
function useDebounce<T extends (...args: unknown[]) => void>(func: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const funcRef = useRef(func)

  // Keep the function reference updated
  useIsomorphicLayoutEffect(() => {
    funcRef.current = func
  })

  // Use useMemo to create the debounced function
  const debouncedFn = useMemo(() => {
    return ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        funcRef.current(...args)
      }, delay)
    }) as T
  }, [delay])

  return debouncedFn
}

export const TextareaAutosize = forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  function TextareaAutosize(
    {
      cacheMeasurements = true,
      maxRows,
      minRows = 1,
      onChange = noop,
      onHeightChange = noop,
      style,
      debounceMs = 0,
      ...props
    },
    userRef,
  ) {
    // 开发环境检查
    if (process.env.NODE_ENV !== "production") {
      if (style && ("maxHeight" in style || "minHeight" in style)) {
        throw new Error(
          "Using `style.maxHeight` or `style.minHeight` for <TextareaAutosize/> is not supported. Please use `maxRows` and `minRows`.",
        )
      }

      if (minRows && minRows < 1) {
        console.warn("TextareaAutosize: minRows should be >= 1, got:", minRows)
      }

      if (maxRows && minRows && maxRows < minRows) {
        console.warn("TextareaAutosize: maxRows should be >= minRows, got:", { maxRows, minRows })
      }
    }

    const isControlled = props.value !== undefined
    const libRef = React.useRef<HTMLTextAreaElement | null>(null)
    const ref = useComposedRef(libRef, userRef)
    const heightRef = React.useRef(0)
    const measurementsCacheRef = React.useRef<SizingData>()
    const lastValueRef = React.useRef("")

    // 标准化参数
    const normalizedMinRows = Math.max(minRows, 1)
    const normalizedMaxRows = maxRows && maxRows >= normalizedMinRows ? maxRows : undefined

    const resizeTextarea = React.useCallback(() => {
      const node = libRef.current
      if (!node || !isBrowser) return

      const currentValue = node.value || node.placeholder || ""

      try {
        // Always get fresh sizing data when resizing to account for style changes
        const nodeSizingData = getSizingData(node)

        if (!nodeSizingData) {
          // 如果获取不到 sizing data，可能是元素还未完全渲染
          // 在下一帧重试
          requestAnimationFrame(() => {
            const retryData = getSizingData(node)
            if (!retryData) return

            if (cacheMeasurements) {
              measurementsCacheRef.current = retryData
              lastValueRef.current = currentValue
            }

            const [height, rowHeight] = calculateNodeHeight(
              retryData,
              currentValue,
              normalizedMinRows,
              normalizedMaxRows,
            )

            if (heightRef.current !== height) {
              heightRef.current = height
              node.style.setProperty("height", `${height}px`, "important")
              onHeightChange(height, { rowHeight })
            }
          })
          return
        }

        if (cacheMeasurements) {
          measurementsCacheRef.current = nodeSizingData
          lastValueRef.current = currentValue
        }

        const [height, rowHeight] = calculateNodeHeight(
          nodeSizingData,
          currentValue,
          normalizedMinRows,
          normalizedMaxRows,
        )

        if (heightRef.current !== height) {
          heightRef.current = height
          node.style.setProperty("height", `${height}px`, "important")
          onHeightChange(height, { rowHeight })
        }
      } catch (error) {
        console.warn("TextareaAutosize: Error during resize calculation", error)
      }
    }, [cacheMeasurements, normalizedMinRows, normalizedMaxRows, onHeightChange])

    // 应用防抖
    const debouncedResize = useDebounce(resizeTextarea, debounceMs)

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) {
          if (debounceMs > 0) {
            debouncedResize()
          } else {
            resizeTextarea()
          }
        }
        onChange(event)
      },
      [isControlled, debounceMs, debouncedResize, resizeTextarea, onChange],
    )

    // 表单重置监听器回调
    const formResetCallback = React.useCallback(() => {
      if (!isControlled) {
        const currentValue = libRef.current?.value || ""
        requestAnimationFrame(() => {
          const node = libRef.current
          if (node && currentValue !== node.value) {
            resizeTextarea()
          }
        })
      }
    }, [isControlled, resizeTextarea])

    // 所有 hooks 必须无条件调用
    useIsomorphicLayoutEffect(resizeTextarea)
    useFormResetListener(libRef, formResetCallback)
    useWindowResizeListener(resizeTextarea)
    useFontsLoadedListener(resizeTextarea)

    // 监听元素可见性变化（用于 popover/dialog 场景）
    React.useEffect(() => {
      const node = libRef.current
      if (!node || !isBrowser || typeof IntersectionObserver === "undefined") {
        return
      }

      // 使用 IntersectionObserver 监听元素何时变为可见
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 元素变为可见时，延迟一帧再计算，确保布局已完成
              requestAnimationFrame(() => {
                resizeTextarea()
              })
            }
          })
        },
        { threshold: 0 },
      )

      observer.observe(node)

      return () => {
        observer.disconnect()
      }
    }, [resizeTextarea])

    // When style changes, trigger resize to recalculate with new line height / padding
    React.useEffect(() => {
      resizeTextarea()
    }, [style?.lineHeight, style?.padding, resizeTextarea])

    // 合并样式
    const mergedStyle = useMemo(() => {
      if (!isBrowser) {
        // SSR 时提供合理的默认高度
        const estimatedRowHeight = 20
        const estimatedHeight = estimatedRowHeight * normalizedMinRows
        return {
          ...style,
          minHeight: `${estimatedHeight}px`,
        }
      }
      return style
    }, [style, normalizedMinRows])

    return (
      <textarea
        {...props}
        style={mergedStyle}
        onChange={isBrowser ? handleChange : onChange}
        ref={ref}
      />
    )
  },
)

TextareaAutosize.displayName = "TextareaAutosize"
