import { tcx } from "@choice-ui/shared"
import { memo } from "react"

interface VirtualizedHeaderProps {
  headerType: "category" | "subcategory"
  isFirst?: boolean
  size: number
  start: number
  title: string
}

export const VirtualizedHeader = memo(function VirtualizedHeader({
  title,
  size,
  start,
  headerType,
  isFirst,
}: VirtualizedHeaderProps) {
  return (
    <div
      style={{
        height: `${size}px`,
        transform: `translateY(${start + 16}px)`,
      }}
      className={tcx(
        "absolute top-0 left-0 flex w-full items-center px-4 select-none",
        headerType === "category" && "font-bold",
        headerType === "category" && !isFirst && "mt-2 border-t",
      )}
    >
      {title}
    </div>
  )
})

VirtualizedHeader.displayName = "VirtualizedHeader"
