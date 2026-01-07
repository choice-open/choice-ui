import type { ColorStop } from "../types/colors"
import type { GradientControlLabels } from "../types/paint"
import { ColorGradientControl } from "./color-gradient-control"
import { ColorGradientSlider } from "./color-gradient-slider"

interface ColorGradientCombinedProps {
  active?: (stopId: string) => boolean
  containerWidth: number
  labels?: GradientControlLabels
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onSelectedStopIdChange: (id: string) => void
  onStopColorPickerOpen: (stop: ColorStop) => void
  onStopsChange: (stops: ColorStop[]) => void
  selectedStopId: string
  stops: ColorStop[]
}

export const ColorGradientCombined = (props: ColorGradientCombinedProps) => {
  const {
    active,
    stops,
    selectedStopId,
    onStopsChange,
    onSelectedStopIdChange,
    onStopColorPickerOpen,
    containerWidth,
    onChangeEnd,
    onChangeStart,
    labels,
  } = props

  return (
    <>
      <ColorGradientSlider
        value={stops}
        onChange={onStopsChange}
        onChangeStart={onChangeStart}
        onChangeEnd={onChangeEnd}
        controlledSelectedStopId={selectedStopId}
        onSelectedStopIdChange={onSelectedStopIdChange}
        trackSize={{
          width: containerWidth - 32,
          height: 16,
        }}
        className="min-w-0 px-4 pb-4"
      />

      <ColorGradientControl
        className="min-w-0 border-t"
        active={active}
        stops={stops}
        openPicker={onStopColorPickerOpen}
        selectedStopId={selectedStopId}
        onStopChange={onStopsChange}
        onSelectedStopIdChange={onSelectedStopIdChange}
        controlSize={containerWidth - 32}
        onChangeStart={onChangeStart}
        onChangeEnd={onChangeEnd}
        labels={labels}
      />
    </>
  )
}
