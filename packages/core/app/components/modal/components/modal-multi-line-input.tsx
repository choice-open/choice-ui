import { memo, useId, useRef } from "react"
import { Label } from "~/components"
import { MultiLineTextInput, MultiLineTextInputProps } from "~/components/multi-line-text-input"
import { tcx } from "~/utils"

interface ModalMultiLineInputProps extends Omit<MultiLineTextInputProps, "children"> {
  className?: string
  description?: string
  label?: string
}

export const ModalMultiLineInput = memo(function ModalMultiLineInput(
  props: ModalMultiLineInputProps,
) {
  const { label, description, className, ...rest } = props
  const id = useId()
  const inputRef = useRef<HTMLDivElement>(null)

  return (
    <fieldset className={tcx("flex w-full min-w-0 flex-col gap-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <MultiLineTextInput
        ref={inputRef}
        {...rest}
      />
      {description && <p className="text-secondary-foreground">{description}</p>}
    </fieldset>
  )
})

ModalMultiLineInput.displayName = "ModalMultiLineInput"
