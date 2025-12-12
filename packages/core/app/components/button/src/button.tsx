import { isMultiElement, tcx } from "@choice-ui/shared"
import { LoaderCircle } from "@choiceform/icons-react"
import { Slot } from "@choice-ui/slot"
import { Tooltip, TooltipProps } from "@choice-ui/tooltip"
import { cloneElement, forwardRef, HTMLProps, isValidElement, useMemo } from "react"
import { buttonTv } from "./tv"

export interface ButtonProps extends Omit<HTMLProps<HTMLButtonElement>, "size"> {
  active?: boolean
  asChild?: boolean
  className?: string
  focused?: boolean
  loading?: boolean
  readOnly?: boolean
  /**
   * @default "default"
   */
  size?: "default" | "large"
  tooltip?: TooltipProps
  /**
   * @default "primary"
   */
  variant?:
    | "primary"
    | "secondary"
    | "solid"
    | "destructive"
    | "secondary-destruct"
    | "inverse"
    | "success"
    | "link"
    | "link-danger"
    | "ghost"
    | "dark"
    | "reset"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    className,
    variant = "primary",
    size = "default",
    disabled,
    readOnly = false,
    active,
    focused,
    loading,
    asChild,
    children,
    tooltip,
    "aria-label": ariaLabel,
    onClick,
    ...rest
  } = props

  const Button = asChild ? Slot : "button"

  const tv = buttonTv({ variant, size, active, disabled, loading, focused, className })

  const content = isValidElement(children) ? (
    cloneElement(children as React.ReactElement, {
      children: (children as React.ReactElement).props.children,
    })
  ) : loading ? (
    <>
      <div className={tcx(tv.spinner())}>
        <LoaderCircle className="animate-spin" />
      </div>
      <span className={tcx(tv.content())}>{children}</span>
    </>
  ) : (
    children
  )

  const ariaLabelProps = useMemo(() => {
    if (typeof children === "string") {
      return children
    }

    return props["aria-label"]
  }, [children, props])

  // In readOnly mode, prevent onClick event
  const handleClick = readOnly ? undefined : onClick

  const button = (
    <Button
      {...rest}
      ref={ref}
      type={(rest.type as "button" | "submit" | "reset" | undefined) || "button"}
      disabled={disabled || loading}
      onClick={handleClick}
      className={tcx(tv.button(), className)}
      data-multi-element={isMultiElement(content)}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabelProps}
    >
      {content}
    </Button>
  )

  return tooltip ? <Tooltip {...tooltip}>{button}</Tooltip> : button
})

Button.displayName = "Button"
