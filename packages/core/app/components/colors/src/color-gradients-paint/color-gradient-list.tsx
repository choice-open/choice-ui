import { IconButton } from "@choice-ui/icon-button"
import { NumericInput, NumericInputValue } from "@choice-ui/numeric-input"
import { tcx } from "@choice-ui/shared"
import { DeleteSmall } from "@choiceform/icons-react"
import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { translation } from "../contents"
import { ColorInput } from "../fill-input"
import type { ColorStop, RGB } from "../types/colors"
import type { GradientListLabels, GradientPaint } from "../types/paint"

interface ColorGradientListProps {
  active?: (stopId: string) => boolean
  alpha: number
  deleteStop: (id: string) => void
  labels?: GradientListLabels
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onSelectedStopIdChange?: (id: string) => void
  openPicker?: (stop: ColorStop) => void
  selectedStopId?: string
  stop: ColorStop
  stops: GradientPaint["gradientStops"]
  updateStopAlpha: (id: string, alpha: number) => void
  updateStopColor: (id: string, value: RGB) => void
  updateStopPosition: (id: string, position: number) => void
}

export const ColorGradientList = forwardRef<HTMLDivElement, ColorGradientListProps>(
  function ColorGradientList(props, ref) {
    const {
      active,
      stops,
      stop,
      selectedStopId,
      alpha,
      onSelectedStopIdChange,
      updateStopPosition,
      updateStopColor,
      updateStopAlpha,
      deleteStop,
      openPicker,
      labels,
      onChangeEnd,
      onChangeStart,
    } = props

    const handleStopClick = useEventCallback(() => {
      onSelectedStopIdChange?.(stop.id)
    })

    const handlePositionChange = useEventCallback((value: NumericInputValue) => {
      const normalizedValue = Number(value) / 100
      updateStopPosition(stop.id, normalizedValue)
    })

    const handleColorChange = useEventCallback((value: RGB) => {
      updateStopColor(stop.id, value)
    })

    const handleAlphaChange = useEventCallback((value: number) => {
      updateStopAlpha(stop.id, value)
    })

    const handleOpenColorPicker = useEventCallback(() => {
      openPicker?.(stop)
    })

    const handleDelete = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      deleteStop(stop.id)
    })

    return (
      <div
        ref={ref}
        className={tcx(
          "grid grid-cols-[1fr_3fr_auto] items-center gap-2 py-2 pr-2 pl-4",
          selectedStopId === stop.id && "bg-selected-background",
        )}
        onClick={handleStopClick}
      >
        {/* Stop Position */}
        <NumericInput
          tooltip={{
            content: labels?.position ?? translation.gradients.STOP_POSITION,
          }}
          classNames={{
            input: "px-1.5",
          }}
          value={Math.round(stop.position * 100)}
          onChange={handlePositionChange}
          expression="{value}%"
          step={1}
          min={0}
          max={100}
        />

        {/* Stop Color */}
        <ColorInput
          active={active?.(stop.id)}
          color={stop.color}
          onColorChange={handleColorChange}
          alpha={alpha}
          onAlphaChange={handleAlphaChange}
          onPickerClick={handleOpenColorPicker}
          onAlphaChangeEnd={onChangeEnd}
          onAlphaChangeStart={onChangeStart}
          alphaTooltipLabel={labels?.alpha ?? translation.input.ALPHA}
          classNames={{
            hex: "px-0 pl-1", // 调整 Hex Input 的样式
          }}
        />

        {/* Delete Stop */}
        {stops.length > 2 ? (
          <IconButton
            tooltip={{
              content: labels?.delete ?? translation.gradients.DELETE_STOP,
            }}
            onClick={handleDelete}
          >
            <DeleteSmall />
          </IconButton>
        ) : (
          <div className="size-6 flex-none" />
        )}
      </div>
    )
  },
)

ColorGradientList.displayName = "ColorGradientList"
