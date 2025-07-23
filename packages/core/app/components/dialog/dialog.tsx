import {
  FloatingFocusManager,
  FloatingFocusManagerProps,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react"
import React, { memo, useId, useMemo, useRef } from "react"
import { findChildByType, tcx } from "~/utils"
import { Modal, ModalBackdrop, ModalContent, ModalFooter } from "../modal"
import { Slot } from "../slot"
import { DialogHeader, DialogTrigger } from "./components"
import { DialogContext } from "./dialog-context"
import { useDrag, useFloatingDialog, useResize } from "./hooks"
import { dragDialogTv } from "./tv"

const PORTAL_ROOT_ID = "floating-modal-root"

export type DialogPosition =
  | "left-top"
  | "center-top"
  | "right-top"
  | "left-center"
  | "center"
  | "right-center"
  | "left-bottom"
  | "center-bottom"
  | "right-bottom"

export interface DialogProps {
  afterOpenChange?: (isOpen: boolean) => void
  children?: React.ReactNode
  className?: string
  defaultHeight?: number
  defaultWidth?: number
  draggable?: boolean
  focusManagerProps?: Partial<FloatingFocusManagerProps>
  initialPosition?: DialogPosition
  maxHeight?: number
  maxWidth?: number
  minHeight?: number
  minWidth?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  outsidePress?: boolean
  overlay?: boolean
  positionPadding?: number
  rememberPosition?: boolean
  rememberSize?: boolean
  resizable?: {
    height?: boolean
    width?: boolean
  }
}

const DialogComponent = memo(function DialogComponent({
  className,
  children,
  draggable = false,
  initialPosition = "center",
  positionPadding = 32,
  resizable = { width: false, height: false },
  defaultWidth = 512,
  defaultHeight = 384,
  minWidth = 320,
  maxWidth,
  minHeight = 240,
  maxHeight,
  overlay = false,
  outsidePress = false,
  open: controlledOpen,
  onOpenChange,
  afterOpenChange,
  rememberPosition = false,
  rememberSize = false,
  focusManagerProps = { initialFocus: 1 },
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  const isResizable = resizable.width || resizable.height

  const {
    state: dragState,
    handleDragStart,
    resetDragState,
    resetPosition,
  } = useDrag(dialogRef, {
    enabled: draggable,
    rememberPosition,
  })

  const {
    state: resizeState,
    handleResizeStart,
    resetResizeState,
    resetSize,
  } = useResize(dialogRef, {
    enabled: isResizable,
    defaultWidth: isResizable ? defaultWidth : undefined,
    defaultHeight: isResizable ? defaultHeight : undefined,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    rememberSize,
  })

  const floating = useFloatingDialog({
    open: controlledOpen,
    onOpenChange,
    outsidePress,
    initialPosition,
    resetDragState,
    resetPosition,
    resetResizeState,
    resetSize,
    rememberPosition,
    rememberSize,
    afterOpenChange,
    positionPadding,
  })

  const getStyleWithDefaults = useMemo(() => {
    let sizeObj: { height: number; width: number } | undefined = undefined

    if (resizeState.size) {
      sizeObj = {
        width: resizeState.size.width,
        height: resizeState.size.height,
      }
    } else if (isResizable) {
      const width = resizable.width ? defaultWidth : 0
      const height = resizable.height ? defaultHeight : 0

      if (width > 0 || height > 0) {
        sizeObj = {
          width: width > 0 ? width : 0,
          height: height > 0 ? height : 0,
        }
      }
    }

    return floating.getStyles(dragState.position || null, sizeObj, dialogRef)
  }, [
    resizeState.size,
    isResizable,
    floating,
    dragState.position,
    resizable.width,
    resizable.height,
    defaultWidth,
    defaultHeight,
  ])

  const triggerContent = useMemo(() => {
    return findChildByType(children, DialogTrigger)
  }, [children])

  const headerContent = useMemo(() => {
    const headerChild = findChildByType(children, DialogHeader)

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
    return findChildByType(children, ModalContent)
  }, [children])

  const backdropContent = useMemo(() => {
    const backdropChild = findChildByType(children, ModalBackdrop)

    if (!backdropChild) return null

    // 克隆 ModalBackdrop 并传递必要的 props
    return React.cloneElement(backdropChild, {
      isOpen: floating.innerOpen,
      onClose: floating.handleClose,
      ...backdropChild.props, // 保留原有的 props
    })
  }, [children, floating.innerOpen, floating.handleClose])

  const footerContent = useMemo(() => {
    return findChildByType(children, ModalFooter)
  }, [children])

  const contextValue = useMemo(
    () => ({
      open: floating.innerOpen,
      setOpen: floating.setInnerOpen,
      titleId,
      descriptionId,
      draggable,
      handleDragStart,
      contentRef,
      dialogRef,
      onCloseClick: floating.handleClose,
    }),
    [
      floating.innerOpen,
      floating.setInnerOpen,
      titleId,
      descriptionId,
      draggable,
      handleDragStart,
      floating.handleClose,
    ],
  )

  const style = dragDialogTv({
    resizable: isResizable,
    overlay,
  })

  return (
    <DialogContext.Provider value={contextValue}>
      {triggerContent}

      {floating.innerOpen && (
        <FloatingPortal id={PORTAL_ROOT_ID}>
          <FloatingOverlay
            lockScroll
            className={tcx(style.overlay())}
          >
            <FloatingFocusManager
              context={floating.context}
              {...focusManagerProps}
            >
              <Modal
                ref={(node) => {
                  if (node) {
                    dialogRef.current = node
                    floating.refs.setFloating(node)
                  }
                }}
                style={getStyleWithDefaults}
                className={tcx(style.dialog(), className)}
                {...floating.getFloatingProps()}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                role="dialog"
                aria-modal="true"
                data-state={floating.isReady ? "open" : "opening"}
                data-draggable={draggable ? "true" : undefined}
                data-dragging={dragState.isDragging ? "true" : undefined}
                data-closing={floating.isClosing ? "true" : undefined}
                data-resizable={isResizable ? "true" : undefined}
              >
                {headerContent}
                {contentContent}
                {footerContent}

                {resizable.width && (
                  <div
                    className={style.resizeWidthHandle()}
                    aria-label="Resize dialog width"
                    tabIndex={0}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleResizeStart(e, { width: true, height: false })
                    }}
                  />
                )}

                {resizable.height && (
                  <div
                    className={style.resizeHeightHandle()}
                    aria-label="Resize dialog height"
                    tabIndex={0}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleResizeStart(e, { width: false, height: true })
                    }}
                  />
                )}

                {resizable.width && resizable.height && (
                  <div
                    className={style.resizeCornerHandle()}
                    aria-label="Resize dialog width and height"
                    tabIndex={0}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleResizeStart(e, { width: true, height: true })
                    }}
                  />
                )}
              </Modal>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}

      {backdropContent}
    </DialogContext.Provider>
  )
})

type DialogComponentType = React.FC<DialogProps> & {
  Backdrop: typeof ModalBackdrop
  Content: typeof ModalContent
  Footer: typeof ModalFooter
  Header: typeof DialogHeader
  Trigger: typeof DialogTrigger
}

export const Dialog = Object.assign(DialogComponent, {
  Trigger: DialogTrigger,
  Content: ModalContent,
  Header: DialogHeader,
  Backdrop: ModalBackdrop,
  Footer: ModalFooter,
}) as DialogComponentType
