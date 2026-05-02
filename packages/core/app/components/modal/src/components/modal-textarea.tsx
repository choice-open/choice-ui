import { tcx } from "@choice-ui/shared"
import { Label } from "@choice-ui/label"
import { Textarea, type TextareaProps } from "@choice-ui/textarea"
import { forwardRef, memo, useId } from "react"

interface ModalTextareaProps extends Omit<TextareaProps, "children" | "label"> {
  description?: string
  label?: React.ReactNode
}

export const ModalTextarea = memo(
  forwardRef<HTMLTextAreaElement, ModalTextareaProps>((props, ref) => {
    const { className, label, description, ...rest } = props
    const id = useId()
    const descriptionId = useId()

    return (
      <fieldset className={tcx("flex w-full min-w-0 flex-col gap-2", className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Textarea
          id={id}
          ref={ref}
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

ModalTextarea.displayName = "ModalTextarea"
