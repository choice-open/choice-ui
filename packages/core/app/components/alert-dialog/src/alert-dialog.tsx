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

  // 使用 floating-ui 获取 context，但不需要定位功能
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        _handleAction({ type: "HIDE", payload: { value: false } })
      }
    },
  })

  // 处理键盘事件
  useEffect(() => {
    // 只有在对话框打开且有配置时才监听
    if (!isOpen || !config) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC 键关闭对话框
      if (event.key === "Escape") {
        const shouldClose = config.closeOnEscape !== false
        if (shouldClose) {
          // 只有在确实要处理时才阻止传播
          event.stopImmediatePropagation()
          event.preventDefault()
          _handleAction({ type: "HIDE", payload: { value: false } })
        }
      }

      // Enter 键确认（如果有自动聚焦的按钮）
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

  // 处理背景点击
  const handleOverlayClick = useEventCallback((event: React.MouseEvent) => {
    if (!config) return

    // 检查是否允许点击背景关闭
    // 优先使用 outsidePress prop，如果没有设置则使用 config 中的设置
    let shouldClose = false
    if (outsidePress !== undefined) {
      // 如果明确设置了 outsidePress，使用它的值
      shouldClose = outsidePress
    } else {
      // 否则使用 config 中的设置，默认为 true（除非明确设置为 false）
      shouldClose = config.closeOnOverlayClick !== false
    }

    if (shouldClose) {
      // 确保点击的是背景而不是对话框内容
      if (event.target === event.currentTarget) {
        _handleAction({ type: "HIDE", payload: { value: false } })
      }
    }
  })

  // 处理按钮点击
  const handleButtonClick = useEventCallback((buttonValue: string) => {
    if (!type) return

    const result = processButtonResult(type, buttonValue)
    _handleAction({ type: "HIDE", payload: { value: result } })
  })

  // 处理关闭按钮点击
  const handleCloseClick = useEventCallback(() => {
    _handleAction({ type: "HIDE", payload: { value: false } })
  })

  // 生成按钮配置
  const buttons = useMemo(() => {
    if (!type || !config) return []

    if (type === "custom") {
      return (config as AlertDialogCustomConfig).buttons
    }

    return getButtonsForDialog(type, config)
  }, [type, config])

  // 生成标题
  const title = useMemo(() => {
    if (!type || !config) return ""
    return getDialogTitle(type, config)
  }, [type, config])

  // 检查是否显示关闭按钮
  const showCloseButton = useMemo(() => {
    if (!type || !config) return false
    return shouldShowCloseButton(type, config)
  }, [type, config])

  // 生成样式
  const tv = useMemo(() => {
    const variant = config?.variant || "default"
    const size = config?.size || "default"
    return alertDialogTv({ variant, size })
  }, [config?.variant, config?.size])

  // 提取渲染条件
  const shouldRenderContent = isOpen && config

  // 背景点击关闭处理
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

  // 对话框内容
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
          <div
            className={tcx(tv.overlay())}
            onClick={handleOverlayClick}
          >
            {dialogContent}
          </div>
        )
      )}
    </FloatingPortal>
  )
})

AlertDialog.displayName = "AlertDialog"
