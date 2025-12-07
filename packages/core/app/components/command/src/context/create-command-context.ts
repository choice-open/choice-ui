import React from "react"
import { commandScore } from "../command-score"
import type { CommandProps, Context, State, Store } from "../types"

interface CreateCommandContextOptions {
  allGroups: React.MutableRefObject<Map<string, Set<string>>>
  allItems: React.MutableRefObject<Set<string>>
  filterItems: () => void
  ids: React.MutableRefObject<Map<string, { keywords?: string[]; value: string }>>
  inputId: string
  label?: string
  labelId: string
  listId: string
  listInnerRef: React.MutableRefObject<HTMLDivElement | null>
  propsRef: React.MutableRefObject<CommandProps>
  schedule: (id: string | number, cb: () => void) => void
  selectFirstItem: () => void
  size?: "default" | "large"
  sort: () => void
  state: React.MutableRefObject<State>
  store: Store
  variant?: "default" | "dark"
}

export function createCommandContext(options: CreateCommandContextOptions): Context {
  const {
    allGroups,
    allItems,
    filterItems,
    ids,
    inputId,
    label,
    labelId,
    listId,
    listInnerRef,
    propsRef,
    schedule,
    selectFirstItem,
    size,
    sort,
    state,
    store,
    variant,
  } = options

  function score(value: string, keywords?: string[]) {
    const filter =
      propsRef.current?.filter ??
      ((value: string, search: string, keywords?: string[]) =>
        commandScore(value, search, keywords))
    return value ? filter(value, state.current.search, keywords) : 0
  }

  return {
    // Keep id → {value, keywords} mapping up-to-date
    value: (id, value, keywords) => {
      if (value !== ids.current.get(id)?.value) {
        ids.current.set(id, { value: value || "", keywords })
        state.current.filtered.items.set(id, score(value || "", keywords))
        schedule(2, () => {
          sort()
          store.emit()
        })
      }
    },
    // Track item lifecycle (mount, unmount)
    item: (id, groupId) => {
      allItems.current.add(id)

      // Track this item within the group
      if (groupId) {
        if (!allGroups.current.has(groupId)) {
          allGroups.current.set(groupId, new Set([id]))
        } else {
          allGroups.current.get(groupId)?.add(id)
        }
      }

      // Batch this, multiple items can mount in one pass
      // and we should not be filtering/sorting/emitting each time
      schedule(3, () => {
        filterItems()
        sort()

        // Could be initial mount, select the first item if none already selected
        if (!state.current.value) {
          selectFirstItem()
        }

        store.emit()
      })

      return () => {
        ids.current.delete(id)
        allItems.current.delete(id)
        state.current.filtered.items.delete(id)

        // Batch this, multiple items could be removed in one pass
        schedule(4, () => {
          filterItems()

          // The item removed have been the selected one,
          // so selection should be moved to the first
          const ITEM_SELECTOR = `[role="option"]`
          const selectedItem = listInnerRef.current?.querySelector(
            `${ITEM_SELECTOR}[aria-selected="true"]`,
          )
          if (selectedItem?.getAttribute("id") === id) selectFirstItem()

          store.emit()
        })
      }
    },
    // Track group lifecycle (mount, unmount)
    group: (id) => {
      if (!allGroups.current.has(id)) {
        allGroups.current.set(id, new Set())
      }

      return () => {
        ids.current.delete(id)
        allGroups.current.delete(id)
      }
    },
    filter: () => {
      return propsRef.current.shouldFilter !== false
    },
    label: label || propsRef.current["aria-label"],
    getDisablePointerSelection: () => {
      return propsRef.current.disablePointerSelection ?? false
    },
    listId,
    inputId,
    labelId,
    listInnerRef,
    store,
    size,
    variant,
  }
}
