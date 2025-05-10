import { Children, createContext, forwardRef, HTMLProps, useContext, useMemo } from "react"
import { tcx } from "~/utils"
import { propertiesPanelTv } from "./tv"
import { PanelContext, usePanelContext } from "./context"
import {
  PanelLabel,
  PanelPreviewer,
  PanelRow,
  PanelRowLabel,
  PanelRowManyIcon,
  PanelSortable,
  PanelSortableRow,
  PanelTitle,
} from "./components"

interface PanelProps extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  className?: string
  triggerRef?: React.RefObject<HTMLDivElement>
  children?: React.ReactNode
  isEmpty?: boolean
  onEmptyChange?: (isEmpty: boolean) => void
  isCollapsed?: boolean
  onCollapsedChange?: (isCollapsed: boolean) => void
  collapsible?: boolean
  alwaysShowCollapsible?: boolean // 始终显示折叠按钮
  showLabels?: boolean
}

const PanelContent = function PanelContent({
  children,
  collapsible,
  title,
  otherChildren,
}: {
  children: React.ReactNode
  collapsible?: boolean
  title: React.ReactNode
  otherChildren: React.ReactNode[]
}) {
  const { isCollapsed } = usePanelContext()

  return collapsible ? (
    <>
      {title}
      {collapsible && !isCollapsed && otherChildren}
    </>
  ) : (
    <>{children}</>
  )
}

interface PanelComponentProps
  extends React.ForwardRefExoticComponent<PanelProps & React.RefAttributes<HTMLDivElement>> {
  Content: typeof PanelContent
  Title: typeof PanelTitle
  Label: typeof PanelLabel
  Sortable: typeof PanelSortable
  SortableRow: typeof PanelSortableRow
  Row: typeof PanelRow
  RowLabel: typeof PanelRowLabel
  RowManyIcon: typeof PanelRowManyIcon
  RowPreviewer: typeof PanelPreviewer
}

export const PanelBase = forwardRef<HTMLDivElement, PanelProps>(function Panel(props, ref) {
  const {
    className,
    children,
    isEmpty,
    onEmptyChange,
    isCollapsed,
    onCollapsedChange,
    collapsible,
    triggerRef,
    showLabels,
    alwaysShowCollapsible,
    ...rest
  } = props

  const { title, otherChildren } = useMemo(() => {
    let title: React.ReactNode | null = null
    const otherChildren: React.ReactNode[] = []

    Children.forEach(children, (child, index) => {
      if (index === 0) {
        if (child && typeof child === "object" && "props" in child) {
          title = {
            ...child,
            props: {
              ...child.props,
              "data-collapsible": collapsible ? isCollapsed : undefined,
            },
          }
        } else {
          title = child
        }
      } else {
        if (child) {
          otherChildren.push(child)
        }
      }
    })

    return { title, otherChildren }
  }, [children, collapsible, isCollapsed])

  const styles = propertiesPanelTv({
    isEmpty: isEmpty || isCollapsed || otherChildren.length === 0,
  })

  return (
    <PanelContext.Provider
      value={{ collapsible, isCollapsed, onCollapsedChange, showLabels, alwaysShowCollapsible }}
    >
      <div
        ref={ref}
        className={tcx(styles.container(), className)}
        aria-expanded={!isCollapsed}
        {...rest}
      >
        {triggerRef && (
          <div
            ref={triggerRef}
            className={styles.triggerRef()}
          />
        )}

        <PanelContent
          collapsible={collapsible}
          title={title}
          otherChildren={otherChildren}
        >
          {children}
        </PanelContent>
      </div>
    </PanelContext.Provider>
  )
})

PanelBase.displayName = "Panel"

const Panel = PanelBase as PanelComponentProps
Panel.Label = PanelLabel
Panel.Title = PanelTitle
Panel.Sortable = PanelSortable
Panel.SortableRow = PanelSortableRow
Panel.Row = PanelRow
Panel.RowLabel = PanelRowLabel
Panel.RowManyIcon = PanelRowManyIcon
Panel.RowPreviewer = PanelPreviewer
export { Panel }
