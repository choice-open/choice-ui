import { forwardRef, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { ColorPickerPopover } from "../color-picker-popover"
import { ColorSolidPaint } from "../color-solid-paint"
import { translation } from "../contents"
import type { ChannelFieldSpace, ColorStop, RGB, Transform } from "../types/colors"
import type { GradientLabels, GradientPaint, SolidPaintLabels } from "../types/paint"
import { ColorGradientCombined } from "./color-gradient-combined"
import { ColorGradientsToolbar } from "./color-gradients-toolbar"

export interface ColorGradientsPaintProps {
  className?: string
  colorSpace: ChannelFieldSpace
  features?: {
    containerWidth?: number
  }
  gradient: GradientPaint
  labels?: GradientLabels
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onColorSpaceChange: (colorSpace: ChannelFieldSpace) => void
  onGradientChange?: (gradient: GradientPaint) => void
  solidPaintLabels?: SolidPaintLabels
}

export const ColorGradientsPaint = forwardRef<HTMLDivElement, ColorGradientsPaintProps>(
  function ColorGradientsPaint(props, ref) {
    const {
      className,
      gradient,
      onGradientChange,
      features = {
        containerWidth: 240,
      },
      labels,
      colorSpace,
      onColorSpaceChange,
      onChangeStart,
      onChangeEnd,
      solidPaintLabels,
    } = props

    // State
    const [selectedStopId, setSelectedStopId] = useState(() => gradient.gradientStops[0]?.id ?? "")
    const [colorPaneOpen, setColorPaneOpen] = useState<string | null>(null)

    const gradientStops = gradient.gradientStops

    const [selectedStopColor, selectedStopAlpha] = useMemo(() => {
      const selectedStop = gradientStops.find((stop) => stop.id === selectedStopId)
      return [selectedStop?.color, selectedStop?.alpha]
    }, [selectedStopId, gradientStops])

    const controlRef = useRef<HTMLDivElement>(null)

    const handleTypeChange = useEventCallback((value: string) => {
      onGradientChange?.({
        ...gradient,
        type: value as GradientPaint["type"],
      })
    })

    const handleRotate = useEventCallback(() => {
      const transform = gradient.gradientTransform
      const newTransform = transform.map((row) => row.map((value) => (value + 90) % 360))
      onGradientChange?.({
        ...gradient,
        gradientTransform: newTransform as Transform,
      })
    })

    const handleFlipStops = useEventCallback(() => {
      const sortedStops = [...gradient.gradientStops].sort((a, b) => a.position - b.position)
      const flippedStops = sortedStops
        .map((stop) => ({
          ...stop,
          position: 1 - stop.position,
        }))
        .reverse()
      onGradientChange?.({
        ...gradient,
        gradientStops: flippedStops,
      })
    })

    const handleStopsChange = useEventCallback((newStops: readonly ColorStop[]) => {
      onGradientChange?.({
        ...gradient,
        gradientStops: [...newStops],
      })
    })

    const handleSelectedStopIdChange = useEventCallback((id: string) => {
      setSelectedStopId(id)
    })

    const handleOpenStopColorPicker = useEventCallback((stop: ColorStop) => {
      setSelectedStopId(stop.id)
      setColorPaneOpen(stop.id)
    })

    const handleSelectStopColorChange = useEventCallback((color: RGB) => {
      const newStops = gradientStops.map((stop) =>
        stop.id === selectedStopId ? { ...stop, color } : stop,
      )

      handleStopsChange(newStops)
    })

    const handleSelectStopAlphaChange = useEventCallback((alpha: number) => {
      const newStops = gradientStops.map((stop) =>
        stop.id === selectedStopId ? { ...stop, alpha } : stop,
      )

      handleStopsChange(newStops)
    })

    return (
      <>
        <div
          ref={controlRef}
          className={className}
        >
          <ColorGradientsToolbar
            type={gradient.type}
            onTypeChange={handleTypeChange}
            onRotate={handleRotate}
            onFlipStops={handleFlipStops}
            labels={labels}
          />

          <ColorGradientCombined
            active={(stopId) => colorPaneOpen === stopId}
            stops={gradient.gradientStops}
            selectedStopId={selectedStopId}
            onStopsChange={handleStopsChange}
            onSelectedStopIdChange={handleSelectedStopIdChange}
            onStopColorPickerOpen={handleOpenStopColorPicker}
            containerWidth={features?.containerWidth ?? 240}
            onChangeStart={onChangeStart}
            onChangeEnd={onChangeEnd}
            labels={labels}
          />
        </div>

        <ColorPickerPopover
          autoUpdate={true}
          triggerRef={controlRef}
          placement="left-start"
          open={colorPaneOpen !== null}
          onOpenChange={(open) => {
            if (!open) {
              setColorPaneOpen(null)
            }
          }}
          labels={{
            custom: solidPaintLabels?.custom ?? translation.colorPicker.TITLE,
          }}
          solidPaint={
            <ColorSolidPaint
              onChangeStart={onChangeStart}
              onChangeEnd={onChangeEnd}
              colorSpace={colorSpace}
              onColorSpaceChange={onColorSpaceChange}
              color={selectedStopColor}
              onColorChange={handleSelectStopColorChange}
              alpha={selectedStopAlpha}
              onAlphaChange={handleSelectStopAlphaChange}
              labels={solidPaintLabels}
            />
          }
          features={{
            paintsType: false,
            pickerType: true,
          }}
        />
      </>
    )
  },
)

ColorGradientsPaint.displayName = "ColorGradientsPaint"
