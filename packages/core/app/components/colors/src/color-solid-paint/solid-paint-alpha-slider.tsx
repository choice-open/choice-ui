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
  const { hue, alpha, onAlphaChange, onChangeStart, onChangeEnd, width } = props

  return (
    <ColorSlider
      position={alpha}
      onChange={onAlphaChange}
      type="alpha"
      hue={hue}
      width={width}
      onChangeStart={onChangeStart}
      onChangeEnd={onChangeEnd}
    />
  )
}
