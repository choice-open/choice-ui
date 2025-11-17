import { memo, useMemo } from "react"
import { ExternalToast, toast as sonnerToast, ToasterProps } from "sonner"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { NotificationsTv } from "./tv"

export interface NotificationsProps extends Omit<ToasterProps, "id"> {
  actions?: (id: string | number) => {
    action?: {
      content: React.ReactNode
      onClick: () => void
    }
    dismiss?: {
      content: React.ReactNode
      onClick: () => void
    }
  }
  className?: string
  html?: string
  icon?: React.ReactNode
  id: string | number
  text?: string
  toasterId?: string
}

const ToastBase = (props: NotificationsProps) => {
  const { className, icon, text, html, actions, id } = props

  const tv = NotificationsTv({ actions: !!actions, icon: !!icon })

  // 缓存 actions 结果，避免重复调用
  const actionButtons = useMemo(() => {
    if (!actions) return null
    return actions(id)
  }, [actions, id])

  // 验证至少有 text 或 html 其中一个
  if (!text && !html) {
    console.warn("Notifications: Either 'text' or 'html' prop is required")
  }

  const handleActionClick = useEventCallback(() => {
    actionButtons?.action?.onClick()
  })

  const handleDismissClick = useEventCallback(() => {
    actionButtons?.dismiss?.onClick()
  })

  return (
    <div className={tcx(tv.root(), className)}>
      <div className={tv.content()}>
        {icon && <div className={tv.icon()}>{icon}</div>}
        <div className={tv.text()}>
          {html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : text}
        </div>
      </div>

      {actionButtons && (
        <div className={tv.actions()}>
          {actionButtons.action && (
            <button
              className={tv.button()}
              onClick={handleActionClick}
            >
              {actionButtons.action.content}
            </button>
          )}

          {actionButtons.dismiss && (
            <button
              className={tv.button()}
              onClick={handleDismissClick}
            >
              {actionButtons.dismiss.content}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export const Toast = memo(ToastBase)

Toast.displayName = "Toast"

export function notifications(toast: Omit<NotificationsProps, "id">) {
  const { icon, text, html, actions, className, ...sonnerOptions } = toast

  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        className={className}
        icon={icon}
        text={text}
        html={html}
        actions={actions}
      />
    ),
    {
      position: toast.position || "bottom-right",
      ...sonnerOptions,
    } as ExternalToast,
  )
}
