import { mergeRefs, tcx } from "@choice-ui/shared"
import { Kbd, type KbdKey } from "@choice-ui/kbd"
import { forwardRef, memo, ReactNode, useEffect, useId, useRef } from "react"
import {
  useActiveItemContext,
  useLevelContext,
  useSelectionContext,
  useStructureContext,
} from "../context"
import { ListItemTv } from "../tv"

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  active?: boolean
  as?: React.ElementType
  children?: ReactNode
  classNames?: {
    icon?: string
    root?: string
    shortcut?: string
  }
  disabled?: boolean
  id?: string
  parentId?: string
  prefixElement?: ReactNode
  selected?: boolean
  shortcut?: {
    keys?: ReactNode
    modifier?: KbdKey | KbdKey[] | undefined
  }
  suffixElement?: ReactNode
}

export const ListItem = memo(
  forwardRef<HTMLElement, ListItemProps>((props, ref) => {
    const {
      as: providedAs,
      children,
      className,
      active,
      disabled,
      selected,
      shortcut,
      prefixElement,
      suffixElement,
      id: providedId,
      parentId,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ...rest
    } = props

    const internalId = useId()
    const id = providedId || internalId

    // Get values from Context
    const {
      registerItem,
      unregisterItem,
      interactive = true,
      variant,
      size,
    } = useStructureContext()

    // If interaction is disabled, default to div, otherwise use button
    const As = providedAs ?? (interactive ? "button" : "div")
    const { activeItem, setActiveItem } = useActiveItemContext()
    const { isSelected, toggleSelection, selection } = useSelectionContext()
    const { level } = useLevelContext()

    const internalRef = useRef<HTMLElement>(null)
    const mergedRef = mergeRefs(ref, internalRef)

    useEffect(() => {
      registerItem(id, parentId)
      return () => unregisterItem(id)
    }, [id, parentId, registerItem, unregisterItem])

    // Focus management: If this item is active and interactive, focus it.
    useEffect(() => {
      if (activeItem === id && interactive) {
        internalRef.current?.focus()
      }
    }, [activeItem, id, interactive])

    const safeLevel = level > 5 ? 5 : ((level < 0 ? 0 : level) as 0 | 1 | 2 | 3 | 4 | 5)

    const tv = ListItemTv({
      active: active || activeItem === id,
      disabled,
      selected: selected || isSelected(id),
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement,
      variant,
      size,
      level: safeLevel,
    })

    const hasValidShortcut = shortcut && (shortcut.modifier || shortcut.keys)

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled && interactive) {
        setActiveItem(id)
      }
      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
      onMouseLeave?.(e)
    }

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled) {
        if (selection) {
          toggleSelection(id)
        }
        onClick?.(e)
      }
    }

    // Only set type attribute on button elements
    const buttonProps = As === "button" ? { type: "button" as const } : {}

    // In non-interactive mode, tabIndex should always be -1
    const tabIndex = interactive ? (activeItem === id ? 0 : -1) : -1

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return

      if (e.key === "Enter" || e.key === " ") {
        // For native buttons, the browser will automatically handle Enter (trigger Click), but Space needs preventDefault to prevent scrolling
        // And Space usually triggers Click on buttons as well
        // If it's not a button (like div), you need to manually trigger the click logic

        if (As !== "button" && As !== "a") {
          e.preventDefault()
          if (selection) {
            toggleSelection(id)
          }
          onClick?.(e as unknown as React.MouseEvent<HTMLElement>)
        } else if (e.key === " ") {
          // Prevent Space from scrolling the page
          e.preventDefault()
          // The default behavior of Space on buttons is to trigger click when keyup, but in React it sometimes needs manual handling
          // To unify behavior, here we manually trigger
          e.currentTarget.click()
        }
      }
    }

    return (
      <As
        {...rest}
        {...buttonProps}
        ref={mergedRef}
        id={id}
        role="listitem"
        className={tcx(tv.root(), className)}
        tabIndex={tabIndex}
        disabled={interactive ? disabled : undefined}
        aria-disabled={disabled}
        aria-selected={selected || isSelected(id)}
        data-active={activeItem === id || active}
        data-selected={isSelected(id) || selected}
        data-disabled={disabled}
        data-variant={variant}
        data-level={level}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {prefixElement && <div className={tv.icon()}>{prefixElement}</div>}

        {children}

        {hasValidShortcut && (
          <Kbd
            className={tv.shortcut()}
            keys={shortcut.modifier}
          >
            {shortcut.keys}
          </Kbd>
        )}

        {suffixElement && <div className={tv.icon()}>{suffixElement}</div>}
      </As>
    )
  }),
)

ListItem.displayName = "ListItem"
