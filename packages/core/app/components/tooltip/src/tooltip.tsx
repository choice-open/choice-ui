import { Kbd } from "@choiceform/kbd"
import { TooltipContent } from "./components/tooltip-content"
import { TooltipTrigger } from "./components/tooltip-trigger"
import { TooltipContext, PORTAL_ROOT_ID } from "./context/tooltip-context"
import { useTooltip } from "./hooks/use-tooltip"
import type { TooltipProps } from "./types"

export function Tooltip(props: TooltipProps) {
  const {
    children,
    className,
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
          className={className}
        >
          {content}
          {shortcut && (
            <Kbd
              className="ml-2 opacity-50"
              keys={shortcut.modifier}
            >
              {shortcut?.keys}
            </Kbd>
          )}
        </TooltipContent>
      </TooltipContext.Provider>
    )
  }

  // 复合组件 API
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>
}
