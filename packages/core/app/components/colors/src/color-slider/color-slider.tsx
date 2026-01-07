import { mergeRefs, tcx } from "@choice-ui/shared"
import { clamp } from "es-toolkit"
import type { CSSProperties } from "react"
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { translation } from "../contents"
import { useColors } from "../context/colots-context"
import type { PickerSliderType } from "../types/colors"
import { getSliderBackground, positionToSliderValue } from "../utils"
import { ColorSliderTv } from "./tv"

// Constants
const KEYBOARD_STEPS = {
  NORMAL: 0.01,
  SHIFT: 0.1,
} as const

export interface ColorSliderProps {
  backgroundStyle?: CSSProperties
  className?: string
  disabled?: boolean
  hue?: number
  onChange?: (position: number) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  position: number
  thumbSize?: number
  trackSize?: {
    height?: number
    width?: number
  }
  type: PickerSliderType
}

export const ColorSlider = memo(
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
      trackSize = {
        width: 256,
        height: 16,
      },
      thumbSize = 14,
      className,
    } = props

    const { colorProfile } = useColors()

    const sliderRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const isDragging = useRef(false)

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

    const thumbStyle = useMemo(() => {
      // Calculate thumb movement range
      const minTransform = 1
      const maxTransform = (trackSize?.width ?? 0) - thumbSize - 1
      const transformX = minTransform + position * (maxTransform - minTransform)

      return {
        width: thumbSize,
        height: thumbSize,
        transform: `translate(${transformX}px, -50%)`,
        backgroundColor: positionToSliderValue(position, type, hue),
        willChange: isDragging.current ? "transform" : "auto",
        boxShadow: `
        inset 0 0 0 3px white,
        inset 0 0 0 4px rgba(0,0,0,0.2),
        0 0 0 1px rgba(0,0,0,0.2)
      `,
      }
    }, [position, thumbSize, trackSize, type, hue])

    const computedBackgroundStyle = useMemo(
      () => ({
        ...getSliderBackground(type, hue, colorProfile),
        ...backgroundStyle,
      }),
      [type, hue, colorProfile, backgroundStyle],
    )

    const styles = ColorSliderTv({ disabled })

    return (
      <div
        ref={mergeRefs(ref, sliderRef)}
        onPointerDown={handleSliderPointerDown}
        style={{
          ...computedBackgroundStyle,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
          height: trackSize?.height,
          width: trackSize?.width,
        }}
        className={tcx(styles.root(), className)}
      >
        <div
          ref={thumbRef}
          onPointerDown={handlePointerDown}
          className={styles.thumb()}
          style={thumbStyle}
        >
          <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            className={styles.thumbInput()}
            aria-label={translation.slider.ARIA_LABEL}
            tabIndex={disabled ? -1 : 0}
            readOnly
          />
        </div>
      </div>
    )
  }),
)

ColorSlider.displayName = "ColorSlider"
