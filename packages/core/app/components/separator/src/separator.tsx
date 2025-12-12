import { tcx } from "@choice-ui/shared"
import { forwardRef, memo } from "react"
import { SeparatorTV } from "./tv"

export type SeparatorOrientation = "horizontal" | "vertical"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Separator direction
   * @default "horizontal"
   */
  orientation?: SeparatorOrientation
  /**
   * Whether to use decorative separator (not read by screen readers)
   * @default false
   */
  decorative?: boolean
  variant?: "default" | "light" | "dark" | "reset"
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
      ...rest
    } = props

    const tv = SeparatorTV({ orientation, variant })

    // Decorative separator uses role="none", otherwise uses role="separator"
    const semanticProps = decorative
      ? { role: "none" as const }
      : {
          role: "separator" as const,
          "aria-orientation": orientation,
        }

    return (
      <div
        ref={ref}
        {...semanticProps}
        {...rest}
        className={tcx(tv.root(), className)}
      />
    )
  }),
)

Separator.displayName = "Separator"
