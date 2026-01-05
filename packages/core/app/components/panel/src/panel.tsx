import { tcx } from "@choice-ui/shared"
import { Children, forwardRef, HTMLProps, memo, useMemo } from "react"
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
import { PanelContext, PanelContextType, usePanelContext } from "./context"
import { propertiesPanelTv } from "./tv"

interface PanelProps extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  alwaysShowCollapsible?: boolean
  children?: React.ReactNode
  className?: string
  collapsible?: boolean
  isCollapsed?: boolean
  isEmpty?: boolean
  onCollapsedChange?: (isCollapsed: boolean) => void
  onEmptyChange?: (isEmpty: boolean) => void
  showLabels?: boolean
  triggerRef?: React.RefObject<HTMLDivElement>
}

const PanelContent = memo(function PanelContent({
  children,
  collapsible,
  title,
  otherChildren,
}: {
  children: React.ReactNode
  collapsible?: boolean
  otherChildren: React.ReactNode[]
  title: React.ReactNode
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
})

interface PanelComponentProps extends React.ForwardRefExoticComponent<
  PanelProps & React.RefAttributes<HTMLDivElement>
> {
  Content: typeof PanelContent
  Label: typeof PanelLabel
  Previewer: typeof PanelPreviewer
  Row: typeof PanelRow
  RowLabel: typeof PanelRowLabel
  RowManyIcon: typeof PanelRowManyIcon
  Sortable: typeof PanelSortable
  SortableRow: typeof PanelSortableRow
  Title: typeof PanelTitle
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

  const tv = useMemo(
    () =>
      propertiesPanelTv({
        isEmpty: isEmpty || isCollapsed || otherChildren.length === 0,
      }),
    [isEmpty, isCollapsed, otherChildren.length],
  )

  const contextValue = useMemo<PanelContextType>(
    () => ({ collapsible, isCollapsed, onCollapsedChange, showLabels, alwaysShowCollapsible }),
    [collapsible, isCollapsed, onCollapsedChange, showLabels, alwaysShowCollapsible],
  )

  return (
    <PanelContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={tcx(tv.container(), className)}
        aria-expanded={!isCollapsed}
        {...rest}
      >
        {triggerRef && (
          <div
            ref={triggerRef}
            className={tv.triggerRef()}
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
Panel.Previewer = PanelPreviewer
export { Panel }
