import { tcx } from "@choice-ui/shared"
import { Kbd, type KbdKey } from "@choice-ui/kbd"
import { forwardRef, memo, ReactNode } from "react"
import { MenuItemTv } from "../tv"

export interface MenuItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children?: ReactNode
  classNames?: {
    icon?: string
    root?: string
    shortcut?: string
  }
  disabled?: boolean
  prefixElement?: ReactNode
  selected?: boolean
  shortcut?: {
    keys?: ReactNode
    modifier?: KbdKey | KbdKey[] | undefined
  }
  size?: "default" | "large"
  suffixElement?: ReactNode
  variant?: "default" | "highlight" | "danger" | "reset"
}

export const MenuItem = memo(
  forwardRef<HTMLButtonElement, MenuItemProps>((props, ref) => {
    const {
      children,
      className,
      active,
      disabled,
      selected,
      shortcut,
      prefixElement,
      suffixElement,
      variant = "default",
      size = "default",
      ...rest
    } = props

    const tv = MenuItemTv({
      active,
      disabled,
      selected,
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement,
      variant,
      size,
    })

    const hasValidShortcut = shortcut && (shortcut.modifier || shortcut.keys)

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        role="menuitem"
        className={tcx(tv.root(), className)}
        tabIndex={active ? 0 : -1}
        disabled={disabled}
        aria-disabled={disabled}
        aria-selected={selected}
      >
        {prefixElement && <div className={tv.icon()}>{prefixElement}</div>}

        {children}

        {hasValidShortcut && (
          <Kbd
            className={tv.shortcut()}
            keys={shortcut!.modifier}
          >
            {shortcut!.keys}
          </Kbd>
        )}

        {suffixElement && <div className={tv.icon()}>{suffixElement}</div>}
      </button>
    )
  }),
)

MenuItem.displayName = "MenuItem"
