import { Slot } from "@choice-ui/slot"
import { useMergeRefs } from "@floating-ui/react"
import { forwardRef, HTMLProps, useMemo } from "react"
import { useTooltipState } from "../context/tooltip-context"

export const TooltipTrigger = forwardRef<HTMLElement, HTMLProps<HTMLElement>>(
  function TooltipTrigger({ children, ...props }, propRef) {
    const state = useTooltipState()

    // Slot will handle merging childRef internally
    const ref = useMergeRefs([state.refs.setReference, propRef])

    // Cache Slot props to avoid unnecessary re-renders
    const slotProps = useMemo(() => {
      return {
        ...(state.disabled && { disabled: true }),
        ...state.getReferenceProps(props),
      }
    }, [state.disabled, state.getReferenceProps, props])

    return (
      <Slot
        ref={ref}
        {...slotProps}
      >
        {children}
      </Slot>
    )
  },
)
