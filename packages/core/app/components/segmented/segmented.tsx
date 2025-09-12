import { Children, ForwardedRef, forwardRef, HTMLProps, ReactNode, useId, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { type TooltipProps } from "../tooltip"
import { SegmentedContext } from "./context"
import { SegmentedItem } from "./segmented-item"
import { segmentedControlTv } from "./tv"

export interface SegmentedProps extends Omit<HTMLProps<HTMLDivElement>, "onChange"> {
  children?: ReactNode
  className?: string
  disabled?: boolean
  onChange?: (value: string) => void
  tooltip?: TooltipProps
  value?: string
  variant?: "default" | "light" | "dark" | "reset"
}

const SegmentedBase = forwardRef<HTMLDivElement, SegmentedProps>(
  function SegmentedBase(props, ref) {
    const {
      value: valueProp,
      onChange,
      variant,
      disabled,
      className,
      children,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      style,
      ...rest
    } = props

    const id = useId()
    const descriptionId = useId()

    const handleChange = useEventCallback((value: string) => {
      onChange?.(value)
    })

    // 计算子元素数量来设置网格列数
    const itemCount = useMemo(() => Children.count(children), [children])
    const gridStyles = useMemo(
      () => ({
        ...style,
        gridTemplateColumns: `repeat(${itemCount}, 1fr)`,
      }),
      [style, itemCount],
    )

    const styles = segmentedControlTv({
      variant,
    })

    const ariaProps = {
      "aria-label": ariaLabel || "Options",
      "aria-describedby": ariaDescribedby || descriptionId,
    }

    return (
      <SegmentedContext.Provider
        value={{
          value: valueProp,
          onChange: handleChange,
          groupId: id,
          variant,
          disabled,
        }}
      >
        <div
          ref={ref}
          className={tcx(styles.root(), className)}
          style={gridStyles}
          role="radiogroup"
          {...ariaProps}
          {...rest}
        >
          <span
            id={descriptionId}
            className="sr-only"
          >
            Use arrow keys to navigate between options
          </span>

          {children}
        </div>
      </SegmentedContext.Provider>
    )
  },
)

SegmentedBase.displayName = "SegmentedBase"

function SegmentedWithRef(props: SegmentedProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <SegmentedBase
      {...props}
      ref={ref}
    />
  )
}

const SegmentedForwardRef = forwardRef(SegmentedWithRef)
SegmentedForwardRef.displayName = "Segmented"

export const Segmented = Object.assign(SegmentedForwardRef, {
  Item: SegmentedItem,
})
