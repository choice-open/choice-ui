import { forwardRef, HTMLProps } from "react"
import { tcx } from "~/utils"
import { ListContent } from "./components/list-content"
import { ListDivider } from "./components/list-divider"
import { ListItem } from "./components/list-item"
import { ListLabel } from "./components/list-label"
import { ListSubTrigger } from "./components/list-sub-trigger"
import { ListProvider } from "./context"
import { useListKeyboard } from "./hooks"
import { ListTv } from "./tv"

interface ListProps extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  shouldShowReferenceLine?: boolean
  selection?: boolean
  variant?: "default" | "primary"
}

interface ListComponentProps
  extends React.ForwardRefExoticComponent<ListProps & React.RefAttributes<HTMLDivElement>> {
  Content: typeof ListContent
  Item: typeof ListItem
  Label: typeof ListLabel
  Divider: typeof ListDivider
  SubTrigger: typeof ListSubTrigger
}

export const ListBase = forwardRef<HTMLDivElement, ListProps>((props, ref) => {
  const { children, className, shouldShowReferenceLine, selection, variant, ...rest } = props

  return (
    <ListProvider
      shouldShowReferenceLine={shouldShowReferenceLine}
      selection={selection}
      variant={variant}
    >
      <ListRoot
        ref={ref}
        className={className}
        {...rest}
      >
        {children}
      </ListRoot>
    </ListProvider>
  )
})

const ListRoot = forwardRef<HTMLDivElement, ListProps>((props, ref) => {
  const { children, className, ...rest } = props
  const handleKeyDown = useListKeyboard()

  const styles = ListTv()

  return (
    <div
      ref={ref}
      role="list"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...rest}
      className={tcx(styles, className)}
    >
      {children}
    </div>
  )
})

ListBase.displayName = "List"

const List = ListBase as ListComponentProps
List.Content = ListContent
List.Item = ListItem
List.Label = ListLabel
List.Divider = ListDivider
List.SubTrigger = ListSubTrigger

export { List }
