import { forwardRef, memo, ReactNode, useEffect, useId } from "react"
import { tcx } from "~/utils"
import { Kbd, type KbdKey } from "../../kbd"
import {
  useActiveItemContext,
  useSelectionContext,
  useStructureContext,
  useLevelContext,
} from "../context"
import { ListItemTv } from "../tv"

export interface ListItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  active?: boolean
  disabled?: boolean
  selected?: boolean
  id?: string
  parentId?: string
  shortcut?: {
    modifier?: KbdKey | KbdKey[] | undefined
    keys?: ReactNode
  }
  classNames?: {
    root?: string
    icon?: string
    shortcut?: string
  }
  prefixElement?: ReactNode
  suffixElement?: ReactNode
}

export const ListItem = memo(
  forwardRef<HTMLButtonElement, ListItemProps>((props, ref) => {
    const {
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

    // 获取Context中的值
    const { registerItem, unregisterItem, variant, size } = useStructureContext()
    const { activeItem, setActiveItem } = useActiveItemContext()
    const { isSelected, toggleSelection, selection } = useSelectionContext()
    const { level } = useLevelContext()

    useEffect(() => {
      registerItem(id, parentId)
      return () => unregisterItem(id)
    }, [id, parentId])

    const safeLevel = level > 5 ? 5 : ((level < 0 ? 0 : level) as 0 | 1 | 2 | 3 | 4 | 5)

    const styles = ListItemTv({
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

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setActiveItem(id)
        onMouseEnter?.(e)
      }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setActiveItem(null)
        onMouseLeave?.(e)
      }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        if (selection) {
          toggleSelection(id)
        }
        onClick?.(e)
      }
    }

    return (
      <button
        {...rest}
        ref={ref}
        id={id}
        type="button"
        role="listitem"
        className={tcx(styles.root(), className)}
        tabIndex={activeItem === id ? 0 : -1}
        disabled={disabled}
        aria-disabled={disabled}
        aria-selected={selected || isSelected(id)}
        data-active={activeItem === id || active}
        data-selected={isSelected(id) || selected}
        data-disabled={disabled}
        data-variant={variant}
        data-level={level}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {prefixElement && <div className={styles.icon()}>{prefixElement}</div>}

        {children}

        {hasValidShortcut && (
          <Kbd
            className={styles.shortcut()}
            keys={shortcut!.modifier}
          >
            {shortcut!.keys}
          </Kbd>
        )}

        {suffixElement && <div className={styles.icon()}>{suffixElement}</div>}
      </button>
    )
  }),
)

ListItem.displayName = "ListItem"
