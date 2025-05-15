import { ChevronDownSmall } from "@choiceform/icons-react"
import { Slot } from "@radix-ui/react-slot"
import { forwardRef, memo, ReactNode } from "react"
import { tcx } from "~/utils"
import { Button, type ButtonProps } from "../../button"
import { MenuTriggerTv } from "../tv"

export interface MenuTriggerProps extends ButtonProps {
  asChild?: boolean
  prefixElement?: ReactNode
  suffixElement?: ReactNode
  empty?: boolean
}

export const MenuTrigger = memo(
  forwardRef<HTMLButtonElement, MenuTriggerProps>((props, ref) => {
    const {
      children,
      asChild,
      className,
      size = "default",
      prefixElement,
      suffixElement = <ChevronDownSmall />,
      empty,
      ...rest
    } = props

    const styles = MenuTriggerTv({
      hasPrefix: !!prefixElement,
      hasSuffix: !!suffixElement,
      isEmpty: empty,
      size,
    })

    return asChild ? (
      <Slot
        ref={ref}
        {...rest}
      >
        {children}
      </Slot>
    ) : (
      <Button
        ref={ref}
        className={tcx(styles.root(), className)}
        variant="secondary"
        size={size}
        {...rest}
      >
        {prefixElement && <div className={styles.icon()}>{prefixElement}</div>}

        {children}

        {suffixElement && <div className={styles.icon()}>{suffixElement}</div>}
      </Button>
    )
  }),
)

MenuTrigger.displayName = "MenuTrigger"
