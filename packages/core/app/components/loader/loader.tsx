import { AnimatePresence, motion } from "framer-motion"
import React, { forwardRef, useEffect, useRef, useState } from "react"
import { tcx } from "~/utils"
import { LoaderProvider } from "./hooks"
import { loaderVariants } from "./tv"
import type { LoaderProps, LoaderStage } from "./types"

const LoaderRoot = forwardRef<HTMLDivElement, LoaderProps>((props, ref) => {
  const {
    stages,
    className,
    currentStage: controlledStage,
    onStageChange,
    duration = 3000,
    ...rest
  } = props
  const [currentStage, setCurrentStage] = useState(0)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const iconIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const stageIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const actualStage = controlledStage ?? currentStage
  const stage = stages[actualStage]
  const icons = Array.isArray(stage?.icon) ? stage.icon : stage?.icon ? [stage.icon] : []

  // Handle stage progression
  useEffect(() => {
    if (controlledStage !== undefined) return

    if (stageIntervalRef.current) {
      clearInterval(stageIntervalRef.current)
    }

    stageIntervalRef.current = setInterval(() => {
      setDirection(1) // Always move forward
      setCurrentStage((prev) => {
        const next = (prev + 1) % stages.length
        onStageChange?.(next)
        return next
      })
    }, duration)

    return () => {
      if (stageIntervalRef.current) {
        clearInterval(stageIntervalRef.current)
      }
    }
  }, [controlledStage, duration, stages.length, onStageChange])

  // Handle icon cycling
  useEffect(() => {
    if (iconIntervalRef.current) {
      clearInterval(iconIntervalRef.current)
    }

    if (icons.length > 1) {
      setCurrentIconIndex(0)
      iconIntervalRef.current = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % icons.length)
      }, 700)
    } else {
      setCurrentIconIndex(0)
    }

    return () => {
      if (iconIntervalRef.current) {
        clearInterval(iconIntervalRef.current)
      }
    }
  }, [actualStage, icons.length])

  const styles = loaderVariants()

  return (
    <LoaderProvider
      stages={stages}
      currentStage={actualStage}
    >
      <div
        ref={ref}
        className={tcx(styles.root(), className)}
        {...rest}
      >
        <div className={styles.track()}>
          <AnimatePresence
            initial={false}
            mode="popLayout"
            custom={direction}
          >
            <motion.div
              key={actualStage}
              className={styles.stageContainer()}
              custom={direction}
              initial={{ x: direction * 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -200, opacity: 0 }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className={styles.stage({ active: true })}>
                <LoaderStageContent
                  stage={stage}
                  isActive={true}
                  currentIconIndex={currentIconIndex}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </LoaderProvider>
  )
})

LoaderRoot.displayName = "Loader"

interface LoaderStageContentProps {
  currentIconIndex: number
  isActive: boolean
  stage: LoaderStage
}

const LoaderStageContent: React.FC<LoaderStageContentProps> = ({
  stage,
  isActive,
  currentIconIndex,
}) => {
  const styles = loaderVariants()
  const icons = Array.isArray(stage.icon) ? stage.icon : stage.icon ? [stage.icon] : []

  return (
    <>
      <motion.div
        className={styles.iconContainer()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          {icons.length > 0 && (
            <motion.div
              key={`${stage.label}-${currentIconIndex}`}
              className={styles.icon()}
              initial={icons.length > 1 ? { y: 20, opacity: 0 } : { scale: 0.1 }}
              animate={
                icons.length > 1
                  ? {
                      y: [20, 0, 0, -20],
                      opacity: [0, 1, 1, 0],
                    }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                icons.length > 1
                  ? {
                      duration: 0.7,
                      times: [0, 0.3, 0.5, 0.7],
                      ease: "easeInOut",
                    }
                  : { duration: 0.3 }
              }
            >
              {icons[currentIconIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className={styles.label()}
        initial={{ opacity: 0, x: 30 }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
      >
        {stage.label}
      </motion.div>
    </>
  )
}

export const Loader = Object.assign(LoaderRoot, {
  Root: LoaderRoot,
})
