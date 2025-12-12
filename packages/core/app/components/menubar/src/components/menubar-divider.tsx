import { tcx } from "@choice-ui/shared"
import { forwardRef, memo } from "react"
import { MenubarDividerTv } from "../tv"

export interface MenubarDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * MenubarDivider - Separator component for Menubar
 *
 * Used to create visual separation between Menubar items
 */
export const MenubarDivider = memo(
  forwardRef<HTMLDivElement, MenubarDividerProps>((props, ref) => {
    const { className, ...rest } = props
    const tv = MenubarDividerTv()

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="vertical"
        className={tcx(tv.root(), className)}
        {...rest}
      />
    )
  }),
)

MenubarDivider.displayName = "MenubarDivider"
