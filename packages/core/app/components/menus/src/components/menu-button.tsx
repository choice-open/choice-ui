import { Button, type ButtonProps } from "@choiceform/button"
import { tcx } from "@choiceform/design-shared"
import { forwardRef, memo } from "react"
import { MenuButtonTv } from "../tv"

export const MenuButton = memo(
  forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { className, ...rest } = props
    const styles = MenuButtonTv()

    return (
      <Button
        {...rest}
        ref={ref}
        variant="secondary"
        className={tcx(styles, className)}
      />
    )
  }),
)

MenuButton.displayName = "MenuButton"
