import { tcx } from "@choice-ui/shared"
import { CSSProperties, forwardRef, HTMLProps, useMemo } from "react"
import { useColors } from "../context/colots-context"
import type { ColorProfile, RGB } from "../types/colors"
import type { LibrariesType } from "../types/libraries"
import type { GradientPaint } from "../types/paint"
import { getColorSwatchBackground, profileConvertString } from "../utils"
import { getGradientString } from "../utils/color"

export interface ColorSwatchProps extends Omit<HTMLProps<HTMLDivElement>, "color"> {
  alpha?: number
  children?: React.ReactNode
  className?: string
  color?: RGB
  disabled?: boolean
  gradient?: GradientPaint
  size?: number
  type?: LibrariesType
}

const createColorStyle = (
  color: RGB,
  alpha: number,
  type: LibrariesType,
  colorProfile: ColorProfile,
): string => {
  const displayColor = profileConvertString(
    {
      r: color.r,
      g: color.g,
      b: color.b,
    },
    colorProfile,
  )

  if (alpha === 1) return displayColor as string

  const displayColorAlpha = profileConvertString(
    {
      r: color.r,
      g: color.g,
      b: color.b,
      a: alpha,
    },
    colorProfile,
  )

  return `linear-gradient(
    ${type === "VARIABLE" ? "to right" : "45deg"},
    ${displayColor} 50%,
    ${displayColorAlpha} 50%
  )`
}

export const ColorSwatch = forwardRef<HTMLDivElement, ColorSwatchProps>(
  function ColorSwatch(props, ref) {
    const {
      color,
      alpha,
      gradient,
      size = 14,
      className,
      disabled,
      children,
      type = "VARIABLE",
      style,
      ...rest
    } = props

    const { colorProfile } = useColors()

    const checkerboard = useMemo(() => getColorSwatchBackground(size, 3), [size])

    const gradientStyle = useMemo(() => {
      if (!gradient) return null

      const stops = gradient.gradientStops
      const gradientType = gradient.type
      const transform = gradient.gradientTransform

      if (!stops || !gradientType || !transform) return null

      const processedStops = stops.map((stop) => ({
        ...stop,
        color: {
          ...stop.color,
          a: stop.alpha,
        },
      }))

      return {
        stops: processedStops,
        type: gradientType,
        transform,
      }
    }, [gradient])

    const backgroundStyle = useMemo(() => {
      if (gradientStyle) {
        return `${getGradientString(
          gradientStyle.stops,
          gradientStyle.type,
          gradientStyle.transform,
          colorProfile,
        )}, ${checkerboard}`
      }

      if (!color) return ""

      try {
        const colorStyle = createColorStyle(color, alpha ?? 1, type, colorProfile)
        return (alpha ?? 1) < 1 ? `${colorStyle}, ${checkerboard}` : colorStyle
      } catch (error) {
        console.error(error)
        return ""
      }
    }, [color, alpha, type, checkerboard, gradientStyle, colorProfile])

    const swatchStyle = useMemo(
      (): CSSProperties => ({
        width: size,
        height: size,
        background: backgroundStyle,
        ...style,
      }),
      [backgroundStyle, size, style],
    )

    return (
      <div
        ref={ref}
        className={tcx("shadow-line shrink-0", disabled && "saturate-0", className)}
        style={swatchStyle}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
ColorSwatch.displayName = "ColorSwatch"
