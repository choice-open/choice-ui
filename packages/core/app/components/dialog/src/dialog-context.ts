import { createContext, useContext } from "react"

interface DialogContextValue {
  contentRef: React.RefObject<HTMLDivElement>
  descriptionId: string
  dialogRef: React.RefObject<HTMLDivElement>
  draggable?: boolean
  handleDragStart?: (e: React.MouseEvent) => void
  onCloseClick: () => void
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
}

export const DialogContext = createContext<DialogContextValue | null>(null)

export const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog compound components must be used within a Dialog component")
  }
  return context
}
