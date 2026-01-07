import { mergeRefs, tcx } from "@choice-ui/shared"
import { clamp } from "es-toolkit"
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { translation } from "../contents"
import { useColors } from "../context/colots-context"
import type { PickerAreaType, RGB } from "../types"
import { getColorAreaBackground } from "../utils"
import { ColorAreaTv } from "./tv"

// Constants
const KEYBOARD_STEPS = {
  NORMAL: 0.01,
  SHIFT: 0.1,
} as const

interface Position {
  x: number
  y: number
}

export interface ColorAreaProps {
  areaSize?: {
    height?: number
    width?: number
  }
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  hue?: number
  onChange?: (position: Position) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  position: Position
  thumbColor?: RGB
  thumbSize?: number
  type: PickerAreaType
}

export const ColorArea = memo(
  forwardRef<HTMLDivElement, ColorAreaProps>(function ColorArea(props, ref) {
    const {
      position,
      onChange,
      onChangeStart,
      onChangeEnd,
      type,
      hue = 0,
      thumbColor = { r: 0, g: 0, b: 0 },
      disabled = false,
      className,
      areaSize = { width: 256, height: 192 },
      thumbSize = 28,
      children,
    } = props

    const { colorProfile } = useColors()

    // Refs
    const areaRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const isDragging = useRef(false)

    // Get background style based on type
    const backgroundStyle = useMemo(
      () => getColorAreaBackground(type, hue, colorProfile),
      [type, hue, colorProfile],
    )

    // Position update handler
    const updatePosition = useEventCallback((clientX: number, clientY: number, isEnd?: boolean) => {
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return

      const newPosition = {
        x: clamp((clientX - rect.left) / rect.width, 0, 1),
        y: clamp(1 - (clientY - rect.top) / rect.height, 0, 1),
      }

      if (isEnd) {
        isDragging.current = false
      } else {
        onChange?.(newPosition)
      }
    })

    // Pointer event handlers
    const setupPointerListeners = useCallback(
      (thumb: HTMLDivElement) => {
        const handleMove = (e: PointerEvent) => {
          requestAnimationFrame(() => {
            if (!isDragging.current) return
            e.preventDefault()
            updatePosition(e.clientX, e.clientY)
          })
        }

        const handleUp = (e: PointerEvent) => {
          e.preventDefault()
          if (thumb.hasPointerCapture(e.pointerId)) {
            thumb.releasePointerCapture(e.pointerId)
          }
          updatePosition(e.clientX, e.clientY, true)
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

        return () => {
          window.removeEventListener("pointermove", handleMove)
          window.removeEventListener("pointerup", handleUp)
          window.removeEventListener("pointercancel", handleUp)
        }
      },
      [onChangeEnd, updatePosition],
    )

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return
        e.preventDefault()
        e.stopPropagation()

        const thumb = thumbRef.current
        if (!thumb) return

        isDragging.current = true
        thumb.setPointerCapture(e.pointerId)
        updatePosition(e.clientX, e.clientY)
        inputRef.current?.focus()

        setupPointerListeners(thumb)
      },
      [disabled, updatePosition, setupPointerListeners],
    )

    const handleAreaPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || e.target === thumbRef.current) return
        e.preventDefault()

        const thumb = thumbRef.current
        if (!thumb) return

        // 确保在所有数据变动之前调用 onChangeStart
        onChangeStart?.()

        isDragging.current = true
        thumb.setPointerCapture(e.pointerId)
        updatePosition(e.clientX, e.clientY)
        inputRef.current?.focus()

        setupPointerListeners(thumb)
      },
      [disabled, onChangeStart, updatePosition, setupPointerListeners],
    )

    const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
      if (disabled) return

      const step = e.shiftKey ? KEYBOARD_STEPS.SHIFT : KEYBOARD_STEPS.NORMAL
      const { x, y } = position

      const keyboardActions = {
        ArrowLeft: () => ({ x: x - step, y }),
        ArrowRight: () => ({ x: x + step, y }),
        ArrowUp: () => ({ x, y: y + step }),
        ArrowDown: () => ({ x, y: y - step }),
      }

      const action = keyboardActions[e.key as keyof typeof keyboardActions]
      if (!action) return

      e.preventDefault()
      const newPosition = action()
      const clampedPosition = {
        x: clamp(newPosition.x, 0, 1),
        y: clamp(newPosition.y, 0, 1),
      }

      if (clampedPosition.x !== x || clampedPosition.y !== y) {
        onChange?.(clampedPosition)
      }
    })

    // Remove focus when disabled
    useEffect(() => {
      if (disabled && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }, [disabled])

    // Styles
    const thumbStyle = useMemo(() => {
      return {
        width: thumbSize,
        height: thumbSize,
        transform: `
        translate(
          ${position.x * (areaSize?.width ?? 0) - thumbSize / 2}px,
          ${(1 - position.y) * (areaSize?.height ?? 0) - thumbSize / 2}px)
      `,
        willChange: isDragging.current ? "transform" : "auto",
      }
    }, [position.x, position.y, areaSize, thumbSize])

    const gradientStyle = useMemo(
      () => ({
        forcedColorAdjust: "none" as const,
        width: areaSize.width,
        height: areaSize.height,
        ...backgroundStyle,
      }),
      [areaSize.width, areaSize.height, backgroundStyle],
    )

    const styles = ColorAreaTv({ disabled })

    return (
      <div
        ref={mergeRefs(ref, areaRef)}
        onPointerDown={handleAreaPointerDown}
        role="presentation"
        style={gradientStyle}
        className={tcx(styles.root(), className)}
      >
        <div
          ref={thumbRef}
          onPointerDown={handlePointerDown}
          className={styles.thumbWrapper()}
          style={thumbStyle}
        >
          <div
            className={styles.thumb()}
            style={{
              width: thumbSize / 2,
              height: thumbSize / 2,
              backgroundColor: tinycolor({
                r: thumbColor.r,
                g: thumbColor.g,
                b: thumbColor.b,
              }).toRgbString(),
              boxShadow: `
              inset 0 0 0 3px white,
              inset 0 0 0 4px rgba(0,0,0,0.2),
              0 0 0 1px rgba(0,0,0,0.2)
            `,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              onKeyDown={handleKeyDown}
              className={styles.thumbInput()}
              aria-label={translation.area.ARIA_LABEL}
              tabIndex={disabled ? -1 : 0}
              readOnly
            />
          </div>
        </div>
        {children}
      </div>
    )
  }),
)
ColorArea.displayName = "ColorArea"
