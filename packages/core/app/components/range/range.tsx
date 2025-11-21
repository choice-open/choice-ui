import { clamp } from "es-toolkit"
import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { mergeRefs, tcx } from "~/utils"
import { rangeTv } from "./tv"

export interface RangeProps {
  className?: string
  connectsClassName?: {
    negative?: string
    positive?: string
  }
  defaultValue?: number
  disabled?: boolean
  max?: number
  min?: number
  onChange?: (value: number) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  readonly?: boolean
  step?: number
  thumbSize?: number
  trackSize?: {
    height?: number
    width?: number | "auto"
  }
  value?: number
}

export const Range = forwardRef<HTMLDivElement, RangeProps>(function Range(props, ref) {
  const {
    defaultValue,
    value,
    onChange,
    onChangeStart,
    onChangeEnd,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    readonly = false,
    className,
    connectsClassName = {
      positive: "bg-accent-background",
      negative: "bg-accent-background",
    },
    trackSize = {
      width: 256,
      height: 16,
    },
    thumbSize = 14,
  } = props
  // 🔥 使用状态存储动态计算的宽度
  const [actualTrackWidth, setActualTrackWidth] = useState<number | undefined>()

  const valueToPosition = useCallback((val: number) => (val - min) / (max - min), [min, max])

  const positionToValue = useCallback(
    (position: number) => min + position * (max - min),
    [min, max],
  )

  const defaultStepValue = useMemo(() => {
    if (defaultValue === undefined || defaultValue === null) return null
    if (step > 1) {
      return Math.round((defaultValue - min) / step) * step + min
    }
    return defaultValue
  }, [defaultValue, step, min])

  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)

  const [internalValue, setInternalValue] = useState(value ?? min)
  const currentValue = value ?? internalValue
  const currentStepValue = useMemo(
    () => (step > 1 ? Math.round(currentValue / step) * step : currentValue),
    [currentValue, step],
  )

  const [transforms, setTransforms] = useState({
    minTransform: 1,
    maxTransform: 0,
    transformX: 0,
  })

  const trackWidth = useMemo(() => {
    if (trackSize?.width === "auto") {
      return actualTrackWidth
    }
    return trackSize?.width
  }, [trackSize?.width, actualTrackWidth])

  // 🔥 使用 useLayoutEffect 在 DOM 更新后获取实际尺寸
  useLayoutEffect(() => {
    if (trackSize?.width === "auto" && sliderRef.current) {
      const updateWidth = () => {
        if (sliderRef.current) {
          const width = sliderRef.current.getBoundingClientRect().width
          if (width > 0) {
            setActualTrackWidth(width)
          }
        }
      }

      // 初始获取尺寸
      updateWidth()

      // 监听尺寸变化
      const resizeObserver = new ResizeObserver(() => {
        updateWidth()
      })

      resizeObserver.observe(sliderRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [trackSize?.width])

  useEffect(() => {
    const position = valueToPosition(currentValue)
    const minTransform = 1
    const maxTransform = (trackWidth ?? 0) - thumbSize - 1
    const transformX = minTransform + position * (maxTransform - minTransform)

    setTransforms({
      minTransform,
      maxTransform,
      transformX,
    })
  }, [currentValue, trackWidth, thumbSize, valueToPosition])

  const dotsData = useMemo(() => {
    if (!step || step <= 1) return null

    return Array.from({ length: Math.ceil((max - min) / step) + 1 }, (_, i) => {
      const dotValue = min + i * step
      const dotPosition = valueToPosition(dotValue)
      return {
        value: dotValue,
        position: dotPosition,
      }
    })
  }, [step, min, max, valueToPosition])

  const defaultDotPosition = useMemo(() => {
    if (defaultValue === undefined || defaultValue === null || step > 1) return null
    return valueToPosition(defaultValue)
  }, [defaultValue, step, valueToPosition])

  const updatePosition = useEventCallback((clientX: number, isEnd?: boolean) => {
    if (readonly) return

    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return

    const newPosition = clamp((clientX - rect.left) / rect.width, 0, 1)
    const newValue = Math.round(positionToValue(newPosition) / step) * step
    let clampedValue = clamp(newValue, min, max)

    if (defaultValue !== undefined && defaultValue !== null && step === 1) {
      const snapThreshold = (max - min) * 0.05
      const distanceToDefault = Math.abs(clampedValue - defaultValue)

      if (distanceToDefault <= snapThreshold) {
        clampedValue = defaultValue
      }
    }

    if (isEnd) {
      isDragging.current = false
    }

    if (value === undefined) {
      setInternalValue(clampedValue)
    }
    onChange?.(clampedValue)
  })

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || readonly) return
      e.preventDefault()
      e.stopPropagation()

      const thumb = thumbRef.current
      if (!thumb) return

      onChangeStart?.()

      isDragging.current = true
      thumb.setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
      inputRef.current?.focus()

      const handleMove = (e: PointerEvent) => {
        if (!isDragging.current) return
        e.preventDefault()
        updatePosition(e.clientX)
      }

      const handleUp = (e: PointerEvent) => {
        if (!isDragging.current) return
        e.preventDefault()

        if (thumb.hasPointerCapture(e.pointerId)) {
          thumb.releasePointerCapture(e.pointerId)
        }

        updatePosition(e.clientX, true)
        isDragging.current = false

        onChangeEnd?.()

        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
        window.removeEventListener("pointercancel", handleUp)
      }

      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleUp)
      window.addEventListener("pointercancel", handleUp)
    },
    [disabled, readonly, onChangeEnd, onChangeStart, updatePosition],
  )

  const handleSliderPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || readonly || e.target === thumbRef.current) return
      handlePointerDown(e)
    },
    [disabled, readonly, handlePointerDown],
  )

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
    if (disabled || readonly) return

    const stepValue = e.shiftKey ? step * 10 : step
    let newValue = currentValue

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault()
        newValue = clamp(newValue - stepValue, min, max)
        break
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault()
        newValue = clamp(newValue + stepValue, min, max)
        break
      default:
        return
    }

    if (newValue !== value) {
      onChange?.(newValue)
    }
  })

  useEffect(() => {
    if (disabled && document.activeElement === inputRef.current) {
      inputRef.current?.blur()
    }
  }, [disabled])

  const styles = useMemo(
    () =>
      rangeTv({
        currentDefaultValue: defaultStepValue === currentStepValue,
        hasStepOrDefault: step > 1 || defaultValue !== undefined,
        disabled,
      }),
    [defaultStepValue, currentStepValue, step, defaultValue, disabled],
  )

  const connectsClass = useMemo(() => {
    if (disabled) return "bg-disabled-background"
    if (currentValue < 0) return connectsClassName.negative
    return connectsClassName.positive
  }, [disabled, currentValue, connectsClassName])

  const connectStyle = useMemo(() => {
    return {
      left:
        min < 0
          ? currentValue < 0
            ? `${transforms.transformX + thumbSize / 2}px`
            : "50%"
          : (trackSize?.height ?? 0) / 2 + "px",
      right:
        min < 0
          ? currentValue >= 0
            ? `calc(100% - ${transforms.transformX + thumbSize / 2}px)`
            : "50%"
          : `calc(100% - ${transforms.transformX + thumbSize / 2}px)`,
      height: trackSize?.height,
    }
  }, [min, currentValue, transforms.transformX, thumbSize, trackSize?.height])

  const renderDots = useCallback(() => {
    if (dotsData) {
      return dotsData.map(({ value: dotValue, position: dotPosition }) => {
        const { minTransform, maxTransform } = transforms
        const dotTransform = minTransform + dotPosition * (maxTransform - minTransform)
        const { dot } = rangeTv({
          defaultStepValue: defaultStepValue === dotValue,
          overStepValue: dotValue <= currentValue,
        })
        return (
          <div
            key={dotValue}
            className={dot()}
            style={{
              left: dotTransform + thumbSize / 2,
            }}
          />
        )
      })
    }

    if (defaultDotPosition !== null && defaultDotPosition !== undefined) {
      return (
        <div
          className={rangeTv({ defaultStepValue: true }).dot()}
          style={{
            left:
              transforms.minTransform +
              defaultDotPosition * (transforms.maxTransform - transforms.minTransform) +
              thumbSize / 2,
          }}
        />
      )
    }

    return null
  }, [
    dotsData,
    defaultDotPosition,
    defaultStepValue,
    transforms.minTransform,
    transforms.maxTransform,
    thumbSize,
    currentValue,
  ])

  useEffect(() => {
    const noop = () => {}
    return () => {
      // 组件卸载时清理可能残留的事件监听器
      if (typeof window !== "undefined") {
        window.removeEventListener("pointermove", noop)
        window.removeEventListener("pointerup", noop)
        window.removeEventListener("pointercancel", noop)
      }
    }
  }, [])

  return (
    <div
      ref={mergeRefs(sliderRef, ref)}
      onPointerDown={handleSliderPointerDown}
      className={tcx(styles.container(), className)}
      style={
        {
          "--width": `${trackWidth}px`,
          "--height": `${trackSize?.height ?? 16}px`,
        } as CSSProperties
      }
    >
      <div
        className={tcx(styles.connect(), connectsClass)}
        style={connectStyle}
      />

      {step > 1 || defaultValue !== undefined ? (
        <div className={styles.dotContainer()}>{renderDots()}</div>
      ) : (
        ""
      )}

      <div
        ref={thumbRef}
        onPointerDown={handlePointerDown}
        className={styles.thumb()}
        style={{
          width: thumbSize,
          height: thumbSize,
          transform: `translate(${transforms.transformX}px, -50%)`,
          willChange: isDragging.current ? "transform" : "auto",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          className={styles.input()}
          tabIndex={disabled || readonly ? -1 : 0}
          readOnly
        />
      </div>
    </div>
  )
})

Range.displayName = "Range"
