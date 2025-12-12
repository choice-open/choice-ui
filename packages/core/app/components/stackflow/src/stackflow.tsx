import { tcx } from "@choice-ui/shared"
import {
  Children,
  forwardRef,
  Fragment,
  HTMLProps,
  isValidElement,
  ReactNode,
  useCallback,
  useState,
} from "react"
import { StackflowItem, StackflowPrefix, StackflowSuffix } from "./components"
import { StackflowContext } from "./context"
import { StackflowItem as StackflowItemType, useStackflow } from "./hooks"
import { stackflowTv } from "./tv"

export interface StackflowProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode
  className?: string
  defaultId?: string
  initialId?: string
}

interface StackflowComponent extends React.ForwardRefExoticComponent<
  StackflowProps & React.RefAttributes<HTMLDivElement>
> {
  Item: typeof StackflowItem
  Prefix: typeof StackflowPrefix
  Suffix: typeof StackflowSuffix
}

const StackflowRoot = forwardRef<HTMLDivElement, StackflowProps>(function Stackflow(props, ref) {
  const { children, className, defaultId, initialId, ...rest } = props
  const [items, setItems] = useState<StackflowItemType[]>([])

  const registerItem = useCallback((id: string, content: ReactNode) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === id)
      if (exists) {
        // Update existing item
        return prev.map((item) => (item.id === id ? { ...item, content } : item))
      } else {
        // Add new item
        return [...prev, { id, content }]
      }
    })
  }, [])

  // defaultId priority is higher than initialId
  const controls = useStackflow(items, defaultId || initialId)
  const tv = stackflowTv()

  // Recursively process children, including Fragment
  const processChildren = (
    children: ReactNode,
  ): {
    itemElements: ReactNode[]
    prefixElements: ReactNode[]
    suffixElements: ReactNode[]
  } => {
    const prefixElements: ReactNode[] = []
    const suffixElements: ReactNode[] = []
    const itemElements: ReactNode[] = []

    const processChild = (child: ReactNode) => {
      if (!isValidElement(child)) return

      if (child.type === Fragment) {
        // Recursively process children inside Fragment
        const fragmentResult = processChildren(child.props.children)
        prefixElements.push(...fragmentResult.prefixElements)
        suffixElements.push(...fragmentResult.suffixElements)
        itemElements.push(...fragmentResult.itemElements)
      } else if (child.type === StackflowPrefix) {
        prefixElements.push(child)
      } else if (child.type === StackflowSuffix) {
        suffixElements.push(child)
      } else if (child.type === StackflowItem) {
        itemElements.push(child)
      }
    }

    Children.forEach(children, processChild)

    return { prefixElements, suffixElements, itemElements }
  }

  const { prefixElements, suffixElements, itemElements } = processChildren(children)

  return (
    <StackflowContext.Provider
      value={{
        ...controls,
        registerItem,
      }}
    >
      <div
        ref={ref}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        {prefixElements}

        <div className={tv.content()}>{itemElements}</div>

        {suffixElements}
      </div>
    </StackflowContext.Provider>
  )
})

StackflowRoot.displayName = "Stackflow"

const Stackflow = StackflowRoot as StackflowComponent
Stackflow.Item = StackflowItem
Stackflow.Prefix = StackflowPrefix
Stackflow.Suffix = StackflowSuffix

export { Stackflow }
