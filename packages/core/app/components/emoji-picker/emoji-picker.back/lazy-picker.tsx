import { lazy, Suspense } from "react"
import type { PickerProps } from "./emoji-picker-types"

const LazyPicker = lazy(() => import("@emoji-mart/react").then((mod) => ({ default: mod.default })))

export interface LazyPickerProps extends PickerProps {
  fallback?: React.ReactNode
}

export function LazyEmoji({ fallback = null, ...props }: LazyPickerProps) {
  return (
    <Suspense fallback={fallback}>
      <LazyPicker {...props} />
    </Suspense>
  )
}
