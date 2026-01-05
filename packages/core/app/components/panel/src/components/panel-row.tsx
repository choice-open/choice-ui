import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps } from "react"
import { propertiesPanelRowTv } from "../tv"

export interface PanelRowProps extends Omit<HTMLProps<HTMLFieldSetElement>, "title"> {
  active?: boolean
  children?: React.ReactNode
  triggerRef?: React.RefObject<HTMLDivElement>
  /**
   * The type of the panel row.
   * @default "single"
   * @description
   * - `single`: `columns`: 1fr | `areas`: "label" "input" | `rows`: auto minmax(2rem, auto)
   * - `two-columns`: `columns`: 1fr 1fr | `areas`: "label-1 label-2" "input-1 input-2" | `rows`: auto minmax(2rem, auto)
   * - `one-label-one-input`: `columns`: 8fr 20fr | `areas`: "label input" | `rows`: 2rem
   * - `one-label-one-input-one-icon`: `columns`: 8fr 20fr 1.5rem | `areas`: "label input icon" | `rows`: 2rem
   * - `one-label-two-input`: `columns`: 8fr 10fr 10fr | `areas`: "label input-1 input-2" | `rows`: 2rem
   * - `one-icon-one-input`: `columns`: 1.5rem 1fr | `areas`: ". label" "icon input" | `rows`: auto minmax(2rem, auto)
   * - `one-input-one-icon`: `columns`: 1fr 1.5rem | `areas`: "label label" "input icon" | `rows`: auto minmax(2rem, auto)
   * - `one-input-two-icon`: `columns`: 1fr 0.5rem 1.5rem 0.25rem 1.5rem | `areas`: "label . . . ." "input . icon-1 . icon-2" | `rows`: auto minmax(2rem, auto)
   * - `two-input-two-icon`: `columns`: minmax(76px, 1fr) 0.5rem 1fr 0.5rem 1.5rem 0.25rem 1.5rem | `areas`: "label-1 label-1 label-2 label-2 . . ." "input-1 . input-2 . icon-1 . icon-2" | `rows`: auto minmax(2rem, auto)
   * - `two-input-one-icon`: `columns`: 1fr 1fr 1.5rem | `areas`: "label-1 label-2 label-2" "input-1 input-2 icon" | `rows`: auto minmax(2rem, auto)
   * - `one-icon-one-input-one-icon`: `columns`: 1.5rem 0.5rem 1fr 0.5rem 1.5rem | `areas`: "label label label label label" "icon-1 . input . icon-2" | `rows`: auto minmax(2rem, auto)
   * - `one-icon-one-input-two-icon`: `columns`: 1.5rem 0.5rem 1fr 0.5rem 1.5rem 0.25rem 1.5rem | `areas`: "label label label label label label label" "icon-1 . input . icon-2 . icon-3" | `rows`: auto minmax(2rem, auto)
   * - `two-input-one-icon-double-row`: `columns`: 1fr 1fr 1.5rem | `areas`: "label-1 label-2 ." "input-1 input-3 icon-1" "input-2 input-3 icon-2" | `rows`: auto 2rem 2rem
   */
  type?:
    | "single"
    | "two-columns"
    | "one-label-one-input"
    | "one-label-one-input-one-icon"
    | "one-label-two-input"
    | "one-icon-one-input"
    | "one-input-one-icon"
    | "one-input-two-icon"
    | "two-input-two-icon"
    | "two-input-one-icon"
    | "one-icon-one-input-one-icon"
    | "one-icon-one-input-two-icon"
    | "two-input-one-icon-double-row"
}

export const PanelRow = forwardRef<HTMLFieldSetElement, PanelRowProps>(
  function PanelRow(props, ref) {
    const { className, children, type, triggerRef, active, ...rest } = props

    const tv = propertiesPanelRowTv({ type, triggerRef: !!triggerRef, active })

    return (
      <fieldset
        ref={ref}
        className={tcx(tv.container(), className)}
        {...rest}
      >
        {triggerRef && (
          <div
            ref={triggerRef}
            className={tv.triggerRef()}
          />
        )}
        {children}
      </fieldset>
    )
  },
)

PanelRow.displayName = "PanelRow"
