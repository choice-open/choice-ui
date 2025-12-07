import { Check } from "@choiceform/icons-react"
import { useFloatingTree, useListItem } from "@floating-ui/react"
import { forwardRef, memo, startTransition, useCallback, useContext, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { MenuItem, type MenuItemProps } from "../components/menu-item"
import { MenuContext } from "./menu-context"

export interface MenuContextItemProps extends MenuItemProps {
  customActive?: boolean
  exclusiveIndex?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onTouchStart?: (e: React.TouchEvent<HTMLButtonElement>) => void
  value?: string
}

/**
 * 通用菜单项组件
 *
 * 供 Select 和 Dropdown 共用，统一所有交互逻辑：
 * - touch 事件处理
 * - 选择逻辑
 * - 键盘导航
 * - 视觉状态管理
 */
export const MenuContextItem = memo(
  forwardRef<HTMLButtonElement, MenuContextItemProps>(
    function MenuContextItem(props, forwardedRef) {
      const {
        value = "",
        disabled,
        selected,
        size,
        shortcut,
        prefixElement,
        variant,
        onClick,
        onMouseUp,
        onTouchStart,
        onKeyDown,
        customActive,
        ...rest
      } = props

      const menu = useContext(MenuContext)
      const item = useListItem()
      const tree = useFloatingTree()

      // 如果没有 menu context，抛出错误
      if (!menu) {
        throw new Error(
          "MenuContextItem must be used within a Menu component (SelectV2 or DropdownV2)",
        )
      }

      // 计算激活状态
      const isActive = useMemo(
        () => item.index === menu.activeIndex,
        [item.index, menu.activeIndex],
      )

      // 处理点击事件
      const handleClick = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()

        // 如果是 readOnly 模式，阻止 onClick 执行
        if (menu.readOnly) {
          return
        }

        onClick?.(event)

        // 使用 startTransition 优化性能，避免 setTimeout
        startTransition(() => {
          tree?.events.emit("click")
        })
      })

      // 处理鼠标按下事件（防止事件冒泡）
      const handleMouseDown = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
      })

      // 处理鼠标抬起事件
      const handleMouseUp = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onMouseUp?.(event)

        // 使用 startTransition 优化性能，避免 setTimeout
        startTransition(() => {
          tree?.events.emit("click")
        })
      })

      // 处理触摸开始事件
      const handleTouchStart = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
        onTouchStart?.(event)
      })

      // 处理键盘事件
      const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event)
      })

      // 处理焦点事件
      const handleFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
        props.onFocus?.(event)
        menu.setHasFocusInside(true)
      })

      // 前缀元素配置 - 使用复用的空 Fragment
      const prefixConfig = useMemo(() => {
        if (prefixElement !== undefined) return prefixElement
        if (menu.selection && !customActive) {
          return selected ? <Check /> : <></>
        }
        return undefined
      }, [prefixElement, menu.selection, selected, customActive])

      // 快捷键配置
      const shortcutConfig = useMemo(
        () => ({
          modifier: shortcut?.modifier,
          keys: shortcut?.keys,
        }),
        [shortcut?.modifier, shortcut?.keys],
      )

      // 组合 ref 处理器，同时处理 item.ref 和 forwardedRef
      const combinedRef = useCallback(
        (node: HTMLButtonElement | null) => {
          // 总是需要调用 item.ref，用于 useListItem 的键盘导航
          item.ref(node)

          // 如果有 forwardedRef，也要调用它（用于 Select 的 registerItem）
          if (forwardedRef) {
            if (typeof forwardedRef === "function") {
              forwardedRef(node)
            } else {
              forwardedRef.current = node
            }
          }
        },
        [item, forwardedRef],
      )

      return (
        <MenuItem
          {...rest}
          ref={combinedRef}
          active={isActive}
          disabled={disabled}
          selected={selected}
          prefixElement={prefixConfig}
          shortcut={shortcutConfig}
          variant={variant}
          size={size}
          {...menu.getItemProps({
            onClick: handleClick,
            onMouseDown: handleMouseDown,
            onMouseUp: handleMouseUp,
            onTouchStart: handleTouchStart,
            onKeyDown: handleKeyDown,
            onFocus: handleFocus,
          })}
        />
      )
    },
  ),
)
