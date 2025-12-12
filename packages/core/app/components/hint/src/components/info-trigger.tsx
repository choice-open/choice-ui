import { tcx } from "@choice-ui/shared"
import { useMergeRefs } from "@floating-ui/react"
import { cloneElement, forwardRef, HTMLProps, ReactElement, ReactNode } from "react"
import { useHintState } from "../context/hint-context"
import { hintVariants } from "../tv"

export interface HintTriggerProps extends HTMLProps<HTMLButtonElement> {
  asChild?: boolean
  children?: ReactNode
}

const HintTriggerInner = forwardRef<HTMLButtonElement, HintTriggerProps>(function HintTrigger(
  { children, className, asChild = false, ...props },
  propRef,
) {
  const state = useHintState()
  const ref = useMergeRefs([state.refs.setReference, propRef])

  // If using custom child element
  if (asChild && children) {
    return cloneElement(children as ReactElement, {
      ref,
      ...state.getReferenceProps(props),
      ...(state.disabled && { disabled: true }),
    })
  }

  const tv = hintVariants({ disabled: state.disabled })

  return (
    <button
      ref={ref}
      type="button"
      className={tcx(tv.trigger({ className }))}
      {...(state.disabled && { disabled: true })}
      {...state.getReferenceProps(props)}
    >
      {state.icon}
    </button>
  )
})

HintTriggerInner.displayName = "HintTrigger"

export const HintTrigger = HintTriggerInner
