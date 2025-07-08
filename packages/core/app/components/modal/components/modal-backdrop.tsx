import { AnimatePresence, motion, MotionProps } from "framer-motion"
import { forwardRef, memo } from "react"
import { tcx } from "~/utils"
import { ModalBackdropTv } from "../tv"

interface ModalBackdropProps extends Omit<MotionProps, "animate" | "initial" | "exit"> {
  className?: string
  duration?: number
  isOpen?: boolean
  onClose?: () => void
}

export const ModalBackdrop = memo(
  forwardRef<HTMLDivElement, ModalBackdropProps>((props, ref) => {
    const {
      className,
      isOpen = true,
      duration = 150,
      onClose,
      transition = { duration: duration / 1000 },
      ...rest
    } = props

    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={ref}
            className={tcx(ModalBackdropTv(), className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            aria-hidden="true"
            onClick={onClose}
            {...rest}
          />
        )}
      </AnimatePresence>
    )
  }),
)

ModalBackdrop.displayName = "ModalBackdrop"
