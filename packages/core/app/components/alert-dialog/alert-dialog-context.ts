import { createContext, useContext } from "react"
import { AlertDialogContextType } from "./types"

export const AlertDialogContext = createContext<AlertDialogContextType | null>(null)

export const useAlertDialogContext = () => {
  const context = useContext(AlertDialogContext)
  if (!context) {
    throw new Error("useAlertDialogContext must be used within an AlertDialogProvider")
  }
  return context
}
