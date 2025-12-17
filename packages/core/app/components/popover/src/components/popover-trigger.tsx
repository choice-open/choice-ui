import { mergeRefs } from "@choice-ui/shared"
import { Slot } from "@choice-ui/slot"
import { forwardRef, memo, useMemo } from "react"
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

    // Cache Slot props to avoid unnecessary re-renders
    const slotProps = useMemo(() => {
      return getReferenceProps()
    }, [getReferenceProps])

    return (
      <Slot
        ref={mergeRefs(refs.setReference, forwardedRef)}
        {...slotProps}
      >
        {children}
      </Slot>
    )
  }),
)

PopoverTrigger.displayName = "PopoverTrigger"
