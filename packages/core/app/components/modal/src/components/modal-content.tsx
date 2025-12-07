import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { ModalContentTv } from "../tv"

export const ModalContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props
  const styles = ModalContentTv()

  return (
    <div
      ref={ref}
      className={tcx(styles.root(), className)}
      {...rest}
    />
  )
})

ModalContent.displayName = "ModalContent"
