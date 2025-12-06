import { forwardRef, memo, ReactNode, useEffect, useId, useRef } from "react"
import { tcx } from "~/utils"
import { mergeRefs } from "~/utils/merge-refs"
import { Kbd, type KbdKey } from "../../kbd"
import {
  useActiveItemContext,
  useSelectionContext,
  useStructureContext,
  useLevelContext,
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

    // 获取Context中的值
    const {
      registerItem,
      unregisterItem,
      interactive = true,
      variant,
      size,
    } = useStructureContext()

    // 如果禁用交互，默认使用 div，否则使用 button
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

    // 只在 button 元素上设置 type 属性
    const buttonProps = As === "button" ? { type: "button" as const } : {}

    // 非交互模式下，tabIndex 应该始终为 -1
    const tabIndex = interactive ? (activeItem === id ? 0 : -1) : -1

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return

      if (e.key === "Enter" || e.key === " ") {
        // 对于原生按钮，浏览器会自动处理 Enter（触发 Click），但 Space 需要 preventDefault 防止滚动
        // 且 Space 在按钮上也通常触发 Click
        // 如果不是按钮（如 div），需要手动触发点击逻辑

        if (As !== "button" && As !== "a") {
          e.preventDefault()
          if (selection) {
            toggleSelection(id)
          }
          onClick?.(e as unknown as React.MouseEvent<HTMLElement>)
        } else if (e.key === " ") {
          // 防止 Space 滚动页面
          e.preventDefault()
          // 按钮上的 Space 默认行为是 keyup 时触发 click，但在 React 中有时需要手动处理
          // 为了统一行为，这里手动触发
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
        className={tcx(styles.root(), className)}
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
        {prefixElement && <div className={styles.icon()}>{prefixElement}</div>}

        {children}

        {hasValidShortcut && (
          <Kbd
            className={styles.shortcut()}
            keys={shortcut.modifier}
          >
            {shortcut.keys}
          </Kbd>
        )}

        {suffixElement && <div className={styles.icon()}>{suffixElement}</div>}
      </As>
    )
  }),
)

ListItem.displayName = "ListItem"
