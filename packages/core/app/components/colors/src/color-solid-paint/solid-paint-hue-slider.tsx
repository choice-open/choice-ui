import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import type { ColorSliderProps } from "../color-slider"
import { ColorSlider } from "../color-slider"
import type { RGB } from "../types/colors"
import type { ColorUpdateSource } from "../types/paint"
import { hslToRgb } from "../utils/colors-convert"

type Props = Omit<ColorSliderProps, "position"> & {
  color: RGB
  hue: number
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onColorChange?: (color: RGB) => void
  setHue: (newHue: number) => void

  updateSourceRef: React.MutableRefObject<ColorUpdateSource>
}

export const SolidPaintHueSlider = (props: Props) => {
  const {
    hue,
    setHue,
    color,
    onColorChange,
    width,
    onChangeStart,
    onChangeEnd,
    updateSourceRef,
  } = props

  const handleHueChange = useEventCallback((value: number) => {
    const hslColor = tinycolor(color).toHsl()

    const hueValue = value * 360

    const newHslColor = {
      ...hslColor,
      h: hueValue,
    }

    setHue(hueValue)
    updateSourceRef.current = "internal"

    const rgbColor = hslToRgb(newHslColor)
    onColorChange?.(rgbColor)
  })

  return (
    <ColorSlider
      position={hue / 360}
      onChange={handleHueChange}
      type="hue"
      width={width}
      onChangeStart={onChangeStart}
      onChangeEnd={() => {
        onChangeEnd?.()
        updateSourceRef.current = "external"
      }}
    />
  )
}
