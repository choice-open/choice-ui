import {
  autoUpdate,
  flip,
  offset,
  Placement,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from "@floating-ui/react"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useEventCallback } from "usehooks-ts"

const DEFAULT_OFFSET = 4

export interface UseContextMenuProps {
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  portalId?: string
  selection?: boolean
}

export interface UseContextMenuReturn {
  activeIndex: number | null
  context: ReturnType<typeof useFloating>["context"]
  contextMenuContextValue: {
    handleContextMenu: (e: MouseEvent) => void
  }
  // Context values
  dropdownContextValue: {
    activeIndex: number | null
    close: () => void
    getItemProps: ReturnType<typeof useInteractions>["getItemProps"]
    isOpen: boolean
    selection: boolean
    setActiveIndex: (index: number | null) => void
    setHasFocusInside: (value: boolean) => void
  }
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>

  floatingStyles: ReturnType<typeof useFloating>["floatingStyles"]
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"]
  getItemProps: ReturnType<typeof useInteractions>["getItemProps"]

  // Interaction handlers
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"]
  handleArrowHide: () => void

  handleArrowScroll: (amount: number) => void
  handleClose: () => void
  // Event handlers
  handleContextMenu: (e: MouseEvent) => void
  handlePointerMove: (e: React.PointerEvent) => void

  handleScroll: (e: React.UIEvent) => void
  handleTouchStart: () => void
  // State
  isControlledOpen: boolean

  isNested: boolean
  isPositioned: boolean
  labelsRef: React.MutableRefObject<Array<string | null>>
  // IDs
  menuId: string
  nodeId: string
  // Floating UI
  refs: ReturnType<typeof useFloating>["refs"]
  // Refs
  scrollRef: React.RefObject<HTMLDivElement>

  scrollTop: number
  // State setters
  setActiveIndex: (index: number | null) => void

  setHasFocusInside: (value: boolean) => void

  touch: boolean
}

export function useContextMenu(props: UseContextMenuProps): UseContextMenuReturn {
  const {
    offset: offsetDistance = DEFAULT_OFFSET,
    placement = "bottom-start",
    selection = false,
    open: controlledOpen,
    onOpenChange,
  } = props

  // References
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const elementsRef = useRef<Array<HTMLElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])
  const allowMouseUpCloseRef = useRef(false)

  // Local state management
  const [isOpen, setIsOpen] = useState(false)
  const [hasFocusInside, setHasFocusInside] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [touch, setTouch] = useState(false)

  // Controlled/uncontrolled state handling
  const isControlledOpen = controlledOpen === undefined ? isOpen : controlledOpen

  // Accessibility identifiers
  const baseId = useId()
  const menuId = `context-menu-${baseId}`

  // Context and hooks
  const tree = useFloatingTree()
  const nodeId = useFloatingNodeId()
  const parentId = useFloatingParentNodeId()
  const isNested = parentId != null

  // Handle state changes with proper controlled/uncontrolled behavior
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setIsOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange],
  )

  // Floating UI setup
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    nodeId,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    placement: isNested ? "right-start" : placement,
    middleware: [
      offset({ mainAxis: isNested ? 10 : offsetDistance, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
      size({
        padding: 4,
        apply(args) {
          const { elements, availableHeight } = args
          Object.assign(elements.floating.style, {
            height: `${Math.min(elements.floating.clientHeight, availableHeight)}px`,
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, {
    enabled: isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true, buffer: 1 }),
  })

  const click = useClick(context, {
    event: "mousedown",
    toggle: !isNested,
    ignoreMouse: isNested,
  })

  const role = useRole(context, { role: "menu" })
  const dismiss = useDismiss(context)

  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
    loop: true,
  })

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: isControlledOpen ? setActiveIndex : undefined,
    activeIndex,
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
    typeahead,
  ])

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()

      // Set virtual position reference
      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          }
        },
      })

      handleOpenChange(true)

      // Handle mouse up close behavior
      allowMouseUpCloseRef.current = false
      const timeout = setTimeout(() => {
        allowMouseUpCloseRef.current = true
      }, 300)

      return () => clearTimeout(timeout)
    },
    [refs, handleOpenChange],
  )

  useEffect(() => {
    if (!tree) return

    const handleTreeClick = () => {
      handleOpenChange(false)
    }

    const onSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        handleOpenChange(false)
      }
    }

    tree.events.on("click", handleTreeClick)
    tree.events.on("menuopen", onSubMenuOpen)

    return () => {
      tree.events.off("click", handleTreeClick)
      tree.events.off("menuopen", onSubMenuOpen)
    }
  }, [tree, nodeId, parentId, handleOpenChange])

  // Emit menu open event
  useEffect(() => {
    if (isControlledOpen && tree) {
      tree.events.emit("menuopen", { parentId, nodeId })
    }
  }, [tree, isControlledOpen, nodeId, parentId])

  // Handle mouse up close
  useEffect(() => {
    const handleMouseUp = () => {
      if (allowMouseUpCloseRef.current) {
        handleOpenChange(false)
      }
    }

    if (isControlledOpen) {
      document.addEventListener("mouseup", handleMouseUp)
      return () => document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isControlledOpen, handleOpenChange])

  // Scroll handlers
  const handleArrowScroll = useEventCallback((amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop -= amount
      flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0))
    }
  })

  const handleArrowHide = useEventCallback(() => {
    if (touch) {
      clearTimeout(selectTimeoutRef.current)
    }
  })

  // Handle touch input
  const handleTouchStart = useEventCallback(() => {
    setTouch(true)
  })

  const handlePointerMove = useEventCallback(({ pointerType }: React.PointerEvent) => {
    if (pointerType !== "touch") {
      setTouch(false)
    }
  })

  // Handle scroll events
  const handleScroll = useEventCallback(({ currentTarget }: React.UIEvent) => {
    flushSync(() => setScrollTop(currentTarget.scrollTop))
  })

  // Create close method
  const handleClose = useEventCallback(() => {
    handleOpenChange(false)
  })

  // Create dropdown context value
  const dropdownContextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      getItemProps,
      setHasFocusInside,
      isOpen: isControlledOpen,
      selection,
      close: handleClose,
    }),
    [activeIndex, getItemProps, handleClose, isControlledOpen, selection],
  )

  // Create context menu context value
  const contextMenuContextValue = useMemo(
    () => ({
      handleContextMenu,
    }),
    [handleContextMenu],
  )

  // Memoize the return object to avoid creating new objects on every render
  return useMemo(
    () => ({
      // State
      isControlledOpen,
      activeIndex,
      scrollTop,
      touch,
      isNested,

      // Refs
      scrollRef,
      elementsRef,
      labelsRef,

      // IDs
      menuId,
      nodeId,

      // Floating UI
      refs,
      floatingStyles,
      context,
      isPositioned,

      // Interaction handlers
      getReferenceProps,
      getFloatingProps,
      getItemProps,

      // Event handlers
      handleContextMenu,
      handleArrowScroll,
      handleArrowHide,
      handleTouchStart,
      handlePointerMove,
      handleScroll,
      handleClose,

      // State setters
      setActiveIndex,
      setHasFocusInside,

      // Context values
      dropdownContextValue,
      contextMenuContextValue,
    }),
    [
      isControlledOpen,
      activeIndex,
      scrollTop,
      touch,
      isNested,
      scrollRef,
      elementsRef,
      labelsRef,
      menuId,
      nodeId,
      refs,
      floatingStyles,
      context,
      isPositioned,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      handleContextMenu,
      handleArrowScroll,
      handleArrowHide,
      handleTouchStart,
      handlePointerMove,
      handleScroll,
      handleClose,
      setActiveIndex,
      setHasFocusInside,
      dropdownContextValue,
      contextMenuContextValue,
    ],
  )
}
