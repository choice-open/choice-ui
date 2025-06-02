import { ChevronRightSmall } from "@choiceform/icons-react"
import * as CM from "@radix-ui/react-context-menu"
import { forwardRef, ReactNode } from "react"
import { tcx } from "~/utils/tcx"
import { MenuItemTv, MenusTv } from "../../menus/tv"
import { useContextMenu } from "../context-menu-context"
import { processMenuChildren } from "../utils"

export interface ContextSubmenuProps {
  children: ReactNode
  className?: string
  contentProps?: Omit<ContextSubmenuContentProps, "children">
  disabled?: boolean
}

export interface ContextSubmenuTriggerProps {
  children: ReactNode
  className?: string
  disabled?: boolean
}

export interface ContextSubmenuContentProps {
  alignOffset?: number
  children: ReactNode
  className?: string
  sideOffset?: number
}

export const ContextSubmenuRoot = forwardRef<HTMLDivElement, ContextSubmenuProps>(
  ({ children, disabled, className, contentProps, ...props }, ref) => {
    const { triggerElement, contentElement } = processMenuChildren(
      children,
      ContextSubmenuTrigger,
      ContextSubmenuContent,
    )

    return (
      <CM.Sub {...props}>
        {triggerElement}
        {contentElement}
      </CM.Sub>
    )
  },
)

ContextSubmenuRoot.displayName = "ContextSubmenu.Root"

const ContextSubmenuTrigger = forwardRef<HTMLDivElement, ContextSubmenuTriggerProps>(
  ({ children, disabled, className, ...props }, ref) => {
    const { selection = false } = useContextMenu()

    const styles = MenuItemTv({
      disabled,
      hasPrefix: selection,
    })

    return (
      <CM.SubTrigger
        {...props}
        ref={ref}
        disabled={disabled}
        className={tcx(
          styles.root({ hasSuffix: true }),
          "data-[highlighted]:bg-accent-background data-[highlighted]:text-on-accent-foreground",
          className,
        )}
      >
        {selection && <div className={styles.icon()} />}
        {children}
        <div className="flex items-center justify-center">
          <ChevronRightSmall />
        </div>
      </CM.SubTrigger>
    )
  },
)

ContextSubmenuTrigger.displayName = "ContextSubmenu.Trigger"

const ContextSubmenuContent = forwardRef<HTMLDivElement, ContextSubmenuContentProps>(
  ({ children, className, sideOffset = 10, alignOffset, ...props }, ref) => {
    const styles = MenusTv()

    return (
      <CM.Portal>
        <CM.SubContent
          {...props}
          ref={ref}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          loop={true}
          className={tcx(styles, className)}
        >
          {children}
        </CM.SubContent>
      </CM.Portal>
    )
  },
)
ContextSubmenuContent.displayName = "ContextSubmenu.Content"

// Export the compound component
export const ContextSubmenu = Object.assign(ContextSubmenuRoot, {
  Trigger: ContextSubmenuTrigger,
  Content: ContextSubmenuContent,
})
