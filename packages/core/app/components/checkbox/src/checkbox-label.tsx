import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps, memo, ReactNode } from "react"
import { useCheckboxContext } from "./context"
import { checkboxTv } from "./tv"

export interface CheckboxLabelProps extends Omit<
  HTMLProps<HTMLLabelElement>,
  "htmlFor" | "id" | "disabled"
> {
  children: ReactNode
}

export const CheckboxLabel = memo(
  forwardRef<HTMLLabelElement, CheckboxLabelProps>(function CheckboxLabel(props, ref) {
    const { children, className, ...rest } = props
    const { id, descriptionId, labelId, disabled } = useCheckboxContext()
    const tv = checkboxTv({ disabled })

    return (
      <label
        ref={ref}
        id={labelId}
        htmlFor={id}
        className={tcx(tv.label(), className)}
        {...rest}
      >
        {children}
      </label>
    )
  }),
)

CheckboxLabel.displayName = "Checkbox.Label"
