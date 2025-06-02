import { Check } from "@choiceform/icons-react"
import * as CM from "@radix-ui/react-context-menu"
import { ReactNode, forwardRef } from "react"
import { tcx } from "~/utils/tcx"
import { Kbd, KbdKey } from "../../kbd"
import { MenuItemTv } from "../../menus/tv"
import { useContextMenu } from "../context-menu-context"

export interface ContextMenuItemProps {
  children?: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  onHover?: () => void
  prefixElement?: ReactNode
  selected?: boolean
  shortcut?: {
    keys?: ReactNode
    modifier?: KbdKey | KbdKey[] | undefined
  }
  suffixElement?: ReactNode
  variant?: "default" | "highlight" | "danger" | "reste"
}

export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem(
    {
      children,
      disabled,
      onClick,
      selected,
      prefixElement,
      suffixElement,
      shortcut,
      onHover,
      className,
      variant = "default",
      ...props
    },
    ref,
  ) {
    const { selection = false } = useContextMenu()

    const hasPrefix = selection

    const styles = MenuItemTv({
      disabled,
      hasPrefix,
      hasSuffix: !!shortcut || !!suffixElement,
      variant,
    })

    const renderPrefixElement = () => {
      if (!selection) return null

      return <div className={styles.icon()}>{selected ? <Check /> : null}</div>
    }

    const renderShortcut = () => {
      if (!shortcut) return null

      return (
        <Kbd
          className={tcx(
            styles.shortcut(),
            "group-data-[highlighted]/menu-item:text-on-accent-foreground",
          )}
          keys={shortcut.modifier}
        >
          {shortcut.keys}
        </Kbd>
      )
    }

    const renderSuffixElement = () => {
      if (!suffixElement) return null

      return suffixElement
    }

    return (
      <CM.Item
        {...props}
        ref={ref}
        disabled={disabled}
        onSelect={onClick}
        className={tcx(
          styles.root(),
          variant === "default" && "data-[highlighted]:bg-accent-background",
          variant === "danger" && "data-[highlighted]:bg-danger-background",
          "data-[highlighted]:text-on-accent-foreground",
          className,
        )}
        onMouseEnter={() => {
          if (disabled) return
          onHover?.()
        }}
      >
        {prefixElement ? (
          <div className={styles.icon()}>{prefixElement}</div>
        ) : (
          renderPrefixElement()
        )}

        {children}
        {renderShortcut()}
        {renderSuffixElement()}
      </CM.Item>
    )
  },
)

ContextMenuItem.displayName = "ContextMenu.Item"
