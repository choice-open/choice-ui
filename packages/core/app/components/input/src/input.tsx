import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps, useCallback } from "react"
import { useUnmount } from "usehooks-ts"
import { InputTv } from "./tv"

export interface InputProps extends Omit<
  HTMLProps<HTMLInputElement>,
  "value" | "onChange" | "size"
> {
  className?: string
  focusSelection?: "all" | "end" | "none"
  onChange?: (value: string) => void
  onIsEditingChange?: (isEditing: boolean) => void
  selected?: boolean
  size?: "default" | "large"
  value?: string
  variant?: "default" | "light" | "dark" | "reset"
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    className,
    disabled,
    readOnly,
    selected,
    value,
    variant = "default",
    size = "default",
    focusSelection = "all",
    onBlur,
    onChange,
    onFocus,
    onIsEditingChange,
    ...rest
  } = props

  useUnmount(() => {
    onIsEditingChange?.(false)
  })

  const tv = InputTv({ variant, selected, disabled, readOnly, size })

  const inputProps = useCallback(() => {
    return {
      ...rest,
      "data-1p-ignore": true,
      ref,
      spellCheck: false,
      autoComplete: rest.autoComplete || "off",
      type: rest.type || "text",
      value,
      disabled,
      readOnly,
      className: tcx(tv, className),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value)
      },
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        // Handle different focus selection modes
        if (focusSelection === "all") {
          e.target.select()
        } else if (focusSelection === "end") {
          // Use setTimeout to ensure the value is rendered before setting selection
          const input = e.target
          setTimeout(() => {
            const length = input.value.length
            input.setSelectionRange(length, length)
          }, 0)
        }
        // focusSelection === "none" - don't change selection

        onFocus?.(e)
        onIsEditingChange?.(true)
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(e)
        onIsEditingChange?.(false)
      },
    }
  }, [
    rest,
    ref,
    value,
    disabled,
    readOnly,
    tv,
    className,
    focusSelection,
    onChange,
    onFocus,
    onIsEditingChange,
    onBlur,
  ])

  return <input {...inputProps()} />
})

Input.displayName = "Input"
