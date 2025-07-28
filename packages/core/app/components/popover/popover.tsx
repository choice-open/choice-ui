import type { FloatingFocusManagerProps, Placement } from "@floating-ui/react"
import {
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
} from "@floating-ui/react"
import React, { memo, useCallback, useEffect, useId, useMemo, useRef } from "react"
import { findChildByType, mergeRefs } from "~/utils"
import { Modal, ModalContent, ModalFooter } from "../modal"
import { Slot } from "../slot"
import { PopoverHeader, PopoverTrigger } from "./components"
import { useDrag, useFloatingPopover } from "./hooks"
import { PopoverContext } from "./popover-context"

const PORTAL_ROOT_ID = "floating-popover-root"
const DEFAULT_OFFSET = 8

export interface PopoverProps {
  autoSize?: boolean
  autoUpdate?: boolean
  children?: React.ReactNode
  className?: string
  closeOnEscape?: boolean
  contentRef?: React.RefObject<HTMLDivElement>
  defaultOpen?: boolean
  delay?: { close?: number; open?: number }
  draggable?: boolean
  focusManagerProps?: Partial<FloatingFocusManagerProps>
  /**
   * @deprecated use focusManagerProps.initialFocus instead
   */
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>
  interactions?: "hover" | "click" | "focus" | "none"
  matchTriggerWidth?: boolean
  maxWidth?: number
  offset?: number
  onOpenChange?: (isOpen: boolean) => void
  open?: boolean
  outsidePressIgnore?: string | string[] | boolean
  placement?: Placement
  portalId?: string
  rememberPosition?: boolean
  triggerRef?: React.RefObject<HTMLElement>
}

// Popover 组件实现
export const DragPopover = memo(function DragPopover({
  className,
  children,
  triggerRef: externalTriggerRef,
  draggable = false,
  placement = "bottom",
  interactions = "click",
  offset: offsetDistance = DEFAULT_OFFSET,
  open,
  onOpenChange,
  defaultOpen,
  autoUpdate = true,
  closeOnEscape = true,
  contentRef,
  delay,
  initialFocus,
  focusManagerProps = {
    returnFocus: true,
    guards: false,
    modal: false,
  },
  outsidePressIgnore,
  portalId = PORTAL_ROOT_ID,
  autoSize = true,
  rememberPosition = false,
  maxWidth,
  matchTriggerWidth = false,
}: PopoverProps) {
  const titleId = useId()
  const descriptionId = useId()
  const nodeId = useFloatingNodeId()

  // 🔧 移除不必要的 useMemo，简单对象不需要缓存
  const floatingRefMutable = useRef<HTMLElement | null>(null)

  const {
    state: dragState,
    contentRef: dragContentRef,
    handleDragStart,
    resetDragState,
    resetPosition,
  } = useDrag({
    draggable,
    floatingRef: floatingRefMutable,
    rememberPosition,
  })

  const floating = useFloatingPopover({
    autoSize,
    autoUpdate,
    defaultOpen,
    delay,
    draggable,
    interactions,
    maxWidth,
    matchTriggerWidth,
    nodeId,
    offset: offsetDistance,
    onOpenChange,
    open,
    outsidePressIgnore,
    placement,
    closeOnEscape,
    rememberPosition,
    resetDragState,
    resetPosition,
  })

  useEffect(() => {
    if (externalTriggerRef) {
      floating.handleTriggerRef(externalTriggerRef)
    }
  }, [externalTriggerRef, floating])

  // 🔧 缓存样式计算函数
  const combinedStyles = useMemo(() => {
    return floating.getStyles(dragState.position, dragState.isDragging)
  }, [floating, dragState.position, dragState.isDragging])

  // 🔧 缓存内联函数，避免每次渲染重新创建
  const handleFloatingRef = useCallback(
    (node: HTMLElement | null) => {
      floating.refs.setFloating(node)
      floatingRefMutable.current = node
      if (contentRef && node) {
        mergeRefs(contentRef)(node as HTMLDivElement)
      }
    },
    [floating.refs, contentRef],
  )

  const triggerContent = useMemo(() => {
    return findChildByType(children, PopoverTrigger)
  }, [children])

  const headerContent = useMemo(() => {
    const headerChild = findChildByType(children, PopoverHeader)

    if (!headerChild) return null

    return (
      <Slot
        onMouseDown={draggable ? handleDragStart : undefined}
        role={draggable ? "button" : undefined}
        aria-label={draggable ? "Drag to move popover" : undefined}
        tabIndex={draggable ? 0 : undefined}
      >
        {headerChild}
      </Slot>
    )
  }, [children, draggable, handleDragStart])

  // 🔧 contentContent 的依赖项优化
  const contentContent = useMemo(() => {
    const contentChild = findChildByType(children, ModalContent)

    if (!contentChild) return null

    return (
      <Slot
        ref={dragContentRef}
        id={descriptionId}
      >
        {contentChild}
      </Slot>
    )
  }, [children, dragContentRef, descriptionId])

  // 🔧 优化 Context value，减少不必要的依赖项
  const contextValue = useMemo(
    () => ({
      open: floating.innerOpen,
      setOpen: floating.setInnerOpen,
      triggerRef: externalTriggerRef || { current: null },
      getReferenceProps: floating.getReferenceProps,
      getFloatingProps: floating.getFloatingProps,
      refs: floating.refs,
      draggable,
      handleDragStart,
      onCloseClick: floating.handleClose,
      titleId,
      descriptionId,
      dragContentRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      floating.innerOpen,
      floating.setInnerOpen,
      floating.getReferenceProps,
      floating.getFloatingProps,
      floating.refs,
      floating.handleClose,
      externalTriggerRef,
      draggable,
      handleDragStart,
      // titleId, descriptionId, dragContentRef 是稳定的，移除
    ],
  )

  return (
    <FloatingNode id={nodeId}>
      <PopoverContext.Provider value={contextValue}>
        {triggerContent}
        <FloatingFocusManager
          initialFocus={initialFocus}
          {...focusManagerProps}
          context={floating.context}
        >
          <FloatingPortal id={portalId}>
            {floating.innerOpen && (
              <Modal
                ref={handleFloatingRef}
                style={combinedStyles}
                className={className}
                data-state={floating.positionReady ? "open" : "opening"}
                data-dragging={dragState.isDragging ? "true" : undefined}
                data-draggable={draggable ? "true" : undefined}
                data-closing={floating.isClosing ? "true" : undefined}
                {...floating.getFloatingProps()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
              >
                {headerContent}
                {floating.positionReady && contentContent}
              </Modal>
            )}
          </FloatingPortal>
        </FloatingFocusManager>
      </PopoverContext.Provider>
    </FloatingNode>
  )
})

interface PopoverComponent extends React.FC<PopoverProps> {
  Content: typeof ModalContent
  Footer: typeof ModalFooter
  Header: typeof PopoverHeader
  Trigger: typeof PopoverTrigger
}

const PopoverBase = memo((props: PopoverProps) => {
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <DragPopover {...props} />
      </FloatingTree>
    )
  }

  return <DragPopover {...props} />
})

PopoverBase.displayName = "Popover"

export const Popover = Object.assign(PopoverBase, {
  Trigger: PopoverTrigger,
  Content: ModalContent,
  Header: PopoverHeader,
  Footer: ModalFooter,
}) as PopoverComponent
