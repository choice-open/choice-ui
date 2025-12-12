import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps } from "react"
import { ModalContentTv } from "../tv"

export const ModalContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props
  const tv = ModalContentTv()

  return (
    <div
      ref={ref}
      className={tcx(tv.root(), className)}
      {...rest}
    />
  )
})

ModalContent.displayName = "ModalContent"
