import type { Placement, UseFloatingReturn } from "@floating-ui/react"
import type { ReactNode } from "react"
import type { KbdKey } from "@choiceform/kbd"

export interface TooltipOptions {
  disabled?: boolean
  initialOpen?: boolean
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
}

export interface TooltipContextValue {
  arrowRef: React.RefObject<HTMLElement>
  context: UseFloatingReturn["context"]
  disabled: boolean
  floatingStyles: React.CSSProperties
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>
  getReferenceProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>
  isPositioned: UseFloatingReturn["isPositioned"]
  middlewareData: UseFloatingReturn["middlewareData"]
  open: boolean
  placement: Placement
  refs: UseFloatingReturn["refs"]
  setOpen: (open: boolean) => void
  strategy: UseFloatingReturn["strategy"]
  update: UseFloatingReturn["update"]
  x: number | null
  y: number | null
}

export interface TooltipProps {
  children?: React.ReactNode
  className?: string
  content?: React.ReactNode
  disabled?: boolean
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  portalId?: string
  shortcut?: {
    keys?: ReactNode
    modifier?: KbdKey[]
  }
  variant?: "default" | "light"
  withArrow?: boolean
}

export interface TooltipContentProps extends React.HTMLProps<HTMLDivElement> {
  portalId?: string
  variant?: "default" | "light"
  withArrow?: boolean
}

export interface TooltipArrowProps {
  className?: string
  variant?: "default" | "light"
}
