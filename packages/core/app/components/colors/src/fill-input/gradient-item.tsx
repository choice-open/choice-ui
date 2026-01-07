import { tcx } from "@choice-ui/shared"
import { forwardRef, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { ColorSwatch } from "../color-swatch"
import { translation } from "../contents"
import type { GradientFillLabels, GradientPaint } from "../types/paint"
import { AlphaInput } from "./alpha-input"
import { fillInputTv } from "./tv"

export interface GradientItemProps {
  active?: boolean
  alpha?: number
  className?: string
  classNames?: {
    alpha?: string
    container?: string
    content?: string
    swatch?: string
    wrapper?: string
  }
  disabled?: boolean
  features?: {
    alpha?: boolean
  }
  gradient?: GradientPaint
  labels?: GradientFillLabels
  onAlphaChange?: (alpha: number) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onGradientChange?: (gradient: GradientPaint) => void
  onPickerClick?: () => void
  selected?: boolean
}

export const GradientItem = forwardRef<HTMLDivElement, GradientItemProps>(
  function GradientItem(props, ref) {
    const {
      className,
      classNames,
      alpha,
      gradient,
      active,
      disabled,
      selected,
      onAlphaChange,
      onClick,
      onPickerClick,
      labels,
      features = {
        alpha: true,
      },
    } = props

    const handleContainerClick = useEventCallback((e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onClick?.(e)
    })

    const handleWrapperMouseDown = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onPickerClick?.()
    })

    const handleWrapperClick = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
    })

    const gradientLabel = useMemo(() => {
      switch (gradient?.type) {
        case "GRADIENT_LINEAR":
          return labels?.linear ?? translation.gradients.LINEAR
        case "GRADIENT_RADIAL":
          return labels?.radial ?? translation.gradients.RADIAL
        case "GRADIENT_ANGULAR":
          return labels?.conic ?? translation.gradients.CONIC
        default:
          return "Linear"
      }
    }, [gradient?.type, labels?.conic, labels?.linear, labels?.radial])

    const styles = fillInputTv({
      type: "GRADIENT",
      alpha: features.alpha,
      selected,
      active,
      disabled,
      variantType: "VARIABLE",
      empty: !gradient,
    })

    return (
      <div
        ref={ref}
        className={tcx(styles.root(), classNames?.container, className)}
        onClick={handleContainerClick}
      >
        <div
          className={tcx(styles.wrapper(), classNames?.wrapper)}
          onMouseDown={handleWrapperMouseDown}
          onClick={handleWrapperClick}
        >
          <ColorSwatch
            className={tcx(styles.swatch(), classNames?.swatch)}
            gradient={gradient}
          />
          <div className={tcx(styles.content(), classNames?.content)}>
            <span className={styles.label()}>{gradientLabel}</span>
          </div>
        </div>

        {features.alpha && (
          <AlphaInput
            className={tcx(styles.alpha(), classNames?.alpha)}
            value={alpha}
            onChange={onAlphaChange}
            disabled={disabled}
            active={active}
            tooltipLabel={labels?.alpha ?? translation.input.ALPHA}
          />
        )}
      </div>
    )
  },
)

GradientItem.displayName = "GradientItem"
