import type { FloatingContext, Placement } from "@floating-ui/react"
import {
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
} from "@floating-ui/react"
import { Slot } from "@radix-ui/react-slot"
import React, { memo, useEffect, useId, useMemo } from "react"
import { findChildByType, mergeRefs } from "~/utils"
import { Modal, ModalContent, ModalFooter } from "../modal"
import { PopoverHeader, PopoverTrigger } from "./components"
import { useDrag, useFloatingPopover } from "./hooks"
import { PopoverContext } from "./popover-context"

const PORTAL_ROOT_ID = "floating-popover-root"
const DEFAULT_OFFSET = 8

interface FloatingFocusManagerProps {
  closeOnFocusOut?: boolean
  disabled?: boolean
  getInsideElements?: () => Element[]
  guards?: boolean
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>
  modal?: boolean
  order?: Array<"reference" | "floating" | "content">
  outsideElementsInert?: boolean
  restoreFocus?: boolean
  returnFocus?: boolean
  visuallyHiddenDismiss?: boolean | string
}

export interface PopoverProps {
  autoSize?: boolean
  autoUpdate?: boolean
  children?: React.ReactNode
  className?: string
  contentRef?: React.RefObject<HTMLDivElement>
  defaultOpen?: boolean
  delay?: { close?: number; open?: number }
  draggable?: boolean
  focusManagerProps?: FloatingFocusManagerProps
  /**
   * @deprecated use focusManagerProps.initialFocus instead
   */
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>
  interactions?: "hover" | "click" | "focus" | "none"
  offset?: number
  onOpenChange?: (isOpen: boolean) => void
  open?: boolean
  outsidePressIgnore?: string
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
  contentRef,
  delay,
  initialFocus,
  focusManagerProps = {
    returnFocus: true,
    guards: false,
  },
  outsidePressIgnore,
  portalId = PORTAL_ROOT_ID,
  autoSize = true,
  rememberPosition = false,
}: PopoverProps) {
  const titleId = useId()
  const descriptionId = useId()
  const nodeId = useFloatingNodeId()

  const floatingRefMutable = useMemo(() => ({ current: null as HTMLElement | null }), [])

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
    open,
    defaultOpen,
    onOpenChange,
    placement,
    offset: offsetDistance,
    interactions,
    outsidePressIgnore,
    delay,
    autoUpdate,
    draggable,
    nodeId,
    resetDragState,
    resetPosition,
    rememberPosition,
    autoSize,
  })

  useEffect(() => {
    if (externalTriggerRef) {
      floating.handleTriggerRef(externalTriggerRef)
    }
  }, [externalTriggerRef, floating])

  const combinedStyles = useMemo(() => {
    return floating.getStyles(dragState.position, dragState.isDragging)
  }, [floating, dragState.position, dragState.isDragging])

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
  }, [children, descriptionId, dragContentRef])

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
    [
      floating.innerOpen,
      floating.setInnerOpen,
      externalTriggerRef,
      floating.getReferenceProps,
      floating.getFloatingProps,
      floating.refs,
      floating.handleClose,
      draggable,
      handleDragStart,
      titleId,
      descriptionId,
      dragContentRef,
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
                ref={(node) => {
                  floating.refs.setFloating(node)
                  floatingRefMutable.current = node
                  if (contentRef && node) {
                    mergeRefs(contentRef)(node)
                  }
                }}
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
                {contentContent}
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
