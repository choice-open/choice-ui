import { mergeRefs, tcx } from "@choice-ui/shared"
import {
  CircleCheckLargeSolid,
  CircleErrorSolid,
  CircleInfoLargeSolid,
  CircleWarningLargeSolid,
  LoaderCircle,
  RemoveSmall,
} from "@choiceform/icons-react"
import { motion } from "framer-motion"
import { forwardRef, memo, useEffect, useId, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { dismiss, updateHeight, type ToastData } from "../store"
import { toastRootTv } from "../tv"
import type { SwipeDirection, ToastPosition, ToastType } from "../types"
import { ToastProgressBar } from "./toast-progress-bar"
import type { CollectedSlotProps } from "./toaster-slots"

// Constants
const GAP = 12
const DEFAULT_HEIGHT = 56
const SWIPE_THRESHOLD = 56

// Animation config
const ANIMATION_CONFIG = {
  default: {
    type: "spring" as const,
    stiffness: 120,
    damping: 18,
    mass: 1,
  },
  opacity: {
    type: "tween" as const,
    duration: 0.4,
    ease: "easeOut" as const,
  },
}

// Memoized icon components
const SuccessIcon = memo(() => <CircleCheckLargeSolid />)
SuccessIcon.displayName = "SuccessIcon"

const ErrorIcon = memo(() => <CircleErrorSolid />)
ErrorIcon.displayName = "ErrorIcon"

const WarningIcon = memo(() => <CircleWarningLargeSolid />)
WarningIcon.displayName = "WarningIcon"

const InfoIcon = memo(() => <CircleInfoLargeSolid />)
InfoIcon.displayName = "InfoIcon"

const LoadingIcon = memo(() => <LoaderCircle className="animate-spin" />)
LoadingIcon.displayName = "LoadingIcon"

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
  loading: <LoadingIcon />,
  default: null,
}

function getToastIcon(type: ToastType): React.ReactNode {
  return TOAST_ICONS[type] ?? null
}

// Regex to detect HTML tags in a string
const HTML_TAG_REGEX = /<[a-z][\s\S]*>/i

/**
 * Check if a ReactNode is a string containing HTML tags
 */
function isHtmlString(content: React.ReactNode): content is string {
  return typeof content === "string" && HTML_TAG_REGEX.test(content)
}

export { DEFAULT_HEIGHT, GAP }

export interface ToasterItemProps {
  toast: ToastData
  index: number
  total: number
  expanded: boolean
  position: ToastPosition
  toasterId: string
  /** Heights of all visible toasts for offset calculation */
  toastHeights: number[]
  /** Collected slot props from Toaster.Item children */
  slotProps: CollectedSlotProps
  /** Show countdown progress bar */
  showProgress?: boolean
  /** Default duration from Toaster */
  defaultDuration?: number
  /** Whether the timer is paused (hovering) */
  isPaused?: boolean
  layout?: "default" | "compact"
}

export const ToasterItem = memo(
  forwardRef<HTMLDivElement, ToasterItemProps>(function ToasterItem(
    {
      toast,
      index,
      total,
      expanded,
      position,
      toasterId,
      toastHeights,
      slotProps,
      showProgress = false,
      defaultDuration = 5000,
      isPaused = false,
      layout = "default",
    },
    ref,
  ) {
    const titleId = useId()
    const descriptionId = useId()
    const rootRef = useRef<HTMLDivElement>(null)

    const [isSwiping, setIsSwiping] = useState(false)
    const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 })
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null)

    const swipeStartRef = useRef<{ x: number; y: number } | null>(null)

    // Progress bar animation
    const toastDuration = toast.duration ?? defaultDuration
    const shouldShowProgress =
      showProgress && toastDuration > 0 && Number.isFinite(toastDuration) && toast.type !== "loading"

    // Calculate offset for stacking using passed heights (avoids getSnapshot call)
    const offsetY = useMemo(() => {
      if (expanded) {
        let offset = 0
        for (let i = 0; i < index; i++) {
          offset += (toastHeights[i] ?? DEFAULT_HEIGHT) + GAP
        }
        return offset
      }
      return index * 8
    }, [expanded, index, toastHeights])

    // Update height when mounted or resized
    useEffect(() => {
      const node = rootRef.current
      if (!node) return

      let rafId: number | null = null
      let lastHeight = 0

      const measureHeight = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }

        rafId = requestAnimationFrame(() => {
          const height = node.offsetHeight
          if (height > 0 && height !== lastHeight) {
            lastHeight = height
            updateHeight(toast.id, height, toasterId)
          }
          rafId = null
        })
      }

      measureHeight()

      const resizeObserver = new ResizeObserver(measureHeight)
      resizeObserver.observe(node)

      return () => {
        resizeObserver.disconnect()
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
      }
    }, [toast.id, toasterId])

    const close = useEventCallback((_direction?: SwipeDirection) => {
      dismiss(toast.id, toasterId)
    })

    const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
      }
    })

    const handlePointerDown = useEventCallback((e: React.PointerEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("button, a, input, [role='button']")) {
        return
      }

      swipeStartRef.current = { x: e.clientX, y: e.clientY }
      setSwipeDirection(null)

      target.setPointerCapture(e.pointerId)
    })

    const handlePointerMove = useEventCallback((e: React.PointerEvent) => {
      if (!swipeStartRef.current) return

      const deltaX = e.clientX - swipeStartRef.current.x
      const deltaY = e.clientY - swipeStartRef.current.y
      const isVerticalPosition = position === "top-center" || position === "bottom-center"

      if (isVerticalPosition) {
        // Vertical swipe for center positions
        const absDeltaY = Math.abs(deltaY)
        if (!isSwiping && absDeltaY > 10) {
          setIsSwiping(true)
        }
        if (isSwiping) {
          setSwipeDirection(deltaY > 0 ? "down" : "up")
          setSwipeOffset({ x: 0, y: deltaY })
        }
      } else {
        // Horizontal swipe for corner positions
        const absDeltaX = Math.abs(deltaX)
        if (!isSwiping && absDeltaX > 10) {
          setIsSwiping(true)
        }
        if (isSwiping) {
          setSwipeDirection(deltaX > 0 ? "right" : "left")
          setSwipeOffset({ x: deltaX, y: 0 })
        }
      }
    })

    const handlePointerUp = useEventCallback((e: React.PointerEvent) => {
      if (!swipeStartRef.current) return
      const target = e.target as HTMLElement
      target.releasePointerCapture(e.pointerId)

      const isVerticalPosition = position === "top-center" || position === "bottom-center"
      const swipeDistance = isVerticalPosition ? Math.abs(swipeOffset.y) : Math.abs(swipeOffset.x)

      if (swipeDistance > SWIPE_THRESHOLD && swipeDirection) {
        close(swipeDirection)
      } else {
        setSwipeOffset({ x: 0, y: 0 })
      }

      swipeStartRef.current = null
      setIsSwiping(false)
    })

    const handlePointerCancel = useEventCallback((e: React.PointerEvent) => {
      const target = e.target as HTMLElement
      target.releasePointerCapture(e.pointerId)
      swipeStartRef.current = null
      setIsSwiping(false)
      setSwipeOffset({ x: 0, y: 0 })
      setSwipeDirection(null)
    })

    const displayIcon = toast.icon ?? getToastIcon(toast.type)
    const isBehind = index > 0 && !expanded
    const isTop = position.startsWith("top")
    const scale = expanded ? 1 : Math.max(0, 1 - index * 0.05)

    const yPosition = useMemo(() => {
      const swipeY = swipeOffset.y

      if (expanded) {
        return isTop ? offsetY + swipeY : -offsetY + swipeY
      }

      const peek = 8
      const shrink = 1 - scale
      const height = toast.height || 0
      const peekOffset = index * peek
      const shrinkOffset = shrink * height
      return isTop ? peekOffset + shrinkOffset + swipeY : -(peekOffset + shrinkOffset) + swipeY
    }, [expanded, isTop, offsetY, swipeOffset.y, scale, toast.height, index])

    const stackOpacity = useMemo(() => {
      if (expanded) return 1
      return Math.max(0, 1 - index * 0.2)
    }, [expanded, index])

    const enterExitY = isTop ? -100 : 100

    const exitAnimation = useMemo(() => {
      const dir = swipeDirection || toast.swipeDirection
      const exitBase = { opacity: 0, zIndex: -1, filter: "blur(8px)" }
      // Swipe direction takes priority
      if (dir === "right") return { ...exitBase, x: "100%" }
      if (dir === "left") return { ...exitBase, x: "-100%" }
      if (dir === "up") return { ...exitBase, y: "-100%" }
      if (dir === "down") return { ...exitBase, y: "100%" }
      // Default exit animation: same direction as enter (top = up, bottom = down)
      return { ...exitBase, y: isTop ? "-100%" : "100%" }
    }, [swipeDirection, toast.swipeDirection, isTop])

    const tv = useMemo(
      () =>
        toastRootTv({
          layout,
          type: toast.type,
          position,
          hasActions: !!toast.action || !!toast.cancel,
          hasDescription: !!toast.description,
          hasIcon: !!displayIcon,
          behind: isBehind,
          expanded,
          variant: toast.variant,
        }),
      [
        layout,
        toast.type,
        position,
        toast.action,
        toast.cancel,
        toast.description,
        displayIcon,
        isBehind,
        expanded,
        toast.variant,
      ],
    )

    const zIndex = total - index
    const compactProgress = layout === "compact" && shouldShowProgress

    const combinedStyle = useMemo(() => {
      const backgroundColorMap: Record<string, string> = compactProgress
        ? {
            default: "var(--color-gray-800)",
            accent: "var(--color-accent-hover-background)",
            success: "var(--color-success-hover-background)",
            warning: "var(--color-warning-hover-background)",
            error: "var(--color-danger-hover-background)",
            assistive: "var(--color-assistive-hover-background)",
          }
        : {
            default: "var(--color-menu-background)",
            accent: "var(--color-accent-background)",
            success: "var(--color-success-background)",
            warning: "var(--color-warning-background)",
            error: "var(--color-danger-background)",
            assistive: "var(--color-assistive-background)",
          }

      const bgColor =
        backgroundColorMap[toast.variant ?? "default"] ?? "var(--color-menu-background)"

      return {
        "--toast-index": index,
        "--toast-opacity": `${stackOpacity * 100}%`,
        "--toast-background-color": `color-mix(in srgb, ${bgColor} var(--toast-opacity), var(--color-default-background))`,
        "--toast-gap": `${GAP}px`,
        zIndex,
      } as React.CSSProperties
    }, [index, stackOpacity, zIndex, compactProgress, toast.variant])

    const handleActionClick = useEventCallback(() => {
      toast.action?.onClick()
      close()
    })

    const handleDismissClick = useEventCallback(() => {
      close()
    })

    // Extract slot props
    const { renderIcon, renderActions } = slotProps

    // Render icon with slot support
    const iconContent = useMemo(() => {
      if (renderIcon) {
        return renderIcon(toast.type, displayIcon)
      }
      return displayIcon
    }, [renderIcon, toast.type, displayIcon])

    // Render title with slot className support
    const titleContent = useMemo(() => {
      if (!toast.title) return null
      return (
        <div
          id={titleId}
          className={tcx(tv.title(), slotProps.titleClassName)}
          style={slotProps.titleStyle}
          {...(isHtmlString(toast.title)
            ? { dangerouslySetInnerHTML: { __html: toast.title } }
            : { children: toast.title })}
        />
      )
    }, [toast.title, titleId, tv, slotProps.titleClassName, slotProps.titleStyle])

    // Render description with slot className support
    const descriptionContent = useMemo(() => {
      if (!toast.description) return null
      return (
        <div
          id={descriptionId}
          className={tcx(tv.description(), slotProps.descriptionClassName)}
          style={slotProps.descriptionStyle}
          {...(isHtmlString(toast.description)
            ? { dangerouslySetInnerHTML: { __html: toast.description } }
            : { children: toast.description })}
        />
      )
    }, [
      toast.description,
      descriptionId,
      tv,
      slotProps.descriptionClassName,
      slotProps.descriptionStyle,
    ])

    // Render actions with slot support
    const actionsContent = useMemo(() => {
      if (!toast.action && !toast.cancel) return null
      if (renderActions) {
        return renderActions(toast.action, toast.cancel, close)
      }
      return (
        <div
          className={tcx(tv.actions(), slotProps.actionsClassName)}
          style={slotProps.actionsStyle}
        >
          {toast.action && (
            <button
              type="button"
              className={tv.button({ buttonVariant: "action" })}
              onClick={handleActionClick}
            >
              {toast.action.label}
            </button>
          )}
          {toast.cancel && (
            <button
              type="button"
              className={tcx(tv.button({ buttonVariant: "cancel" }))}
              onClick={handleDismissClick}
            >
              {layout === "default" ? toast.cancel?.label : <RemoveSmall />}
            </button>
          )}
        </div>
      )
    }, [
      renderActions,
      toast.action,
      toast.cancel,
      close,
      tv,
      handleActionClick,
      handleDismissClick,
      slotProps.actionsClassName,
      slotProps.actionsStyle,
    ])

    // Merge slot className and style
    const mergedClassName = tcx(tv.root(), slotProps.itemClassName)
    const mergedStyle = useMemo(() => {
      if (slotProps.itemStyle) {
        return { ...combinedStyle, ...slotProps.itemStyle }
      }
      return combinedStyle
    }, [combinedStyle, slotProps.itemStyle])

    return (
      <motion.div
        ref={mergeRefs(rootRef, ref)}
        initial={{ y: enterExitY }}
        animate={{
          x: swipeOffset.x,
          y: yPosition,
          scale,
          opacity: 1,
          filter: "blur(0px)",
        }}
        exit={exitAnimation}
        transition={isSwiping ? { duration: 0 } : ANIMATION_CONFIG}
        role={toast.type === "error" || toast.type === "warning" ? "alertdialog" : "status"}
        aria-modal="false"
        aria-labelledby={toast.title ? titleId : undefined}
        aria-describedby={toast.description ? descriptionId : undefined}
        aria-live={toast.type === "error" ? "assertive" : "polite"}
        tabIndex={0}
        data-toast-root
        data-type={toast.type}
        className={mergedClassName}
        style={mergedStyle}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className={tv.content()}>
          {iconContent && (
            <div
              className={tcx(tv.icon(), slotProps.iconClassName)}
              style={slotProps.iconStyle}
            >
              {iconContent}
            </div>
          )}
          {titleContent}
          {layout === "default" && descriptionContent}

          {shouldShowProgress && (
            <ToastProgressBar
              duration={toastDuration}
              isPaused={isPaused}
              tv={tv}
            />
          )}
        </div>

        {actionsContent}
      </motion.div>
    )
  }),
)

ToasterItem.displayName = "ToasterItem"
