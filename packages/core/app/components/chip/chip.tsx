import { RemoveSmall } from "@choiceform/icons-react"
import { ElementType, forwardRef, HTMLProps, memo, ReactNode } from "react"
import { tcx } from "~/utils"
import { IconButton } from "../icon-button"
import { chipTv } from "./tv"

export interface ChipProps extends Omit<HTMLProps<HTMLDivElement>, "size" | "as"> {
  classNames?: {
    root?: string
    prefix?: string
    suffix?: string
    text?: string
    closeButton?: string
  }
  prefixElement?: ReactNode
  suffixElement?: ReactNode
  size?: "default" | "medium"
  variant?: "default" | "accent" | "success"
  disabled?: boolean
  selected?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void
  as?: ElementType
  defaultText?: {
    chip: string
    remove: string
  }
}

export const Chip = memo(
  forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
    const {
      className,
      classNames,
      size,
      variant,
      disabled,
      selected,
      onClick,
      onRemove,
      prefixElement,
      suffixElement,
      children,
      as,
      defaultText = {
        chip: "Chip",
        remove: "Remove chip:",
      },
      ...rest
    } = props

    const style = chipTv({
      size,
      variant,
      prefix: !!prefixElement,
      suffix: !!suffixElement || (!!onRemove && !disabled),
      selected,
      disabled,
    })

    const Component = as ?? "div"

    return (
      <Component
        {...rest}
        ref={ref}
        className={tcx(style.root(), classNames?.root, className)}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation()
          onClick?.(e)
        }}
      >
        {prefixElement && (
          <span className={tcx(style.prefix(), classNames?.prefix)}>{prefixElement}</span>
        )}

        <span className={tcx(style.text(), classNames?.text)}>{children}</span>

        {suffixElement && (
          <span className={tcx(style.suffix(), classNames?.suffix)}>{suffixElement}</span>
        )}

        {!disabled && onRemove && (
          <IconButton
            className={tcx(style.closeButton(), classNames?.closeButton)}
            aria-label={
              defaultText.remove + (typeof children === "string" ? children : defaultText.chip)
            }
            disabled={disabled}
            size="reset"
            variant="reset"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.(e)
            }}
          >
            <RemoveSmall />
          </IconButton>
        )}
      </Component>
    )
  }),
)

Chip.displayName = "Chip"
