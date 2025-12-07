import { tcx } from "@choiceform/design-shared"
import { AnimatePresence, motion, MotionProps } from "framer-motion"
import { memo } from "react"
import { ModalBackdropTv } from "../tv"

export interface ModalBackdropProps extends Omit<MotionProps, "animate" | "initial" | "exit"> {
  className?: string
  duration?: number
  isOpen?: boolean
  onClose?: () => void
}

export const ModalBackdrop = memo(function ModalBackdrop(props: ModalBackdropProps) {
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
})
