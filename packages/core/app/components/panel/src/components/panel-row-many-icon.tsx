import { mergeRefs, tcx } from "@choice-ui/shared"
import { forwardRef, Fragment, HTMLProps, ReactNode, useRef } from "react"
import { useHover } from "usehooks-ts"
import { panelRowManyIconTv } from "../tv"

export type PanelRowManyIconItem = {
  alwaysShow?: boolean
  element: ReactNode
  id: string
}

export interface PanelRowManyIconProps extends Omit<
  HTMLProps<HTMLDivElement>,
  "title" | "children"
> {
  children?: React.ReactNode
  icons: Array<PanelRowManyIconItem>
  isEditing?: boolean
}

export const PanelRowManyIcon = forwardRef<HTMLDivElement, PanelRowManyIconProps>(
  function PanelRowManyIcon(props, ref) {
    const { className, children, icons, isEditing, ...rest } = props
    const innerRef = useRef<HTMLDivElement>(null)
    const isHovered = useHover(innerRef)

    const tv = panelRowManyIconTv()

    return (
      <div
        ref={mergeRefs(ref, innerRef)}
        className={tcx(tv.container(), className)}
        {...rest}
      >
        {children}

        <div className={tv.iconWrapper()}>
          {!isEditing &&
            icons.map(({ element, alwaysShow, id }) => {
              return <Fragment key={id}>{isHovered || alwaysShow ? element : null}</Fragment>
            })}
        </div>
      </div>
    )
  },
)

PanelRowManyIcon.displayName = "PanelRowManyIcon"
