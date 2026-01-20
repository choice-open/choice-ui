import { mergeRefs, tcx, useIsomorphicLayoutEffect } from "@choice-ui/shared"
import { clamp } from "es-toolkit"
import type { CSSProperties } from "react"
import {
  Children,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { useColors } from "../context/colots-context"
import type { PickerSliderType } from "../types/colors"
import { getSliderBackground, positionToSliderValue } from "../utils"
import { ColorSliderThumb, ColorSliderThumbProps } from "./components/thumb"
import { ColorSliderTrack, ColorSliderTrackProps } from "./components/track"
import { ColorSliderContext, ColorSliderContextValue } from "./context"
import { ColorSliderTv } from "./tv"

// Constants
const KEYBOARD_STEPS = {
  NORMAL: 0.01,
  SHIFT: 0.1,
} as const

export interface ColorSliderProps {
  backgroundStyle?: CSSProperties
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  hue?: number
  onChange?: (position: number) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  position: number
  type: PickerSliderType
  /**
   * Width of the slider track in pixels.
   * If not provided (undefined or false), the width will be auto-calculated from the container.
   */
  width?: number | boolean
}

interface ColorSliderComponent extends React.MemoExoticComponent<
  React.ForwardRefExoticComponent<ColorSliderProps & React.RefAttributes<HTMLDivElement>>
> {
  Thumb: typeof ColorSliderThumb
  Track: typeof ColorSliderTrack
}

const ColorSliderRoot = memo(
  forwardRef<HTMLDivElement, ColorSliderProps>(function ColorSlider(props, ref) {
    const {
      position,
      onChange,
      onChangeStart,
      onChangeEnd,
      type,
      hue = 0,
      backgroundStyle,
      disabled = false,
      width: propsWidth = 256,
      className,
      children,
    } = props

    const { colorProfile } = useColors()

    const sliderRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const isDragging = useRef(false)

    // Use state to store dynamically calculated width
    const [actualTrackWidth, setActualTrackWidth] = useState<number | undefined>()

    // If width prop is a number, use it; otherwise use auto-calculated width
    const trackWidth = typeof propsWidth === "number" ? propsWidth : actualTrackWidth

    // Extract thumbSize and trackHeight from children if provided, otherwise use defaults
    const { hasCustomChildren, extractedThumbSize, extractedTrackHeight } = useMemo(() => {
      const childArray = Children.toArray(children)
      let hasCustom = false
      let thumbSizeFromChild: number | undefined
      let trackHeightFromChild: number | undefined

      for (const child of childArray) {
        if (isValidElement(child)) {
          const childType = child.type as { displayName?: string }
          if (child.type === ColorSliderThumb || childType?.displayName === "ColorSliderThumb") {
            hasCustom = true
            const childProps = child.props as ColorSliderThumbProps
            if (childProps.size !== undefined) {
              thumbSizeFromChild = childProps.size
            }
          } else if (
            child.type === ColorSliderTrack ||
            childType?.displayName === "ColorSliderTrack"
          ) {
            hasCustom = true
            const childProps = child.props as ColorSliderTrackProps
            if (childProps.height !== undefined) {
              trackHeightFromChild = childProps.height
            }
          }
        }
      }

      return {
        hasCustomChildren: hasCustom,
        extractedThumbSize: thumbSizeFromChild,
        extractedTrackHeight: trackHeightFromChild,
      }
    }, [children])

    // Use extracted values from children if available, otherwise use defaults
    const trackHeight = extractedTrackHeight ?? 16
    const thumbSize = extractedThumbSize ?? trackHeight

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

    // Handle position update
    const updatePosition = useEventCallback((clientX: number, isEnd?: boolean) => {
      const rect = sliderRef.current?.getBoundingClientRect()
      if (!rect) return

      // Calculate relative position and clamp to 0-0.999
      // 0.999 is to prevent the slider from being triggered at the edge
      const newPosition = clamp((clientX - rect.left) / rect.width, 0, 0.999)

      if (isEnd) {
        isDragging.current = false
      } else {
        onChange?.(newPosition)
      }
    })

    // Handle pointer events
    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        e.preventDefault()
        e.stopPropagation()

        // 确保在所有数据变动之前调用 onChangeStart
        onChangeStart?.()

        const thumb = thumbRef.current
        if (!thumb) return

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

          // 确保调用 onChangeEnd 后不再发生任何的数据变动
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
        if (e.target === thumbRef.current) return
        handlePointerDown(e)
      },
      [handlePointerDown],
    )

    const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
      if (disabled) return

      const step = e.shiftKey ? KEYBOARD_STEPS.SHIFT : KEYBOARD_STEPS.NORMAL
      let newPosition = position

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          newPosition = clamp(position - step, 0, 1)
          break
        case "ArrowRight":
          e.preventDefault()
          newPosition = clamp(position + step, 0, 1)
          break
        default:
          return
      }

      if (newPosition !== position) {
        onChange?.(newPosition)
      }
    })

    // Remove focus when disabled
    useEffect(() => {
      if (disabled && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }, [disabled])

    const computedTrackWidth = trackWidth ?? 256

    const thumbWrapperStyle = useMemo(() => {
      // Calculate thumb movement range
      const minTransform = 0
      const maxTransform = computedTrackWidth - thumbSize
      const transformX = minTransform + position * (maxTransform - minTransform)

      return {
        width: thumbSize,
        height: thumbSize,
        transform: `translate(${transformX}px, -50%)`,
        willChange: isDragging.current ? "transform" : "auto",
      }
    }, [position, thumbSize, computedTrackWidth])

    const thumbStyle = useMemo(() => {
      return {
        "--thumb-size": `${thumbSize}px`,
        backgroundColor: positionToSliderValue(position, type, hue),
        boxShadow: `
        inset 0 0 0 3px white,
        inset 0 0 0 4px rgba(0,0,0,0.2),
        0 0 0 1px rgba(0,0,0,0.2)
      `,
      }
    }, [position, type, hue])

    const trackStyle = useMemo(
      () => ({
        ...getSliderBackground(type, hue, colorProfile),
        ...backgroundStyle,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
      }),
      [type, hue, colorProfile, backgroundStyle],
    )

    const tv = useMemo(() => ColorSliderTv({ disabled }), [disabled])

    // Create context value
    const contextValue = useMemo<ColorSliderContextValue>(
      () => ({
        position,
        disabled,
        type,
        hue,
        thumbSize,
        trackWidth: computedTrackWidth,
        trackHeight,
        thumbWrapperStyle,
        thumbStyle,
        trackStyle,
        thumbRef,
        inputRef,
        isDragging,
        handlePointerDown,
        handleKeyDown,
        tv,
      }),
      [
        position,
        disabled,
        type,
        hue,
        thumbSize,
        computedTrackWidth,
        trackHeight,
        thumbWrapperStyle,
        thumbStyle,
        trackStyle,
        handlePointerDown,
        handleKeyDown,
        tv,
      ],
    )

    return (
      <ColorSliderContext.Provider value={contextValue}>
        <div
          ref={mergeRefs(ref, sliderRef)}
          onPointerDown={handleSliderPointerDown}
          style={{
            ...trackStyle,
            height: trackHeight,
            width: typeof propsWidth === "number" ? propsWidth : undefined,
          }}
          className={tcx(tv.root(), className)}
        >
          {hasCustomChildren ? children : <ColorSliderThumb />}
        </div>
      </ColorSliderContext.Provider>
    )
  }),
)

ColorSliderRoot.displayName = "ColorSlider"

export const ColorSlider = Object.assign(ColorSliderRoot, {
  Thumb: ColorSliderThumb,
  Track: ColorSliderTrack,
}) as ColorSliderComponent

export type { ColorSliderThumbProps, ColorSliderTrackProps }
