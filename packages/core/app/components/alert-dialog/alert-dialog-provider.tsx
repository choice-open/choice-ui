import { memo, ReactNode } from "react"
import { AlertDialog } from "./alert-dialog"
import { AlertDialogContext } from "./alert-dialog-context"
import { useAlertDialogProvider } from "./hooks"

export interface AlertDialogProviderProps {
  children: ReactNode
  className?: string
  outsidePress?: boolean
  overlay?: boolean
  portalId?: string
}

export const AlertDialogProvider = memo(function AlertDialogProvider({
  children,
  className,
  overlay = false,
  outsidePress,
  portalId,
}: AlertDialogProviderProps) {
  const alertDialogContext = useAlertDialogProvider()

  return (
    <AlertDialogContext.Provider value={alertDialogContext}>
      {children}
      <AlertDialog
        className={className}
        overlay={overlay}
        outsidePress={outsidePress}
        portalId={portalId}
      />
    </AlertDialogContext.Provider>
  )
})

AlertDialogProvider.displayName = "AlertDialogProvider"
