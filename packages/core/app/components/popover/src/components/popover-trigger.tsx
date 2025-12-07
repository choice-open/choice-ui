import { mergeRefs } from "@choiceform/design-shared"
import { Slot } from "@choiceform/slot"
import { forwardRef, memo } from "react"
import { usePopoverContext } from "../popover-context"

export const PopoverTrigger = memo(
  forwardRef<
    HTMLElement,
    {
      children: React.ReactNode
    }
  >((props, forwardedRef) => {
    const { children } = props
    const { getReferenceProps, refs } = usePopoverContext()

    return (
      <Slot
        ref={mergeRefs(refs.setReference, forwardedRef)}
        {...getReferenceProps()}
      >
        {children}
      </Slot>
    )
  }),
)

PopoverTrigger.displayName = "PopoverTrigger"
