import { ScrollArea } from "@choice-ui/scroll-area"
import { tcx } from "@choice-ui/shared"
import { useVirtualizer } from "@tanstack/react-virtual"
import { CSSProperties, forwardRef, Fragment, ReactNode, useMemo, useRef } from "react"

type Props = {
  className?: string
  items: unknown[]
  libraryItem: (item: unknown, style: CSSProperties) => ReactNode
}

export const IfLibrariesContent = forwardRef<HTMLDivElement, Props>(
  function IfLibrariesContent(props, ref) {
    const { className, items, libraryItem } = props

    const parentRef = useRef<HTMLDivElement>(null)

    const virtualItemsCount = useMemo(() => {
      return items.length
    }, [items.length])

    const listVirtualizer = useVirtualizer({
      count: virtualItemsCount,
      getScrollElement: () => parentRef.current,
      estimateSize: (_index) => {
        return 32
      },
      overscan: 5,
      measureElement: (element) => {
        return element?.getBoundingClientRect().height ?? 32
      },
    })

    const style = useMemo(
      () => ({
        "--height": tcx(listVirtualizer.getTotalSize() + 16 + "px"),
        "--width": 240 + "px",
      }),
      [listVirtualizer],
    )

    return (
      <ScrollArea
        ref={ref}
        className={tcx("max-h-96", className)}
        style={style as CSSProperties}
      >
        <ScrollArea.Viewport
          ref={parentRef}
          className="relative flex h-(--height) w-(--width) flex-none flex-col"
        >
          <ScrollArea.Content>
            {listVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = items[virtualRow.index]
              const style: CSSProperties = {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start + 8}px)`,
              }

              return (
                <Fragment key={virtualRow.key}>{libraryItem && libraryItem(item, style)}</Fragment>
              )
            })}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  },
)
IfLibrariesContent.displayName = "IfLibrariesContent"
