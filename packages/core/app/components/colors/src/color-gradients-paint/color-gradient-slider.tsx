import { tcx } from "@choice-ui/shared"
import { clamp, round } from "es-toolkit"
import { nanoid } from "nanoid"
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { ColorSwatch } from "../color-swatch"
import { useColors } from "../context/colots-context"
import type { ColorStop } from "../types/colors"
import type { GradientPaint } from "../types/paint"
import { profileConvertString } from "../utils"

interface ColorGradientSliderProps {
  className?: string
  controlledSelectedStopId?: string
  disabled?: boolean
  onChange?: (stops: GradientPaint["gradientStops"]) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onSelectedStopIdChange?: (id: string) => void
  stopSize?: number
  /**
   * Width of the gradient slider track in pixels.
   */
  width?: number
  value?: GradientPaint["gradientStops"]
}

export const ColorGradientSlider = forwardRef<HTMLDivElement, ColorGradientSliderProps>(
  function ColorGradientSlider(props, ref) {
    const {
      value = [],
      onChange,
      onChangeEnd,
      onChangeStart,
      controlledSelectedStopId,
      onSelectedStopIdChange,
      disabled = false,
      width: trackWidth = 224,
      stopSize = 18,
      className,
    } = props

    // Track height is fixed at 16px
    const trackHeight = 16

    const { colorProfile } = useColors()

    const sliderRef = useRef<HTMLDivElement>(null)
    const stopsContainerRef = useRef<HTMLDivElement>(null)
    const stopRefs = useRef<Map<string, HTMLDivElement>>(new Map())
    const isDragging = useRef(false)
    const uuid = nanoid()
    const [hoverPosition, setHoverPosition] = useState<number | null>(null)

    // 内部状态仅在非受控模式下使用
    const [internalStops, setInternalStops] = useState<GradientPaint["gradientStops"]>(value)
    const [internalSelectedStopId, setInternalSelectedStopId] = useState<string>(value[0].id)

    // 使用受控值或内部状态
    const stops = onChange ? value : internalStops
    const selectedStopId = onSelectedStopIdChange
      ? (controlledSelectedStopId ?? value[0].id)
      : internalSelectedStopId

    // Memoize sorted stops
    const sortedStops = useMemo(() => [...stops].sort((a, b) => a.position - b.position), [stops])

    // 更新选中的 stop
    const updateSelectedStopId = useEventCallback((id: string) => {
      if (onSelectedStopIdChange) {
        onSelectedStopIdChange(id)
      } else {
        setInternalSelectedStopId(id)
      }
    })

    // 更新 stops
    const updateStops = useEventCallback((newStops: ColorStop[], isEnd?: boolean) => {
      if (onChange) {
        onChange(newStops)
      } else {
        setInternalStops(newStops)
      }
    })

    // 生成渐变背景
    const gradientBackground = useMemo(() => {
      const checkerboard =
        "repeating-conic-gradient(rgb(204, 204, 204) 0%, rgb(204, 204, 204) 25%, white 0%, white 50%) left top / 11px 11px"
      const gradient = sortedStops
        .map(
          (stop) =>
            `${profileConvertString({ r: stop.color.r, g: stop.color.g, b: stop.color.b, a: stop.alpha }, colorProfile)} ${round(stop.position * 100)}%`,
        )
        .join(", ")
      return `linear-gradient(to right, ${gradient}), ${checkerboard}`
    }, [sortedStops, colorProfile])

    // 计算相对位置
    const calculatePosition = useCallback((clientX: number) => {
      const rect = sliderRef.current?.getBoundingClientRect()
      if (!rect) return 0

      const position = (clientX - rect.left) / rect.width
      return clamp(position, 0, 1)
    }, [])

    // 添加新的 stop
    const addStop = useEventCallback((clientX: number) => {
      const position = calculatePosition(clientX)

      // 找到新位置的前后两个 stop
      const sortedStops = [...stops].sort((a, b) => a.position - b.position)
      let beforeStop = sortedStops[0]
      let afterStop = sortedStops[sortedStops.length - 1]

      for (let i = 0; i < sortedStops.length - 1; i++) {
        if (sortedStops[i].position <= position && sortedStops[i + 1].position >= position) {
          beforeStop = sortedStops[i]
          afterStop = sortedStops[i + 1]
          break
        }
      }

      // 计算新 stop 在前后两个 stop 之间的相对位置 (0-1)
      const relativePosition =
        (position - beforeStop.position) / (afterStop.position - beforeStop.position)

      const beforeColor = tinycolor({
        r: beforeStop.color.r,
        g: beforeStop.color.g,
        b: beforeStop.color.b,
      })

      const lastColor = tinycolor({
        r: afterStop.color.r,
        g: afterStop.color.g,
        b: afterStop.color.b,
      })

      // tinycolor 的 mix 需要的是 0-100 的比例值，而不是 0-1
      const amount = relativePosition * 100

      const mixedColor = tinycolor.mix(beforeColor, lastColor, amount)
      const { r, g, b } = mixedColor.toRgb()

      const alpha = beforeStop.alpha + (afterStop.alpha - beforeStop.alpha) * relativePosition

      const newStop: ColorStop = {
        id: uuid,
        position,
        color: { r, g, b },
        alpha,
      }

      // 确保 stops 按位置排序
      const newStops = [...stops, newStop].sort((a, b) => a.position - b.position)
      updateStops(newStops, true)
      updateSelectedStopId(newStop.id)
    })

    // 更新 stop 位置
    const updateStopPosition = useEventCallback((id: string, clientX: number, isEnd?: boolean) => {
      const position = calculatePosition(clientX)
      const updatedStops = stops.map((stop) => (stop.id === id ? { ...stop, position } : stop))
      const newStops = updatedStops.sort((a, b) => a.position - b.position)
      updateStops(newStops, isEnd)
    })

    // 删除选中的 stop
    const deleteSelectedStop = useEventCallback(() => {
      if (stops.length <= 2) return // 保持至少两个 stop

      // 获取排序后的 stops
      const sortedStops = [...stops].sort((a, b) => a.position - b.position)
      const currentIndex = sortedStops.findIndex((stop) => stop.id === selectedStopId)
      const beforeStop = sortedStops[currentIndex - 1]
      const afterStop = sortedStops[currentIndex + 1]

      const newStops = stops.filter((stop) => stop.id !== selectedStopId)
      updateStops(newStops, true)

      // 优先选择前一个 stop，如果没有（即删除第一个）则选择后一个
      updateSelectedStopId(beforeStop?.id ?? afterStop.id)
    })

    // 处理键盘事件
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // 检查是否是删除键（Backspace 或 Delete）
        if (e.key === "Backspace" || e.key === "Delete") {
          deleteSelectedStop()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [deleteSelectedStop])

    // 处理点击事件
    const handleSliderClick = useEventCallback((e: React.MouseEvent) => {
      if (disabled || isDragging.current) return

      // 检查是否点击在任何 stop 元素上
      const clickedOnStop = Array.from(stopRefs.current.values()).some((stopEl) =>
        stopEl.contains(e.target as Node),
      )
      if (clickedOnStop) {
        return
      }

      addStop(e.clientX)
    })

    // 处理 stop 的拖拽
    const handleStopPointerDown = useEventCallback((e: React.PointerEvent, stopId: string) => {
      if (disabled) return
      e.stopPropagation()
      e.preventDefault()

      const stop = e.currentTarget as HTMLDivElement
      const sliderRect = sliderRef.current?.getBoundingClientRect()
      if (!sliderRect) return

      onChangeStart?.()

      isDragging.current = true
      stop.setPointerCapture(e.pointerId)
      updateSelectedStopId(stopId)

      // 记录初始点击位置
      const initialX = e.clientX
      let hasMoved = false

      const handleMove = (e: PointerEvent) => {
        if (!isDragging.current) return
        e.preventDefault()

        // 检查是否真的移动了
        if (Math.abs(e.clientX - initialX) > 1) {
          hasMoved = true
        }

        if (hasMoved) {
          // 限制鼠标位置在 slider 范围内
          const boundedX = Math.max(sliderRect.left, Math.min(e.clientX, sliderRect.right))
          updateStopPosition(stopId, boundedX)
        }
      }

      const handleUp = (e: PointerEvent) => {
        if (!isDragging.current) return
        e.preventDefault()

        if (stop.hasPointerCapture(e.pointerId)) {
          stop.releasePointerCapture(e.pointerId)
        }

        // 只有当用户真的移动了鼠标才更新位置
        if (hasMoved) {
          // 限制最终位置在 slider 范围内
          const boundedX = Math.max(sliderRect.left, Math.min(e.clientX, sliderRect.right))
          updateStopPosition(stopId, boundedX, true)
        }

        isDragging.current = false
        hasMoved = false

        onChangeEnd?.()

        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
        window.removeEventListener("pointercancel", handleUp)
      }

      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleUp)
      window.addEventListener("pointercancel", handleUp)
    })

    const trackStyle = useMemo(() => {
      return {
        width: trackWidth,
        height: trackHeight,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
        background: gradientBackground,
      }
    }, [gradientBackground, trackWidth, trackHeight])

    const stopStyle = useCallback(
      (stop: ColorStop) => {
        const position = stop.position * trackWidth
        return {
          width: stopSize,
          height: stopSize,
          transform: `translateX(${position}px) translateX(-50%)`,
          willChange: isDragging.current ? "transform" : "auto",
        }
      },
      [stopSize, trackWidth],
    )

    // 处理鼠标移动
    const handleMouseMove = useEventCallback((e: React.MouseEvent) => {
      if (disabled || isDragging.current) return
      const position = calculatePosition(e.clientX)
      setHoverPosition(position * trackWidth)
    })

    // 处理鼠标离开
    const handleMouseLeave = useEventCallback(() => {
      setHoverPosition(null)
    })

    return (
      <div
        className={className}
        ref={ref}
      >
        {/* Stops */}
        <div
          ref={stopsContainerRef}
          className="relative"
          style={{
            height: 24,
            width: trackWidth,
          }}
        >
          {stops.map((stop) => (
            <div
              key={stop.id}
              ref={(el) => {
                if (el) {
                  stopRefs.current.set(stop.id, el)
                } else {
                  stopRefs.current.delete(stop.id)
                }
              }}
              onPointerDown={(e) => handleStopPointerDown(e, stop.id)}
              className={tcx(
                "shadow-small absolute rounded-sm bg-white ring-2",
                selectedStopId === stop.id ? "ring-selected-boundary" : "ring-transparent",
              )}
              style={stopStyle(stop)}
            >
              <ColorSwatch
                className="absolute inset-0.5 rounded-sm"
                color={stop.color}
                alpha={stop.alpha}
              />
            </div>
          ))}
        </div>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          onClick={handleSliderClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={trackStyle}
          className={tcx("relative touch-none rounded-sm select-none", disabled && "saturate-0")}
        >
          {/* Hover Indicator */}
          {hoverPosition !== null && !disabled && !isDragging.current && (
            <div
              className="pointer-events-none absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-md bg-white shadow-sm"
              style={{ left: hoverPosition }}
            />
          )}
        </div>
      </div>
    )
  },
)

ColorGradientSlider.displayName = "ColorGradientSlider"
