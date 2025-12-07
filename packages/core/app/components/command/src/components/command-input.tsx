import { tcx } from "@choiceform/design-shared"
import { Input, type InputProps } from "@choiceform/input"
import { forwardRef, ReactNode, useEffect } from "react"
import { useEventCallback } from "usehooks-ts"
import { useCommand, useCommandState } from "../hooks"
import { commandInputTv } from "../tv"

export interface CommandInputProps extends Omit<InputProps, "value" | "onChange" | "type"> {
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
    <div className={tcx(tv.root({ className }))}>
      {prefixElement}
      <Input
        ref={ref}
        {...rest}
        className={tcx(tv.input({ className }))}
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
      />
      {suffixElement}
    </div>
  )
})

CommandInput.displayName = "CommandInput"
