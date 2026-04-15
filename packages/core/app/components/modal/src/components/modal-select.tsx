import { tcx } from "@choice-ui/shared"
import { Label } from "@choice-ui/label"
import { Select, SelectProps } from "@choice-ui/select"
import { memo, useId } from "react"

interface ModalSelectProps extends Omit<SelectProps, "label"> {
  className?: string
  description?: string
  label?: React.ReactNode
}

export const ModalSelect = memo(function ModalSelect(props: ModalSelectProps) {
  const { label, description, className, ...rest } = props
  const id = useId()
  const descriptionId = useId()

  return (
    <fieldset className={tcx("flex w-full min-w-0 flex-col gap-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div id={id}>
        <Select
          matchTriggerWidth
          aria-describedby={description ? descriptionId : undefined}
          {...rest}
        />
      </div>
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
})

ModalSelect.displayName = "ModalSelect"
