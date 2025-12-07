import { isMultiElement, tcx } from "@choiceform/design-shared"
import { LoaderCircle } from "@choiceform/icons-react"
import { Slot } from "@choiceform/slot"
import { Tooltip } from "@choiceform/tooltip"
import { cloneElement, forwardRef, isValidElement, useMemo } from "react"
import { buttonTv } from "./tv"
import { type ButtonProps } from "./types"

/**
 * Button component for user interactions
 *
 * @displayName Button
 * @description A versatile button component that supports various styles, states, and behaviors. Renders as a button element or can be used with asChild for custom elements.
 * @category Actions
 * @status stable
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link https://design-system.choiceform.io/components/button Button Documentation}
 */
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

  const style = buttonTv({ variant, size, active, disabled, loading, focused, className })

  const content = isValidElement(children) ? (
    cloneElement(children as React.ReactElement, {
      children: (children as React.ReactElement).props.children,
    })
  ) : loading ? (
    <>
      <div className={tcx(style.spinner())}>
        <LoaderCircle className="animate-spin" />
      </div>
      <span className={tcx(style.content())}>{children}</span>
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

  // 在 readOnly 模式下阻止 onClick 事件
  const handleClick = readOnly ? undefined : onClick

  const button = (
    <Button
      {...rest}
      ref={ref}
      type={(rest.type as "button" | "submit" | "reset" | undefined) || "button"}
      disabled={disabled || loading}
      onClick={handleClick}
      className={tcx(style.button(), className)}
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
