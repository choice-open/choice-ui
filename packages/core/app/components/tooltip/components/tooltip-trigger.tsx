import { useMergeRefs } from "@floating-ui/react"
import { forwardRef, HTMLProps, Ref } from "react"
import { Slot } from "../../slot"
import { useTooltipState } from "../context/tooltip-context"

export const TooltipTrigger = forwardRef<HTMLElement, HTMLProps<HTMLElement>>(
  function TooltipTrigger({ children, ...props }, propRef) {
    const state = useTooltipState()

    const childrenRef = (children as { ref?: Ref<HTMLElement> })?.ref
    const ref = useMergeRefs([state.refs.setReference, propRef, childrenRef])

    return (
      <Slot
        ref={ref}
        {...(state.disabled && { disabled: true })}
        {...state.getReferenceProps(props)}
      >
        {children}
      </Slot>
    )
  },
)
