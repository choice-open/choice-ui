import { useMergeRefs } from "@floating-ui/react"
import { tcx } from "~/utils"
import { useHintState } from "../hint"
import { hintVariants } from "../tv"
import { cloneElement, forwardRef, HTMLProps, ReactElement, ReactNode } from "react"

interface HintTriggerProps extends HTMLProps<HTMLButtonElement> {
  asChild?: boolean
  icon?: ReactNode
}

export const HintTrigger = forwardRef<HTMLButtonElement, HintTriggerProps>(function HintTrigger(
  { children, className, asChild = false, icon, ...props },
  propRef,
) {
  const state = useHintState()

  const ref = useMergeRefs([state.refs.setReference, propRef])

  // 如果使用自定义子元素
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
      {icon}
    </button>
  )
})
