import { ChevronDownSmall, ChevronRightSmall } from "@choiceform/icons-react"
import { forwardRef, memo, ReactNode, useEffect, useId, useRef } from "react"
import { tcx } from "~/utils"
import { useActiveItemContext, useExpandContext, useStructureContext } from "../context"
import { ListItemTv } from "../tv"
import { useEventCallback } from "usehooks-ts"

export interface ListSubTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  classNames?: {
    root?: string
    icon?: string
    chevron?: string
  }
  children?: ReactNode
  active?: boolean
  disabled?: boolean
  id?: string
  parentId?: string
  defaultOpen?: boolean
  disableCollapse?: boolean
  prefixElement?: ReactNode | ((isOpen: boolean) => ReactNode)
  suffixElement?: ReactNode | ((isOpen: boolean) => ReactNode)
}

export const ListSubTrigger = memo(
  forwardRef<HTMLButtonElement, ListSubTriggerProps>((props, ref) => {
    const {
      children,
      className,
      active,
      disabled,
      id: providedId,
      parentId,
      defaultOpen,
      disableCollapse,
      prefixElement,
      suffixElement,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ...rest
    } = props

    const internalId = useId()
    const id = providedId || internalId
    const defaultOpenApplied = useRef(false)

    // 使用分离的Context，减少重渲染
    const { registerItem, unregisterItem, variant } = useStructureContext()
    const { activeItem, setActiveItem } = useActiveItemContext()
    const { toggleSubList, isSubListExpanded } = useExpandContext()

    const isOpen = isSubListExpanded(id)

    const defaultSuffixElement = isOpen ? <ChevronDownSmall /> : <ChevronRightSmall />

    // 只在挂载/卸载时注册/注销项目
    useEffect(() => {
      registerItem(id, parentId)
      return () => unregisterItem(id)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, parentId]) // 注意：我们故意省略依赖项，因为只需要在挂载和卸载时执行

    // 处理默认打开状态
    useEffect(() => {
      if (defaultOpen && !defaultOpenApplied.current && !isOpen) {
        toggleSubList(id)
        defaultOpenApplied.current = true
      }
    }, [defaultOpen, id, isOpen, toggleSubList])

    const styles = ListItemTv({
      active: (active || activeItem === id) && !disableCollapse,
      disabled,
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement || !!defaultSuffixElement,
      variant,
    })

    // 使用useEventCallback优化事件处理函数
    const handleMouseEnter = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setActiveItem(id)
        onMouseEnter?.(e)
      }
    })

    const handleMouseLeave = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setActiveItem(null)
        onMouseLeave?.(e)
      }
    })

    const handleClick = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !disableCollapse) {
        toggleSubList(id)
        onClick?.(e)
      } else if (!disabled) {
        onClick?.(e)
      }
    })

    return (
      <button
        {...rest}
        ref={ref}
        id={id}
        type="button"
        role="button"
        className={tcx(styles.root(), className)}
        tabIndex={activeItem === id ? 0 : -1}
        disabled={disabled}
        aria-disabled={disabled}
        aria-expanded={isOpen}
        data-active={activeItem === id || active}
        data-open={isOpen}
        data-disabled={disabled}
        data-variant={variant}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {prefixElement && (
          <div className={styles.icon()}>
            {typeof prefixElement === "function" ? prefixElement(isOpen) : prefixElement}
          </div>
        )}
        {children}

        {!disableCollapse && (
          <div className={styles.icon()}>
            {typeof suffixElement === "function"
              ? suffixElement(isOpen)
              : suffixElement || defaultSuffixElement}
          </div>
        )}
      </button>
    )
  }),
)

ListSubTrigger.displayName = "ListSubTrigger"
