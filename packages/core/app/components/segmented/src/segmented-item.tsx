import { tcx } from "@choice-ui/shared"
import { Tooltip, type TooltipProps } from "@choice-ui/tooltip"
import { forwardRef, memo, ReactNode } from "react"
import { useEventCallback } from "usehooks-ts"
import { useSegmentedContext } from "./context"
import { segmentedControlTv } from "./tv"

export interface SegmentedItemProps {
  "aria-label"?: string
  children: ReactNode
  className?: string
  disabled?: boolean
  onHoverChange?: (isHovered: boolean) => void
  tooltip?: TooltipProps
  value: string
}

export const SegmentedItem = memo(
  forwardRef<HTMLLabelElement, SegmentedItemProps>(function SegmentedItem(props, ref) {
    const {
      className,
      children,
      value,
      disabled,
      onHoverChange,
      tooltip,
      "aria-label": ariaLabel,
      ...rest
    } = props

    const {
      value: selectedValue,
      onChange,
      groupId,
      variant,
      disabled: contextDisabled,
      readOnly: contextReadOnly,
    } = useSegmentedContext()
    const isActive = value === selectedValue

    const isDisabled = contextDisabled || disabled

    const tv = segmentedControlTv({
      active: isActive,
      disabled: isDisabled,
      variant,
    })

    const optionId = `${groupId}-${value}`

    const ariaLabelProp = typeof children === "string" ? children : ariaLabel

    const handleChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (contextReadOnly) return
      if (e.target.checked) {
        onChange(value)
      }
    })

    const handleMouseEnter = useEventCallback(() => {
      onHoverChange?.(true)
    })

    const handleMouseLeave = useEventCallback(() => {
      onHoverChange?.(false)
    })

    const optionClassName = tcx(tv.option(), className)

    const inputElement = (
      <input
        className={tv.input()}
        type="radio"
        id={optionId}
        name={groupId}
        disabled={isDisabled || contextReadOnly}
        checked={isActive}
        value={value}
        aria-label={ariaLabelProp}
        aria-checked={isActive}
        aria-disabled={isDisabled || contextReadOnly}
        onChange={handleChange}
      />
    )

    const contentElement = (
      <div
        className={optionClassName}
        aria-hidden="true"
      >
        {children}
      </div>
    )

    const label = (
      <label
        ref={ref}
        htmlFor={optionId}
        className="pointer-events-none relative"
        aria-disabled={isDisabled || contextReadOnly}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {inputElement}
        {contentElement}
      </label>
    )

    if (tooltip) {
      return <Tooltip {...tooltip}>{label}</Tooltip>
    }

    return label
  }),
)

SegmentedItem.displayName = "SegmentedItem"
