import type { Placement } from "@floating-ui/react"
import { createContext, useContext } from "react"
import { Kbd, type KbdKey } from "../kbd"
import { TooltipContent } from "./components/tooltip-content"
import { TooltipTrigger } from "./components/tooltip-trigger"
import { useTooltip } from "./hooks/use-tooltip"

const TooltipContext = createContext<ReturnType<typeof useTooltip> | null>(null)

export function useTooltipState() {
  const context = useContext(TooltipContext)
  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />")
  }
  return context
}

const PORTAL_ROOT_ID = "floating-tooltip-root"

export interface TooltipProps {
  children?: React.ReactNode
  content?: React.ReactNode
  disabled?: boolean
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  portalId?: string
  shortcut?: {
    keys: string
    modifier?: KbdKey[]
  }
  variant?: "default" | "light"
  withArrow?: boolean
}

export function Tooltip(props: TooltipProps) {
  const {
    children,
    placement,
    open,
    onOpenChange,
    disabled = false,
    content,
    shortcut,
    withArrow = true,
    variant = "default",
    offset = 8,
    portalId = PORTAL_ROOT_ID,
  } = props

  const tooltip = useTooltip({
    placement,
    open,
    onOpenChange,
    disabled,
    offset,
  })

  // 如果有 content prop，使用简化 API
  if (content) {
    return (
      <TooltipContext.Provider value={tooltip}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          withArrow={withArrow}
          variant={variant}
          portalId={portalId}
        >
          {content}
          {shortcut && (
            <Kbd
              className="ml-2 opacity-50"
              keys={shortcut.modifier}
            >
              {shortcut.keys}
            </Kbd>
          )}
        </TooltipContent>
      </TooltipContext.Provider>
    )
  }

  // 复合组件 API
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>
}
