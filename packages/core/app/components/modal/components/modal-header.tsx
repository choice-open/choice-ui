import { Remove } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, isValidElement, ReactNode, useMemo } from "react"
import { tcx } from "~/utils"
import { IconButton } from "../../icon-button"
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

  const styles = ModalHeaderTv({ validElement, close: !!onClose })

  return (
    <div
      ref={ref}
      className={tcx(styles.root(), className)}
      {...rest}
    >
      {title && (
        <div className={styles.title()}>
          <span className="min-w-0 truncate">{title}</span>
        </div>
      )}

      {children}

      {onClose && (
        <div className={styles.close()}>
          <IconButton onClick={onClose}>
            <Remove />
          </IconButton>
        </div>
      )}
    </div>
  )
})

ModalHeader.displayName = "ModalHeader"
