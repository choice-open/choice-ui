import { isMultiElement, tcx } from "@choice-ui/shared"
import { Slot } from "@choice-ui/slot"
import { LoaderCircle } from "@choiceform/icons-react"
import { cloneElement, forwardRef, HTMLProps, isValidElement, useMemo } from "react"
import { buttonTv } from "./tv"

export interface ButtonProps extends Omit<
  HTMLProps<HTMLButtonElement | HTMLAnchorElement>,
  "size" | "as"
> {
  active?: boolean
  as?: React.ElementType
  asChild?: boolean
  className?: string
  focused?: boolean
  loading?: boolean
  readOnly?: boolean
  size?: "default" | "large"
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
    as,
    "aria-label": ariaLabel,
    onClick,
    ...rest
  } = props

  const As = as ?? "button"
  const AsComponent = asChild ? Slot : As

  // 只在真正渲染为 button 时才添加 type 属性，asChild 模式下不添加
  const elementProps =
    !asChild && As === "button"
      ? { type: (rest.type as "button" | "submit" | "reset") ?? "button" }
      : {}

  const tv = useMemo(
    () =>
      buttonTv({
        variant,
        size,
        active,
        disabled,
        loading,
        focused,
      }),
    [variant, size, active, disabled, loading, focused],
  )

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

  return (
    <AsComponent
      ref={ref}
      className={tcx(tv.button({ multiElement: isMultiElement(content) }), className)}
      {...elementProps}
      {...rest}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabelProps}
    >
      {content}
    </AsComponent>
  )
})

Button.displayName = "Button"
