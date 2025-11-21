import { forwardRef, memo, ReactNode } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { Tooltip, type TooltipProps } from "../tooltip"
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
      readonly: contextReadonly,
    } = useSegmentedContext()
    const isActive = value === selectedValue

    const isDisabled = contextDisabled || disabled
    const styles = segmentedControlTv({
      active: isActive,
      disabled: isDisabled,
      variant,
    })

    const optionId = `${groupId}-${value}`

    const ariaLabelProp = typeof children === "string" ? children : ariaLabel

    const handleChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (contextReadonly) return
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

    const optionClassName = tcx(styles.option(), className)

    const inputElement = (
      <input
        className={styles.input()}
        type="radio"
        id={optionId}
        name={groupId}
        disabled={isDisabled || contextReadonly}
        checked={isActive}
        value={value}
        aria-label={ariaLabelProp}
        aria-checked={isActive}
        aria-disabled={isDisabled || contextReadonly}
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
        aria-disabled={isDisabled || contextReadonly}
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
