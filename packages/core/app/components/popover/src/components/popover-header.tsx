import { ModalHeader, type ModalHeaderProps } from "@choiceform/modal"
import { forwardRef, memo } from "react"
import { usePopoverContext } from "../popover-context"

export const PopoverHeader = memo(
  forwardRef<HTMLDivElement, ModalHeaderProps>((props, ref) => {
    const { children, className, ...rest } = props
    const { titleId, onCloseClick } = usePopoverContext()

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

PopoverHeader.displayName = "PopoverHeader"
