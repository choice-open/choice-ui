import { tcx } from "@choice-ui/shared"
import { MenuValue } from "@choice-ui/menus"
import { forwardRef, HTMLProps } from "react"
import { ListContent } from "./components/list-content"
import { ListDivider } from "./components/list-divider"
import { ListItem } from "./components/list-item"
import { ListLabel } from "./components/list-label"
import { ListSubTrigger } from "./components/list-sub-trigger"
import { ListProvider, useActiveItemContext } from "./context"
import { useListKeyboard } from "./hooks"
import { ListTv } from "./tv"

export interface ListProps extends Omit<HTMLProps<HTMLDivElement>, "size"> {
  children: React.ReactNode
  interactive?: boolean
  selection?: boolean
  shouldShowReferenceLine?: boolean
  size?: "default" | "large"
  variant?: "default" | "primary"
}

interface ListComponentProps extends React.ForwardRefExoticComponent<
  ListProps & React.RefAttributes<HTMLDivElement>
> {
  Content: typeof ListContent
  Divider: typeof ListDivider
  Item: typeof ListItem
  Label: typeof ListLabel
  SubTrigger: typeof ListSubTrigger
  Value: typeof MenuValue
}

export const ListBase = forwardRef<HTMLDivElement, ListProps>((props, ref) => {
  const {
    children,
    className,
    interactive = true,
    shouldShowReferenceLine,
    selection,
    variant,
    size,
    ...rest
  } = props

  return (
    <ListProvider
      interactive={interactive}
      shouldShowReferenceLine={shouldShowReferenceLine}
      selection={selection}
      variant={variant}
      size={size}
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
  const { setActiveItem } = useActiveItemContext()

  const tv = ListTv()

  return (
    <div
      ref={ref}
      role="list"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setActiveItem(null)}
      {...rest}
      className={tcx(tv, className)}
    >
      {children}
    </div>
  )
})

ListRoot.displayName = "ListRoot"

ListBase.displayName = "List"

const List = ListBase as ListComponentProps
List.Content = ListContent
List.Item = ListItem
List.Label = ListLabel
List.Divider = ListDivider
List.SubTrigger = ListSubTrigger
List.Value = MenuValue

export { List }
