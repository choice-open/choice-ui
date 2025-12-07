import { Slot } from "@choiceform/slot"
import { tcx } from "@choiceform/design-shared"
import { forwardRef, memo, useMemo } from "react"
import { useSkeletonContext } from "./context"
import { useSkeleton } from "./hooks"
import { skeletonTv } from "./tv"
import { type SkeletonProps } from "./types"

/**
 * Skeleton component for loading states
 *
 * @displayName Skeleton
 * @description A loading placeholder that mimics the content it will replace.
 * When children are provided, Skeleton acts as a Slot and passes skeleton styles down.
 * Use `loading` prop for simple cases, or SkeletonProvider for unified control.
 * @category Feedback
 * @status stable
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link https://design-system.choiceform.io/components/skeleton Skeleton Documentation}
 */
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
    // 优先使用 prop，如果没有则从 Context 获取
    const loading = loadingProp ?? skeletonContext?.loading ?? false

    const { styles: skeletonStyles } = useSkeleton({
      hasChildren,
      width,
      height,
    })

    // 使用 useMemo 缓存 tv 计算结果
    const tv = useMemo(
      () =>
        skeletonTv({
          hasChildren,
          loading,
        }),
      [hasChildren, loading],
    )

    // 缓存合并后的样式对象
    const mergedStyle = useMemo(() => {
      if (!skeletonStyles && !style) return undefined
      return { ...skeletonStyles, ...style }
    }, [skeletonStyles, style])

    // 当有 children 时，Skeleton 作为 Slot 向下传递样式（不传递尺寸样式）
    if (hasChildren) {
      // 当 loading 为 false 时，不应用任何 skeleton 样式
      const skeletonClassName = loading ? tv.root() : undefined

      return (
        <Slot
          ref={ref}
          className={tcx(skeletonClassName, className)}
          style={style}
          aria-busy={loading ? "true" : undefined}
          role={loading ? "status" : undefined}
          {...rest}
        >
          {children}
        </Slot>
      )
    }

    // 没有 children 时，作为普通元素或 Slot（当 asChild 为 true 时）
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
