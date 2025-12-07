import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { ModalFooterTv } from "../tv"

export const ModalFooter = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props
  const styles = ModalFooterTv()

  return (
    <div
      ref={ref}
      className={tcx(styles.root(), className)}
      {...rest}
    />
  )
})

ModalFooter.displayName = "ModalFooter"
