import { tcx } from "@choice-ui/shared"
import { Tooltip, type TooltipProps } from "@choice-ui/tooltip"
import { forwardRef, HTMLProps, useId } from "react"
import { toggleButtonTv } from "./tv"

export interface ToggleButtonProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange" | "size"> {
  active?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  event?: "click" | "mousedown"
  focused?: boolean
  onChange?: (value: boolean) => void
  readOnly?: boolean
  size?: "default" | "large"
  tooltip?: TooltipProps
  value: boolean
  variant?: "default" | "secondary" | "highlight" | "reset"
}

export const ToggleButton = forwardRef<HTMLInputElement, ToggleButtonProps>(
  function ToggleButton(props, ref) {
    const {
      className,
      variant = "default",
      size = "default",
      children,
      disabled,
      readOnly = false,
      active,
      focused,
      value,
      tooltip,
      event = "click",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      onChange,
      onMouseDown,
      onContextMenu,
      ...rest
    } = props

    const id = useId()
    const descriptionId = useId()

    const styles = toggleButtonTv({
      checked: value,
      disabled,
      variant,
      active,
      focused,
      event,
      size,
    })

    const button = (
      <div
        className={tcx(styles.root(), className)}
        role="presentation"
        onContextMenu={onContextMenu}
      >
        <span className="sr-only">{value ? "Enabled" : "Disabled"}</span>

        <input
          ref={ref}
          id={id}
          className={styles.input()}
          tabIndex={0}
          type="checkbox"
          checked={value}
          disabled={disabled || readOnly}
          onChange={(e) => {
            if (!readOnly) {
              onChange?.(e.target.checked)
            }
          }}
          aria-checked={value}
          aria-disabled={disabled || readOnly}
          aria-label={ariaLabel || (typeof children === "string" ? children : undefined)}
          aria-describedby={ariaDescribedby || (children ? descriptionId : undefined)}
          {...rest}
        />

        <label
          htmlFor={id}
          id={descriptionId}
          className={styles.label()}
          onMouseDown={(e) => {
            if (readOnly) return

            if (event === "mousedown") {
              e.preventDefault()
              onMouseDown?.(e as unknown as React.MouseEvent<HTMLInputElement>)
              if (!disabled) {
                onChange?.(!value)
              }
              const clickHandler = (e: Event) => {
                e.preventDefault()
                e.stopPropagation()
                document.removeEventListener("click", clickHandler, true)
              }
              document.addEventListener("click", clickHandler, true)
            }
          }}
        >
          {children}
        </label>
      </div>
    )

    return tooltip ? <Tooltip {...tooltip}>{button}</Tooltip> : button
  },
)

ToggleButton.displayName = "ToggleButton"
