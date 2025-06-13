import { forwardRef, memo } from "react"
import { TextField, TextFieldProps } from "~/components/text-field"
import { tcx } from "~/utils"

interface ModalInputProps extends TextFieldProps {
  className?: string
  description?: string
  label?: string
  onChange?: (value: string) => void
  placeholder?: string
  size?: "default" | "large"
  value?: string
}

export const ModalInput = memo(
  forwardRef<HTMLInputElement, ModalInputProps>((props, ref) => {
    const {
      className,
      label,
      placeholder,
      description,
      value,
      onChange,
      size = "default",
      ...rest
    } = props

    return (
      <TextField
        ref={ref}
        placeholder={placeholder}
        size={size}
        value={value}
        onChange={onChange}
        className={tcx("w-full", className)}
        {...rest}
      >
        {label && <TextField.Label>{label}</TextField.Label>}
        {description && <TextField.Description>{description}</TextField.Description>}
      </TextField>
    )
  }),
)

ModalInput.displayName = "ModalInput"
