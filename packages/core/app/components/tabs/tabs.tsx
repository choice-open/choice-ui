import { forwardRef, HTMLProps, ReactNode, useId } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { TabsContext } from "./context"
import { TabItem } from "./tab-item"
import { tabsTv } from "./tv"

export interface TabsProps extends Omit<HTMLProps<HTMLDivElement>, "onChange"> {
  children?: ReactNode
  className?: string
  disabled?: boolean
  onChange?: (value: string) => void
  value: string
  variant?: "default" | "light" | "dark" | "reset"
}

interface TabsComponent
  extends React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>> {
  Item: typeof TabItem
}

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  const {
    value: valueProp,
    onChange,
    className,
    disabled,
    "aria-label": ariaLabel,
    children,
    variant = "default",
    ...rest
  } = props
  const id = useId()

  const handleChange = useEventCallback((newValue: string) => {
    onChange?.(newValue)
  })

  const tv = tabsTv({ variant })

  return (
    <TabsContext.Provider
      value={{
        disabled,
        value: valueProp,
        onChange: handleChange,
        variant,
        id,
      }}
    >
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        aria-disabled={disabled}
        aria-label={ariaLabel || "Tabs"}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
})

TabsRoot.displayName = "Tabs"

const Tabs = TabsRoot as TabsComponent
Tabs.Item = TabItem

export { Tabs }
