import { Kbd } from "@choice-ui/kbd"
import { TooltipContent } from "./components/tooltip-content"
import { TooltipTrigger } from "./components/tooltip-trigger"
import { TooltipContext, PORTAL_ROOT_ID } from "./context/tooltip-context"
import { useTooltip } from "./hooks/use-tooltip"
import type { TooltipProps } from "./types"

function TooltipRoot(props: TooltipProps) {
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
    interactive = true,
  } = props

  const tooltip = useTooltip({
    placement,
    open,
    onOpenChange,
    disabled,
    interactive,
    offset,
  })

  if (content) {
    return (
      <TooltipContext.Provider value={tooltip}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          withArrow={withArrow}
          variant={variant}
          portalId={portalId}
          className={className}
          interactive={interactive}
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

  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>
}

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  displayName: "Tooltip",
})
