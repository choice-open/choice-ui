import { Slot } from "@choiceform/slot"
import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react"
import { useAsRef } from "@choiceform/design-shared"
import { TRIGGER_NAME } from "../constants"
import { useFileUploadContext } from "../hooks"

export interface FileUploadTriggerProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

export const FileUploadTrigger = forwardRef<HTMLButtonElement, FileUploadTriggerProps>(
  (props, forwardedRef) => {
    const { asChild, ...triggerProps } = props
    const context = useFileUploadContext(TRIGGER_NAME)
    const propsRef = useAsRef(triggerProps)

    const onClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        propsRef.current?.onClick?.(event)

        if (event.defaultPrevented) return

        context.inputRef.current?.click()
      },
      [context.inputRef, propsRef],
    )

    const TriggerPrimitive = asChild ? Slot : "button"

    return (
      <TriggerPrimitive
        type="button"
        aria-controls={context.inputId}
        data-disabled={context.disabled ? "" : undefined}
        data-slot="file-upload-trigger"
        {...triggerProps}
        ref={forwardedRef}
        disabled={context.disabled}
        onClick={onClick}
      />
    )
  },
)

FileUploadTrigger.displayName = TRIGGER_NAME
