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

export interface RangeTupleProps {
  className?: string
  connectsClassName?: {
    negative?: string
    positive?: string
  }
  defaultValue?: [number, number]
  disabled?: boolean
  max?: number
  min?: number
  onChange?: (value: [number, number]) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  step?: number
  thumbSize?: number
  trackSize?: {
    height?: number
    width?: number | "auto"
  }
  value?: [number, number]
}

type ThumbIndex = 0 | 1

/**
 * Normalize a value or tuple to a valid tuple within bounds
 */
function normalizeTuple(
  value: number | [number, number] | undefined,
  min: number,
  max: number,
): [number, number] {
  if (value === undefined) {
    return [min, max]
  }
  if (Array.isArray(value)) {
    const [v0, v1] = value
    return [clamp(Math.min(v0, v1), min, max), clamp(Math.max(v0, v1), min, max)]
  }
  return [clamp(value, min, max), max]
}

export const RangeTuple = forwardRef<HTMLDivElement, RangeTupleProps>(
  function RangeTuple(props, ref) {
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

    const [actualTrackWidth, setActualTrackWidth] = useState<number | undefined>()

    const valueToPosition = useCallback((val: number) => (val - min) / (max - min), [min, max])

    const positionToValue = useCallback(
      (position: number) => min + position * (max - min),
      [min, max],
    )

    const normalizedDefaultValue = useMemo(
      () => (defaultValue ? normalizeTuple(defaultValue, min, max) : undefined),
      [defaultValue, min, max],
    )

    const defaultStepValue = useMemo(() => {
      if (!normalizedDefaultValue) return null
      if (step > 1) {
        return normalizedDefaultValue.map((v) => Math.round((v - min) / step) * step + min) as [
          number,
          number,
        ]
      }
      return normalizedDefaultValue
    }, [normalizedDefaultValue, step, min])

    const sliderRef = useRef<HTMLDivElement>(null)
    const thumb0Ref = useRef<HTMLDivElement>(null)
    const thumb1Ref = useRef<HTMLDivElement>(null)
    const input0Ref = useRef<HTMLInputElement>(null)
    const input1Ref = useRef<HTMLInputElement>(null)
    const isDragging = useRef<ThumbIndex | null>(null)

    const [internalValue, setInternalValue] = useState<[number, number]>(
      normalizeTuple(value, min, max),
    )
    const currentValue = useMemo(
      () => (value ? normalizeTuple(value, min, max) : internalValue),
      [value, min, max, internalValue],
    )
    const currentStepValue = useMemo(() => {
      if (step > 1) {
        return currentValue.map((v) => Math.round(v / step) * step) as [number, number]
      }
      return currentValue
    }, [currentValue, step])

    const [transforms, setTransforms] = useState({
      minTransform: 1,
      maxTransform: 0,
      transformX0: 0,
      transformX1: 0,
    })

    const trackWidth = useMemo(() => {
      if (trackSize?.width === "auto") {
        return actualTrackWidth
      }
      return trackSize?.width
    }, [trackSize?.width, actualTrackWidth])

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

        updateWidth()

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
      const position0 = valueToPosition(currentValue[0])
      const position1 = valueToPosition(currentValue[1])
      const minTransform = 1
      const maxTransform = (trackWidth ?? 0) - thumbSize - 1
      const transformX0 = minTransform + position0 * (maxTransform - minTransform)
      const transformX1 = minTransform + position1 * (maxTransform - minTransform)

      setTransforms({
        minTransform,
        maxTransform,
        transformX0,
        transformX1,
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

    const defaultDotPositions = useMemo(() => {
      if (!normalizedDefaultValue || step > 1) return null
      return normalizedDefaultValue.map((v) => valueToPosition(v)) as [number, number]
    }, [normalizedDefaultValue, step, valueToPosition])

    const updatePosition = useEventCallback(
      (clientX: number, thumbIndex: ThumbIndex, isEnd?: boolean) => {
        const rect = sliderRef.current?.getBoundingClientRect()
        if (!rect) return

        const newPosition = clamp((clientX - rect.left) / rect.width, 0, 1)
        const newValue = Math.round(positionToValue(newPosition) / step) * step
        let clampedValue = clamp(newValue, min, max)

        // Snap to default value if close
        if (normalizedDefaultValue && step === 1) {
          const snapThreshold = (max - min) * 0.05
          for (const defVal of normalizedDefaultValue) {
            const distanceToDefault = Math.abs(clampedValue - defVal)
            if (distanceToDefault <= snapThreshold) {
              clampedValue = defVal
              break
            }
          }
        }

        // Update the appropriate thumb while ensuring order
        const newTuple: [number, number] = [...currentValue] as [number, number]
        newTuple[thumbIndex] = clampedValue

        // Ensure min <= max
        if (newTuple[0] > newTuple[1]) {
          if (thumbIndex === 0) {
            newTuple[0] = newTuple[1]
          } else {
            newTuple[1] = newTuple[0]
          }
        }

        if (isEnd) {
          isDragging.current = null
        }

        if (value === undefined) {
          setInternalValue(newTuple)
        }
        onChange?.(newTuple)
      },
    )

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(normalizeTuple(value, min, max))
      }
    }, [value, min, max])

    const handlePointerDown = useCallback(
      (e: React.PointerEvent, thumbIndex: ThumbIndex) => {
        if (disabled) return
        e.preventDefault()
        e.stopPropagation()

        const thumb = thumbIndex === 0 ? thumb0Ref.current : thumb1Ref.current
        const inputRef = thumbIndex === 0 ? input0Ref : input1Ref
        if (!thumb) return

        onChangeStart?.()

        isDragging.current = thumbIndex
        thumb.setPointerCapture(e.pointerId)
        updatePosition(e.clientX, thumbIndex)
        inputRef.current?.focus()

        const handleMove = (e: PointerEvent) => {
          if (isDragging.current !== thumbIndex) return
          e.preventDefault()
          updatePosition(e.clientX, thumbIndex)
        }

        const handleUp = (e: PointerEvent) => {
          if (isDragging.current !== thumbIndex) return
          e.preventDefault()

          if (thumb.hasPointerCapture(e.pointerId)) {
            thumb.releasePointerCapture(e.pointerId)
          }

          updatePosition(e.clientX, thumbIndex, true)
          isDragging.current = null

          onChangeEnd?.()

          window.removeEventListener("pointermove", handleMove)
          window.removeEventListener("pointerup", handleUp)
          window.removeEventListener("pointercancel", handleUp)
        }

        window.addEventListener("pointermove", handleMove)
        window.addEventListener("pointerup", handleUp)
        window.addEventListener("pointercancel", handleUp)
      },
      [disabled, onChangeEnd, onChangeStart, updatePosition],
    )

    const handleSliderPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        if (e.target === thumb0Ref.current || e.target === thumb1Ref.current) return

        // Determine which thumb to move based on proximity
        const rect = sliderRef.current?.getBoundingClientRect()
        if (!rect) return

        const clickPosition = (e.clientX - rect.left) / rect.width
        const clickValue = positionToValue(clickPosition)

        // Calculate distances to both thumbs
        const dist0 = Math.abs(clickValue - currentValue[0])
        const dist1 = Math.abs(clickValue - currentValue[1])

        // Move the closer thumb
        const thumbIndex: ThumbIndex = dist0 <= dist1 ? 0 : 1
        handlePointerDown(e, thumbIndex)
      },
      [disabled, handlePointerDown, currentValue, positionToValue],
    )

    const handleKeyDown = useEventCallback((e: React.KeyboardEvent, thumbIndex: ThumbIndex) => {
      if (disabled) return

      const stepValue = e.shiftKey ? step * 10 : step
      let newValue = currentValue[thumbIndex]

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

      const newTuple: [number, number] = [...currentValue] as [number, number]
      newTuple[thumbIndex] = newValue

      // Ensure min <= max
      if (newTuple[0] > newTuple[1]) {
        if (thumbIndex === 0) {
          newTuple[0] = newTuple[1]
        } else {
          newTuple[1] = newTuple[0]
        }
      }

      onChange?.(newTuple)
    })

    useEffect(() => {
      if (disabled) {
        if (document.activeElement === input0Ref.current) {
          input0Ref.current?.blur()
        }
        if (document.activeElement === input1Ref.current) {
          input1Ref.current?.blur()
        }
      }
    }, [disabled])

    const styles = useMemo(
      () =>
        rangeTv({
          hasStepOrDefault: step > 1 || normalizedDefaultValue !== undefined,
          disabled,
        }),
      [step, normalizedDefaultValue, disabled],
    )

    const connectsClass = useMemo(() => {
      if (disabled) return "bg-disabled-background"
      return connectsClassName.positive
    }, [disabled, connectsClassName])

    // Connector between the two thumbs
    const connectStyle = useMemo(() => {
      return {
        left: `${transforms.transformX0 + thumbSize / 2}px`,
        right: `calc(100% - ${transforms.transformX1 + thumbSize / 2}px)`,
        height: trackSize?.height,
      }
    }, [transforms.transformX0, transforms.transformX1, thumbSize, trackSize?.height])

    const renderDots = useCallback(() => {
      if (dotsData) {
        return dotsData.map(({ value: dotValue, position: dotPosition }) => {
          const { minTransform, maxTransform } = transforms
          const dotTransform = minTransform + dotPosition * (maxTransform - minTransform)

          // Check if dot is within the selected range
          const isWithinRange = dotValue >= currentValue[0] && dotValue <= currentValue[1]
          const isDefaultValue = defaultStepValue?.includes(dotValue)

          const { dot } = rangeTv({
            defaultStepValue: isDefaultValue,
            overStepValue: isWithinRange,
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

      if (defaultDotPositions) {
        return defaultDotPositions.map((position, idx) => (
          <div
            key={`default-${idx}`}
            className={rangeTv({ defaultStepValue: true }).dot()}
            style={{
              left:
                transforms.minTransform +
                position * (transforms.maxTransform - transforms.minTransform) +
                thumbSize / 2,
            }}
          />
        ))
      }

      return null
    }, [dotsData, defaultDotPositions, defaultStepValue, transforms, thumbSize, currentValue])

    useEffect(() => {
      const noop = () => {}
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("pointermove", noop)
          window.removeEventListener("pointerup", noop)
          window.removeEventListener("pointercancel", noop)
        }
      }
    }, [])

    // Determine thumb colors based on whether they're at default values
    const thumb0IsDefault = useMemo(() => {
      if (!defaultStepValue) return false
      return currentStepValue[0] === defaultStepValue[0]
    }, [currentStepValue, defaultStepValue])

    const thumb1IsDefault = useMemo(() => {
      if (!defaultStepValue) return false
      return currentStepValue[1] === defaultStepValue[1]
    }, [currentStepValue, defaultStepValue])

    const thumb0Styles = useMemo(
      () =>
        rangeTv({
          currentDefaultValue: thumb0IsDefault,
          hasStepOrDefault: step > 1 || normalizedDefaultValue !== undefined,
          disabled,
        }),
      [thumb0IsDefault, step, normalizedDefaultValue, disabled],
    )

    const thumb1Styles = useMemo(
      () =>
        rangeTv({
          currentDefaultValue: thumb1IsDefault,
          hasStepOrDefault: step > 1 || normalizedDefaultValue !== undefined,
          disabled,
        }),
      [thumb1IsDefault, step, normalizedDefaultValue, disabled],
    )

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

        {(step > 1 || normalizedDefaultValue !== undefined) && (
          <div className={styles.dotContainer()}>{renderDots()}</div>
        )}

        {/* Thumb 0 (min value) */}
        <div
          ref={thumb0Ref}
          onPointerDown={(e) => handlePointerDown(e, 0)}
          className={thumb0Styles.thumb()}
          style={{
            width: thumbSize,
            height: thumbSize,
            transform: `translate(${transforms.transformX0}px, -50%)`,
            willChange: isDragging.current === 0 ? "transform" : "auto",
          }}
        >
          <input
            ref={input0Ref}
            type="text"
            onKeyDown={(e) => handleKeyDown(e, 0)}
            className={styles.input()}
            tabIndex={disabled ? -1 : 0}
            readOnly
          />
        </div>

        {/* Thumb 1 (max value) */}
        <div
          ref={thumb1Ref}
          onPointerDown={(e) => handlePointerDown(e, 1)}
          className={thumb1Styles.thumb()}
          style={{
            width: thumbSize,
            height: thumbSize,
            transform: `translate(${transforms.transformX1}px, -50%)`,
            willChange: isDragging.current === 1 ? "transform" : "auto",
          }}
        >
          <input
            ref={input1Ref}
            type="text"
            onKeyDown={(e) => handleKeyDown(e, 1)}
            className={styles.input()}
            tabIndex={disabled ? -1 : 0}
            readOnly
          />
        </div>
      </div>
    )
  },
)

RangeTuple.displayName = "RangeTuple"
