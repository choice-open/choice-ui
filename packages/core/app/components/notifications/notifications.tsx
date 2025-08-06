import { useMemo } from "react"
import { toast as sonnerToast, ToasterProps } from "sonner"
import { NotificationsTv } from "./tv"

interface NotificationsProps extends Omit<ToasterProps, "id"> {
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
}

const Toast = (props: NotificationsProps) => {
  const { className, icon, text, html, actions, id } = props

  const styles = NotificationsTv({ actions: !!actions, icon: !!icon })

  // 🔧 缓存 actions 结果，避免重复调用
  const actionButtons = useMemo(() => {
    if (!actions) return null
    return actions(id)
  }, [actions, id])

  // 验证至少有 text 或 html 其中一个
  if (!text && !html) {
    console.warn("Notifications: Either 'text' or 'html' prop is required")
  }

  return (
    <div className={styles.root({ className })}>
      <div className={styles.content()}>
        {icon && <div className={styles.icon()}>{icon}</div>}
        <div className={styles.text()}>
          {html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : text}
        </div>
      </div>

      {actionButtons && (
        <div className={styles.actions()}>
          {actionButtons.action && (
            <button
              className={styles.button()}
              onClick={() => {
                actionButtons.action?.onClick()
              }}
            >
              {actionButtons.action.content}
            </button>
          )}

          {actionButtons.dismiss && (
            <button
              className={styles.button()}
              onClick={() => {
                actionButtons.dismiss?.onClick()
              }}
            >
              {actionButtons.dismiss.content}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function notifications(toast: Omit<NotificationsProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      {...toast}
    />
  ))
}
