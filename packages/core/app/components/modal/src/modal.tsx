import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps, ReactNode } from "react"
import {
  ModalBackdrop,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalInput,
  ModalSelect,
  ModalTextarea,
} from "./components"
import { ModalTv } from "./tv"

interface ModalProps extends Omit<HTMLProps<HTMLDivElement>, "title" | "as"> {
  as?: React.ElementType
  className?: string
  onClose?: () => void
  title?: ReactNode
}

interface ModalComponent extends React.ForwardRefExoticComponent<
  ModalProps & React.RefAttributes<HTMLDivElement>
> {
  Backdrop: typeof ModalBackdrop
  Content: typeof ModalContent
  Footer: typeof ModalFooter
  Header: typeof ModalHeader
  Input: typeof ModalInput
  Select: typeof ModalSelect
  Textarea: typeof ModalTextarea
}

const ModalBase = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const { as: As = "div", className, title, onClose, ...rest } = props
  const tv = ModalTv()

  return (
    <As
      ref={ref}
      className={tcx(tv.root(), className)}
      role="dialog"
      aria-modal="true"
      {...rest}
    />
  )
})

ModalBase.displayName = "Modal"

const Modal = ModalBase as ModalComponent
Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter
Modal.Input = ModalInput
Modal.Select = ModalSelect
Modal.Textarea = ModalTextarea
Modal.Backdrop = ModalBackdrop
export { Modal }
