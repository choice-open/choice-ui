import { tcx } from "@choice-ui/shared"
import { Input, type InputProps } from "@choice-ui/input"
import { Label } from "@choice-ui/label"
import { forwardRef, memo, useId } from "react"

interface ModalInputProps extends Omit<InputProps, "size" | "label"> {
  description?: string
  label?: React.ReactNode
  size?: "default" | "large"
}

export const ModalInput = memo(
  forwardRef<HTMLInputElement, ModalInputProps>((props, ref) => {
    const { className, label, description, size, ...rest } = props
    const id = useId()
    const descriptionId = useId()

    return (
      <fieldset className={tcx("flex w-full min-w-0 flex-col gap-2", className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Input
          id={id}
          ref={ref}
          size={size}
          aria-describedby={description ? descriptionId : undefined}
          {...rest}
        />
        {description && (
          <p
            id={descriptionId}
            className="text-secondary-foreground"
          >
            {description}
          </p>
        )}
      </fieldset>
    )
  }),
)

ModalInput.displayName = "ModalInput"
