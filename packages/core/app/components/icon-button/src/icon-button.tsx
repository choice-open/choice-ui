import { Slot } from "@choice-ui/slot"
import { tcx } from "@choice-ui/shared"
import { LoaderCircle } from "@choiceform/icons-react"
import { Tooltip, type TooltipProps } from "@choice-ui/tooltip"
import { forwardRef, HTMLProps } from "react"
import { iconButtonTv } from "./tv"

export interface IconButtonProps extends Omit<HTMLProps<HTMLElement>, "size" | "as"> {
  active?: boolean
  as?: React.ElementType
  asChild?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  focused?: boolean
  loading?: boolean
  readOnly?: boolean
  size?: "default" | "large" | "reset"
  tooltip?: TooltipProps
  variant?: "default" | "secondary" | "solid" | "highlight" | "ghost" | "dark" | "submit" | "reset"
}

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(function IconButton(props, ref) {
  const {
    as = "button",
    className,
    children,
    disabled,
    readOnly = false,
    active,
    loading,
    focused,
    variant = "default",
    size = "default",
    tooltip,
    asChild,
    onClick,
    ...rest
  } = props

  const As = asChild ? Slot : as

  const tv = iconButtonTv({
    disabled,
    active,
    focused,
    loading,
    variant,
    size,
  })

  // Prevent onClick event when in readOnly mode
  const handleClick = readOnly ? undefined : onClick

  const button = (
    <As
      {...rest}
      ref={ref}
      type={(rest.type as "button" | "submit" | "reset" | undefined) || "button"}
      className={tcx(tv.button(), className)}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </As>
  )

  return tooltip ? <Tooltip {...tooltip}>{button}</Tooltip> : button
})

IconButton.displayName = "IconButton"
