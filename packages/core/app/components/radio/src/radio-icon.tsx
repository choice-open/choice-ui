import { tcx } from "@choice-ui/shared"
import { Dot } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, memo, ReactNode } from "react"
import { useRadioContext } from "./context"
import { radioTv } from "./tv"

export interface RadioIconProps extends Omit<HTMLProps<HTMLDivElement>, "children"> {
  children?: ReactNode | ((props: { value?: boolean }) => ReactNode)
}

export const RadioIcon = memo(
  forwardRef<HTMLDivElement, RadioIconProps>(function RadioIcon(props, ref) {
    const { className, children, ...rest } = props
    const { value, disabled, variant } = useRadioContext()
    const tv = radioTv({
      type: "radio",
      variant,
      disabled,
      checked: value,
    })

    const renderIcon = () => {
      if (typeof children === "function") {
        return children({ value })
      }
      if (children !== undefined) {
        return children
      }
      return value ? <Dot /> : null
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

RadioIcon.displayName = "Radio.Icon"
