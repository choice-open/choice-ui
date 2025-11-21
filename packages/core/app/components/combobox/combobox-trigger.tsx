import { ChevronDownSmall, RemoveSmall } from "@choiceform/icons-react"
import React, { forwardRef, ReactNode, useState, type HTMLProps } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { IconButton } from "../icon-button"
import { comboboxTriggerTv } from "./tv"

export interface ComboboxTriggerProps
  extends Omit<HTMLProps<HTMLInputElement>, "size" | "onChange"> {
  active?: boolean
  disabled?: boolean
  i18n?: {
    clear: string
    placeholder: string
  }
  noMatch?: boolean
  onChange?: (value: string) => void
  onClick?: () => void
  placeholder?: string
  prefixElement?: ReactNode
  showClear?: boolean
  size?: "default" | "large"
  suffixElement?: ReactNode
  value?: string
  variant?: "default" | "dark" | "reset"
}

export const ComboboxTrigger = forwardRef<HTMLInputElement, ComboboxTriggerProps>(
  function ComboboxTrigger(props, ref) {
    const {
      active = false,
      className,
      disabled = false,
      readOnly = false,
      onChange,
      onClick,
      onFocus,
      onBlur,
      placeholder,
      size = "default",
      value = "",
      prefixElement,
      suffixElement = <ChevronDownSmall />,
      i18n = {
        clear: "Clear",
      },
      noMatch = false,
      showClear = false,
      ...rest
    } = props

    const [isFocused, setIsFocused] = useState(false)

    const tv = comboboxTriggerTv({
      size,
      disabled,
      open: active,
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement,
    })

    const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      onChange?.(newValue)
    })

    const handleClear = useEventCallback(() => {
      if (readOnly) return
      onChange?.("")
    })

    const handleFocus = useEventCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(event)
    })

    const handleBlur = useEventCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(event)
    })

    return (
      <div className={tcx(tv.root(), className)}>
        {prefixElement && <div className={tv.icon()}>{prefixElement}</div>}
        <input
          ref={ref}
          className={tv.input()}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete="off"
          role="combobox"
          aria-expanded={active}
          aria-autocomplete="list"
          {...rest}
        />

        {showClear && value ? (
          <IconButton
            className={tv.icon()}
            variant="ghost"
            tooltip={{ content: i18n.clear }}
            onClick={handleClear}
          >
            <RemoveSmall />
          </IconButton>
        ) : (
          suffixElement && (
            <IconButton
              className={tv.icon()}
              variant="solid"
              active={active}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onClick?.()
              }}
            >
              {suffixElement}
            </IconButton>
          )
        )}
      </div>
    )
  },
)
