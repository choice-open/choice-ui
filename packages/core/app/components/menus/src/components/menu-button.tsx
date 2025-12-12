import { Button, type ButtonProps } from "@choice-ui/button"
import { tcx } from "@choice-ui/shared"
import { forwardRef, memo } from "react"
import { MenuButtonTv } from "../tv"

export const MenuButton = memo(
  forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { className, ...rest } = props
    const tv = MenuButtonTv()

    return (
      <Button
        {...rest}
        ref={ref}
        variant="secondary"
        className={tcx(tv, className)}
      />
    )
  }),
)

MenuButton.displayName = "MenuButton"
