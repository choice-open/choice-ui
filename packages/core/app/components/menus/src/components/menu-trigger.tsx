import { Button, type ButtonProps } from "@choiceform/button"
import { Slot } from "@choiceform/slot"
import { tcx } from "@choiceform/design-shared"
import { ChevronDownSmall } from "@choiceform/icons-react"
import { forwardRef, memo, ReactNode } from "react"
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

    const styles = MenuTriggerTv({
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement,
      isEmpty: empty,
      size,
    })

    const slotProps = enterForwardedProps
      ? {
          ...rest,
          active,
          selected,
          disabled,
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
            e.preventDefault()
            if (rest.onClick) {
              rest.onClick(e)
            }
          },
        }
      : {
          ...rest,
          ...(active !== undefined ? { "data-active": active } : {}),
          ...(selected !== undefined ? { "data-selected": selected } : {}),
          ...(disabled !== undefined ? { "data-disabled": disabled } : {}),
        }

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
        className={tcx(styles.root(), className)}
        variant="secondary"
        active={active}
        selected={selected}
        disabled={disabled}
        size={size}
        {...rest}
      >
        {prefixElement && (
          <div className={tcx(styles.icon(), prefixClassName)}>{prefixElement}</div>
        )}

        {typeof children === "function" ? children(active ?? false) : children}

        {suffixElement && <div className={styles.icon()}>{suffixElement}</div>}
      </Button>
    )
  }),
)

MenuTrigger.displayName = "MenuTrigger"
