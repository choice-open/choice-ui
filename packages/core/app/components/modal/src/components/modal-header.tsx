import { tcx } from "@choice-ui/shared"
import { IconButton } from "@choice-ui/icon-button"
import { Remove } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, isValidElement, ReactNode, useMemo } from "react"
import { ModalHeaderTv } from "../tv"

export interface ModalHeaderProps extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  onClose?: () => void
  title?: ReactNode
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>((props, ref) => {
  const { className, children, title, onClose, ...rest } = props

  const validElement = useMemo(() => {
    return isValidElement(title)
  }, [title])

  const tv = ModalHeaderTv({ validElement, close: !!onClose })

  return (
    <div
      ref={ref}
      className={tcx(tv.root(), className)}
      {...rest}
    >
      {title && (
        <div className={tv.title()}>
          <span className="min-w-0 truncate">{title}</span>
        </div>
      )}

      {children}

      {onClose && (
        <div className={tv.close()}>
          <IconButton onClick={onClose}>
            <Remove />
          </IconButton>
        </div>
      )}
    </div>
  )
})

ModalHeader.displayName = "ModalHeader"
