import { tcx } from "@choice-ui/shared"
import { translation } from "../../contents"
import { useColorSlider } from "../context"

export interface ColorSliderThumbProps {
  className?: string
  size?: number
}

export function ColorSliderThumb(props: ColorSliderThumbProps) {
  const { className } = props
  const {
    thumbRef,
    inputRef,
    thumbWrapperStyle,
    thumbStyle,
    disabled,
    handlePointerDown,
    handleKeyDown,
    tv,
  } = useColorSlider()

  return (
    <div
      ref={thumbRef}
      onPointerDown={handlePointerDown}
      className={tv.thumbWrapper()}
      style={thumbWrapperStyle}
    >
      <div
        className={tcx(tv.thumb(), className)}
        style={thumbStyle}
      >
        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          className={tv.thumbInput()}
          aria-label={translation.slider.ARIA_LABEL}
          tabIndex={disabled ? -1 : 0}
          readOnly
        />
      </div>
    </div>
  )
}

ColorSliderThumb.displayName = "ColorSliderThumb"
