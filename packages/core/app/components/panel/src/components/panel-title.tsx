import { tcx } from "@choiceform/design-shared"
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
  styles,
  classNames,
}: {
  classNames?: PanelTitleProps["classNames"]
  collapsible?: boolean
  onClick?: () => void
  styles: ReturnType<typeof propertiesPaneTitleTv>
  title: string
}) {
  return collapsible || onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={tcx(styles.title(), classNames?.title)}
    >
      <span aria-hidden="true">{title}</span>
    </button>
  ) : (
    <span className={tcx(styles.title(), classNames?.title)}>{title}</span>
  )
})

export const PanelTitle = forwardRef<HTMLDivElement, PanelTitleProps>(
  function PanelTitle(props, ref) {
    const { title, children, onHeaderClick, onTitleClick, className, classNames, ...rest } = props

    const { collapsible, isCollapsed, onCollapsedChange, alwaysShowCollapsible } = usePanelContext()

    const styles = propertiesPaneTitleTv()

    const handleMouseDown = useEventCallback(() => {
      if (collapsible) {
        onCollapsedChange?.(!isCollapsed)
      }
    })

    const containerClassName = useMemo(
      () => tcx(styles.container(), className),
      [styles, className],
    )

    return (
      <div
        ref={ref}
        className={containerClassName}
        onMouseDown={handleMouseDown}
        onClick={() => {
          onHeaderClick?.()
        }}
        {...rest}
      >
        <div className={styles.wrapper()}>
          <div className={styles.content()}>
            <div className={tcx(styles.collapsibleWrapper(), alwaysShowCollapsible && "visible")}>
              {collapsible && (isCollapsed ? <ChevronRightSmall /> : <ChevronDownSmall />)}
            </div>

            <div className={tcx(styles.titleWrapper(), classNames?.titleWrapper)}>
              <TitleContent
                title={title}
                collapsible={collapsible}
                onClick={onTitleClick}
                styles={styles}
                classNames={classNames}
              />
            </div>
          </div>

          {children && (
            <div className={tcx(styles.actionWrapper(), classNames?.actionWrapper)}>{children}</div>
          )}
        </div>
      </div>
    )
  },
)

PanelTitle.displayName = "PanelTitle"
