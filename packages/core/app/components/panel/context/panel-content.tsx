import { memo, forwardRef, HTMLProps } from "react"
import { usePanelContext } from "./panel-context"

interface PanelContentProps extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  children?: React.ReactNode
  collapsible?: boolean
  title?: React.ReactNode
  otherChildren?: React.ReactNode[]
}

export const PanelContent = memo(
  forwardRef<HTMLDivElement, PanelContentProps>(function PanelContent(
    props: PanelContentProps,
    ref,
  ) {
    const { children, collapsible, title, otherChildren, ...rest } = props

    const { isCollapsed } = usePanelContext()

    return collapsible ? (
      <>
        {title}
        {collapsible && !isCollapsed && otherChildren}
      </>
    ) : (
      <>{children}</>
    )
  }),
)

PanelContent.displayName = "PanelContent"
