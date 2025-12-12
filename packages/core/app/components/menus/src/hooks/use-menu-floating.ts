import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useHover,
  safePolygon,
  inner,
  type Placement,
  type SideObject,
} from "@floating-ui/react"
import { useMemo } from "react"

/**
 * Menu FloatingUI configuration Hook
 *
 * Provide different floating configurations for Select and Dropdown:
 * - Select: use inner middleware + virtual scrolling
 * - Dropdown: use standard middleware + nested support
 */

export interface MenuFloatingConfig {
  activeIndex: number | null
  // Select specific configuration
  /** Current selected index (Select specific) */
  currentSelectedIndex?: number
  // Reference configuration
  elementsRef: React.RefObject<Array<HTMLElement | null>>
  /** Whether to use fallback mode (Select specific) */
  fallback?: boolean
  /** State change callback */
  handleOpenChange: (open: boolean) => void
  /** Internal offset (Select specific) */
  innerOffset?: number
  /** Current open state */
  isControlledOpen: boolean
  /** Whether to use nested mode (only used for Dropdown) */
  isNested?: boolean
  labelsRef: React.RefObject<Array<string | null>>

  /** Whether to match trigger width */
  matchTriggerWidth?: boolean
  /** Node ID (only used for Dropdown) */
  nodeId?: string
  /** Offset distance */
  offsetDistance?: number
  /** overflow reference (Select specific) */
  overflowRef?: React.RefObject<SideObject | null>
  /** Position configuration */
  placement?: Placement
  scrollRef: React.RefObject<HTMLDivElement>

  setActiveIndex: (index: number | null) => void
  /** Set fallback (Select specific) */
  setFallback?: (fallback: boolean) => void
  /** Set internal offset (Select specific) */
  setInnerOffset?: (offset: number) => void
  /** Touch state */
  touch?: boolean
  /** Component type */
  type: "select" | "dropdown"
}

export interface MenuFloatingResult {
  /** floating context and styles */
  floating: ReturnType<typeof useFloating>
  /** hover handler (only used for Dropdown) */
  hover?: ReturnType<typeof useHover>
  /** Interaction handler */
  interactions: ReturnType<typeof useInteractions>
}

export function useMenuFloating(config: MenuFloatingConfig): MenuFloatingResult {
  const {
    type,
    isControlledOpen,
    handleOpenChange,
    placement = "bottom-start",
    matchTriggerWidth = false,
    isNested = false,
    offsetDistance = 4,
    touch = false,
    nodeId,
    currentSelectedIndex = 0,
    fallback = false,
    innerOffset = 0,
    setFallback,
    setInnerOffset,
    overflowRef,
    elementsRef,
    labelsRef,
    scrollRef,
    activeIndex,
    setActiveIndex,
  } = config

  // Configure middleware based on component type
  const middleware = useMemo(() => {
    if (type === "select") {
      // Select component: use inner middleware
      return fallback
        ? [
            offset(8),
            touch ? shift({ crossAxis: true, padding: 16 }) : flip({ padding: 16 }),
            size({
              apply(args) {
                const { availableHeight } = args
                requestAnimationFrame(() => {
                  if (scrollRef.current) {
                    scrollRef.current.style.maxHeight = `${availableHeight}px`
                  }
                })
              },
              padding: 4,
            }),
          ]
        : [
            inner({
              listRef: elementsRef as React.MutableRefObject<Array<HTMLElement | null>>,
              overflowRef: overflowRef as React.MutableRefObject<SideObject | null>,
              scrollRef: scrollRef as React.MutableRefObject<HTMLDivElement | null>,
              index: currentSelectedIndex >= 0 ? currentSelectedIndex : 0,
              offset: innerOffset,
              onFallbackChange: setFallback,
              padding: 16,
              minItemsVisible: touch ? 8 : 4,
              referenceOverflowThreshold: 20,
            }),
            offset(placement.includes("end") ? { crossAxis: 8 } : { crossAxis: -8 }),
            size({
              apply(args) {
                const { rects, elements } = args
                if (matchTriggerWidth) {
                  elements.floating.style.width = `${rects.reference.width + 16}px`
                }
              },
            }),
          ]
    } else {
      // Dropdown component: use standard middleware
      return [
        offset({ mainAxis: isNested ? 10 : offsetDistance, alignmentAxis: isNested ? -4 : 0 }),
        flip(),
        shift(),
        size({
          padding: 4,
          apply(args) {
            const { elements, availableHeight, rects } = args
            Object.assign(elements.floating.style, {
              height: `${Math.min(elements.floating.clientHeight, availableHeight)}px`,
            })
            if (matchTriggerWidth) {
              elements.floating.style.width = `${rects.reference.width}px`
            }
          },
        }),
      ]
    }
  }, [
    type,
    fallback,
    touch,
    scrollRef,
    elementsRef,
    overflowRef,
    currentSelectedIndex,
    innerOffset,
    setFallback,
    placement,
    matchTriggerWidth,
    isNested,
    offsetDistance,
  ])

  // Configure floating
  const floating = useFloating({
    nodeId,
    placement: isNested ? "right-start" : placement,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
    transform: type === "select" ? false : undefined,
  })

  // Configure hover (always called, but enabled/disabled based on type)
  const hover = useHover(floating.context, {
    enabled: type === "dropdown" && isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true, requireIntent: false, buffer: 10 }),
  })

  // Configure click
  const click = useClick(floating.context, {
    event: "mousedown",
    toggle: type === "dropdown" ? !isNested : true,
    ignoreMouse: type === "dropdown" ? isNested : false,
    stickIfOpen: false,
  })

  // Configure dismiss
  const dismiss = useDismiss(floating.context, {
    bubbles: true,
    escapeKey: true,
  })

  // Configure role
  const role = useRole(floating.context, {
    role: type === "select" ? "listbox" : "menu",
  })

  // Configure listNavigation
  const listNavigation = useListNavigation(floating.context, {
    listRef: elementsRef as React.MutableRefObject<Array<HTMLElement | null>>,
    activeIndex,
    selectedIndex:
      type === "select" ? (currentSelectedIndex >= 0 ? currentSelectedIndex : 0) : undefined,
    nested: type === "dropdown" ? isNested : false,
    onNavigate: setActiveIndex,
    loop: type === "dropdown",
  })

  // Configure typeahead
  const typeahead = useTypeahead(floating.context, {
    listRef: labelsRef as React.MutableRefObject<Array<string | null>>,
    onMatch:
      type === "select"
        ? isControlledOpen
          ? setActiveIndex
          : (index) => {
              if (index !== -1) setActiveIndex(index)
            }
        : isControlledOpen
          ? setActiveIndex
          : undefined,
    activeIndex,
  })

  // Combine interaction handlers
  const interactionHandlers = useMemo(() => {
    const handlers = [click, dismiss, role, listNavigation, typeahead]

    // Only include specific handlers for related types
    if (type === "dropdown") {
      handlers.unshift(hover)
    }

    return handlers
  }, [type, click, dismiss, role, hover, listNavigation, typeahead])

  const interactions = useInteractions(interactionHandlers)

  return {
    floating,
    interactions,
    hover,
  }
}
