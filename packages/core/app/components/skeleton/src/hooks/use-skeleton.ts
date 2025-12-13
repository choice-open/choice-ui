import { useMemo } from "react"

export interface UseSkeletonParams {
  height?: number | string
  width?: number | string
}

export interface UseSkeletonReturn {
  styles: React.CSSProperties
}

export function useSkeleton({ width, height }: UseSkeletonParams): UseSkeletonReturn {
  const styles = useMemo<React.CSSProperties>(() => {
    const result: React.CSSProperties = {}

    if (width) {
      result.width = typeof width === "number" ? `${width}px` : width
    }

    if (height) {
      result.height = typeof height === "number" ? `${height}px` : height
    }

    return result
  }, [width, height])

  return {
    styles,
  }
}
