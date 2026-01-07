import { tcx, type PressMoveProps } from "@choice-ui/shared"
import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { ColorSwatch } from "../color-swatch"
import { translation } from "../contents"
import { HexInput } from "../hex-input"
import type { RGB } from "../types/colors"
import { AlphaInput } from "./alpha-input"
import { fillInputTv } from "./tv"

export interface ColorInputProps {
  active?: boolean
  alpha?: number
  alphaTooltipLabel?: string
  children?: React.ReactNode
  className?: string
  classNames?: {
    alpha?: string
    container?: string
    hex?: string
    swatch?: string
    wrapper?: string
  }
  color?: RGB
  disabled?: boolean
  features?: {
    alpha?: boolean
  }
  onAlphaChange?: (alpha: number) => void
  onAlphaChangeEnd?: PressMoveProps["onPressEnd"]
  onAlphaChangeStart?: PressMoveProps["onPressStart"]
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onColorChange?: (color: RGB) => void
  onFocus?: () => void
  onPickerClick?: () => void
  placeholder?: string
  selected?: boolean
}

export const ColorInput = forwardRef<HTMLDivElement, ColorInputProps>(
  function ColorInput(props, ref) {
    const {
      className,
      classNames,
      alpha,
      alphaTooltipLabel,
      color,
      active,
      disabled,
      selected,
      onAlphaChange,
      onAlphaChangeEnd,
      onAlphaChangeStart,
      onClick,
      onFocus,
      onColorChange,
      onPickerClick,
      placeholder = translation.input.SOLID,
      features = {
        alpha: true,
      },
    } = props

    const handleClick = useEventCallback((e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onClick?.(e)
    })

    const handleSwatchMouseDown = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onPickerClick?.()
    })

    const handleLabelMouseDown = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      if (disabled) return
      onPickerClick?.()
      onColorChange?.({ r: 250, g: 250, b: 250 })
    })

    const styles = fillInputTv({
      type: "SOLID",
      alpha: features.alpha,
      selected,
      active,
      variantType: "VARIABLE",
      empty: !color,
    })

    return (
      <>
        <div
          ref={ref}
          className={tcx(styles.root(), classNames?.container, className)}
          onClick={handleClick}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
        >
          <div className={styles.wrapper()}>
            <ColorSwatch
              className={tcx(styles.swatch(), classNames?.swatch)}
              color={color}
              alpha={alpha}
              onMouseDown={handleSwatchMouseDown}
            />
            {color ? (
              <HexInput
                className={tcx(styles.hex(), classNames?.hex)}
                value={color}
                onChange={onColorChange}
                onAlphaChange={onAlphaChange}
                disabled={disabled}
                onFocus={onFocus}
              />
            ) : (
              <span
                className={tcx(styles.label(), "flex h-full w-full items-center pl-2")}
                onMouseDown={handleLabelMouseDown}
              >
                {placeholder}
              </span>
            )}
          </div>

          {features.alpha && (
            <AlphaInput
              className={tcx(styles.alpha(), classNames?.alpha)}
              value={alpha}
              onChange={onAlphaChange}
              active={active}
              disabled={disabled}
              onPressEnd={onAlphaChangeEnd}
              onPressStart={onAlphaChangeStart}
              tooltipLabel={alphaTooltipLabel}
            />
          )}
        </div>
      </>
    )
  },
)

ColorInput.displayName = "ColorInput"
