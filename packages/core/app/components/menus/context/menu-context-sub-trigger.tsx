import { ChevronRightSmall } from "@choiceform/icons-react"
import { useListItem } from "@floating-ui/react"
import { forwardRef, memo, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { MenuItem, MenuItemProps } from ".."
import { MenuContext } from "./menu-context"

export const MenuContextSubTrigger = memo(
  forwardRef<HTMLButtonElement, MenuItemProps>((props, forwardedRef) => {
    const {
      children,
      active,
      prefixElement,
      suffixElement = <ChevronRightSmall />,
      ...rest
    } = props

    const item = useListItem()
    const menu = useContext(MenuContext)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    // 如果没有 menu context，抛出错误
    if (!menu) {
      throw new Error("MenuContextSubTrigger must be used within a MenuContext component")
    }

    const isActive = useMemo(
      () => item.index === menu.activeIndex || !!active,
      [item.index, menu.activeIndex, active],
    )

    // 优化：减少事件监听器重复绑定，将激活状态检查移到事件处理器内部
    useEffect(() => {
      const currentRef = buttonRef.current
      if (!currentRef) return

      const handleKeyDown = (e: KeyboardEvent) => {
        // 将激活状态检查移到事件处理器内部，避免重复绑定
        const currentlyActive = item.index === menu.activeIndex || !!active
        if (currentlyActive && (e.key === "Enter" || e.key === "ArrowRight")) {
          e.preventDefault()
          e.stopPropagation()
          // 直接调用 click() 方法，避免创建 MouseEvent
          currentRef.click()
        }
      }

      currentRef.addEventListener("keydown", handleKeyDown)
      return () => {
        currentRef.removeEventListener("keydown", handleKeyDown)
      }
    }, [item.index, menu.activeIndex, active]) // 依赖具体值而不是计算结果

    const handleFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
      props.onFocus?.(event)
      menu.setHasFocusInside(true)
    })

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        buttonRef.current = node

        if (typeof item.ref === "function") {
          item.ref(node)
        }

        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [item, forwardedRef],
    )

    // 前缀配置 - 使用复用的空 Fragment
    const prefixConfig = useMemo(() => {
      if (prefixElement) return prefixElement
      if (menu.selection) return <></>
      return undefined
    }, [prefixElement, menu.selection])

    return (
      <MenuItem
        ref={setRefs}
        active={isActive}
        suffixElement={suffixElement}
        prefixElement={prefixConfig}
        {...menu.getItemProps({
          ...rest,
          onFocus: handleFocus,
          size: undefined,
        })}
      >
        {children}
      </MenuItem>
    )
  }),
)

MenuContextSubTrigger.displayName = "MenuContextSubTrigger"
