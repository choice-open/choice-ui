import { Slot } from "@choice-ui/slot"
import { tcx } from "@choice-ui/shared"
import { forwardRef, memo, useMemo } from "react"
import { useSkeletonContext } from "./context"
import { useSkeleton } from "./hooks"
import { skeletonTv } from "./tv"
import { type SkeletonProps } from "./types"

export const Skeleton = memo(
  forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(props, ref) {
    const {
      width,
      height,
      children,
      className,
      style,
      asChild,
      loading: loadingProp,
      ...rest
    } = props

    const hasChildren = Boolean(children)
    const skeletonContext = useSkeletonContext()
    // Use loading prop if provided, otherwise use context value, default to false
    const loading = loadingProp ?? skeletonContext?.loading ?? false

    const { styles: skeletonStyles } = useSkeleton({
      width,
      height,
    })

    // Use useMemo to cache tv calculation results
    const tv = useMemo(
      () =>
        skeletonTv({
          loading,
        }),
      [loading],
    )

    // Cache merged style object
    const mergedStyle = useMemo(() => {
      if (!skeletonStyles && !style) return undefined
      return { ...skeletonStyles, ...style }
    }, [skeletonStyles, style])

    // When there are children, Skeleton acts as a Slot and passes styles down (without passing size styles)
    if (hasChildren) {
      return (
        <Slot
          ref={ref}
          className={tcx(tv.root(), className)}
          style={style}
          aria-busy={loading ? "true" : undefined}
          role={loading ? "status" : undefined}
          {...rest}
        >
          {children}
        </Slot>
      )
    }

    // When there are no children, act as a normal element or Slot (when asChild is true)
    const Component = asChild ? Slot : "span"

    return (
      <Component
        ref={ref}
        className={tcx(tv.root(), className)}
        style={mergedStyle}
        aria-busy={loading ? "true" : undefined}
        role={loading ? "status" : undefined}
        {...rest}
      />
    )
  }),
)

Skeleton.displayName = "Skeleton"
