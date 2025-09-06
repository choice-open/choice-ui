import { forwardRef, memo } from "react"
import { tcx } from "~/utils"
import { Slot } from "../slot"
import { useSkeleton } from "./hooks"
import { skeletonTv } from "./tv"
import { type SkeletonProps, type SkeletonSubComponentProps, type SkeletonVariant } from "./types"

/**
 * Skeleton component for loading states
 *
 * @displayName Skeleton
 * @description A loading placeholder that mimics the content it will replace
 * @category Feedback
 * @status stable
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link https://design-system.choiceform.io/components/skeleton Skeleton Documentation}
 */
const SkeletonBase = memo(
  forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(props, ref) {
    const {
      animation = "pulse",
      variant = "text",
      width,
      height,
      children,
      className,
      style,
      asChild,
      ...rest
    } = props

    const hasChildren = Boolean(children)

    const { shouldShowWave, fitContent, heightAuto, styles } = useSkeleton({
      animation,
      variant,
      hasChildren,
      width,
      height,
    })

    const tv = skeletonTv({
      variant,
      animation,
      hasChildren,
      fitContent,
      heightAuto,
    })

    const Component = asChild ? Slot : "span"

    return (
      <Component
        ref={ref}
        className={tcx(tv.root(), className)}
        style={{ ...styles, ...style }}
        aria-busy="true"
        role="status"
        {...rest}
      >
        {children}
        {shouldShowWave && (
          <span
            className={tcx(tv.wave())}
            aria-hidden="true"
          />
        )}
      </Component>
    )
  }),
)

SkeletonBase.displayName = "Skeleton"

/**
 * Creates a skeleton sub-component with a specific variant
 */
const createSkeletonSubComponent = (variant: SkeletonVariant) => {
  const SubComponent = memo(
    forwardRef<HTMLSpanElement, SkeletonSubComponentProps>(function SkeletonSubComponent(props, ref) {
      const {
        animation = "pulse",
        width,
        height,
        className,
        style,
        asChild,
        ...rest
      } = props

      const hasChildren = false

      const { shouldShowWave, fitContent, heightAuto, styles } = useSkeleton({
        animation,
        variant,
        hasChildren,
        width,
        height,
      })

      const tv = skeletonTv({
        variant,
        animation,
        hasChildren,
        fitContent,
        heightAuto,
      })

      const Component = asChild ? Slot : "span"

      return (
        <Component
          ref={ref}
          className={tcx(tv.root(), className)}
          style={{ ...styles, ...style }}
          aria-busy="true"
          role="status"
          {...rest}
        >
          {shouldShowWave && (
            <span
              className={tcx(tv.wave())}
              aria-hidden="true"
            />
          )}
        </Component>
      )
    }),
  )

  SubComponent.displayName = `Skeleton.${variant.charAt(0).toUpperCase() + variant.slice(1)}`
  return SubComponent
}

/**
 * Text skeleton component
 */
const Text = createSkeletonSubComponent("text")

/**
 * Rectangular skeleton component
 */
const Rectangular = createSkeletonSubComponent("rectangular")

/**
 * Rounded skeleton component
 */
const Rounded = createSkeletonSubComponent("rounded")

/**
 * Circular skeleton component
 */
const Circular = createSkeletonSubComponent("circular")

// Attach sub-components to main component
const SkeletonWithSubComponents = Object.assign(SkeletonBase, {
  Text,
  Rectangular,
  Rounded,
  Circular,
})

export { SkeletonWithSubComponents as Skeleton }
