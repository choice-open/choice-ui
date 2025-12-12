import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps } from "react"
import { ModalFooterTv } from "../tv"

export const ModalFooter = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props
  const tv = ModalFooterTv()

  return (
    <div
      ref={ref}
      className={tcx(tv.root(), className)}
      {...rest}
    />
  )
})

ModalFooter.displayName = "ModalFooter"
