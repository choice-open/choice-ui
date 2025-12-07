import { tcx } from "@choiceform/design-shared"
import { Label } from "@choiceform/label"
import { Select, SelectProps } from "@choiceform/select"
import { memo, useId } from "react"

interface ModalSelectProps extends Omit<SelectProps, "label"> {
  className?: string
  description?: string
  label?: React.ReactNode
}

export const ModalSelect = memo(function ModalSelect(props: ModalSelectProps) {
  const { label, description, className, ...rest } = props
  const id = useId()

  return (
    <fieldset className={tcx("flex w-full min-w-0 flex-col gap-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        matchTriggerWidth
        {...rest}
      />
      {description && <p className="text-secondary-foreground">{description}</p>}
    </fieldset>
  )
})

ModalSelect.displayName = "ModalSelect"
