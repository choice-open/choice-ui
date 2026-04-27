import { findChildByType, tcx } from "@choice-ui/shared"
import { Slot } from "@choice-ui/slot"
import { Modal, ModalBackdrop, ModalContent, ModalFooter } from "@choice-ui/modal"
import {
  FloatingFocusManager,
  FloatingFocusManagerProps,
  FloatingOverlay,
  FloatingPortal,
  UseTransitionStylesProps,
} from "@floating-ui/react"
import React, { memo, useId, useMemo, useRef } from "react"
import { DialogHeader, DialogTrigger } from "./components"
import { DialogContext } from "./dialog-context"
import { useDrag, useFloatingDialog, useResize } from "./hooks"
import { dragDialogTv } from "./tv"

const PORTAL_ROOT_ID = "floating-modal-root"

import type { DialogPosition } from "./types"
export interface DialogProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  afterOpenChange?: (isOpen: boolean) => void
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  closeOnEscape?: boolean
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
  root?: HTMLElement | null
  transitionStylesProps?: UseTransitionStylesProps
}

const DialogComponent = memo(function DialogComponent({
  as,
  className,
  children,
  closeOnEscape = true,
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
  transitionStylesProps,
  root,
  ...restProps
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  const isResizable = resizable.width || resizable.height

  const {
    state: dragState,
    handleDragStart,
    moveByKeyboard,
    resetDragState,
    resetPosition,
  } = useDrag(dialogRef, {
    enabled: draggable,
    rememberPosition,
  })

  const {
    state: resizeState,
    handleResizeStart,
    resizeByKeyboard,
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
    closeOnEscape,
    initialPosition,
    resetDragState,
    resetPosition,
    resetResizeState,
    resetSize,
    rememberPosition,
    rememberSize,
    afterOpenChange,
    positionPadding,
    transitionStylesProps,
  })

  const getStyleWithDefaults = useMemo(() => {
    let sizeObj: { height: number; width: number } | undefined = undefined

    if (resizeState.size) {
      sizeObj = {
        width: resizeState.size.width,
        height: resizeState.size.height,
      }
    } else if (isResizable) {
      const width = resizable.width ? defaultWidth : undefined
      const height = resizable.height ? defaultHeight : undefined

      if (width !== undefined || height !== undefined) {
        sizeObj = {
          width: width ?? defaultWidth,
          height: height ?? defaultHeight,
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
        onKeyDown={
          draggable
            ? (e: React.KeyboardEvent) => {
                if (e.target !== e.currentTarget) return
                const STEP = 10
                switch (e.key) {
                  case "ArrowLeft":
                    e.preventDefault()
                    moveByKeyboard(-STEP, 0)
                    break
                  case "ArrowRight":
                    e.preventDefault()
                    moveByKeyboard(STEP, 0)
                    break
                  case "ArrowUp":
                    e.preventDefault()
                    moveByKeyboard(0, -STEP)
                    break
                  case "ArrowDown":
                    e.preventDefault()
                    moveByKeyboard(0, STEP)
                    break
                  default:
                    break
                }
              }
            : undefined
        }
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

    // Clone ModalBackdrop and pass necessary props
    return React.cloneElement(backdropChild, {
      isOpen: floating.innerOpen,
      onClose: floating.handleClose,
      ...backdropChild.props,
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

      {floating.innerOpen && floating.isMounted && (
        <FloatingPortal
          id={PORTAL_ROOT_ID}
          root={root}
        >
          <FloatingOverlay
            lockScroll
            className={tcx(style.overlay())}
            style={{
              ...floating.styles,
            }}
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
                as={as}
                style={getStyleWithDefaults}
                className={tcx(style.dialog(), className)}
                {...floating.getFloatingProps()}
                {...restProps}
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
                    onKeyDown={(e) => {
                      const STEP = 10
                      switch (e.key) {
                        case "ArrowRight":
                          e.preventDefault()
                          resizeByKeyboard(STEP, 0)
                          break
                        case "ArrowLeft":
                          e.preventDefault()
                          resizeByKeyboard(-STEP, 0)
                          break
                      }
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
                    onKeyDown={(e) => {
                      const STEP = 10
                      switch (e.key) {
                        case "ArrowDown":
                          e.preventDefault()
                          resizeByKeyboard(0, STEP)
                          break
                        case "ArrowUp":
                          e.preventDefault()
                          resizeByKeyboard(0, -STEP)
                          break
                      }
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

type DialogComponentType = typeof DialogComponent & {
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
