import { mergeRefs, tcx } from "@choice-ui/shared"
import { clamp } from "es-toolkit"
import React, {
  Children,
  CSSProperties,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { useIsomorphicLayoutEffect } from "@choice-ui/shared"
import { RangeContext, RangeContextValue } from "./context"
import {
  RangeConnects,
  RangeConnectsProps,
  RangeContainer,
  RangeContainerProps,
} from "./components/connects"
import { RangeThumb, RangeThumbProps } from "./components/thumb"
import { RangeDot, RangeDotProps } from "./components/dot"
import { rangeTv } from "./tv"

export interface RangeProps {
  children?: React.ReactNode
  className?: string
  defaultValue?: number
  disabled?: boolean
  max?: number
  min?: number
  onChange?: (value: number) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  readOnly?: boolean
  step?: number
  thumbSize?: number
  value?: number
  /**
   * Width of the range track in pixels.
   * If not provided (undefined), the width will be auto-calculated from the container.
   */
  width?: number | boolean
}

interface RangeComponent extends React.ForwardRefExoticComponent<
  RangeProps & React.RefAttributes<HTMLDivElement>
> {
  Container: typeof RangeContainer
  Connects: typeof RangeConnects
  Thumb: typeof RangeThumb
  Dot: typeof RangeDot
}

const RangeRoot = forwardRef<HTMLDivElement, RangeProps>(function Range(props, ref) {
  const {
    children,
    defaultValue,
    value,
    onChange,
    onChangeStart,
    onChangeEnd,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    readOnly = false,
    className,
    width: propsWidth = 256,
    thumbSize: propsThumbSize = 14,
  } = props

  // Extract thumbSize, trackHeight and detect custom children from children if provided
  const {
    hasCustomChildren,
    hasCustomDot,
    hasCustomConnects,
    extractedThumbSize,
    extractedTrackHeight,
  } = useMemo(() => {
    const childArray = Children.toArray(children)
    let hasCustom = false
    let hasDot = false
    let hasConnects = false
    let thumbSizeFromChild: number | undefined
    let trackHeightFromChild: number | undefined

    for (const child of childArray) {
      if (isValidElement(child)) {
        const type = child.type as { displayName?: string }
        if (child.type === RangeThumb || type?.displayName === "RangeThumb") {
          hasCustom = true
          const childProps = child.props as RangeThumbProps
          if (childProps.size !== undefined) {
            thumbSizeFromChild = childProps.size
          }
        } else if (child.type === RangeContainer || type?.displayName === "RangeContainer") {
          hasCustom = true
          const childProps = child.props as RangeContainerProps
          if (childProps.height !== undefined) {
            trackHeightFromChild = childProps.height
          }
        } else if (child.type === RangeConnects || type?.displayName === "RangeConnects") {
          hasCustom = true
          hasConnects = true
        } else if (child.type === RangeDot || type?.displayName === "RangeDot") {
          hasCustom = true
          hasDot = true
        }
      }
    }

    return {
      hasCustomChildren: hasCustom,
      hasCustomDot: hasDot,
      hasCustomConnects: hasConnects,
      extractedThumbSize: thumbSizeFromChild,
      extractedTrackHeight: trackHeightFromChild,
    }
  }, [children])

  // Use extracted values from children if available, otherwise use props
  const thumbSize = extractedThumbSize ?? propsThumbSize
  const trackHeight = extractedTrackHeight ?? 16

  // Normalize step to prevent division by zero or negative values
  // Use a very small positive number as minimum to allow decimal steps like 0.0001
  const safeStep = step > 0 ? step : 1
  // Ensure min < max to prevent division by zero
  const range = max - min || 1

  // Use state to store dynamically calculated width
  const [actualTrackWidth, setActualTrackWidth] = useState<number | undefined>()

  const valueToPosition = useCallback((val: number) => (val - min) / range, [min, range])

  const positionToValue = useCallback((position: number) => min + position * range, [min, range])

  const defaultStepValue = useMemo(() => {
    if (defaultValue === undefined || defaultValue === null) return null
    if (safeStep > 1) {
      return Math.round((defaultValue - min) / safeStep) * safeStep + min
    }
    return defaultValue
  }, [defaultValue, safeStep, min])

  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  const [internalValue, setInternalValue] = useState(value ?? min)
  const currentValue = value ?? internalValue
  const currentStepValue = useMemo(
    () => (safeStep > 1 ? Math.round(currentValue / safeStep) * safeStep : currentValue),
    [currentValue, safeStep],
  )

  // If width prop is undefined, use auto-calculated width
  const trackWidth = typeof propsWidth === "number" ? propsWidth : actualTrackWidth

  // Use useIsomorphicLayoutEffect to get the actual size after DOM update
  // When width is not a number (undefined or false), auto-calculate from container
  useIsomorphicLayoutEffect(() => {
    if (typeof propsWidth !== "number" && sliderRef.current) {
      const updateWidth = () => {
        if (sliderRef.current) {
          const width = sliderRef.current.getBoundingClientRect().width
          if (width > 0) {
            setActualTrackWidth(width)
          }
        }
      }

      // Initial get size
      updateWidth()

      // Listen for size changes
      const resizeObserver = new ResizeObserver(() => {
        updateWidth()
      })

      resizeObserver.observe(sliderRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [propsWidth])

  // Calculate transforms using useMemo instead of useState + useEffect
  const transforms = useMemo(() => {
    const position = valueToPosition(currentValue)
    const minTransform = 1
    const maxTransform = (typeof trackWidth === "number" ? trackWidth : 0) - thumbSize - 1
    const transformX = minTransform + position * (maxTransform - minTransform)

    return { minTransform, maxTransform, transformX }
  }, [currentValue, trackWidth, thumbSize, valueToPosition])

  const dotsData = useMemo(() => {
    if (safeStep <= 1) return null

    return Array.from({ length: Math.ceil((max - min) / safeStep) + 1 }, (_, i) => {
      const dotValue = min + i * safeStep
      const dotPosition = valueToPosition(dotValue)
      return {
        value: dotValue,
        position: dotPosition,
      }
    })
  }, [safeStep, min, max, valueToPosition])

  const defaultDotPosition = useMemo(() => {
    if (defaultValue === undefined || defaultValue === null || safeStep > 1) return null
    return valueToPosition(defaultValue)
  }, [defaultValue, safeStep, valueToPosition])

  const updatePosition = useEventCallback((clientX: number, isEnd?: boolean) => {
    if (readOnly) return

    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return

    const newPosition = clamp((clientX - rect.left) / rect.width, 0, 1)
    const newValue = Math.round(positionToValue(newPosition) / safeStep) * safeStep
    let clampedValue = clamp(newValue, min, max)

    if (defaultValue !== undefined && defaultValue !== null && safeStep <= 1) {
      const snapThreshold = range * 0.05
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
      if (disabled || readOnly) return
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

      const cleanup = () => {
        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
        window.removeEventListener("pointercancel", handleUp)
        cleanupRef.current = null
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
        cleanup()
      }

      // Store cleanup for unmount
      cleanupRef.current = cleanup

      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleUp)
      window.addEventListener("pointercancel", handleUp)
    },
    [disabled, readOnly, onChangeEnd, onChangeStart, updatePosition],
  )

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current?.()
    }
  }, [])

  const handleSliderPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || readOnly || e.target === thumbRef.current) return
      handlePointerDown(e)
    },
    [disabled, readOnly, handlePointerDown],
  )

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
    if (disabled || readOnly) return

    const stepValue = e.shiftKey ? safeStep * 10 : safeStep
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

  const hasStepOrDefault = safeStep > 1 || defaultValue !== undefined

  const tv = useMemo(
    () =>
      rangeTv({
        currentDefaultValue: defaultStepValue === currentStepValue,
        hasStepOrDefault,
        disabled,
      }),
    [defaultStepValue, currentStepValue, hasStepOrDefault, disabled],
  )

  // Create context value
  const contextValue = useMemo<RangeContextValue>(
    () => ({
      currentValue,
      disabled,
      readOnly,
      min,
      max,
      step: safeStep,
      thumbSize,
      trackHeight,
      transforms,
      defaultStepValue,
      currentStepValue,
      dotsData,
      defaultDotPosition,
      thumbRef,
      inputRef,
      isDragging,
      handlePointerDown,
      handleKeyDown,
      tv,
      defaultValue,
      hasCustomDot,
      hasCustomConnects,
      isDefaultValue: defaultStepValue === currentStepValue && hasStepOrDefault,
    }),
    [
      currentValue,
      disabled,
      readOnly,
      min,
      max,
      safeStep,
      thumbSize,
      trackHeight,
      transforms,
      defaultStepValue,
      currentStepValue,
      dotsData,
      defaultDotPosition,
      handlePointerDown,
      handleKeyDown,
      tv,
      defaultValue,
      hasCustomDot,
      hasCustomConnects,
    ],
  )

  return (
    <RangeContext.Provider value={contextValue}>
      <div
        ref={mergeRefs(sliderRef, ref)}
        onPointerDown={handleSliderPointerDown}
        className={tcx(tv.container(), className)}
        style={
          {
            "--width": `${typeof trackWidth === "number" ? trackWidth : actualTrackWidth}px`,
            "--height": `${trackHeight}px`,
            "--thumb-size": `${thumbSize}px`,
          } as CSSProperties
        }
      >
        {hasCustomChildren ? (
          children
        ) : (
          <>
            <RangeContainer />
            <RangeThumb />
          </>
        )}
      </div>
    </RangeContext.Provider>
  )
})

RangeRoot.displayName = "Range"

export const Range = Object.assign(RangeRoot, {
  Container: RangeContainer,
  Connects: RangeConnects,
  Thumb: RangeThumb,
  Dot: RangeDot,
}) as RangeComponent

export type { RangeContainerProps, RangeConnectsProps, RangeThumbProps, RangeDotProps }
