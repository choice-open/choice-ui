import { RemoveSmall, Search } from "@choiceform/icons-react"
import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { IconButton } from "../icon-button"
import { TextField, type TextFieldProps } from "../text-field"
import { searchInputTv } from "./tv"

export interface SearchInputProps extends TextFieldProps {
  defaultText?: {
    placeholder: string
    clear: string
  }
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const {
    placeholder = "Search...",
    value,
    onChange,
    variant = "default",
    disabled,
    defaultText = {
      clear: "Clear",
    },
    ...rest
  } = props

  const handleClear = useEventCallback(() => {
    onChange?.("")
  })

  const style = searchInputTv({ variant, disabled })

  return (
    <TextField
      ref={ref}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      variant={variant}
      disabled={disabled}
      {...rest}
    >
      <TextField.Prefix className={style.icon()}>
        <Search />
      </TextField.Prefix>
      {value && (
        <TextField.Suffix>
          <IconButton
            className={style.action()}
            variant="ghost"
            tooltip={{ content: defaultText.clear }}
            onClick={handleClear}
          >
            <RemoveSmall />
          </IconButton>
        </TextField.Suffix>
      )}
    </TextField>
  )
})

SearchInput.displayName = "SearchInput"
