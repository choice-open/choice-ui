import { tcx } from "@choice-ui/shared"
import { Check, Indeterminate } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, memo, ReactNode } from "react"
import { useCheckboxContext } from "./context"
import { checkboxTv } from "./tv"

export interface CheckboxIconProps extends Omit<HTMLProps<HTMLDivElement>, "children"> {
  children?: ReactNode | ((props: { value?: boolean; mixed?: boolean }) => ReactNode)
}

export const CheckboxIcon = memo(
  forwardRef<HTMLDivElement, CheckboxIconProps>(function CheckboxIcon(props, ref) {
    const { className, children, ...rest } = props
    const { value, mixed, disabled, variant } = useCheckboxContext()
    const tv = checkboxTv({
      type: "checkbox",
      variant,
      disabled,
      checked: value || mixed,
    })

    const renderIcon = () => {
      if (typeof children === "function") {
        return children({ value, mixed })
      }
      if (children !== undefined) {
        return children
      }
      return mixed ? <Indeterminate /> : value ? <Check /> : null
    }

    return (
      <div
        ref={ref}
        className={tcx(tv.box(), className)}
        data-active={value}
        {...rest}
      >
        {renderIcon()}
      </div>
    )
  }),
)

CheckboxIcon.displayName = "Checkbox.Icon"
