import { ColorSlider } from "../color-slider"
import type { ColorSliderProps } from "../color-slider"

type Props = Omit<ColorSliderProps, "position"> & {
  alpha: number
  hue: number
  onAlphaChange?: (value: number) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
}

export const SolidPaintAlphaSlider = (props: Props) => {
  const { hue, alpha, onAlphaChange, onChangeStart, onChangeEnd, trackSize } = props

  return (
    <ColorSlider
      position={alpha}
      onChange={onAlphaChange}
      type="alpha"
      hue={hue}
      trackSize={trackSize}
      onChangeStart={onChangeStart}
      onChangeEnd={onChangeEnd}
    />
  )
}
