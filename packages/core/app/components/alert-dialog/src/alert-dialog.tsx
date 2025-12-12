import { Button } from "@choice-ui/button"
import { tcx } from "@choice-ui/shared"
import { Modal } from "@choice-ui/modal"
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useFloating,
} from "@floating-ui/react"
import { memo, useEffect, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { useAlertDialogContext } from "./context/alert-dialog-context"
import { alertDialogTv } from "./tv"
import { AlertDialogCustomConfig } from "./types"
import {
  getButtonsForDialog,
  getDialogTitle,
  processButtonResult,
  shouldShowCloseButton,
} from "./utils"

const PORTAL_ROOT_ID = "floating-alert-root"

export interface AlertDialogProps {
  className?: string
  outsidePress?: boolean
  overlay?: boolean
  portalId?: string
  root?: HTMLElement | null
}

export const AlertDialog = memo(function AlertDialog(props: AlertDialogProps) {
  const { className, outsidePress, overlay = false, portalId = PORTAL_ROOT_ID, root } = props
  const { state, _handleAction } = useAlertDialogContext()
  const { isOpen, type, config } = state

  // Use floating-ui to get context, positioning not needed
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        _handleAction({ type: "HIDE", payload: { value: false } })
      }
    },
  })

  // Handle keyboard events
  useEffect(() => {
    // Only listen when dialog is open and config exists
    if (!isOpen || !config) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key to close dialog
      if (event.key === "Escape") {
        const shouldClose = config.closeOnEscape !== false
        if (shouldClose) {
          // Only prevent propagation when actually handling
          event.stopImmediatePropagation()
          event.preventDefault()
          _handleAction({ type: "HIDE", payload: { value: false } })
        }
      }

      // Enter key to confirm (if autofocus button exists)
      if (event.key === "Enter") {
        if (type === "alert") {
          event.preventDefault()
          _handleAction({ type: "HIDE", payload: { value: undefined } })
        } else if (type === "confirm") {
          event.preventDefault()
          _handleAction({ type: "HIDE", payload: { value: true } })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [isOpen, config, type, _handleAction])

  // Handle overlay click
  const handleOverlayClick = useEventCallback((event: React.MouseEvent) => {
    if (!config) return

    // Check if overlay click should close
    // Prefer outsidePress prop, fallback to config setting
    let shouldClose = false
    if (outsidePress !== undefined) {
      // If outsidePress is explicitly set, use its value
      shouldClose = outsidePress
    } else {
      // Otherwise use config setting, default to true (unless explicitly false)
      shouldClose = config.closeOnOverlayClick !== false
    }

    if (shouldClose) {
      // Ensure click is on overlay, not dialog content
      if (event.target === event.currentTarget) {
        _handleAction({ type: "HIDE", payload: { value: false } })
      }
    }
  })

  // Handle button click
  const handleButtonClick = useEventCallback((buttonValue: string) => {
    if (!type) return

    const result = processButtonResult(type, buttonValue)
    _handleAction({ type: "HIDE", payload: { value: result } })
  })

  // Handle close button click
  const handleCloseClick = useEventCallback(() => {
    _handleAction({ type: "HIDE", payload: { value: false } })
  })

  // Generate button configuration
  const buttons = useMemo(() => {
    if (!type || !config) return []

    if (type === "custom") {
      return (config as AlertDialogCustomConfig).buttons
    }

    return getButtonsForDialog(type, config)
  }, [type, config])

  // Generate title
  const title = useMemo(() => {
    if (!type || !config) return ""
    return getDialogTitle(type, config)
  }, [type, config])

  // Check if close button should be shown
  const showCloseButton = useMemo(() => {
    if (!type || !config) return false
    return shouldShowCloseButton(type, config)
  }, [type, config])

  // Generate styles
  const tv = useMemo(() => {
    const variant = config?.variant || "default"
    const size = config?.size || "default"
    return alertDialogTv({ variant, size })
  }, [config?.variant, config?.size])

  // Extract render condition
  const shouldRenderContent = isOpen && config

  // Handle backdrop close
  const handleBackdropClose = useEventCallback(() => {
    if (!config) return

    let shouldClose = false
    if (outsidePress !== undefined) {
      shouldClose = outsidePress
    } else {
      shouldClose = config.closeOnOverlayClick !== false
    }

    if (shouldClose) {
      _handleAction({ type: "HIDE", payload: { value: false } })
    }
  })

  // Dialog content
  const dialogContent = shouldRenderContent && (
    <FloatingFocusManager
      context={context}
      modal
    >
      <Modal
        ref={refs.setFloating}
        className={tcx(tv.container(), className)}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? "alert-dialog-title" : undefined}
        aria-describedby="alert-dialog-description"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <Modal.Header
            className={tv.header()}
            title={title}
            onClose={showCloseButton ? handleCloseClick : undefined}
            id="alert-dialog-title"
          />
        )}

        {/* Content */}
        <Modal.Content
          id="alert-dialog-description"
          className={tv.content()}
        >
          {config.content || config.description}
        </Modal.Content>

        {/* Footer */}
        {buttons.length > 0 && (
          <Modal.Footer className={tv.footer()}>
            {buttons.map((button) => (
              <Button
                key={button.value}
                variant={button.variant || "primary"}
                disabled={button.disabled}
                onClick={() => handleButtonClick(button.value)}
                autoFocus={button.autoFocus}
              >
                {button.text}
              </Button>
            ))}
          </Modal.Footer>
        )}
      </Modal>
    </FloatingFocusManager>
  )

  return (
    <FloatingPortal
      id={portalId}
      root={root}
    >
      {overlay ? (
        <>
          <Modal.Backdrop
            isOpen={isOpen}
            onClose={handleBackdropClose}
            duration={200}
          />
          {dialogContent && (
            <FloatingOverlay
              className={tcx(tv.overlay())}
              lockScroll
              onClick={handleOverlayClick}
            >
              {dialogContent}
            </FloatingOverlay>
          )}
        </>
      ) : (
        dialogContent && (
          <FloatingOverlay
            className={tcx(tv.overlay())}
            onClick={handleOverlayClick}
          >
            {dialogContent}
          </FloatingOverlay>
        )
      )}
    </FloatingPortal>
  )
})

AlertDialog.displayName = "AlertDialog"
