import { Slot } from "@choiceform/slot"
import { tcx } from "@choiceform/design-shared"
import { LoaderCircle } from "@choiceform/icons-react"
import { Tooltip, type TooltipProps } from "@choiceform/tooltip"
import { forwardRef, HTMLProps } from "react"
import { iconButtonTv } from "./tv"

export interface IconButtonProps extends Omit<HTMLProps<HTMLButtonElement>, "size"> {
  active?: boolean
  asChild?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  focused?: boolean
  loading?: boolean
  readOnly?: boolean
  size?: "default" | "large" | "reset"
  tooltip?: TooltipProps
  variant?: "default" | "secondary" | "solid" | "highlight" | "ghost" | "dark" | "reset"
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const {
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

    const Button = asChild ? Slot : "button"

    const style = iconButtonTv({
      disabled,
      active,
      focused,
      loading,
      variant,
      size,
    })

    // 在 readOnly 模式下阻止 onClick 事件
    const handleClick = readOnly ? undefined : onClick

    const button = (
      <Button
        {...rest}
        ref={ref}
        type={(rest.type as "button" | "submit" | "reset" | undefined) || "button"}
        className={tcx(style.button(), className)}
        disabled={disabled || loading}
        onClick={handleClick}
      >
        {loading ? <LoaderCircle className="animate-spin" /> : children}
      </Button>
    )

    return tooltip ? <Tooltip {...tooltip}>{button}</Tooltip> : button
  },
)

IconButton.displayName = "IconButton"
