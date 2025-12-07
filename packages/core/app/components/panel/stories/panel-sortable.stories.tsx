import { tcx } from "@choiceform/design-shared"
import { IconButton } from "@choiceform/icon-button"
import { AddSmall, DeleteSmall, EffectDropShadow, Hidden, Visible } from "@choiceform/icons-react"
import { Popover } from "@choiceform/popover"
import { ScrollArea } from "@choiceform/scroll-area"
import { Select } from "@choiceform/select"
import { Splitter } from "@choiceform/splitter"
import { faker } from "@faker-js/faker"
import { batch, Observable, observable } from "@legendapp/state"
import { observer, use$, useObservable } from "@legendapp/state/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { IndexGenerator } from "fractional-indexing-jittered"
import { nanoid } from "nanoid"
import React, { useEffect, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { useSortableRowItem } from "../src/context"
import { Panel } from "../src/panel"

const meta: Meta<typeof Panel> = {
  title: "Layouts/Panel/Sortable",
  component: Panel,
}

export default meta

type Story = StoryObj<typeof Panel>

const AllotmentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Splitter
      defaultSizes={[800, 240]}
      className="absolute! inset-0"
    >
      <Splitter.Pane minSize={320}>
        <div className="bg-secondary-background flex h-screen min-h-0 w-full flex-1 flex-col"></div>
      </Splitter.Pane>

      <Splitter.Pane minSize={240}>
        <ScrollArea>
          <ScrollArea.Viewport className="bg-default-background h-full pb-16">
            <ScrollArea.Content className="h-full">{children}</ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </Splitter.Pane>
    </Splitter>
  )
}

function sortByIndex<T extends { indexKey: string }>(a: T, b: T) {
  if (a.indexKey < b.indexKey) {
    return -1
  } else if (a.indexKey > b.indexKey) {
    return 1
  }
  return 0
}

// 初始化fractional indexing器作为全局实例
const globalIndexGenerator = new IndexGenerator([])

// 维护一个全局的键列表
const indexKeysList: string[] = []

// 添加新键并更新生成器的辅助函数
function updateKeysList(newKey: string) {
  indexKeysList.push(newKey)
  globalIndexGenerator.updateList(indexKeysList)
}

// 定义排序数据类型（Panel.Sortable负责处理）
interface SortableItem {
  id: string
  indexKey: string
}

// 定义完整的项目数据类型（包含所有属性）
interface ItemData {
  value: string
  visible: boolean
}

// 生成初始排序数据
const initialSortData: SortableItem[] = []
// 生成初始项目数据（使用id作为键）
const initialItemsData: Record<string, ItemData> = {}

// 生成 Faker 初始数据
for (let i = 0; i < 10; i++) {
  // 创建唯一ID
  const id = nanoid()

  // 生成排序键
  const indexKey = i === 0 ? globalIndexGenerator.keyStart() : globalIndexGenerator.keyEnd()

  // 更新键列表和生成器
  updateKeysList(indexKey)

  // 添加到排序数据
  initialSortData.push({
    id,
    indexKey,
  })

  // 添加到项目数据
  initialItemsData[id] = {
    visible: true,
    value: `Option ${i + 1}`,
  }
}

// 创建两个独立的可观察数据源
const SORT_DATA$ = observable(initialSortData)
const ITEMS_DATA$ = observable(initialItemsData)

interface SortablePopoverProps {
  open$: Observable<string | null>
  triggerRefs: React.MutableRefObject<Map<string, HTMLFieldSetElement>>
}

const SortablePopover = observer(function SortablePopover({
  triggerRefs,
  open$,
}: SortablePopoverProps) {
  // Create a stable ref object that we can update
  const currentTriggerRef = useRef<HTMLFieldSetElement | null>(null)

  // Update the ref's current value when the open state changes
  const openId = open$.get()
  useEffect(() => {
    if (openId && openId !== "color") {
      currentTriggerRef.current = triggerRefs.current.get(openId) ?? null
    } else {
      currentTriggerRef.current = null
    }
  }, [openId, triggerRefs])

  return (
    <Popover
      triggerRef={currentTriggerRef}
      open={open$.get() !== null && open$.get() !== "color"}
      onOpenChange={(open) => open$.set(open ? open$.get() : null)}
      placement="left"
      draggable={true}
      autoUpdate={true} // Enable autoUpdate for better positioning
    >
      <Popover.Header title="Popover" />
      <Popover.Content className="max-w-64 p-4">{faker.lorem.paragraph()}</Popover.Content>
    </Popover>
  )
})

const SortableRowContent = observer(function SortableRowContentInner({
  sortableTriggerRefs,
  open$,
  selectedId$,
  onSelect,
  onVisible,
  onRemove,
}: {
  onRemove: (id: string) => void
  onSelect: (id: string | null) => void
  onVisible: (id: string, visible: boolean) => void
  open$: Observable<string | null>
  selectedId$: Observable<string | null>
  sortableTriggerRefs: React.MutableRefObject<Map<string, HTMLFieldSetElement>>
}) {
  const item = useSortableRowItem<{ id: string; indexKey: string }>()
  const itemsData = use$(ITEMS_DATA$)

  // 获取当前行的具体显示数据
  const currentItemDisplayData = itemsData[item.id]
  const visible = currentItemDisplayData ? currentItemDisplayData.visible : true
  const valueToDisplay = currentItemDisplayData ? currentItemDisplayData.value : item.indexKey

  return (
    <Panel.SortableRow
      ref={(el) => {
        if (el) {
          sortableTriggerRefs.current.set(item.id, el)
        }
      }}
      // id 和 indexKey 不再通过 props 传递
      type="one-icon-one-input-two-icon"
      onClick={(e) => {
        e.stopPropagation()
        onSelect(item.id)
      }}
    >
      <IconButton
        active={open$.get() === item.id}
        variant="highlight"
        className={tcx("[grid-area:icon-1]", !visible && "text-disabled-foreground")}
        tooltip={{ content: "Effect drop shadow-sm" }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          selectedId$.set(null)
          if (open$.get() !== item.id) {
            React.startTransition(() => {
              open$.set(item.id)
            })
          } else {
            open$.set(null)
          }
        }}
      >
        <EffectDropShadow />
      </IconButton>

      {/* <NumericInput className="[grid-area:input]" /> */}

      <Select
        matchTriggerWidth
        value={item.indexKey}
      >
        <Select.Trigger
          className={tcx(
            !visible && "text-disabled-foreground",
            "group-data-[selected=true]/sortable-row:border-selected-boundary [grid-area:input]",
          )}
        >
          <span className="flex-1 truncate">{valueToDisplay}</span>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value={item.indexKey}>{valueToDisplay}</Select.Item>
        </Select.Content>
      </Select>

      <IconButton
        className="[grid-area:icon-2]"
        tooltip={{ content: "Visible" }}
        onClick={(e) => {
          e.stopPropagation()
          onVisible(item.id, !visible)
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        {visible ? <Visible /> : <Hidden />}
      </IconButton>

      <IconButton
        className="[grid-area:icon-3]"
        tooltip={{ content: "Delete" }}
        onClick={(e) => {
          e.stopPropagation()
          onRemove(item.id)
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <DeleteSmall />
      </IconButton>
    </Panel.SortableRow>
  )
})

const Sortable = observer(function Sortable({
  // Renamed from SortablePopover to Sortable
  sortableTriggerRefs,
  open$,
  selectedId$,
  onSelect,
  onVisible,
  onRemove,
  onDrop,
}: {
  onDrop: (position: "top" | "bottom" | null, id: string, newIndex: number) => void
  onRemove: (id: string) => void
  onSelect: (id: string | null) => void
  onVisible: (id: string, visible: boolean) => void
  open$: Observable<string | null>
  selectedId$: Observable<string | null>
  sortableTriggerRefs: React.MutableRefObject<Map<string, HTMLFieldSetElement>>
}) {
  const sortData = use$(SORT_DATA$)

  return (
    <Panel.Sortable
      data={sortData}
      selectedId={selectedId$.get()}
      onDrop={onDrop}
      onSelectedIdChange={(id) => selectedId$.set(id)}
    >
      <SortableRowContent
        sortableTriggerRefs={sortableTriggerRefs}
        open$={open$}
        selectedId$={selectedId$}
        onSelect={onSelect}
        onVisible={onVisible}
        onRemove={onRemove}
      />
    </Panel.Sortable>
  )
})

export const SingleItem: Story = {
  render: function SingleItemStory() {
    const sortableTriggerRefs = useRef<Map<string, HTMLFieldSetElement>>(new Map())
    const open$ = useObservable<string | null>(null)
    const selectedId$ = useObservable<string | null>(null)

    // 创建只有一个item的独立数据源
    const singleItemId = nanoid()
    const singleItemIndexKey = globalIndexGenerator.keyStart()

    const singleSortData$ = useObservable([
      {
        id: singleItemId,
        indexKey: singleItemIndexKey,
      },
    ])

    const singleItemsData$ = useObservable({
      [singleItemId]: {
        visible: true,
        value: "Single Item",
      },
    })

    const handleAdd = useEventCallback(() => {
      batch(() => {
        const items = singleSortData$.peek()
        const newId = nanoid()

        let newIndexKey
        if (items.length === 0) {
          newIndexKey = globalIndexGenerator.keyStart()
        } else {
          const lastItem = items[items.length - 1]
          newIndexKey = globalIndexGenerator.keyAfter(lastItem.indexKey)
        }

        updateKeysList(newIndexKey)

        const newSortItem = {
          id: newId,
          indexKey: newIndexKey,
        }

        const newItemData = {
          visible: true,
          value: `Item ${items.length + 1}`,
        }

        singleSortData$.set([...items, newSortItem])

        singleItemsData$.set({
          ...singleItemsData$.peek(),
          [newId]: newItemData,
        })
      })
    })

    const handleRemove = useEventCallback((id: string) => {
      batch(() => {
        const sortItems = singleSortData$.peek()
        const itemToRemove = sortItems.find((item) => item.id === id)
        if (!itemToRemove) return

        const newSortItems = sortItems.filter((item) => item.id !== id)
        singleSortData$.set(newSortItems)

        const itemsData = singleItemsData$.peek()
        const newItemsData = { ...itemsData }
        delete newItemsData[id]
        singleItemsData$.set(newItemsData)

        selectedId$.set(null)
      })
    })

    const handleVisible = useEventCallback((id: string, visible: boolean) => {
      batch(() => {
        const itemsData = singleItemsData$.peek()

        if (itemsData[id]) {
          singleItemsData$.set({
            ...itemsData,
            [id]: {
              ...itemsData[id],
              visible,
            },
          })

          selectedId$.set(null)
        }
      })
    })

    const handleSelect = useEventCallback((id: string | null) => {
      selectedId$.set(id)
    })

    const handleDrop = useEventCallback(
      (position: "top" | "bottom" | null, id: string, newIndex: number) => {
        // 单个item场景下的拖拽处理（虽然不会触发，但保持接口一致）
        console.log("Drop handler called for single item scenario")
      },
    )

    // 键盘删除
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const id = selectedId$.get()
        if ((e.key === "Delete" || e.key === "Backspace") && id) {
          handleRemove(id)
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [handleRemove, selectedId$])

    const SingleItemSortableRowContent = observer(function SingleItemSortableRowContent() {
      const item = useSortableRowItem<{ id: string; indexKey: string }>()
      const itemsData = use$(singleItemsData$)

      // 获取当前行的具体显示数据
      const currentItemDisplayData = itemsData[item.id]
      const visible = currentItemDisplayData ? currentItemDisplayData.visible : true
      const valueToDisplay = currentItemDisplayData ? currentItemDisplayData.value : item.indexKey

      return (
        <Panel.SortableRow
          ref={(el) => {
            if (el) {
              sortableTriggerRefs.current.set(item.id, el)
            }
          }}
          type="one-icon-one-input-two-icon"
          onClick={(e) => {
            e.stopPropagation()
            handleSelect(item.id)
          }}
        >
          <IconButton
            active={open$.get() === item.id}
            variant="highlight"
            className={tcx("[grid-area:icon-1]", !visible && "text-disabled-foreground")}
            tooltip={{ content: "Effect drop shadow-sm" }}
            onClick={(e) => {
              e.stopPropagation()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              selectedId$.set(null)
              if (open$.get() !== item.id) {
                React.startTransition(() => {
                  open$.set(item.id)
                })
              } else {
                open$.set(null)
              }
            }}
          >
            <EffectDropShadow />
          </IconButton>

          <Select
            matchTriggerWidth
            value={item.indexKey}
          >
            <Select.Trigger
              className={tcx(
                !visible && "text-disabled-foreground",
                "group-data-[selected=true]/sortable-row:border-selected-boundary [grid-area:input]",
              )}
            >
              <span className="flex-1 truncate">{valueToDisplay}</span>
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={item.indexKey}>{valueToDisplay}</Select.Item>
            </Select.Content>
          </Select>

          <IconButton
            className="[grid-area:icon-2]"
            tooltip={{ content: "Visible" }}
            onClick={(e) => {
              e.stopPropagation()
              handleVisible(item.id, !visible)
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            {visible ? <Visible /> : <Hidden />}
          </IconButton>

          <IconButton
            className="[grid-area:icon-3]"
            tooltip={{ content: "Delete" }}
            onClick={(e) => {
              e.stopPropagation()
              handleRemove(item.id)
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <DeleteSmall />
          </IconButton>
        </Panel.SortableRow>
      )
    })

    const SingleItemSortable = observer(function SingleItemSortable() {
      const sortData = use$(singleSortData$)

      return (
        <Panel.Sortable
          data={sortData}
          selectedId={selectedId$.get()}
          onDrop={handleDrop}
          onSelectedIdChange={(id) => selectedId$.set(id)}
        >
          <SingleItemSortableRowContent />
        </Panel.Sortable>
      )
    })

    return (
      <>
        <AllotmentContainer>
          <Panel>
            <Panel.Title title="Single Item (No Drag Handle)">
              <IconButton
                onClick={handleAdd}
                tooltip={{ content: "Add item" }}
              >
                <AddSmall />
              </IconButton>
            </Panel.Title>

            <SingleItemSortable />
          </Panel>
        </AllotmentContainer>

        <SortablePopover
          triggerRefs={sortableTriggerRefs}
          open$={open$}
        />
      </>
    )
  },
}

export const Basic: Story = {
  render: function BasicStory() {
    const sortableTriggerRefs = useRef<Map<string, HTMLFieldSetElement>>(new Map())
    const open$ = useObservable<string | null>(null)
    const selectedId$ = useObservable<string | null>(null)

    const handleAdd = useEventCallback(() => {
      batch(() => {
        const items = SORT_DATA$.peek()
        const newId = nanoid()

        let newIndexKey
        if (items.length === 0) {
          newIndexKey = globalIndexGenerator.keyStart()
        } else {
          const lastItem = items[items.length - 1]
          newIndexKey = globalIndexGenerator.keyAfter(lastItem.indexKey)
        }

        updateKeysList(newIndexKey)

        const newSortItem = {
          id: newId,
          indexKey: newIndexKey,
        }

        const newItemData = {
          visible: true,
          value: faker.helpers.arrayElement([
            "option-1",
            "option-2",
            "option-3",
            "option-4",
            "option-5",
            "option-6",
            "option-7",
            "option-8",
            "option-9",
          ]),
        }

        SORT_DATA$.set([...items, newSortItem])

        ITEMS_DATA$.set({
          ...ITEMS_DATA$.peek(),
          [newId]: newItemData,
        })
      })
    })

    const handleRemove = useEventCallback((id: string) => {
      batch(() => {
        const sortItems = SORT_DATA$.peek()
        const itemToRemove = sortItems.find((item) => item.id === id)
        if (!itemToRemove) return

        const newSortItems = sortItems.filter((item) => item.id !== id)
        SORT_DATA$.set(newSortItems)

        const keyIndex = indexKeysList.indexOf(itemToRemove.indexKey)
        if (keyIndex !== -1) {
          indexKeysList.splice(keyIndex, 1)
          globalIndexGenerator.updateList(indexKeysList)
        }

        const itemsData = ITEMS_DATA$.peek()
        const newItemsData = { ...itemsData }
        delete newItemsData[id]
        ITEMS_DATA$.set(newItemsData)

        selectedId$.set(null)
      })
    })

    const handleVisible = useEventCallback((id: string, visible: boolean) => {
      batch(() => {
        const itemsData = ITEMS_DATA$.peek()

        if (itemsData[id]) {
          ITEMS_DATA$.set({
            ...itemsData,
            [id]: {
              ...itemsData[id],
              visible,
            },
          })

          selectedId$.set(null)
        }
      })
    })

    const handleSelect = useEventCallback((id: string | null) => {
      selectedId$.set(id)
    })

    const handleDrop = useEventCallback(
      (position: "top" | "bottom" | null, id: string, newIndex: number) => {
        batch(() => {
          const sortItems = SORT_DATA$.peek()
          const indexList = sortItems.map((item) => item.indexKey)

          const itemToMove = sortItems.find((item) => item.id === id)
          if (!itemToMove) return

          // 更新索引键列表
          globalIndexGenerator.updateList(indexList)

          let isStart = false
          let isEnd = false

          if (newIndex === 0 && position === "top") {
            isStart = true
          }

          if (newIndex === sortItems.length - 1 && position === "bottom") {
            isEnd = true
          }

          let newIndexKey: string | undefined
          if (isStart) {
            newIndexKey = globalIndexGenerator.keyStart()
          } else if (isEnd) {
            newIndexKey = globalIndexGenerator.keyEnd()
          } else {
            if (position === "top") {
              newIndexKey = globalIndexGenerator.keyBefore(sortItems[newIndex - 1].indexKey)
            } else {
              newIndexKey = globalIndexGenerator.keyAfter(sortItems[newIndex].indexKey)
            }
          }

          if (!newIndexKey) return

          // 更新排序数据
          const newSortItems = sortItems.map((item) =>
            item.id === id ? { ...item, indexKey: newIndexKey } : item,
          )

          // 重新排序
          newSortItems.sort((a, b) => sortByIndex(a, b))

          // 更新索引键列表
          SORT_DATA$.set(newSortItems)
        })
      },
    )

    // 键盘删除
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const id = selectedId$.get()
        if ((e.key === "Delete" || e.key === "Backspace") && id) {
          handleRemove(id)
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [handleRemove, selectedId$])

    return (
      <>
        <AllotmentContainer>
          <Panel>
            <Panel.Title title="Sortable">
              <IconButton
                onClick={handleAdd}
                tooltip={{ content: "Add fill" }}
              >
                <AddSmall />
              </IconButton>
            </Panel.Title>

            <Sortable
              sortableTriggerRefs={sortableTriggerRefs}
              open$={open$}
              selectedId$={selectedId$}
              onSelect={handleSelect}
              onVisible={handleVisible}
              onRemove={handleRemove}
              onDrop={handleDrop}
            />
          </Panel>
        </AllotmentContainer>

        <SortablePopover
          triggerRefs={sortableTriggerRefs}
          open$={open$}
        />
      </>
    )
  },
}
