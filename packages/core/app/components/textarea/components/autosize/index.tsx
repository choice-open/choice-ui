import React, { forwardRef, useMemo } from "react"
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
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  return React.useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        func(...args)
      }, delay)
    }) as T,
    [func, delay],
  )
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

      // 优化：如果值没有变化且有缓存，跳过重新计算
      if (
        cacheMeasurements &&
        currentValue === lastValueRef.current &&
        measurementsCacheRef.current
      ) {
        return
      }

      try {
        const nodeSizingData =
          cacheMeasurements && measurementsCacheRef.current && currentValue === lastValueRef.current
            ? measurementsCacheRef.current
            : getSizingData(node)

        if (!nodeSizingData) {
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
