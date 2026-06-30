import { IconButton } from "@choice-ui/icon-button"
import { RemoveSmall, Search } from "@choiceform/icons-react"
import { TextField, type TextFieldProps } from "@choice-ui/text-field"
import { forwardRef, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { searchInputTv } from "./tv"

export interface SearchInputProps extends TextFieldProps {
  /**
   * Whether to show the clear button when there is a value
   * @default true
   */
  clearable?: boolean
  i18n?: {
    clear: string
    placeholder?: string
  }
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const {
    placeholder = "Search...",
    value: valueProp,
    onChange,
    variant = "default",
    disabled,
    clearable = true,
    i18n = {
      clear: "Clear",
    },
    ...rest
  } = props

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [internalValue, setInternalValue] = useState<string>(
    typeof props.defaultValue === "string" ? props.defaultValue : "",
  )
  const isControlled = valueProp !== undefined
  const displayValue = isControlled ? valueProp : internalValue

  const handleChange = useEventCallback((value: string) => {
    if (!isControlled) {
      setInternalValue(value)
    }
    onChange?.(value)
  })

  const handleClear = useEventCallback(() => {
    if (!isControlled) {
      setInternalValue("")
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
    onChange?.("")
    inputRef.current?.focus()
  })

  const tv = searchInputTv({ variant, disabled })

  return (
    <TextField
      ref={(el) => {
        inputRef.current = el
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
      }}
      placeholder={i18n.placeholder ?? placeholder}
      value={isControlled ? displayValue : undefined}
      onChange={handleChange}
      variant={variant}
      disabled={disabled}
      {...rest}
    >
      <TextField.Prefix className={tv.icon()}>
        <Search />
      </TextField.Prefix>
      {displayValue && clearable && (
        <TextField.Suffix>
          <IconButton
            className={tv.action()}
            variant="ghost"
            tooltip={{ content: i18n.clear }}
            onClick={handleClear}
            disabled={disabled}
            data-clear-button
          >
            <RemoveSmall />
          </IconButton>
        </TextField.Suffix>
      )}
    </TextField>
  )
})

SearchInput.displayName = "SearchInput"
