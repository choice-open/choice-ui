import { tcx } from "@choice-ui/shared"
import { useColorSlider } from "../context"

export interface ColorSliderTrackProps {
  className?: string
  children?: React.ReactNode
  /**
   * Height of the track in pixels.
   * This prop is extracted by the parent ColorSlider and passed via context.
   */
  height?: number
}

/**
 * ColorSliderTrack - The track background of the color slider.
 * Renders the gradient background based on slider type (hue, alpha, etc.)
 * Can contain custom children for additional visual elements.
 */
export function ColorSliderTrack(props: ColorSliderTrackProps) {
  // height prop is extracted by parent component and passed via context
  const { className, children, height: _height } = props
  const { trackStyle } = useColorSlider()

  return (
    <div
      className={tcx("absolute inset-0 rounded-full", className)}
      style={trackStyle}
    >
      {children}
    </div>
  )
}

ColorSliderTrack.displayName = "ColorSliderTrack"
