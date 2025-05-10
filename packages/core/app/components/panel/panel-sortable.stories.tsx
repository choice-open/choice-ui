import { AddSmall, DeleteSmall, Grid, Hidden, Styles, Visible } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import { batch, Observable, observable } from "@legendapp/state"
import { observer, use$, useObservable } from "@legendapp/state/react"
import type { Meta, StoryObj } from "@storybook/react"
import "allotment/dist/style.css"
import { nanoid } from "nanoid"
import React, { useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { IconButton, Popover, Scroll, Select, Splitter } from "../../components"
import { tcx } from "../../utils"
import { Panel } from "./panel"

const meta: Meta<typeof Panel> = {
  title: "Layouts/Panel/Sortable",
  component: Panel,
}

export default meta

type Story = StoryObj<typeof Panel>

const AllotmentContainer = ({
  children,
  header,
}: {
  children: React.ReactNode
  header: React.ReactNode
}) => {
  return (
    <Splitter
      defaultSizes={[800, 240]}
      className="absolute! inset-0"
    >
      <Splitter.Pane minSize={320}>
        <div className="bg-secondary-background flex h-screen min-h-0 w-full flex-1 flex-col"></div>
      </Splitter.Pane>

      <Splitter.Pane minSize={240}>
        <Scroll>
          <Scroll.Viewport className="bg-default-background pb-16">
            <div className="flex items-center border-b p-4 text-sm font-medium">{header}</div>

            {children}
          </Scroll.Viewport>
        </Scroll>
      </Splitter.Pane>
    </Splitter>
  )
}

const DATA$ = observable([
  { id: nanoid(), index: 0, visible: true, value: "option-1" },
  { id: nanoid(), index: 1, visible: true, value: "option-2" },
  { id: nanoid(), index: 2, visible: true, value: "option-3" },
])

interface SortablePopoverProps {
  triggerRefs: React.MutableRefObject<Map<string, HTMLFieldSetElement>>
  open$: Observable<string | null>
}

const SortablePopover = observer(function SortablePopover({
  triggerRefs,
  open$,
}: SortablePopoverProps) {
  return (
    <Popover
      triggerRef={{ current: triggerRefs.current.get(open$.get() ?? "") ?? null }}
      open={open$.get() !== null && open$.get() !== "color"}
      onOpenChange={(open) => open$.set(open ? open$.get() : null)}
      placement="left"
      draggable={true}
      autoUpdate={false}
    >
      <Popover.Header title="Popover" />
      <Popover.Content className="max-w-64 p-4">{faker.lorem.paragraph()}</Popover.Content>
    </Popover>
  )
})

const Sortable = observer(function SortablePopover({
  sortableTriggerRefs,
  open$,
  selectedId$,
  handleSelect,
  handleVisible,
  handleRemove,
}: {
  sortableTriggerRefs: React.MutableRefObject<Map<string, HTMLFieldSetElement>>
  open$: Observable<string | null>
  selectedId$: Observable<string | null>
  handleSelect: (id: string | null) => void
  handleVisible: (id: string, visible: boolean) => void
  handleRemove: (id: string) => void
}) {
  const open = use$(open$)
  const selectedId = use$(selectedId$)

  return (
    <Panel.Sortable
      data={DATA$.get()}
      selectedId={selectedId$.get()}
      onDataChange={(data) =>
        DATA$.set(data as { id: string; index: number; visible: boolean; value: string }[])
      }
      onSelectedIdChange={(id) => selectedId$.set(id)}
    >
      {(id, index) => {
        const item = DATA$.peek().find((item) => item.id === id)
        if (!item) {
          return null
        }
        const { visible } = item

        return (
          <Panel.SortableRow
            ref={(el) => {
              if (el) {
                sortableTriggerRefs.current.set(id, el)
              }
            }}
            id={id}
            index={index}
            type="one-icon-one-input-two-icon"
            onClick={(e) => {
              e.stopPropagation()
              handleSelect(id)
            }}
          >
            <IconButton
              active={open === id}
              variant="highlight"
              className={tcx("[grid-area:icon-1]", !visible && "text-secondary-foreground")}
              tooltip={{ content: "Effect drop shadow-sm" }}
              onClick={(e) => {
                e.stopPropagation()
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                selectedId$.set(null)
                if (open !== id) {
                  open$.set(id)
                } else {
                  open$.set(null)
                }
              }}
            >
              <Grid />
            </IconButton>

            <Select
              matchTriggerWidth
              value={item.value}
            >
              <Select.Trigger className="group-data-[selected=true]/sortable-row:border-selected-boundary [grid-area:input]">
                <span className="flex-1 truncate">{item.value}</span>
              </Select.Trigger>

              <Select.Content>
                {[
                  { label: "Option 1", value: "option-1" },
                  { label: "Option 2", value: "option-2" },
                  { label: "Option 3", value: "option-3" },
                  { label: "Option 4", value: "option-4" },
                  { label: "Option 5", value: "option-5" },
                  { label: "Option 6", value: "option-6" },
                  { label: "Option 7", value: "option-7" },
                  { label: "Option 8", value: "option-8" },
                  { label: "Option 9", value: "option-9" },
                ].map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <IconButton
              className="[grid-area:icon-2]"
              tooltip={{ content: "Visible" }}
              onClick={(e) => {
                e.stopPropagation()
                handleVisible(id, !visible)
              }}
            >
              {visible ? <Visible /> : <Hidden />}
            </IconButton>

            <IconButton
              className="[grid-area:icon-3]"
              tooltip={{ content: "Delete" }}
              onClick={(e) => {
                e.stopPropagation()
                handleRemove(id)
              }}
            >
              <DeleteSmall />
            </IconButton>
          </Panel.SortableRow>
        )
      }}
    </Panel.Sortable>
  )
})

/**
 * `PanelSortable` is a panel component that supports drag-and-drop sorting functionality.
 *
 * ### Core Features
 * - Drag-and-drop sorting of list items
 * - Visual drag indicators and feedback
 * - Integrated selection functionality
 *
 * ### Interaction Features
 * - Drag-and-Drop: Vertical sorting via left-side handle
 * - Selection: Click to select/deselect items
 * - Visibility Toggle: Show/hide individual items
 *
 * ### State Management
 * - Maintains order of items during sorting
 * - Tracks selected items for batch operations
 * - Manages visibility state per item
 *
 * ### Best Practices
 * - Use for lists requiring frequent reordering (layers, styles, effects)
 * - Implement selection for batch operations
 * - Maintain consistent item styling and clear visual feedback
 * - Ensure smooth animations for drag operations
 *
 * ```tsx
 * interface SortableItem {
 *   id: string
 *   index: number
 * }
 *
 * interface PanelSortableProps<T extends SortableItem> {
 *   className?: string
 *   data: T[]
 *   onDataChange: (data: T[]) => void
 *   selectedId: string | null
 *   onSelectedIdChange: (id: string | null) => void
 *   children: (id: string, index: number) => React.ReactNode
 * }
 *
 * interface PanelSortableRowProps extends PanelRowProps {
 *   id: string
 *   index: number
 *   children: React.ReactNode
 * }
 * ```
 *
 * ### Example
 *
 * ```tsx
 * <PanelSortable
 *   data={DATA$.get()}
 *   selectedId={selectedId$.get()}
 *   onDataChange={(data) => DATA$.set(data)}
 *   onSelectedIdChange={(id) => selectedId$.set(id)}
 * >
 *   {(id, index) => (
 *     <PanelSortableRow
 *       id={id}
 *       index={index}
 *     >
 *       ...
 *     </PanelSortableRow>
 *   )}
 * </PanelSortable>
 */
export const Basic: Story = {
  render: function BasicStory() {
    const sortableTriggerRefs = useRef<Map<string, HTMLFieldSetElement>>(new Map())
    const open$ = useObservable<string | null>(null)
    const selectedId$ = useObservable<string | null>(null)

    const handleAdd = useEventCallback(() => {
      batch(() => {
        const items = DATA$.peek()
        const newId = nanoid()
        const newItem = {
          id: newId,
          index: 0,
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

        DATA$.set([newItem, ...items])
        DATA$.set(
          DATA$.peek().map((item, index) => ({
            ...item,
            index,
          })),
        )
      })
    })

    const handleRemove = useEventCallback((id: string) => {
      batch(() => {
        const items = DATA$.peek()
        const newItems = items
          .filter((item) => item.id !== id)
          .map((item, idx) => ({
            ...item,
            index: idx,
          }))
        DATA$.set(newItems)
        selectedId$.set(null)
      })
    })

    const handleVisible = useEventCallback((id: string, visible: boolean) => {
      batch(() => {
        const items = [...DATA$.peek()]
        const index = items.findIndex((item) => item.id === id)
        if (index !== -1) {
          items[index] = { ...items[index], visible }
          DATA$.set(items)
          selectedId$.set(null)
        }
      })
    })

    const handleSelect = useEventCallback((id: string | null) => {
      const currentSelectedId = selectedId$.peek()
      selectedId$.set(currentSelectedId === id ? null : id)
    })

    return (
      <>
        <AllotmentContainer
          header={
            <>
              <span className="flex-1">Sortable</span>
              <IconButton
                onClick={handleAdd}
                tooltip={{ content: "Add fill" }}
              >
                <AddSmall />
              </IconButton>
            </>
          }
        >
          <Panel>
            <Panel.Title title="Sortable">
              <IconButton tooltip={{ content: "Styles" }}>
                <Styles />
              </IconButton>
            </Panel.Title>

            <Sortable
              sortableTriggerRefs={sortableTriggerRefs}
              open$={open$}
              selectedId$={selectedId$}
              handleSelect={handleSelect}
              handleVisible={handleVisible}
              handleRemove={handleRemove}
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
