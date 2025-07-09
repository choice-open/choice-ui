import { forwardRef, memo } from "react"
import { InputProps } from "~/components/input"
import { TextField } from "~/components/text-field"
import { tcx } from "~/utils"

interface ModalInputProps extends Omit<InputProps, "children"> {
  description?: string
  label?: string
}

export const ModalInput = memo(
  forwardRef<HTMLInputElement, ModalInputProps>((props, ref) => {
    const { className, label, description, ...rest } = props

    return (
      <TextField
        ref={ref}
        className={tcx("w-full", className)}
        {...rest}
      >
        {label && <TextField.Label>{label}</TextField.Label>}
        {description && <TextField.Description>{description}</TextField.Description>}z
      </TextField>
    )
  }),
)

ModalInput.displayName = "ModalInput"
