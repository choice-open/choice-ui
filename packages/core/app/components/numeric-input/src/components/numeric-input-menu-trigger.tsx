import { tcx } from "@choiceform/design-shared"
import { IconButton, type IconButtonProps } from "@choiceform/icon-button"
import { ChevronDownSmall } from "@choiceform/icons-react"
import { forwardRef, HTMLProps } from "react"
import { useNumericInputContext } from "../context"
import { NumericInputMenuActionPromptTv, NumericInputMenuTriggerTv } from "../tv"

interface NumericInputMenuTriggerProps extends IconButtonProps {
  className?: string
  type?: "menu" | "action"
}

export const NumericInputMenuTrigger = forwardRef<HTMLButtonElement, NumericInputMenuTriggerProps>(
  (props, ref) => {
    const { className, type = "menu", ...rest } = props
    const context = useNumericInputContext()

    const style = NumericInputMenuTriggerTv({
      type,
      disabled: context.disabled,
      variant: context.variant,
    })

    return (
      <IconButton
        ref={ref}
        variant={type === "menu" ? (context.disabled ? "ghost" : "solid") : undefined}
        className={tcx(style, className)}
        disabled={context.disabled}
        {...rest}
      >
        <ChevronDownSmall />
      </IconButton>
    )
  },
)

NumericInputMenuTrigger.displayName = "NumericInputMenuTrigger"

interface NumericInputMenuActionPromptProps extends HTMLProps<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export const NumericInputMenuActionPrompt = forwardRef<
  HTMLDivElement,
  NumericInputMenuActionPromptProps
>((props, ref) => {
  const { className, children, ...rest } = props
  const context = useNumericInputContext()

  return (
    <div
      ref={ref}
      className={tcx(NumericInputMenuActionPromptTv({ disabled: context.disabled }), className)}
      {...rest}
    >
      {children}
    </div>
  )
})

NumericInputMenuActionPrompt.displayName = "NumericInputMenuActionPrompt"
