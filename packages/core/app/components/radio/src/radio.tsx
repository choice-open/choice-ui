import { tcx } from "@choice-ui/shared"
import { Dot } from "@choiceform/icons-react"
import { Children, forwardRef, HTMLProps, isValidElement, memo, ReactNode, useId } from "react"
import { useEventCallback } from "usehooks-ts"
import { RadioContext } from "./context"
import { RadioIcon } from "./radio-icon"
import { RadioLabel } from "./radio-label"
import { radioTv } from "./tv"

export interface RadioProps extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  children?: ReactNode
  className?: string
  focused?: boolean
  onChange: (value: boolean) => void
  readOnly?: boolean
  value: boolean
  variant?: "default" | "accent" | "outline"
}

const RadioBase = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  const {
    value,
    onChange,
    disabled,
    readOnly = false,
    name,
    variant = "default",
    className,
    focused,
    children,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    onKeyDown,
    ...rest
  } = props
  const id = useId()
  const descriptionId = useId()

  const tv = radioTv({
    type: "radio",
    variant,
    disabled,
    checked: value,
    focused,
  })

  const handleChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return
    onChange(e.target.checked)
  })

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      onChange(!value)
    }
    onKeyDown?.(e)
  })

  // Separate Icon from other children
  const isIconElement = (child: unknown): child is React.ReactElement =>
    isValidElement(child) &&
    (child.type === RadioIcon ||
      (child.type as { displayName?: string })?.displayName === "Radio.Icon")

  const childArray = Children.toArray(children)
  const iconChild = childArray.find(isIconElement)
  const otherChildren = childArray.filter((child) => !isIconElement(child))

  // Automatically wrap string-type children into RadioLabel
  const renderChildren = () => {
    if (otherChildren.length === 1) {
      const child = otherChildren[0]
      if (typeof child === "string" || typeof child === "number") {
        return <RadioLabel>{child}</RadioLabel>
      }
    }
    return otherChildren
  }

  // Render default icon (used when no custom Radio.Icon is provided)
  const renderDefaultIcon = () => (
    <div className={tv.box()}>{value && <Dot />}</div>
  )

  return (
    <RadioContext.Provider value={{ id, descriptionId, disabled, value, variant }}>
      <div className={tcx(tv.root(), className)}>
        <div className="pointer-events-none relative">
          <input
            ref={ref}
            className={tv.input()}
            type="radio"
            id={id}
            name={name}
            checked={value}
            disabled={disabled || readOnly}
            onChange={handleChange}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby || descriptionId}
            aria-checked={value}
            aria-disabled={disabled || readOnly}
            role="radio"
            onKeyDown={handleKeyDown}
            {...rest}
          />
          {iconChild ?? renderDefaultIcon()}
        </div>

        {renderChildren()}
      </div>
    </RadioContext.Provider>
  )
})

const MemoizedRadio = memo(RadioBase) as unknown as RadioType

interface RadioType {
  (props: RadioProps & { ref?: React.Ref<HTMLInputElement> }): JSX.Element
  Icon: typeof RadioIcon
  Label: typeof RadioLabel
  displayName?: string
}

export const Radio = MemoizedRadio as RadioType

Radio.Icon = RadioIcon
Radio.Label = RadioLabel
Radio.displayName = "Radio"
