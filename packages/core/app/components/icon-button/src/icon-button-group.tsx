import { Slot } from "@choice-ui/slot"
import { tcx } from "@choice-ui/shared"
import { Children, cloneElement, CSSProperties, forwardRef, HTMLProps, isValidElement } from "react"
import { type IconButtonProps } from "./icon-button"
import { iconButtonGroupTv } from "./tv"

export interface IconButtonGroupProps extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "secondary" | "solid"
}

export const IconButtonGroup = forwardRef<HTMLDivElement, IconButtonGroupProps>((props, ref) => {
  const { children, className, variant = "solid", ...rest } = props

  const styles = iconButtonGroupTv()

  const childrenSlot = Children.map(children, (child) => {
    if (isValidElement<IconButtonProps>(child)) {
      return <Slot className={styles.button()}>{cloneElement(child, { variant })}</Slot>
    }
  })

  return (
    <div
      ref={ref}
      className={tcx(styles.container(), className)}
      style={
        {
          "--columns": `repeat(${Children.count(children)}, 1fr)`,
        } as CSSProperties
      }
      {...rest}
    >
      {childrenSlot}
    </div>
  )
})

IconButtonGroup.displayName = "IconButtonGroup"
