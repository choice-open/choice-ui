import { forwardRef, memo } from "react"
import { ModalHeader } from "../../modal"
import { useDialogContext } from "../dialog-context"

export const DialogHeader = memo(
  forwardRef<HTMLDivElement, React.ComponentProps<typeof ModalHeader>>((props, ref) => {
    const { children, ...rest } = props
    const { titleId, onCloseClick } = useDialogContext()

    return (
      <ModalHeader
        ref={ref}
        id={titleId}
        onClose={onCloseClick}
        {...rest}
      >
        {children}
      </ModalHeader>
    )
  }),
)

DialogHeader.displayName = "DialogHeader"
