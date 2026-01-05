import { tcx } from "@choice-ui/shared"
import { ChevronDownSmall, ChevronRightSmall } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, memo, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { usePanelContext } from "../context"
import { propertiesPaneTitleTv } from "../tv"

interface PanelTitleProps extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  children?: React.ReactNode
  classNames?: {
    actionWrapper?: string
    container?: string
    title?: string
    titleWrapper?: string
  }
  onHeaderClick?: () => void
  onTitleClick?: () => void
  title: string
}

// Extract TitleContent as a memoized component
const TitleContent = memo(function TitleContent({
  title,
  onClick,
  collapsible,
  titleClassName,
}: {
  collapsible?: boolean
  onClick?: () => void
  title: string
  titleClassName?: string
}) {
  const tv = useMemo(() => propertiesPaneTitleTv(), [])

  return collapsible || onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={tcx(tv.title(), titleClassName)}
    >
      <span aria-hidden="true">{title}</span>
    </button>
  ) : (
    <span className={tcx(tv.title(), titleClassName)}>{title}</span>
  )
})

export const PanelTitle = forwardRef<HTMLDivElement, PanelTitleProps>(
  function PanelTitle(props, ref) {
    const { title, children, onHeaderClick, onTitleClick, className, classNames, ...rest } = props

    const { collapsible, isCollapsed, onCollapsedChange, alwaysShowCollapsible } = usePanelContext()

    const tv = useMemo(() => propertiesPaneTitleTv(), [])

    const handleMouseDown = useEventCallback(() => {
      if (collapsible) {
        onCollapsedChange?.(!isCollapsed)
      }
    })

    const handleClick = useEventCallback(() => {
      onHeaderClick?.()
    })

    const containerClassName = useMemo(() => tcx(tv.container(), className), [tv, className])

    return (
      <div
        ref={ref}
        className={containerClassName}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        {...rest}
      >
        <div className={tv.wrapper()}>
          <div className={tv.content()}>
            <div className={tcx(tv.collapsibleWrapper(), alwaysShowCollapsible && "visible")}>
              {collapsible && (isCollapsed ? <ChevronRightSmall /> : <ChevronDownSmall />)}
            </div>

            <div className={tcx(tv.titleWrapper(), classNames?.titleWrapper)}>
              <TitleContent
                title={title}
                collapsible={collapsible}
                onClick={onTitleClick}
                titleClassName={classNames?.title}
              />
            </div>
          </div>

          {children && (
            <div className={tcx(tv.actionWrapper(), classNames?.actionWrapper)}>{children}</div>
          )}
        </div>
      </div>
    )
  },
)

PanelTitle.displayName = "PanelTitle"
