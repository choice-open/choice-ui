import { ScrollArea } from "@choice-ui/scroll-area"
import { tcx } from "@choice-ui/shared"
import { useVirtualizer } from "@tanstack/react-virtual"
import { CSSProperties, forwardRef, useMemo, useRef } from "react"
import { getColorPickerCursor } from "../hooks"
import type { RGB, Style, Variable } from "../types"
import { VirtualizedGridRow } from "./components/virtualized-grid-row"
import { useLibraryCategories } from "./hooks"
import { LibrariesHeader } from "./libraries-header"
import type { LibrariesType } from "../types"

// 定义虚拟化项目类型
type VirtualizedItem = {
  index: number
  item: Variable
  itemType: "VARIABLE"
  type: "item"
}

interface IfLibraryColorSwatchProps {
  category?: string
  className?: string
  onCategoryChange?: (category: string) => void
  onLibraryChange?: (value: { item: Variable | Style; type: LibrariesType }) => void
  onSwatchChange?: (value: { alpha: number; color: RGB }) => void
  selectedItem?: { item: Variable | Style; type: LibrariesType } | null
  variables?: Variable[]
}

export const IfLibraryColorSwatch = forwardRef<HTMLDivElement, IfLibraryColorSwatchProps>(
  function IfLibraryColorSwatch(props, ref) {
    const {
      className,
      variables = [],
      category = "all",
      onCategoryChange,
      onSwatchChange,
      onLibraryChange,
      selectedItem,
    } = props

    const inputRef = useRef<HTMLInputElement>(null)

    // 过滤颜色变量
    const colorVariables = useMemo(() => {
      return variables.filter((v) => v.type === "color")
    }, [variables])

    const categoryOptions = useLibraryCategories({
      variables: colorVariables,
    })

    // 过滤当前分类的颜色变量
    const filteredVariables = useMemo(() => {
      if (category === "all") return colorVariables

      return colorVariables.filter((v) => {
        const [cat] = v.masterId.split("/")
        return cat === category
      })
    }, [colorVariables, category])

    // 计算网格项目
    const gridItems = useMemo(() => {
      const items: VirtualizedItem[] = filteredVariables.map((variable, index) => ({
        type: "item",
        item: variable,
        itemType: "VARIABLE",
        index,
      }))

      // 每行8个项目
      const rows: VirtualizedItem[][] = []
      for (let i = 0; i < items.length; i += 8) {
        rows.push(items.slice(i, i + 8))
      }
      return rows
    }, [filteredVariables])

    const parentRef = useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
      count: gridItems.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 24,
      overscan: 5,
    })

    const cursor = getColorPickerCursor()

    return (
      <>
        <LibrariesHeader
          categoryOptions={categoryOptions}
          value={category}
          onChange={onCategoryChange}
          displayType="SMALL_GRID"
          allowDisplayTypeSwitch={false}
          inputRef={inputRef}
        />

        <ScrollArea
          ref={ref}
          className={tcx("h-[104px]", className)}
          style={
            {
              "--color-picker-cursor": `url('${cursor}') 8 24, auto`,
              "--height": `${rowVirtualizer.getTotalSize() + 8}px`,
            } as CSSProperties
          }
        >
          <ScrollArea.Viewport
            ref={parentRef}
            className="relative flex h-[--height] flex-none flex-col"
          >
            <ScrollArea.Content>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = gridItems[virtualRow.index]
                return (
                  <VirtualizedGridRow
                    key={`row-${virtualRow.index}`}
                    row={row}
                    size={virtualRow.size}
                    start={virtualRow.start}
                    onSwatchChange={onSwatchChange}
                    onLibraryChange={onLibraryChange}
                    displayType="SMALL_GRID"
                    columns={8}
                    padding="px-4"
                    selectedItem={selectedItem}
                  />
                )
              })}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </>
    )
  },
)
