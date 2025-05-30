import { tcx } from "@choiceform/design-system"
import React, { forwardRef } from "react"
import type { TimeFormat } from "./types"
import { useTimeInput } from "./hooks"

interface TimeInputProps {
  className?: string
  disabled?: boolean
  format?: TimeFormat
  onChange?: (value: string | null) => void
  placeholder?: string
  readOnly?: boolean
  value?: string | null
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
  const {
    value,
    onChange,
    format = "HH:mm",
    placeholder,
    disabled,
    readOnly,
    className,
    ...rest
  } = props

  const { inputValue, isFocused, handleInputChange, handleFocus, handleBlur, handleKeyDown } =
    useTimeInput(value, {
      format,
      onChange,
    })

  return (
    <input
      ref={ref}
      type="text"
      value={inputValue}
      onChange={(e) => handleInputChange(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || format.toLowerCase()}
      disabled={disabled}
      readOnly={readOnly}
      className={tcx(
        "w-full rounded-md border px-3 py-2 transition-colors",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
        "read-only:cursor-default read-only:bg-gray-50",
        "border-gray-300",
        className,
      )}
      {...rest}
    />
  )
})

TimeInput.displayName = "TimeInput"
