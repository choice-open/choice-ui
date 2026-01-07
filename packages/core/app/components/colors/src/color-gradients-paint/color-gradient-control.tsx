import { IconButton } from "@choice-ui/icon-button"
import { ScrollArea } from "@choice-ui/scroll-area"
import { tcx } from "@choice-ui/shared"
import { AddSmall } from "@choiceform/icons-react"
import { clamp } from "es-toolkit"
import { nanoid } from "nanoid"
import { forwardRef } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { translation } from "../contents"
import type { ColorStop, RGB } from "../types/colors"
import type { GradientControlLabels, GradientPaint } from "../types/paint"
import { ColorGradientList } from "./color-gradient-list"

interface ColorGradientControlProps {
  active?: (stopId: string) => boolean
  addStopLabel?: string
  className?: string
  controlSize?: number
  labels?: GradientControlLabels
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onSelectedStopIdChange?: (id: string) => void
  onStopChange?: (stops: ColorStop[]) => void
  openPicker?: (stop: ColorStop) => void
  selectedStopId?: string
  stops: GradientPaint["gradientStops"]
}

export const ColorGradientControl = forwardRef<HTMLDivElement, ColorGradientControlProps>(
  function ColorGradientControl(props, ref) {
    const {
      active,
      className,
      controlSize = 224,
      selectedStopId,
      stops,
      labels,
      onSelectedStopIdChange,
      onStopChange,
      openPicker,
      onChangeEnd,
      onChangeStart,
    } = props

    // 添加新的 stop
    const addStop = useEventCallback(() => {
      if (!onStopChange) return

      // 获取排序后的 stops
      const sortedStops = [...stops].sort((a, b) => a.position - b.position)
      const lastIndex = sortedStops.length - 1
      const lastStop = sortedStops[lastIndex]
      const beforeLastStop = sortedStops[lastIndex - 1]

      // 计算新 stop 的位置（在最后两个 stop 之间）
      const position = (lastStop.position + beforeLastStop.position) / 2

      // 计算新 stop 在前后两个 stop 之间的相对位置 (0-1)
      const relativePosition =
        (position - beforeLastStop.position) / (lastStop.position - beforeLastStop.position)

      const beforeColor = tinycolor({
        r: beforeLastStop.color.r,
        g: beforeLastStop.color.g,
        b: beforeLastStop.color.b,
      })

      const lastColor = tinycolor({
        r: lastStop.color.r,
        g: lastStop.color.g,
        b: lastStop.color.b,
      })

      // tinycolor 的 mix 需要的是 0-100 的比例值，而不是 0-1
      const amount = relativePosition * 100

      const mixedColor = tinycolor.mix(beforeColor, lastColor, amount)
      const { r, g, b } = mixedColor.toRgb()

      const alpha =
        beforeLastStop.alpha + (lastStop.alpha - beforeLastStop.alpha) * relativePosition

      // 创建新的 stop
      const newStop: ColorStop = {
        id: nanoid(),
        position,
        color: { r, g, b },
        alpha,
      }

      // 更新 stops
      const newStops = [...stops, newStop].sort((a, b) => a.position - b.position)

      onStopChange(newStops)
      onSelectedStopIdChange?.(newStop.id)
    })

    // 更新 stop 位置
    const updateStopPosition = useEventCallback((id: string, position: number) => {
      if (!onStopChange) return

      const newStops = stops.map((stop) =>
        stop.id === id ? { ...stop, position: clamp(position, 0, 1) } : stop,
      )
      onStopChange(newStops.sort((a, b) => a.position - b.position))
    })

    // 删除 stop
    const deleteStop = useEventCallback((id: string) => {
      if (!onStopChange || !onSelectedStopIdChange || stops.length <= 2) return

      // 获取排序后的 stops
      const sortedStops = [...stops].sort((a, b) => a.position - b.position)
      const currentIndex = sortedStops.findIndex((stop) => stop.id === id)
      const beforeStop = sortedStops[currentIndex - 1]
      const afterStop = sortedStops[currentIndex + 1]

      // 删除当前 stop
      const newStops = stops.filter((stop) => stop.id !== id)

      onStopChange(newStops)
      // 优先选择前一个 stop，如果没有（即删除第一个）则选择后一个
      onSelectedStopIdChange(beforeStop?.id ?? afterStop.id)
    })

    // 更新 stop 颜色
    const updateStopColor = useEventCallback((id: string, value: RGB) => {
      if (!onStopChange || !onSelectedStopIdChange) return

      try {
        // 然后更新颜色，这样会触发 colorState$ 的更新
        const newStops = stops.map((stop) => (stop.id === id ? { ...stop, color: value } : stop))

        // 先选中要更新的 stop
        onSelectedStopIdChange(id)
        onStopChange(newStops as ColorStop[])
      } catch (error) {
        console.warn("Invalid color value:", error)
      }
    })

    // 更新 stop 透明度
    const updateStopAlpha = useEventCallback((id: string, alpha: number) => {
      if (!onStopChange || !onSelectedStopIdChange) return

      try {
        const newStops = stops.map((stop) => (stop.id === id ? { ...stop, alpha } : stop))

        // 先选中要更新的 stop
        onSelectedStopIdChange(id)
        // 然后更新 alpha，这样会触发 colorState$ 的更新
        onStopChange(newStops)
      } catch (error) {
        console.warn("Invalid alpha value:", error)
      }
    })

    return (
      <div
        ref={ref}
        className={tcx("flex min-w-0 flex-col", className)}
        style={{
          width: controlSize + 32,
        }}
      >
        <div className="flex h-10 min-w-0 items-center justify-between pr-2 pl-4">
          <span className="font-strong">{labels?.title ?? translation.gradients.STOP}</span>
          <IconButton
            onClick={addStop}
            tooltip={{
              content: labels?.addStopLabel ?? translation.gradients.ADD_STOP,
            }}
          >
            <AddSmall />
          </IconButton>
        </div>

        <ScrollArea>
          <ScrollArea.Viewport className="max-h-96 min-w-0">
            <ScrollArea.Content className="flex flex-col pb-2">
              {stops.map((stop) => {
                return (
                  <ColorGradientList
                    key={stop.id}
                    active={(stopId) => active?.(stopId) ?? false}
                    openPicker={openPicker}
                    stops={stops}
                    stop={stop}
                    selectedStopId={selectedStopId}
                    alpha={stop.alpha}
                    onSelectedStopIdChange={onSelectedStopIdChange}
                    updateStopPosition={updateStopPosition}
                    updateStopColor={updateStopColor}
                    updateStopAlpha={updateStopAlpha}
                    deleteStop={deleteStop}
                    onChangeStart={onChangeStart}
                    onChangeEnd={onChangeEnd}
                    labels={labels}
                  />
                )
              })}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </div>
    )
  },
)

ColorGradientControl.displayName = "ColorGradientControl"
