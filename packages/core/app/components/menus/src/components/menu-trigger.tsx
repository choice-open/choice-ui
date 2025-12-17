import { Button, type ButtonProps } from "@choice-ui/button"
import { Slot } from "@choice-ui/slot"
import { tcx } from "@choice-ui/shared"
import { ChevronDownSmall } from "@choiceform/icons-react"
import { forwardRef, memo, ReactNode, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { MenuTriggerTv } from "../tv"

export interface MenuTriggerProps extends Omit<ButtonProps, "children"> {
  asChild?: boolean
  children?: ReactNode | ((active: boolean) => ReactNode)
  empty?: boolean
  enterForwardedProps?: boolean
  prefixClassName?: string
  prefixElement?: ReactNode
  suffixElement?: ReactNode
}

export const MenuTrigger = memo(
  forwardRef<HTMLButtonElement, MenuTriggerProps>((props, ref) => {
    const {
      children,
      asChild,
      className,
      size = "default",
      prefixElement,
      prefixClassName,
      suffixElement = <ChevronDownSmall />,
      empty,
      enterForwardedProps = true,
      active,
      selected,
      disabled,
      ...rest
    } = props

    const tv = MenuTriggerTv({
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement,
      isEmpty: empty,
      size,
    })

    // Cache click handler to avoid unnecessary re-renders
    const handleClick = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      rest.onClick?.(e)
    })

    // Cache Slot props to avoid unnecessary re-renders
    const slotProps = useMemo(() => {
      if (enterForwardedProps) {
        return {
          ...rest,
          active,
          selected,
          disabled,
          onClick: handleClick,
        }
      }
      return {
        ...rest,
        ...(active !== undefined ? { "data-active": active } : {}),
        ...(selected !== undefined ? { "data-selected": selected } : {}),
        ...(disabled !== undefined ? { "data-disabled": disabled } : {}),
      }
    }, [enterForwardedProps, rest, active, selected, disabled, handleClick])

    return asChild ? (
      <Slot
        ref={ref}
        {...slotProps}
      >
        {typeof children === "function" ? children(active ?? false) : children}
      </Slot>
    ) : (
      <Button
        ref={ref}
        className={tcx(tv.root(), className)}
        variant="secondary"
        active={active}
        selected={selected}
        disabled={disabled}
        size={size}
        {...rest}
      >
        {prefixElement && <div className={tcx(tv.icon(), prefixClassName)}>{prefixElement}</div>}

        {typeof children === "function" ? children(active ?? false) : children}

        {suffixElement && <div className={tv.icon()}>{suffixElement}</div>}
      </Button>
    )
  }),
)

MenuTrigger.displayName = "MenuTrigger"
