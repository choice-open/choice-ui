import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps, KeyboardEvent, memo, MouseEvent, ReactNode } from "react"
import { useEventCallback } from "usehooks-ts"
import { useTabsContext } from "./context"
import { tabsTv } from "./tv"

export interface TabItemProps extends Omit<HTMLProps<HTMLElement>, "value" | "as"> {
  as?: React.ElementType
  children: ReactNode
  disabled?: boolean
  value: string
}

export const TabItem = memo(
  forwardRef<HTMLElement, TabItemProps>(function TabItem(
    {
      as = "button",
      children,
      value,
      disabled,
      className,
      "aria-label": ariaLabel,
      onMouseDown,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const {
      value: selectedValue,
      onChange,
      id,
      variant,
      disabled: contextDisabled,
      readOnly: contextReadOnly,
    } = useTabsContext()
    const isActive = value === selectedValue

    const tv = tabsTv({ active: isActive, disabled: contextDisabled || disabled, variant })
    const tabId = `${id}-tab-${value}`

    let ariaLabelText = ariaLabel
    if (!ariaLabelText && typeof children === "string") {
      ariaLabelText = children
    }

    const handleMouseDown = useEventCallback((e: MouseEvent<HTMLElement>) => {
      if (contextReadOnly) return

      if (!contextDisabled && !disabled) {
        e.preventDefault()
        onChange(value)
      }
      e.stopPropagation()
      if (onMouseDown) {
        onMouseDown(e)
      }
    })

    const handleKeyDown = useEventCallback((e: KeyboardEvent<HTMLElement>) => {
      if (contextReadOnly) return

      if (!contextDisabled && !disabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault()
        onChange(value)
      }
      if (onKeyDown) {
        onKeyDown(e)
      }
    })

    const As = as ?? "button"

    return (
      <As
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-disabled={contextDisabled || disabled || contextReadOnly}
        tabIndex={isActive ? 0 : -1}
        id={tabId}
        className={tcx(tv.tab(), className)}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        value={value}
        disabled={contextDisabled || disabled || contextReadOnly}
        {...props}
      >
        <>
          <span
            aria-hidden="true"
            className={tcx(typeof children === "string" ? tv.label() : "sr-only")}
          >
            {typeof children === "string" ? children : ariaLabelText}
          </span>
          <span className={tcx(tv.label())}>{children}</span>
        </>
      </As>
    )
  }),
)

TabItem.displayName = "TabItem"
