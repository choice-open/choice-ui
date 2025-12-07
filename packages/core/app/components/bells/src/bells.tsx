import { tcx } from "@choiceform/design-shared"
import { IconButton } from "@choiceform/icon-button"
import { Remove } from "@choiceform/icons-react"
import { motion, useAnimationControls } from "framer-motion"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ExternalToast, toast as sonnerToast, ToasterProps } from "sonner"
import { useEventCallback } from "usehooks-ts"
import { BellsTv } from "./tv"

export interface BellsProps extends Omit<ToasterProps, "id"> {
  action?: (id: string | number) => React.ReactNode
  className?: string
  html?: string
  icon?: React.ReactNode
  id: string | number
  onClose?: (id: string | number) => void
  progress?: boolean
  text?: string
  toasterId?: string
  variant?: "default" | "accent" | "success" | "warning" | "danger" | "assistive" | "reset"
}

const CloseButton = memo(({ onClick, className }: { className: string; onClick: () => void }) => (
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
    icon,
    text,
    html,
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

  const tv = BellsTv({ action: !!action, close: !!onClose, variant })

  // 验证至少有 text 或 html 其中一个
  if (!text && !html) {
    console.warn("Bells: Either 'text' or 'html' prop is required")
  }

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
      if (delay > 0 && duration !== Infinity) {
        autoCloseTimerRef.current = window.setTimeout(closeNotification, delay)
      }
    },
    [cancelAutoClose, closeNotification, duration],
  )

  const handleMouseEnter = useEventCallback(() => {
    if (!progress || duration === Infinity) return

    setIsPaused(true)
    pauseTimeRef.current = Date.now()
    controls.stop()
    cancelAutoClose()
  })

  const handleMouseLeave = useEventCallback(() => {
    if (!progress || !isPaused || duration === Infinity) return

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

  // 缓存 action 结果，避免每次渲染都重新创建
  const actionElement = useMemo(() => {
    if (!action) return null
    return action(id)
  }, [action, id])

  useEffect(() => {
    if (duration === Infinity) return

    startTimeRef.current = Date.now()
    totalPausedTimeRef.current = 0

    // 启动动画（仅当 duration 不是 Infinity 时）
    if (progress) {
      controls.start({
        x: "0%",
        transition: {
          duration: duration / 1000,
          ease: "linear",
        },
      })
    }

    scheduleAutoClose(duration)

    return cancelAutoClose
  }, [controls, duration, scheduleAutoClose, cancelAutoClose, progress])

  return (
    <div
      className={tcx(tv.root(), className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {progress && duration !== Infinity && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={controls}
          className={tv.progress()}
        />
      )}
      <div className={tv.content()}>
        {icon && <div className={tv.icon()}>{icon}</div>}

        <div className={tv.text()}>
          {html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : text}
        </div>

        {actionElement}
      </div>

      {onClose && (
        <div className={tv.close()}>
          <CloseButton
            className={tv.button()}
            onClick={handleCloseClick}
          />
        </div>
      )}
    </div>
  )
}

export const Bell = memo(BellBase)

export function bells(bell: Omit<BellsProps, "id">) {
  const { icon, text, html, action, onClose, progress, variant, className, ...sonnerOptions } = bell

  return sonnerToast.custom(
    (id) => (
      <Bell
        id={id}
        className={className}
        icon={icon}
        text={text}
        html={html}
        action={action}
        onClose={onClose}
        progress={progress}
        duration={bell.duration}
        variant={variant}
      />
    ),
    {
      duration: bell.duration === Infinity ? Infinity : undefined,
      position: bell.position || "bottom-center",
      ...sonnerOptions,
    } as ExternalToast,
  )
}
