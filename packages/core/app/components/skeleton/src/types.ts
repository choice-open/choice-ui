import { ComponentPropsWithoutRef } from "react"

export type SkeletonVariant = "text" | "rectangular" | "rounded" | "circular"

export interface SkeletonProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * Whether to render as child element
   */
  asChild?: boolean
  /**
   * Optional children to infer width and height from
   * When children are provided, Skeleton acts as a Slot and passes styles down
   */
  children?: React.ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Height of the skeleton
   */
  height?: number | string
  /**
   * Whether the skeleton is in loading state
   * When true, children will be wrapped with skeleton styles (gray background, no border/shadow, invisible children)
   * If not provided, will fallback to SkeletonContext loading state
   * @default undefined (falls back to Context)
   */
  loading?: boolean
  /**
   * The variant of the skeleton
   * @default 'text'
   */
  variant?: SkeletonVariant
  /**
   * Width of the skeleton
   */
  width?: number | string
}
