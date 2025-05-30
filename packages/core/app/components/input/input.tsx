import { forwardRef, HTMLProps, useCallback } from "react"
import { useUnmount } from "usehooks-ts"
import { tcx } from "~/utils"
import { InputTv } from "./tv"

export interface InputProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange" | "size"> {
  className?: string
  onChange?: (value: string) => void
  onIsEditingChange?: (isEditing: boolean) => void
  selected?: boolean
  size?: "default" | "large"
  value?: string
  variant?: "default" | "dark" | "reset"
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
    onBlur,
    onChange,
    onFocus,
    onIsEditingChange,
    ...rest
  } = props

  useUnmount(() => {
    onIsEditingChange?.(false)
  })

  const styles = InputTv({ variant, selected, disabled, readOnly, size })

  const inputProps = useCallback(() => {
    return {
      ...rest,
      "data-1p-ignore": true,
      ref,
      spellCheck: false,
      autoComplete: "false",
      type: "text",
      value,
      disabled,
      readOnly,
      className: tcx(styles, className),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value)
      },
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
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
    styles,
    className,
    onChange,
    onFocus,
    onIsEditingChange,
    onBlur,
  ])

  return <input {...inputProps()} />
})

Input.displayName = "Input"
