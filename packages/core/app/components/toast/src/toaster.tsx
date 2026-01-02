import { mergeRefs, tcx } from "@choice-ui/shared"
import { AnimatePresence } from "framer-motion"
import {
  Children,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { useEventCallback } from "usehooks-ts"
import {
  CollectedSlotProps,
  DEFAULT_HEIGHT,
  GAP,
  ToasterActionsSlot,
  ToasterActionsSlotProps,
  ToasterDescriptionSlot,
  ToasterDescriptionSlotProps,
  ToasterIconSlot,
  ToasterIconSlotProps,
  ToasterItem,
  ToasterItemSlot,
  ToasterItemSlotProps,
  ToasterTitleSlot,
  ToasterTitleSlotProps,
} from "./components"
import { dismiss, getSnapshot, setExpanded, setToasterConfig, subscribe } from "./store"
import { toastViewportTv } from "./tv"
import type { ToastPosition } from "./types"

// Shared portal container for all Toasters
let sharedPortalContainer: HTMLDivElement | null = null
let portalRefCount = 0

function getSharedPortalContainer(): HTMLDivElement {
  if (!sharedPortalContainer && typeof document !== "undefined") {
    sharedPortalContainer = document.createElement("div")
    sharedPortalContainer.setAttribute("data-toast-portal", "")
    document.body.appendChild(sharedPortalContainer)
  }
  return sharedPortalContainer!
}

function releaseSharedPortalContainer() {
  portalRefCount--
  if (portalRefCount <= 0 && sharedPortalContainer) {
    sharedPortalContainer.remove()
    sharedPortalContainer = null
    portalRefCount = 0
  }
}

export interface ToasterProps {
  /**
   * Unique ID for this Toaster instance
   * Use this to have multiple Toaster instances in the same app
   * @default "default"
   */
  id?: string
  /**
   * Position of the toaster
   * @default "bottom-right"
   */
  position?: ToastPosition
  /**
   * Render toasts into a custom container
   */
  container?: HTMLElement | null
  /**
   * Label for accessibility
   * @default "Notifications"
   */
  label?: string
  /**
   * Whether to use a portal for rendering
   * @default true
   */
  portal?: boolean
  /**
   * Offset from viewport edges in pixels
   * @default 16
   */
  offset?: number
  /**
   * Default duration for toasts in ms
   * @default 5000
   */
  duration?: number
  /**
   * Maximum number of visible toasts
   * @default 3
   */
  visibleToasts?: number
  /**
   * Additional class name
   */
  className?: string
  /**
   * Children - use Toaster.Item to customize toast rendering
   */
  children?: ReactNode
  /**
   * Show countdown progress bar at the bottom of each toast
   * @default false
   */
  showProgress?: boolean
  /**
   * Layout mode for toasts
   * @default "default"
   */
  layout?: "default" | "compact"
}

/**
 * Toaster component - renders toasts from the global store
 */
const ToasterRoot = memo(
  forwardRef<HTMLDivElement, ToasterProps>(function Toaster(
    {
      id: toasterId = "default",
      position = "bottom-right",
      container,
      label = "Notifications",
      portal = true,
      offset = 16,
      duration = 5000,
      visibleToasts = 3,
      className,
      children,
      showProgress = false,
      layout = "default",
    },
    ref,
  ) {
    // Extract slot props from Toaster.Item and its children
    const collectedSlots = useMemo(() => {
      const slots: CollectedSlotProps = {}

      Children.forEach(children, (child) => {
        if (isValidElement(child) && child.type === ToasterItemSlot) {
          const itemProps = child.props as ToasterItemSlotProps
          slots.itemClassName = itemProps.className
          slots.itemStyle = itemProps.style

          // Extract slot children from Toaster.Item
          Children.forEach(itemProps.children, (slotChild) => {
            if (!isValidElement(slotChild)) return

            if (slotChild.type === ToasterIconSlot) {
              const iconProps = slotChild.props as ToasterIconSlotProps
              slots.iconClassName = iconProps.className
              slots.iconStyle = iconProps.style
              slots.renderIcon = iconProps.children
            } else if (slotChild.type === ToasterTitleSlot) {
              const titleProps = slotChild.props as ToasterTitleSlotProps
              slots.titleClassName = titleProps.className
              slots.titleStyle = titleProps.style
            } else if (slotChild.type === ToasterDescriptionSlot) {
              const descProps = slotChild.props as ToasterDescriptionSlotProps
              slots.descriptionClassName = descProps.className
              slots.descriptionStyle = descProps.style
            } else if (slotChild.type === ToasterActionsSlot) {
              const actionsProps = slotChild.props as ToasterActionsSlotProps
              slots.actionsClassName = actionsProps.className
              slots.actionsStyle = actionsProps.style
              slots.renderActions = actionsProps.children
            }
          })
        }
      })

      return slots
    }, [children])

    const internalRef = useRef<HTMLDivElement>(null)
    const [hovering, setHovering] = useState(false)

    // Subscribe to the global store
    const subscribeToStore = useCallback(
      (callback: () => void) => subscribe(callback, toasterId),
      [toasterId],
    )

    const getStoreSnapshot = useCallback(() => getSnapshot(toasterId), [toasterId])

    const state = useSyncExternalStore(subscribeToStore, getStoreSnapshot, getStoreSnapshot)

    // Update toaster config when props change
    useEffect(() => {
      setToasterConfig({ position }, toasterId)
    }, [position, toasterId])

    // Timer management with pause/resume support
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
    // Track remaining time for each toast when paused (0 = not paused, >0 = remaining ms)
    const remainingRef = useRef<Map<string, number>>(new Map())

    // Single effect to manage all timer logic
    useEffect(() => {
      const currentIds = new Set(state.toasts.map((t) => t.id))

      // Cleanup timers for removed toasts
      timersRef.current.forEach((timer, id) => {
        if (!currentIds.has(id)) {
          clearTimeout(timer)
          timersRef.current.delete(id)
          remainingRef.current.delete(id)
        }
      })

      state.toasts.forEach((toast) => {
        // Skip loading toasts - they never auto-dismiss
        if (toast.type === "loading") return

        const toastDuration = toast.duration ?? duration
        // duration <= 0 or Infinity means no auto-dismiss
        // Note: setTimeout with Infinity overflows (32-bit signed int max is ~24.8 days)
        if (toastDuration <= 0 || !Number.isFinite(toastDuration)) return

        const hasTimer = timersRef.current.has(toast.id)

        if (hovering) {
          // Pause: clear timer and save remaining time
          if (hasTimer) {
            clearTimeout(timersRef.current.get(toast.id))
            timersRef.current.delete(toast.id)

            // Calculate remaining time
            const elapsed = Date.now() - toast.createdAt
            const remaining = Math.max(0, toastDuration - elapsed)
            remainingRef.current.set(toast.id, remaining)
          }
        } else {
          // Not hovering: start or resume timer
          if (!hasTimer) {
            // Get remaining time (from pause) or calculate fresh
            let delay = remainingRef.current.get(toast.id)
            if (delay === undefined) {
              // New toast - calculate based on creation time
              const elapsed = Date.now() - toast.createdAt
              delay = Math.max(0, toastDuration - elapsed)
            }
            remainingRef.current.delete(toast.id)

            if (delay <= 0) {
              // Time already expired
              toast.onAutoClose?.()
              dismiss(toast.id, toasterId)
              return
            }

            const timer = setTimeout(() => {
              toast.onAutoClose?.()
              dismiss(toast.id, toasterId)
              timersRef.current.delete(toast.id)
              remainingRef.current.delete(toast.id)
            }, delay)

            timersRef.current.set(toast.id, timer)
          }
        }
      })
    }, [state.toasts, duration, hovering, toasterId])

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        timersRef.current.forEach((timer) => clearTimeout(timer))
        timersRef.current.clear()
        remainingRef.current.clear()
      }
    }, [])

    const handleMouseEnter = useEventCallback(() => {
      setHovering(true)
      setExpanded(true, toasterId)
    })

    const handleMouseLeave = useEventCallback(() => {
      setHovering(false)
      setExpanded(false, toasterId)
    })

    const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
      if (e.key === "F6" && state.toasts.length > 0) {
        e.preventDefault()
        const firstToast = internalRef.current?.querySelector(
          '[role="alertdialog"], [role="status"]',
        )
        if (firstToast instanceof HTMLElement) {
          firstToast.focus()
        }
      }
    })

    // Limit visible toasts (memoized)
    const visibleToastsList = useMemo(
      () => state.toasts.slice(0, visibleToasts),
      [state.toasts, visibleToasts],
    )

    // Reset hover state when all toasts are dismissed
    useEffect(() => {
      if (visibleToastsList.length === 0 && hovering) {
        setHovering(false)
        setExpanded(false, toasterId)
      }
    }, [visibleToastsList.length, hovering, toasterId])

    // Calculate container height - always needed for hover detection
    // Use DEFAULT_HEIGHT as fallback when height hasn't been measured yet
    const containerHeight = useMemo(() => {
      if (visibleToastsList.length === 0) return undefined
      if (state.expanded) {
        // Expanded: sum of all heights + gaps
        const totalHeight = visibleToastsList.reduce((acc, toast, index) => {
          const height = toast.height || DEFAULT_HEIGHT
          const gap = index < visibleToastsList.length - 1 ? GAP : 0
          return acc + height + gap
        }, 0)
        return totalHeight
      } else {
        // Collapsed: frontmost height + peek offset for stacked toasts
        const frontmostHeight = visibleToastsList[0]?.height || DEFAULT_HEIGHT
        const peekOffset = (visibleToastsList.length - 1) * 8
        return frontmostHeight + peekOffset
      }
    }, [state.expanded, visibleToastsList])

    // Extract toast heights for ToasterItem offset calculation (avoids getSnapshot in child)
    const toastHeights = useMemo(
      () => visibleToastsList.map((t) => t.height ?? 0),
      [visibleToastsList],
    )

    const tv = toastViewportTv({ position, expanded: state.expanded, layout })

    const viewportStyle = useMemo(() => {
      const frontmostHeight = visibleToastsList[0]?.height
      return {
        "--toast-frontmost-height": frontmostHeight ? `${frontmostHeight}px` : undefined,
        "--toast-offset": `${offset}px`,
        height: containerHeight ? `${containerHeight}px` : undefined,
      } as React.CSSProperties
    }, [visibleToastsList, offset, containerHeight])

    // Portal reference counting - must be called before any early returns
    useEffect(() => {
      if (portal && !container) {
        portalRefCount++
        return releaseSharedPortalContainer
      }
    }, [portal, container])

    if (visibleToastsList.length === 0) return null

    const content = (
      <div
        ref={mergeRefs(internalRef, ref)}
        role="region"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions text"
        aria-label={label}
        tabIndex={-1}
        data-toaster
        data-toaster-id={toasterId}
        data-position={position}
        style={viewportStyle}
        className={tcx(tv, className)}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence>
          {visibleToastsList.map((toast, index) => (
            <ToasterItem
              key={toast.id}
              toast={toast}
              index={index}
              total={visibleToastsList.length}
              expanded={state.expanded}
              position={position}
              toasterId={toasterId}
              toastHeights={toastHeights}
              slotProps={collectedSlots}
              showProgress={showProgress}
              defaultDuration={duration}
              isPaused={hovering}
              layout={layout}
            />
          ))}
        </AnimatePresence>
      </div>
    )

    if (!portal) {
      return content
    }

    const portalContainer = container ?? getSharedPortalContainer()

    if (!portalContainer) {
      return content
    }

    return createPortal(content, portalContainer)
  }),
)

ToasterRoot.displayName = "Toaster"

// Compound component type
interface ToasterComponent extends React.MemoExoticComponent<
  React.ForwardRefExoticComponent<ToasterProps & React.RefAttributes<HTMLDivElement>>
> {
  Item: typeof ToasterItemSlot
  Icon: typeof ToasterIconSlot
  Title: typeof ToasterTitleSlot
  Description: typeof ToasterDescriptionSlot
  Actions: typeof ToasterActionsSlot
}

/**
 * Toaster component with compound pattern
 *
 * @example
 * ```tsx
 * <Toaster id="my-toaster">
 *   <Toaster.Item className="custom-class">
 *     <Toaster.Icon>{(type, defaultIcon) => <CustomIcon type={type} />}</Toaster.Icon>
 *     <Toaster.Title className="font-bold uppercase" />
 *     <Toaster.Description className="text-sm" />
 *     <Toaster.Actions>{(action, cancel, close) => <CustomActions />}</Toaster.Actions>
 *   </Toaster.Item>
 * </Toaster>
 * ```
 */
export const Toaster = Object.assign(ToasterRoot, {
  Item: ToasterItemSlot,
  Icon: ToasterIconSlot,
  Title: ToasterTitleSlot,
  Description: ToasterDescriptionSlot,
  Actions: ToasterActionsSlot,
}) as ToasterComponent
