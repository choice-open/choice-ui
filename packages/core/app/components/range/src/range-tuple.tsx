import { mergeRefs, tcx, useIsomorphicLayoutEffect } from "@choice-ui/shared"
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
import {
  RangeTupleConnects,
  RangeTupleConnectsProps,
  RangeTupleContainer,
  RangeTupleContainerProps,
} from "./components/connects"
import { RangeTupleDot, RangeTupleDotProps } from "./components/dot"
import { RangeTupleThumb, RangeTupleThumbProps } from "./components/thumb"
import { RangeTupleContext, RangeTupleContextValue } from "./context"
import { rangeTv } from "./tv"

export interface RangeTupleProps {
  children?: React.ReactNode
  className?: string
  defaultValue?: [number, number]
  disabled?: boolean
  max?: number
  min?: number
  onChange?: (value: [number, number]) => void
  onChangeEnd?: (value: [number, number]) => void
  onChangeStart?: () => void
  readOnly?: boolean
  step?: number
  thumbSize?: number
  value?: [number, number]
  /**
   * Width of the range track in pixels.
   * If not provided (undefined) or set to false, the width will be auto-calculated from the container.
   */
  width?: number | boolean
}

type ThumbIndex = 0 | 1

interface RangeTupleComponent extends React.ForwardRefExoticComponent<
  RangeTupleProps & React.RefAttributes<HTMLDivElement>
> {
  Container: typeof RangeTupleContainer
  Connects: typeof RangeTupleConnects
  Thumb: typeof RangeTupleThumb
  Dot: typeof RangeTupleDot
}

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

const RangeTupleRoot = forwardRef<HTMLDivElement, RangeTupleProps>(function RangeTuple(props, ref) {
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
        if (child.type === RangeTupleThumb || type?.displayName === "RangeTupleThumb") {
          hasCustom = true
          const childProps = child.props as RangeTupleThumbProps
          if (childProps.size !== undefined) {
            thumbSizeFromChild = childProps.size
          }
        } else if (
          child.type === RangeTupleContainer ||
          type?.displayName === "RangeTupleContainer"
        ) {
          hasCustom = true
          const childProps = child.props as RangeTupleContainerProps
          if (childProps.height !== undefined) {
            trackHeightFromChild = childProps.height
          }
        } else if (
          child.type === RangeTupleConnects ||
          type?.displayName === "RangeTupleConnects"
        ) {
          hasCustom = true
          hasConnects = true
        } else if (child.type === RangeTupleDot || type?.displayName === "RangeTupleDot") {
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

  const [actualTrackWidth, setActualTrackWidth] = useState<number | undefined>()

  const valueToPosition = useCallback((val: number) => (val - min) / range, [min, range])

  const positionToValue = useCallback((position: number) => min + position * range, [min, range])

  const normalizedDefaultValue = useMemo(
    () => (defaultValue ? normalizeTuple(defaultValue, min, max) : undefined),
    [defaultValue, min, max],
  )

  const defaultStepValue = useMemo(() => {
    if (!normalizedDefaultValue) return null
    if (safeStep > 1) {
      return normalizedDefaultValue.map(
        (v) => Math.round((v - min) / safeStep) * safeStep + min,
      ) as [number, number]
    }
    return normalizedDefaultValue
  }, [normalizedDefaultValue, safeStep, min])

  const sliderRef = useRef<HTMLDivElement>(null)
  const thumb0Ref = useRef<HTMLDivElement>(null)
  const thumb1Ref = useRef<HTMLDivElement>(null)
  const input0Ref = useRef<HTMLInputElement>(null)
  const input1Ref = useRef<HTMLInputElement>(null)
  const isDragging = useRef<ThumbIndex | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const [internalValue, setInternalValue] = useState<[number, number]>(
    normalizeTuple(value, min, max),
  )
  const currentValue = useMemo(
    () => (value ? normalizeTuple(value, min, max) : internalValue),
    [value, min, max, internalValue],
  )
  const currentStepValue = useMemo(() => {
    if (safeStep > 1) {
      return currentValue.map((v) => Math.round(v / safeStep) * safeStep) as [number, number]
    }
    return currentValue
  }, [currentValue, safeStep])

  // If width prop is not a number (undefined or false), use auto-calculated width
  const trackWidth = typeof propsWidth === "number" ? propsWidth : actualTrackWidth

  // When width is not a number, auto-calculate from container
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

      updateWidth()

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
    const position0 = valueToPosition(currentValue[0])
    const position1 = valueToPosition(currentValue[1])
    const minTransform = 1
    const maxTransform = (trackWidth ?? 0) - thumbSize - 1
    const transformX0 = minTransform + position0 * (maxTransform - minTransform)
    const transformX1 = minTransform + position1 * (maxTransform - minTransform)

    return { minTransform, maxTransform, transformX0, transformX1 }
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

  const defaultDotPositions = useMemo(() => {
    if (!normalizedDefaultValue || safeStep > 1) return null
    return normalizedDefaultValue.map((v) => valueToPosition(v)) as [number, number]
  }, [normalizedDefaultValue, safeStep, valueToPosition])

  const updatePosition = useEventCallback(
    (clientX: number, thumbIndex: ThumbIndex, isEnd?: boolean) => {
      if (readOnly) return
      const rect = sliderRef.current?.getBoundingClientRect()
      if (!rect) return

      const newPosition = clamp((clientX - rect.left) / rect.width, 0, 1)
      const newValue = Math.round(positionToValue(newPosition) / safeStep) * safeStep
      let clampedValue = clamp(newValue, min, max)

      // Snap to default value if close (only when step <= 1, i.e., no dots shown)
      if (normalizedDefaultValue && safeStep <= 1) {
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

  // Store latest value in ref for onChangeEnd callback
  const latestValueRef = useRef(currentValue)
  latestValueRef.current = currentValue

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, thumbIndex: ThumbIndex) => {
      if (disabled || readOnly) return
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

      const cleanup = () => {
        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
        window.removeEventListener("pointercancel", handleUp)
        cleanupRef.current = null
      }

      const handleUp = (e: PointerEvent) => {
        if (isDragging.current !== thumbIndex) return
        e.preventDefault()

        if (thumb.hasPointerCapture(e.pointerId)) {
          thumb.releasePointerCapture(e.pointerId)
        }

        updatePosition(e.clientX, thumbIndex, true)
        isDragging.current = null

        // Use latest value from ref instead of recalculating
        onChangeEnd?.(latestValueRef.current)
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
      if (disabled || readOnly) return
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
    [disabled, readOnly, handlePointerDown, currentValue, positionToValue],
  )

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent, thumbIndex: ThumbIndex) => {
    if (disabled || readOnly) return

    const stepValue = e.shiftKey ? safeStep * 10 : safeStep
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

  const hasStepOrDefault = safeStep > 1 || normalizedDefaultValue !== undefined

  const tv = useMemo(() => rangeTv({ hasStepOrDefault, disabled }), [hasStepOrDefault, disabled])

  // Simple boolean calculations - no useMemo needed
  const thumb0IsDefault = defaultStepValue ? currentStepValue[0] === defaultStepValue[0] : false
  const thumb1IsDefault = defaultStepValue ? currentStepValue[1] === defaultStepValue[1] : false

  const thumbTv0 = useMemo(
    () => rangeTv({ currentDefaultValue: thumb0IsDefault, hasStepOrDefault, disabled }),
    [thumb0IsDefault, hasStepOrDefault, disabled],
  )

  const thumbTv1 = useMemo(
    () => rangeTv({ currentDefaultValue: thumb1IsDefault, hasStepOrDefault, disabled }),
    [thumb1IsDefault, hasStepOrDefault, disabled],
  )

  // Create context value
  const contextValue = useMemo<RangeTupleContextValue>(
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
      defaultDotPositions,
      normalizedDefaultValue,
      thumb0Ref,
      thumb1Ref,
      input0Ref,
      input1Ref,
      isDragging,
      handlePointerDown,
      handleKeyDown,
      tv,
      thumbTv0,
      thumbTv1,
      hasCustomDot,
      hasCustomConnects,
      isDefaultValue: thumb0IsDefault && thumb1IsDefault,
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
      defaultDotPositions,
      normalizedDefaultValue,
      handlePointerDown,
      handleKeyDown,
      tv,
      thumbTv0,
      thumbTv1,
      hasCustomDot,
      hasCustomConnects,
      thumb0IsDefault,
      thumb1IsDefault,
    ],
  )

  return (
    <RangeTupleContext.Provider value={contextValue}>
      <div
        ref={mergeRefs(sliderRef, ref)}
        onPointerDown={handleSliderPointerDown}
        className={tcx(tv.container(), className)}
        style={
          {
            "--width": `${trackWidth}px`,
            "--height": `${trackHeight}px`,
            "--thumb-size": `${thumbSize}px`,
          } as CSSProperties
        }
      >
        {hasCustomChildren ? (
          children
        ) : (
          <>
            <RangeTupleContainer />
            <RangeTupleThumb index={0} />
            <RangeTupleThumb index={1} />
          </>
        )}
      </div>
    </RangeTupleContext.Provider>
  )
})

RangeTupleRoot.displayName = "RangeTuple"

export const RangeTuple = Object.assign(RangeTupleRoot, {
  Container: RangeTupleContainer,
  Connects: RangeTupleConnects,
  Thumb: RangeTupleThumb,
  Dot: RangeTupleDot,
}) as RangeTupleComponent

export type {
  RangeTupleConnectsProps,
  RangeTupleContainerProps,
  RangeTupleDotProps,
  RangeTupleThumbProps,
}
