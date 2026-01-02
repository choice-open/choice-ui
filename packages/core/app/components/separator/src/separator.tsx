import { tcx } from "@choice-ui/shared"
import { forwardRef, memo } from "react"
import { SeparatorTV } from "./tv"

export type SeparatorOrientation = "horizontal" | "vertical"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation
  decorative?: boolean
  variant?: "default" | "light" | "dark" | "reset"
  children?: React.ReactNode
}

/**
 * Separator - Separator component
 *
 * Used to create visual separation between content, supports horizontal and vertical directions.
 * Screen reader friendly, uses correct ARIA attributes.
 *
 */
export const Separator = memo(
  forwardRef<HTMLDivElement, SeparatorProps>((props, ref) => {
    const {
      className,
      orientation = "horizontal",
      decorative = false,
      variant = "default",
      children,
      ...rest
    } = props

    const tv = SeparatorTV({ orientation, variant, hasChildren: !!children })

    const semanticProps = decorative
      ? { role: "none" as const }
      : {
          role: "separator" as const,
          "aria-orientation": orientation,
        }

    if (!children) {
      return (
        <div
          ref={ref}
          {...semanticProps}
          {...rest}
          className={tcx(tv.separator(), className)}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        <div
          {...semanticProps}
          className={tv.separator()}
        />
        {children}
        <div
          {...semanticProps}
          className={tv.separator()}
        />
      </div>
    )
  }),
)

Separator.displayName = "Separator"
