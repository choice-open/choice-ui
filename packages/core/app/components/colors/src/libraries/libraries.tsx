import { ScrollArea } from "@choice-ui/scroll-area"
import { tcx } from "@choice-ui/shared"
import { useVirtualizer } from "@tanstack/react-virtual"
import Fuse, { type IFuseOptions } from "fuse.js"
import { CSSProperties, forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { getColorPickerCursor } from "../hooks"
import type { LibrariesFeature, RGB, Style, Variable } from "../types"
import { VirtualizedGridRow } from "./components/virtualized-grid-row"
import { VirtualizedHeader } from "./components/virtualized-header"
import { useLibraryCategories } from "./hooks/use-category-options"
import { LibrariesHeader } from "./libraries-header"
import { LibraryItem } from "./library-item/library-item"
import type { LibrariesDisplayType, LibrariesType } from "../types"

type VirtualizedItem =
  | { headerType: "category" | "subcategory"; isFirst?: boolean; title: string; type: "header" }
  | { index: number; item: Variable | Style; itemType: LibrariesType; type: "item" }

// 数据源相关的 props
interface LibrariesDataProps {
  features?: LibrariesFeature
  styles?: Style[]
  variables?: Variable[]
}

// 分类相关的 props
interface CategoryProps {
  category?: string
  onCategoryChange?: (category: string) => void
}

// 显示类型相关的 props
interface DisplayProps {
  displayType?: LibrariesDisplayType
  onDisplayTypeChange?: (displayType: LibrariesDisplayType) => void
}

// 选择和变更回调相关的 props
interface SelectionProps {
  /** 重复项的索引，用于标记重复的颜色 */
  duplicateIndex?: number | null
  /** 当选择库中的项目时的回调 */
  onLibraryChange?: (value: { item: Variable | Style; type: LibrariesType }) => void
  /** 当色板颜色改变时的回调 */
  onSwatchChange?: (value: { alpha: number; color: RGB }) => void
  /** 外部选中的项目，用于定位和高亮显示 */
  selectedItem?: { item: Variable | Style; type: LibrariesType } | null
}

// 组件基础 props
interface BaseProps {
  className?: string
  /** 头部右侧的元素 */
  headerActionElement?: React.ReactNode
}

// 合并所有 props
export interface LibrariesProps
  extends LibrariesDataProps, CategoryProps, DisplayProps, SelectionProps, BaseProps {}

// Main component
export const Libraries = forwardRef<HTMLDivElement, LibrariesProps>(function Libraries(props, ref) {
  const {
    // 数据源
    variables = [],
    styles = [],

    features: userFeatures = {},
    // 分类
    category = "all",
    onCategoryChange,

    // 显示类型
    displayType: initialDisplayType = "LIST",
    onDisplayTypeChange,

    // 选择和变更
    duplicateIndex,
    onSwatchChange,
    onLibraryChange,
    selectedItem,

    // 基础属性
    className,
    headerActionElement,
  } = props

  const features: LibrariesFeature = {
    containerWidth: 240,
    variables: true,
    styles: true,
    ...userFeatures,
  }

  // 创建本地状态
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDisplayType, setCurrentDisplayType] =
    useState<LibrariesDisplayType>(initialDisplayType)

  // 计算分类选项
  const categoryOptions = useLibraryCategories({
    variables,
    styles,
  })

  // 计算过滤后的项目
  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      if (category === "all") {
        return { variables, styles }
      }
      return {
        variables: variables.filter((v: Variable) => {
          const [cat] = v.masterId.split("/")
          return cat === category
        }),
        styles: styles.filter((s: Style) => {
          const [cat] = s.fileId.split("/")
          return cat === category
        }),
      }
    }

    const fuseInstance = new Fuse([...variables, ...styles], {
      keys: ["name", "value", "masterId", "fileId", "fills.color"],
      threshold: 0.3,
      ignoreLocation: true,
    } as IFuseOptions<Variable | Style>)

    const searchResults = fuseInstance.search(searchTerm)
    const searchedItems = searchResults.map((result) => result.item)
    const filteredVariables = searchedItems.filter((item): item is Variable => "masterId" in item)
    const filteredStyles = searchedItems.filter((item): item is Style => "fileId" in item)

    if (category === "all") {
      return { variables: filteredVariables, styles: filteredStyles }
    }

    return {
      variables: filteredVariables.filter((v) => {
        const [cat] = v.masterId.split("/")
        return cat === category
      }),
      styles: filteredStyles.filter((s) => {
        const [cat] = s.fileId.split("/")
        return cat === category
      }),
    }
  }, [category, searchTerm, variables, styles])

  // 计算虚拟化项目
  const virtualizedItems = useMemo(() => {
    const { variables, styles } = filteredItems
    const items: VirtualizedItem[] = []

    // LIST 和 LARGE_GRID 模式的处理
    let isFirstCategory = true

    // 处理变量
    if (features.variables && variables.length > 0) {
      const variablesByCategory = new Map<string, Map<string, Variable[]>>()
      variables.forEach((variable) => {
        const [category, subcategory] = variable.masterId.split("/")
        if (!variablesByCategory.has(category)) {
          variablesByCategory.set(category, new Map())
        }
        const subgroup = variablesByCategory.get(category)!
        if (!subgroup.has(subcategory)) {
          subgroup.set(subcategory, [])
        }
        subgroup.get(subcategory)!.push(variable)
      })

      variablesByCategory.forEach((subcategories, categoryName) => {
        // 只在 all 模式下显示分类 header
        if (category === "all") {
          items.push({
            type: "header",
            title: categoryName,
            headerType: "category",
            isFirst: isFirstCategory,
          })
          isFirstCategory = false
        }

        // 只处理 all 模式下的所有分类，或者匹配当前选中分类的项目
        if (category === "all" || categoryName === category) {
          subcategories.forEach((variables, subcategory) => {
            if (subcategory) {
              items.push({
                type: "header",
                title: subcategory,
                headerType: "subcategory",
              })
            }

            variables.forEach((variable, index) => {
              items.push({
                type: "item",
                item: variable,
                itemType: "VARIABLE",
                index,
              })
            })
          })
        }
      })
    }

    // 处理样式
    if (features.styles && styles.length > 0) {
      const stylesByCategory = new Map<string, Map<string, Style[]>>()
      styles.forEach((style) => {
        const [category, subcategory] = style.fileId.split("/")
        if (!stylesByCategory.has(category)) {
          stylesByCategory.set(category, new Map())
        }
        const subgroup = stylesByCategory.get(category)!
        if (!subgroup.has(subcategory)) {
          subgroup.set(subcategory, [])
        }
        subgroup.get(subcategory)!.push(style)
      })

      stylesByCategory.forEach((subcategories, categoryName) => {
        // 只在 all 模式下显示分类 header
        if (category === "all") {
          items.push({
            type: "header",
            title: categoryName,
            headerType: "category",
            isFirst: isFirstCategory,
          })
          isFirstCategory = false
        }

        // 只处理 all 模式下的所有分类，或者匹配当前选中分类的项目
        if (category === "all" || categoryName === category) {
          subcategories.forEach((styles, subcategory) => {
            if (subcategory) {
              items.push({
                type: "header",
                title: subcategory,
                headerType: "subcategory",
              })
            }

            styles.forEach((style, index) => {
              items.push({
                type: "item",
                item: style,
                itemType: "STYLE",
                index,
              })
            })
          })
        }
      })
    }

    return items
  }, [filteredItems, features.variables, features.styles, category])

  // 计算网格项目
  const gridItems = useMemo(() => {
    const items = virtualizedItems
    const result: VirtualizedItem[][] = []
    let currentRow: VirtualizedItem[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type === "header") {
        if (currentRow.length > 0) {
          result.push(currentRow)
          currentRow = []
        }
        result.push([item])
      } else if (item.type === "item") {
        currentRow.push(item)
        if (currentRow.length === 6) {
          result.push(currentRow)
          currentRow = []
        }
      }
    }

    if (currentRow.length > 0) {
      result.push(currentRow)
    }

    return result
  }, [virtualizedItems])

  // 记录上一次内部选择的项目
  const lastInternalSelectedRef = useRef<{
    displayType: LibrariesDisplayType
    item: Variable | Style
    type: LibrariesType
  } | null>(null)

  // 处理内部选择
  const handleInternalSelect = (item: { item: Variable | Style; type: LibrariesType }) => {
    lastInternalSelectedRef.current = {
      ...item,
      displayType: currentDisplayType,
    }
    onLibraryChange?.(item)
  }

  // 监听外部选中项变化，只在外部选择时滚动到对应位置
  useEffect(() => {
    if (!selectedItem || !parentRef.current) return

    // 如果是内部选择且显示类型相同，不触发滚动
    if (
      lastInternalSelectedRef.current?.type === selectedItem.type &&
      lastInternalSelectedRef.current?.item.id === selectedItem.item.id &&
      lastInternalSelectedRef.current?.displayType === currentDisplayType
    ) {
      return
    }

    const items = virtualizedItems
    const itemIndex = items.findIndex(
      (item) =>
        item.type === "item" &&
        item.itemType === selectedItem.type &&
        item.item.id === selectedItem.item.id,
    )

    requestAnimationFrame(() => {
      if (itemIndex !== -1) {
        if (currentDisplayType === "LIST") {
          listVirtualizer.scrollToIndex(itemIndex, { align: "center" })
        } else {
          // 对于网格视图，需要计算行索引
          const rowSize = currentDisplayType === "LARGE_GRID" ? 6 : 6
          const displayType = currentDisplayType

          // 在 LARGE_GRID 模式下，需要考虑 header 的影响
          if (displayType === "LARGE_GRID") {
            const gridRows = gridItems
            let targetRowIndex = -1

            // 找到目标项所在的行索引
            for (let i = 0; i < gridRows.length; i++) {
              const row = gridRows[i]
              const foundItem = row.find(
                (item) =>
                  item.type === "item" &&
                  item.itemType === selectedItem.type &&
                  item.item.id === selectedItem.item.id,
              )
              if (foundItem) {
                targetRowIndex = i
                break
              }
            }

            if (targetRowIndex !== -1) {
              rowVirtualizer.scrollToIndex(targetRowIndex, { align: "center" })
            }
          } else {
            // LARGE_GRID 模式保持原有逻辑
            const rowIndex = Math.floor(itemIndex / rowSize)
            rowVirtualizer.scrollToIndex(rowIndex, { align: "center" })
          }
        }
      }
    })
  }, [selectedItem, currentDisplayType])

  // 监听分类变化，重置滚动位置
  useEffect(() => {
    const scrollElement = parentRef.current
    if (scrollElement) {
      scrollElement.scrollTop = 0
    }
  }, [category])

  const allowDisplayTypeSwitch = useMemo(() => {
    return variables?.some((v) => v.type === "color") || styles?.some((s) => s.type === "PAINT")
  }, [variables, styles])

  // 监听显示类型变化并通知外部
  useEffect(() => {
    if (allowDisplayTypeSwitch && onDisplayTypeChange) {
      onDisplayTypeChange(currentDisplayType)
    }
  }, [currentDisplayType, allowDisplayTypeSwitch, onDisplayTypeChange])

  // 监听外部显示类型变化
  useEffect(() => {
    if (allowDisplayTypeSwitch && initialDisplayType !== currentDisplayType) {
      setCurrentDisplayType(initialDisplayType)
    }
  }, [initialDisplayType, allowDisplayTypeSwitch])

  const inputRef = useRef<HTMLInputElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  // 使用 useMemo 计算虚拟列表项目数量
  const virtualItemsCount = useMemo(() => {
    return virtualizedItems.length
  }, [virtualizedItems, category, searchTerm])

  const gridItemsCount = useMemo(() => {
    return gridItems.length
  }, [gridItems, category, searchTerm])

  const listVirtualizer = useVirtualizer({
    count: virtualItemsCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = virtualizedItems[index]
      if (item.type === "header") {
        return item.headerType === "category" && !item.isFirst ? 40 : 32
      }
      return 32
    },
    overscan: 5,
    measureElement: (element) => {
      return element?.getBoundingClientRect().height ?? 32
    },
  })

  const rowVirtualizer = useVirtualizer({
    count: gridItemsCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = gridItems[index]
      const firstItem = row[0]
      if (firstItem.type === "header") {
        return firstItem.headerType === "category" && !firstItem.isFirst ? 48 : 32
      }
      return 36
    },
    overscan: 5,
    measureElement: (element) => {
      return element?.getBoundingClientRect().height ?? 32
    },
  })

  // 当数据源变化时重新计算
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (listVirtualizer && rowVirtualizer) {
        listVirtualizer.measure()
        rowVirtualizer.measure()
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [
    listVirtualizer,
    rowVirtualizer,
    virtualItemsCount,
    gridItemsCount,
    category,
    searchTerm,
    currentDisplayType,
  ])

  // 修改 VirtualizedGridRow 和 IfColorLibrarieItem 的渲染逻辑，添加选中状态
  const isItemSelected = (item: Variable | Style, type: LibrariesType) => {
    if (!selectedItem) return false
    return selectedItem.type === type && selectedItem.item.id === item.id
  }

  const cursor = getColorPickerCursor()

  const style = useMemo(() => {
    // 获取实测高度，如果尚未测量（初始渲染时），则使用估算高度
    const measuredListHeight = listVirtualizer.getTotalSize()
    const measuredRowHeight = rowVirtualizer.getTotalSize()

    // 基于项目数量的估算高度
    const estimatedListHeight = virtualItemsCount * 32
    const estimatedRowHeight = gridItemsCount * 36

    return {
      "--color-picker-cursor":
        currentDisplayType === "LARGE_GRID" ? `url('${cursor}') 8 24, auto` : undefined,
      "--height": tcx(
        currentDisplayType === "LIST" && (measuredListHeight || estimatedListHeight) + 32 + "px",
        currentDisplayType === "LARGE_GRID" &&
          (measuredRowHeight || estimatedRowHeight) + 32 + "px",
      ),
      "--width": (features?.containerWidth ?? 240) + "px",
    }
  }, [
    currentDisplayType,
    cursor,
    features?.containerWidth,
    listVirtualizer,
    rowVirtualizer,
    virtualItemsCount,
    gridItemsCount,
  ])

  return (
    <>
      <LibrariesHeader
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        displayType={currentDisplayType}
        onDisplayTypeChange={setCurrentDisplayType}
        inputRef={inputRef}
        categoryOptions={categoryOptions}
        value={category}
        onChange={onCategoryChange}
        allowDisplayTypeSwitch={allowDisplayTypeSwitch}
        actionElement={headerActionElement}
      />

      <ScrollArea
        ref={ref}
        className={tcx("flex h-96 flex-col", className)}
        style={style as CSSProperties}
      >
        <ScrollArea.Viewport
          ref={parentRef}
          className="relative flex h-full w-(--width) flex-col"
        >
          <ScrollArea.Content className="h-(--height) flex-none">
            {currentDisplayType === "LIST"
              ? listVirtualizer.getVirtualItems().map((virtualRow) => {
                  const item = virtualizedItems[virtualRow.index]

                  if (item.type === "header") {
                    return (
                      <VirtualizedHeader
                        key={`header-${virtualRow.index}`}
                        title={item.title}
                        size={virtualRow.size}
                        start={virtualRow.start}
                        headerType={item.headerType}
                        isFirst={item.isFirst}
                      />
                    )
                  }

                  return (
                    <LibraryItem
                      key={item.item.id || `item-${item.itemType}-${item.index}`}
                      data-item-id={item.item.id}
                      item={item.item}
                      libraryType={item.itemType}
                      isSelected={isItemSelected(item.item, item.itemType)}
                      isDuplicate={duplicateIndex === item.index}
                      onSwatchChange={onSwatchChange}
                      onLibraryChange={handleInternalSelect}
                      displayType={currentDisplayType}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start + 16}px)`,
                      }}
                    />
                  )
                })
              : rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = gridItems[virtualRow.index]
                  const isHeader = row[0].type === "header"

                  if (isHeader) {
                    const headerItem = row[0] as {
                      headerType: "category" | "subcategory"
                      isFirst?: boolean
                      title: string
                      type: "header"
                    }
                    return (
                      <VirtualizedHeader
                        key={`header-${virtualRow.index}`}
                        title={headerItem.title}
                        size={virtualRow.size}
                        start={virtualRow.start}
                        headerType={headerItem.headerType}
                        isFirst={headerItem.isFirst}
                      />
                    )
                  }

                  return (
                    <VirtualizedGridRow
                      key={`row-${virtualRow.index}`}
                      row={row}
                      size={virtualRow.size}
                      start={virtualRow.start}
                      duplicateIndex={duplicateIndex}
                      onSwatchChange={onSwatchChange}
                      onLibraryChange={handleInternalSelect}
                      displayType={currentDisplayType}
                      offset={16}
                      selectedItem={selectedItem}
                    />
                  )
                })}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    </>
  )
})

Libraries.displayName = "Libraries"
