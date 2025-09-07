import { FloatingPortal } from "@floating-ui/react"
import { motion } from "framer-motion"
import { match } from "ts-pattern"
import type { FloatingMenuContainerProps, MotionWrapperProps } from "../types"

export type { FloatingMenuContainerProps, MotionWrapperProps }

export const FloatingMenuContainer = ({
  portalElementId,
  refs,
  floatingStyles,
  getFloatingProps,
  children,
  onMouseDown,
  style,
}: FloatingMenuContainerProps) => (
  <FloatingPortal id={portalElementId}>
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        ...style,
      }}
      onMouseDown={onMouseDown}
      className="z-tooltip"
      {...getFloatingProps()}
    >
      {children}
    </div>
  </FloatingPortal>
)

export const MotionWrapper = (props: MotionWrapperProps) => {
  const { placement, className, onMouseDown, children, animationType = "default", style } = props

  const transformOrigin = match(placement)
    .with("top", () => "bottom center")
    .with("bottom", () => "top center")
    .with("left", () => "right center")
    .with("right", () => "left center")
    .otherwise(() => "center")

  const animationProps =
    animationType === "scale"
      ? {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 },
        }
      : {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
        }

  return (
    <motion.div
      {...animationProps}
      transition={{ duration: 0.1 }}
      className={className}
      style={{
        transformOrigin,
        ...style,
      }}
      onMouseDown={onMouseDown}
    >
      {children}
    </motion.div>
  )
}
