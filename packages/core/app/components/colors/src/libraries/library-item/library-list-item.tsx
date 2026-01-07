import { tcx } from "@choice-ui/shared"
import { ComponentProps } from "react"

type Props = ComponentProps<"div"> & {
  isSelected: boolean
}

export const LibraryListItem = (props: Props) => {
  const { children, className, isSelected, ...rest } = props

  return (
    <div
      className={tcx(
        "group flex h-8 w-full min-w-0 items-center gap-2 pr-3 pl-5 select-none",
        isSelected ? "bg-selected-background" : "hover:bg-secondary-background",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
