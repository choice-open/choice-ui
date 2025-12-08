import { tcx } from "@choice-ui/shared"
import { IconButton } from "@choice-ui/icon-button"
import { RemoveTiny } from "@choiceform/icons-react"
import { ElementType, forwardRef, HTMLProps, memo, ReactNode } from "react"
import { chipTv } from "./tv"

export interface ChipProps extends Omit<HTMLProps<HTMLDivElement>, "size" | "as"> {
  as?: ElementType
  classNames?: {
    closeButton?: string
    prefix?: string
    root?: string
    suffix?: string
    text?: string
  }
  disabled?: boolean
  i18n?: {
    chip: string
    remove: string
  }
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onRemove?: (e: React.MouseEvent<HTMLElement>) => void
  prefixElement?: ReactNode
  selected?: boolean
  size?: "default" | "medium"
  suffixElement?: ReactNode
  variant?: "default" | "accent" | "success" | "rest"
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
      i18n = {
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
            aria-label={i18n.remove + (typeof children === "string" ? children : i18n.chip)}
            disabled={disabled}
            size="reset"
            variant="reset"
            data-remove-button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onRemove?.(e)
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <RemoveTiny />
          </IconButton>
        )}
      </Component>
    )
  }),
)

Chip.displayName = "Chip"
