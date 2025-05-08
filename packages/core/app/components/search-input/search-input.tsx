import { RemoveSmall, Search } from "@choiceform/icons-react"
import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { useI18nContext } from "~/i18n/i18n-react"
import { IconButton } from "../icon-button"
import { TextField, type TextFieldProps } from "../text-field"
import { searchInputTv } from "./tv"

export interface SearchInputProps extends TextFieldProps {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const { placeholder, value, onChange, variant = "default", disabled, ...rest } = props

  const { LL } = useI18nContext()

  const handleClear = useEventCallback(() => {
    onChange?.("")
  })

  const style = searchInputTv({ variant, disabled })

  return (
    <TextField
      ref={ref}
      placeholder={placeholder || LL.common.search()}
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
            tooltip={{ content: "Clear" }}
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
