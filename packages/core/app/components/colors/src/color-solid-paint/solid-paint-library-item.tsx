import { ColorSwatch } from "../color-swatch"
import type { RGBA } from "../types/colors"
import { rgbaToRgb } from "../utils/colors-convert"

type Props = {
  color: RGBA
  onClick: (color: RGBA) => void
  size?: number
}

export const SolidPaintLibraryItem = (props: Props) => {
  const { color, onClick, size = 16 } = props
  const rgbColor = rgbaToRgb(color)

  return (
    <div className="group flex cursor-(--color-picker-cursor) items-center justify-center p-1 select-none">
      <ColorSwatch
        color={rgbColor}
        alpha={color.a}
        size={size}
        className="aspect-square rounded-sm"
        type="VARIABLE"
        onClick={() => onClick(color)}
      />
    </div>
  )
}
