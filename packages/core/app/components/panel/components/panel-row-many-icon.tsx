import { forwardRef, Fragment, HTMLProps, ReactNode, useRef } from "react"
import { useHover } from "usehooks-ts"
import { mergeRefs, tcx } from "~/utils"

export type PanelRowManyIconItem = {
  id: string
  element: ReactNode
  alwaysShow?: boolean
}

export interface PanelRowManyIconProps
  extends Omit<HTMLProps<HTMLDivElement>, "title" | "children"> {
  children?: React.ReactNode
  isEditing?: boolean
  icons: Array<PanelRowManyIconItem>
}

export const PanelRowManyIcon = forwardRef<HTMLDivElement, PanelRowManyIconProps>(
  function PanelRowManyIcon(props, ref) {
    const { className, children, icons, isEditing, ...rest } = props
    const innerRef = useRef<HTMLDivElement>(null)
    const isHovered = useHover(innerRef)

    return (
      <div
        ref={mergeRefs(ref, innerRef)}
        className={tcx(
          "group flex h-8 min-w-0 items-center justify-between gap-x-2 pr-2 pl-4 select-none",
          className,
        )}
        {...rest}
      >
        {children}

        <div className="text-secondary-foreground group-hover:text-default-foreground flex h-6 min-w-6 flex-none gap-x-1">
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
