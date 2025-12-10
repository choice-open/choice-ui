import { tcx } from "@choice-ui/shared"
import { TextField, type TextFieldProps } from "@choice-ui/text-field"
import { forwardRef, ReactNode, useEffect } from "react"
import { useEventCallback } from "usehooks-ts"
import { useCommand, useCommandState } from "../hooks"
import { commandInputTv } from "../tv"

export interface CommandInputProps extends Omit<TextFieldProps, "value" | "onChange" | "type"> {
  onChange?: (search: string) => void
  prefixElement?: ReactNode
  suffixElement?: ReactNode
  value?: string
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>((props, ref) => {
  const { className, onChange, value, prefixElement, suffixElement, ...rest } = props
  const isControlled = value != null
  const store = useCommand().store
  const search = useCommandState((state) => state.search)
  const selectedItemId = useCommandState((state) => state.selectedItemId)
  const context = useCommand()

  useEffect(() => {
    if (value != null) {
      store.setState("search", value)
    }
  }, [value, store])

  const handleChange = useEventCallback((value: string) => {
    if (!isControlled) {
      store.setState("search", value)
    }
    onChange?.(value)
  })

  const tv = commandInputTv({ size: context.size })

  return (
    <TextField
      ref={ref}
      {...rest}
      className={tcx(tv.input({ className }))}
      size="large"
      variant={props.variant || context.variant}
      data-command-input=""
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      aria-autocomplete="list"
      role="combobox"
      aria-expanded={true}
      aria-controls={context.listId}
      aria-labelledby={context.labelId}
      aria-activedescendant={selectedItemId}
      id={context.inputId}
      type="text"
      value={isControlled ? value : search}
      onChange={handleChange}
    >
      {prefixElement && <TextField.Prefix>{prefixElement}</TextField.Prefix>}
      {suffixElement && <TextField.Suffix>{suffixElement}</TextField.Suffix>}
    </TextField>
  )
})

CommandInput.displayName = "CommandInput"
