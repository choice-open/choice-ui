import { tcx } from "@choice-ui/shared"
import { AnimatePresence, motion } from "framer-motion"
import { forwardRef, HTMLProps, ReactNode, useEffect, useState } from "react"
import { useStackflowContext } from "../context"
import { stackflowTv } from "../tv"

export interface StackflowItemProps extends Omit<HTMLProps<HTMLDivElement>, "id"> {
  children?: ReactNode
  className?: string
  id: string
}

export const StackflowItem = forwardRef<HTMLDivElement, StackflowItemProps>(
  function StackflowItem(props, ref) {
    const { id, children, className, style, ...rest } = props
    const { registerItem, current, direction, isInitial } = useStackflowContext()

    useEffect(() => {
      registerItem(id, children)
    }, [id, children, registerItem])

    const isActive = current?.id === id
    const tv = stackflowTv({ active: isActive })

    const [isTransitioningOut, setIsTransitioningOut] = useState(false)
    const [prevActive, setPrevActive] = useState(isActive)

    useEffect(() => {
      if (prevActive && !isActive) {
        setIsTransitioningOut(true)
      }
      setPrevActive(isActive)
    }, [isActive, prevActive])

    if (!isActive && !isTransitioningOut) {
      return null
    }

    const variants = {
      enter: (direction: string) => ({
        x: direction === "forward" ? "100%" : "-100%",
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction: string) => ({
        x: direction === "forward" ? "-100%" : "100%",
        opacity: 0,
      }),
    }

    return (
      <AnimatePresence
        mode="wait"
        custom={direction}
        onExitComplete={() => setIsTransitioningOut(false)}
      >
        <motion.div
          key={id}
          ref={ref}
          custom={direction}
          variants={variants}
          initial={isInitial ? "center" : "enter"}
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.3 }}
          className={tcx(tv.item(), className)}
          style={style}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  },
)
