import { forwardRef, HTMLProps } from "react"

import { memo, ReactNode } from "react"
import { tcx } from "~/utils"
import { checkboxTv } from "./tv"

export interface CheckboxLabelProps extends HTMLProps<HTMLLabelElement> {
  children: ReactNode
}

export const CheckboxLabel = memo(
  forwardRef<HTMLLabelElement, CheckboxLabelProps>(function CheckboxLabel(props, ref) {
    const { children, className, htmlFor, id, disabled, ...rest } = props
    const styles = checkboxTv({ disabled })

    return (
      <label
        ref={ref}
        id={id}
        htmlFor={htmlFor}
        className={tcx(styles.label(), className)}
        {...rest}
      >
        {children}
      </label>
    )
  }),
)

CheckboxLabel.displayName = "Checkbox.Label"
