import { forwardRef, HTMLProps, memo, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { usePanelContext } from "../context"
import { propertiesPaneTitleTv } from "../tv"
import { tcx } from "~/utils"
import { ChevronDownSmall, ChevronRightSmall } from "@choiceform/icons-react"

interface PanelTitleProps extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  title: string
  children?: React.ReactNode
  onHeaderClick?: () => void
  onTitleClick?: () => void
  classNames?: {
    container?: string
    titleWrapper?: string
    title?: string
    actionWrapper?: string
  }
}

// Extract TitleContent as a memoized component
const TitleContent = memo(function TitleContent({
  title,
  onClick,
  collapsible,
  styles,
  classNames,
}: {
  title: string
  onClick?: () => void
  collapsible?: boolean
  styles: ReturnType<typeof propertiesPaneTitleTv>
  classNames?: PanelTitleProps["classNames"]
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
