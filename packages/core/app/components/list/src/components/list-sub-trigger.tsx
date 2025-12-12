import { mergeRefs, tcx } from "@choice-ui/shared"
import { ChevronDownSmall, ChevronRightSmall } from "@choiceform/icons-react"
import { forwardRef, memo, ReactNode, useEffect, useId, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import {
  useActiveItemContext,
  useExpandContext,
  useLevelContext,
  useStructureContext,
} from "../context"
import { ListItemTv } from "../tv"

export interface ListSubTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children?: ReactNode
  classNames?: {
    chevron?: string
    icon?: string
    root?: string
  }
  defaultOpen?: boolean
  disableCollapse?: boolean
  disabled?: boolean
  id?: string
  parentId?: string
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

    // Use separate Context to reduce re-rendering
    const { registerItem, unregisterItem, variant, size } = useStructureContext()
    const { activeItem, setActiveItem } = useActiveItemContext()
    const { toggleSubList, isSubListExpanded } = useExpandContext()
    const { level } = useLevelContext()

    const internalRef = useRef<HTMLButtonElement>(null)
    const mergedRef = mergeRefs(ref, internalRef)
    const isOpen = isSubListExpanded(id)

    const defaultSuffixElement = isOpen ? <ChevronDownSmall /> : <ChevronRightSmall />

    // Only register/unregister item when mounted/unmounted
    useEffect(() => {
      registerItem(id, parentId)
      return () => unregisterItem(id)
    }, [id, parentId])

    // Focus management: If this item is active and interactive, focus it.
    useEffect(() => {
      if (activeItem === id && !disabled) {
        internalRef.current?.focus()
      }
    }, [activeItem, id, disabled, isOpen])

    // Handle default open state
    useEffect(() => {
      if (defaultOpen && !defaultOpenApplied.current && !isOpen) {
        toggleSubList(id)
        defaultOpenApplied.current = true
      }
    }, [defaultOpen, id, isOpen, toggleSubList])

    const safeLevel = level > 5 ? 5 : ((level < 0 ? 0 : level) as 0 | 1 | 2 | 3 | 4 | 5)

    const tv = ListItemTv({
      active: (active || activeItem === id) && !disableCollapse,
      disabled,
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement || !!defaultSuffixElement,
      variant,
      size,
      level: safeLevel,
    })

    // Use useEventCallback to optimize event handling functions
    const handleMouseEnter = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setActiveItem(id)
        onMouseEnter?.(e)
      }
    })

    const handleMouseLeave = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
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
        ref={mergedRef}
        id={id}
        type="button"
        role="button"
        className={tcx(tv.root(), className)}
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
          <div className={tv.icon()}>
            {typeof prefixElement === "function" ? prefixElement(isOpen) : prefixElement}
          </div>
        )}
        {children}

        {!disableCollapse && (
          <div className={tv.icon()}>
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
