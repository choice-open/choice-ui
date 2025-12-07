import { createContext, useContext } from "react"

interface PopoverContextValue {
  descriptionId: string
  dragContentRef: React.RefObject<HTMLDivElement>
  draggable: boolean
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  getReferenceProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  handleDragStart: (e: React.MouseEvent) => void
  onCloseClick: () => void
  open: boolean
  refs: {
    setFloating: (node: HTMLElement | null) => void
    setReference: (node: HTMLElement | null) => void
  }
  setOpen: (open: boolean) => void
  titleId: string
  triggerRef: React.RefObject<HTMLElement>
}

export const PopoverContext = createContext<PopoverContextValue | null>(null)

export const usePopoverContext = () => {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error("Popover compound components must be used within a Popover component")
  }
  return context
}
