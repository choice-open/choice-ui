import { tcx } from "@choiceform/design-shared"
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
   * - `two-columns`: `columns`: 1fr 1fr | `areas`: "label label" "left right" | `rows`: auto minmax(2rem, auto)
   * - `one-label-one-input`: `columns`: 8fr 20fr | `areas`: "label input" | `rows`: 2rem
   * - `one-label-one-input-one-icon`: `columns`: 8fr 20fr 2rem | `areas`: "label input icon" | `rows`: 2rem
   * - `one-label-two-input`: `columns`: 8fr 1fr 1fr | `areas`: "label left right" | `rows`: 2rem
   * - `one-icon-one-input`: `columns`: 2rem 1fr | `areas`: "icon input" | `rows`: 2rem
   * - `one-input-one-icon`: `columns`: 1fr 2rem | `areas`: "input icon" | `rows`: 2rem
   * - `one-input-two-icon`: `columns`: 1fr 1fr 2rem | `areas`: "input left icon" "input right icon" | `rows`: 2rem
   * - `two-input-two-icon`: `columns`: 1fr 1fr 2rem | `areas`: "left icon right icon" | `rows`: 2rem
   * - `two-input-one-icon`: `columns`: 2rem 1fr 1fr | `areas`: "icon left right" | `rows`: 2rem
   * - `one-icon-one-input-two-icon`: `columns`: 2rem 1fr 2rem | `areas`: "icon input icon" | `rows`: 2rem
   * - `two-input-one-icon-double-row`: `columns`: 1fr 1fr 2rem | `areas`: "left icon right icon" | `rows`: 2rem 2rem
   * - `one-icon-one-input-two-icon-double-row`: `columns`: 2rem 1fr 2rem | `areas`: "icon input icon" | `rows`: 2rem 2rem
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
    | "one-icon-one-input-two-icon"
    | "two-input-one-icon-double-row"
}

export const PanelRow = forwardRef<HTMLFieldSetElement, PanelRowProps>(
  function PanelRow(props, ref) {
    const { className, children, type, triggerRef, active, ...rest } = props

    const styles = propertiesPanelRowTv({ type, triggerRef: !!triggerRef, active })

    return (
      <fieldset
        ref={ref}
        className={tcx(styles.container(), className)}
        {...rest}
      >
        {triggerRef && (
          <div
            ref={triggerRef}
            className={styles.triggerRef()}
          />
        )}
        {children}
      </fieldset>
    )
  },
)

PanelRow.displayName = "PanelRow"
