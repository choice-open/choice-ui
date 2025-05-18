import { Remove } from "@choiceform/icons-react"
import { motion, useAnimationControls } from "framer-motion"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { toast as sonnerToast, ToasterProps } from "sonner"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { IconButton } from "../icon-button"
import { BellsTv } from "./tv"

export interface BellsProps extends ToasterProps {
  className?: string
  classNames?: {
    root?: string
    content?: string
    icon?: string
    text?: string
    close?: string
    button?: string
    progress?: string
  }
  id: string | number
  icon?: React.ReactNode
  text: string
  progress?: boolean
  variant?: "default" | "accent" | "success" | "warning" | "danger" | "assistive" | "reset"
  action?: (id: string | number) => React.ReactNode
  onClose?: (id: string | number) => void
}

const CloseButton = memo(({ onClick, className }: { onClick: () => void; className: string }) => (
  <IconButton
    variant="reset"
    className={className}
    onClick={onClick}
  >
    <Remove />
  </IconButton>
))

CloseButton.displayName = "CloseButton"

const BellBase = (props: BellsProps) => {
  const {
    className,
    classNames,
    icon,
    text,
    action,
    id,
    onClose,
    progress,
    duration = 4000,
    variant = "default",
  } = props
  const [isPaused, setIsPaused] = useState(false)
  const controls = useAnimationControls()
  // 跟踪动画和toast的状态
  const autoCloseTimerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pauseTimeRef = useRef<number>(0)
  const totalPausedTimeRef = useRef<number>(0)

  const styles = BellsTv({ action: !!action, close: !!onClose, variant })

  // 取消当前的自动关闭计时器
  const cancelAutoClose = useCallback(() => {
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current)
      autoCloseTimerRef.current = null
    }
  }, [])

  const closeNotification = useCallback(() => {
    if (onClose) {
      onClose(id)
    } else {
      sonnerToast.dismiss(id)
    }
  }, [id, onClose])

  const handleCloseClick = useCallback(() => {
    onClose?.(id)
  }, [id, onClose])

  const scheduleAutoClose = useCallback(
    (delay: number) => {
      cancelAutoClose()
      if (delay > 0) {
        autoCloseTimerRef.current = window.setTimeout(closeNotification, delay)
      } else {
        // 如果延迟已经为零或负数，立即关闭
        closeNotification()
      }
    },
    [cancelAutoClose, closeNotification],
  )

  const handleMouseEnter = useEventCallback(() => {
    if (!progress) return

    setIsPaused(true)
    pauseTimeRef.current = Date.now()
    controls.stop()
    cancelAutoClose()
  })

  const handleMouseLeave = useEventCallback(() => {
    if (!progress || !isPaused) return

    setIsPaused(false)
    const pauseDuration = Date.now() - pauseTimeRef.current
    totalPausedTimeRef.current += pauseDuration

    const elapsedActiveTime = Date.now() - startTimeRef.current - totalPausedTimeRef.current
    const remainingTime = Math.max(0, duration - elapsedActiveTime)

    controls.start({
      x: "0%",
      transition: {
        duration: remainingTime / 1000,
        ease: "linear",
      },
    })

    // 重新设置自动关闭，考虑暂停的总时间
    scheduleAutoClose(remainingTime)
  })

  useEffect(() => {
    startTimeRef.current = Date.now()
    totalPausedTimeRef.current = 0

    // 启动动画
    controls.start({
      x: "0%",
      transition: {
        duration: duration / 1000,
        ease: "linear",
      },
    })

    scheduleAutoClose(duration)

    return cancelAutoClose
  }, [controls, duration, scheduleAutoClose, cancelAutoClose])

  return (
    <div
      className={tcx(styles.root(), classNames?.root, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {progress && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={controls}
          className={tcx(styles.progress(), classNames?.progress)}
        />
      )}
      <div className={tcx(styles.content(), classNames?.content)}>
        {icon && <div className={tcx(styles.icon(), classNames?.icon)}>{icon}</div>}

        <div className={tcx(styles.text(), classNames?.text)}>{text}</div>

        {action && action(id)}
      </div>

      {onClose && (
        <div className={tcx(styles.close(), classNames?.close)}>
          <CloseButton
            className={tcx(styles.button(), classNames?.button)}
            onClick={handleCloseClick}
          />
        </div>
      )}
    </div>
  )
}

export const Bell = memo(BellBase)

export function bells(bell: Omit<BellsProps, "id">) {
  return sonnerToast.custom((id) => (
    <Bell
      id={id}
      className={bell.className}
      icon={bell.icon}
      text={bell.text}
      action={bell.action}
      onClose={bell.onClose}
      progress={bell.progress}
      duration={bell.duration}
      variant={bell.variant}
    />
  ))
}
