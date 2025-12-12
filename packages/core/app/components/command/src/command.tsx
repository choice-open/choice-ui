import { tcx, useLazyRef } from "@choice-ui/shared"
import React, { forwardRef, useCallback, useId, useMemo, useRef } from "react"
import { useEventCallback, useIsomorphicLayoutEffect } from "usehooks-ts"
import { CommandContext, createCommandContext, StoreContext } from "./context"
import { useAsRef, useScheduleLayoutEffect } from "./hooks"
import { commandTv } from "./tv"
import { CommandFilter, CommandProps, State, Store } from "./types"
import {
  commandScore,
  findNextSibling,
  findPreviousSibling,
  GROUP_HEADING_SELECTOR,
  GROUP_ITEMS_SELECTOR,
  GROUP_SELECTOR,
  ITEM_SELECTOR,
  SELECT_EVENT,
  SlottableWithNestedChildren,
  VALID_ITEM_SELECTOR,
  VALUE_ATTR,
} from "./utils"

export const defaultFilter: CommandFilter = (value, search, keywords) =>
  commandScore(value, search, keywords)

export const Command = forwardRef<HTMLDivElement, CommandProps>((props, forwardedRef) => {
  const state = useLazyRef<State>(() => ({
    /** Value of the search query. */
    search: "",
    /** Currently selected item value. */
    value: props.value ?? props.defaultValue ?? "",
    /** Currently selected item id. */
    selectedItemId: undefined,
    filtered: {
      /** The count of all visible items. */
      count: 0,
      /** Map from visible item id to its search score. */
      items: new Map(),
      /** Set of groups with at least one visible item. */
      groups: new Set(),
    },
  }))
  const allItems = useLazyRef<Set<string>>(() => new Set()) // [...itemIds]
  const allGroups = useLazyRef<Map<string, Set<string>>>(() => new Map()) // groupId → [...itemIds]
  const ids = useLazyRef<Map<string, { keywords?: string[]; value: string }>>(() => new Map()) // id → { value, keywords }
  const listeners = useLazyRef<Set<() => void>>(() => new Set()) // [...rerenders]
  const propsRef = useAsRef(props)
  const {
    label,
    children,
    value,
    onChange: onValueChange,
    filter,
    shouldFilter,
    loop,
    size = "default",
    variant = "default",
    disablePointerSelection = false,
    vimBindings = true,
    className,
    ...etc
  } = props

  const listId = useId()
  const labelId = useId()
  const inputId = useId()

  const listInnerRef = useRef<HTMLDivElement | null>(null)

  const schedule = useScheduleLayoutEffect()

  const tv = commandTv({ variant })

  /** Controlled mode `value` handling. */
  const store: Store = useMemo(() => {
    return {
      subscribe: (cb) => {
        listeners.current.add(cb)
        return () => listeners.current.delete(cb)
      },
      snapshot: () => {
        return state.current
      },
      setState: (key, value, opts) => {
        if (Object.is(state.current[key], value)) return
        state.current[key] = value

        if (key === "search") {
          // Filter synchronously before emitting back to children
          filterItems()
          sort()
          schedule(1, selectFirstItem)
        } else if (key === "value") {
          // Force focus input or root so accessibility works
          const activeElement = document.activeElement as HTMLElement
          if (
            activeElement?.hasAttribute("data-command-input") ||
            activeElement?.hasAttribute("data-command-root")
          ) {
            const input = document.getElementById(inputId)
            if (input) input.focus()
            else document.getElementById(listId)?.focus()
          }

          schedule(7, () => {
            state.current.selectedItemId = getSelectedItem()?.id
            store.emit()
          })

          // opts is a boolean referring to whether it should NOT be scrolled into view
          if (!opts) {
            // Scroll the selected item into view
            schedule(5, scrollSelectedIntoView)
          }
          if (propsRef.current?.value !== undefined) {
            // If controlled, just call the callback instead of updating state internally
            const newValue = (value ?? "") as string
            propsRef.current.onChange?.(newValue)
            return
          }
        }

        // Notify subscribers that state has changed
        store.emit()
      },
      emit: () => {
        listeners.current.forEach((l) => l())
      },
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (value !== undefined) {
      const v = value.trim()
      state.current.value = v
      store.emit()
    }
  }, [value])

  useIsomorphicLayoutEffect(() => {
    schedule(6, scrollSelectedIntoView)
  }, [])

  const score = useEventCallback((value: string, keywords?: string[]) => {
    const filter = propsRef.current?.filter ?? defaultFilter
    return value ? filter(value, state.current.search, keywords) : 0
  })

  /** Sorts items by score, and groups by highest item score. */
  const sort = useCallback(() => {
    if (
      !state.current.search ||
      // Explicitly false, because true | undefined is the default
      propsRef.current.shouldFilter === false
    ) {
      return
    }

    const scores = state.current.filtered.items

    // Sort the groups
    const groups: [string, number][] = []
    state.current.filtered.groups.forEach((value) => {
      const items = allGroups.current.get(value)

      // Get the maximum score of the group's items
      let max = 0
      items?.forEach((item) => {
        const score = scores.get(item) ?? 0
        max = Math.max(score, max)
      })

      groups.push([value, max])
    })

    // Sort items within groups to bottom
    // Sort items outside of groups
    // Sort groups to bottom (pushes all non-grouped items to the top)
    const listInsertionElement = listInnerRef.current

    // Sort the items
    getValidItems()
      .sort((a, b) => {
        const valueA = a.getAttribute("id")
        const valueB = b.getAttribute("id")
        return (scores.get(valueB ?? "") ?? 0) - (scores.get(valueA ?? "") ?? 0)
      })
      .forEach((item) => {
        const group = item.closest(GROUP_ITEMS_SELECTOR)

        if (group) {
          const elementToMove =
            item.parentElement === group ? item : item.closest(`${GROUP_ITEMS_SELECTOR} > *`)
          if (elementToMove) group.appendChild(elementToMove)
        } else {
          const elementToMove =
            item.parentElement === listInsertionElement
              ? item
              : item.closest(`${GROUP_ITEMS_SELECTOR} > *`)
          if (elementToMove) listInsertionElement?.appendChild(elementToMove)
        }
      })

    groups
      .sort((a, b) => b[1] - a[1])
      .forEach((group) => {
        const element = listInnerRef.current?.querySelector(
          `${GROUP_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(group[0])}"]`,
        )
        if (element && element.parentElement) {
          element.parentElement.appendChild(element)
        }
      })
  }, [])

  const selectFirstItem = useCallback(() => {
    const item = getValidItems().find((item) => item.getAttribute("aria-disabled") !== "true")
    const value = item?.getAttribute(VALUE_ATTR)
    store.setState("value", value || "")
  }, [])

  /** Filters the current items. */
  const filterItems = useCallback(() => {
    if (
      !state.current.search ||
      // Explicitly false, because true | undefined is the default
      propsRef.current.shouldFilter === false
    ) {
      state.current.filtered.count = allItems.current.size
      // Do nothing, each item will know to show itself because search is empty
      return
    }

    // Reset the groups
    state.current.filtered.groups = new Set()
    let itemCount = 0

    // Check which items should be included
    for (const id of allItems.current) {
      const itemData = ids.current.get(id)
      // Skip items that haven't registered their value yet
      if (!itemData) continue
      const value = itemData.value ?? ""
      const keywords = itemData.keywords ?? []
      const rank = score(value, keywords)
      state.current.filtered.items.set(id, rank)
      if (rank > 0) itemCount++
    }

    // Check which groups have at least 1 item shown
    for (const [groupId, group] of allGroups.current) {
      for (const itemId of group) {
        if ((state.current.filtered.items.get(itemId) ?? 0) > 0) {
          state.current.filtered.groups.add(groupId)
          break
        }
      }
    }

    state.current.filtered.count = itemCount
  }, [])

  const scrollSelectedIntoView = useCallback(() => {
    const item = getSelectedItem()

    if (item) {
      if (item.parentElement?.firstChild === item) {
        // First item in Group, ensure heading is in view
        item
          .closest(GROUP_SELECTOR)
          ?.querySelector(GROUP_HEADING_SELECTOR)
          ?.scrollIntoView({ block: "nearest" })
      }

      // Ensure the item is always in view
      item.scrollIntoView({ block: "nearest" })
    }
  }, [])

  /** Getters */

  const getSelectedItem = useCallback(() => {
    return listInnerRef.current?.querySelector(`${ITEM_SELECTOR}[aria-selected="true"]`)
  }, [])

  function getValidItems(): HTMLElement[] {
    return Array.from(
      listInnerRef.current?.querySelectorAll(VALID_ITEM_SELECTOR) || [],
    ) as HTMLElement[]
  }

  /** Setters */

  const updateSelectedToIndex = useEventCallback((index: number) => {
    const items = getValidItems()
    const item = items[index]
    if (item) store.setState("value", item.getAttribute(VALUE_ATTR) || "")
  })

  const updateSelectedByItem = useEventCallback((change: 1 | -1) => {
    const selected = getSelectedItem()
    const items = getValidItems()
    const index = items.findIndex((item) => item === selected)

    // Get item at this index
    let newSelected = items[index + change]

    if (propsRef.current?.loop) {
      newSelected =
        index + change < 0
          ? items[items.length - 1]
          : index + change === items.length
            ? items[0]
            : items[index + change]
    }

    if (newSelected) store.setState("value", newSelected.getAttribute(VALUE_ATTR) || "")
  })

  const updateSelectedByGroup = useEventCallback((change: 1 | -1) => {
    const selected = getSelectedItem()
    let group = selected?.closest(GROUP_SELECTOR)
    let item: HTMLElement | null = null

    while (group && !item) {
      group =
        change > 0
          ? (findNextSibling(group, GROUP_SELECTOR) as HTMLElement)
          : (findPreviousSibling(group, GROUP_SELECTOR) as HTMLElement)
      item = group?.querySelector(VALID_ITEM_SELECTOR) as HTMLElement
    }

    if (item) {
      store.setState("value", item.getAttribute(VALUE_ATTR) || "")
    } else {
      updateSelectedByItem(change)
    }
  })

  const context = useMemo(
    () =>
      createCommandContext({
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
      }),
    [], // Empty deps array, consistent with original cmdk implementation
  )

  // Store now directly uses the functions in closure, no need for updateHandlers

  const last = () => updateSelectedToIndex(getValidItems().length - 1)

  const next = (e: React.KeyboardEvent) => {
    e.preventDefault()

    if (e.metaKey) {
      // Last item
      last()
    } else if (e.altKey) {
      // Next group
      updateSelectedByGroup(1)
    } else {
      // Next item
      updateSelectedByItem(1)
    }
  }

  const prev = (e: React.KeyboardEvent) => {
    e.preventDefault()

    if (e.metaKey) {
      // First item
      updateSelectedToIndex(0)
    } else if (e.altKey) {
      // Previous group
      updateSelectedByGroup(-1)
    } else {
      // Previous item
      updateSelectedByItem(-1)
    }
  }

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    etc.onKeyDown?.(e)

    // Check if IME composition is finished before triggering key binds
    // This prevents unwanted triggering while user is still inputting text with IME
    // e.keyCode === 229 is for the CJK IME with Legacy Browser [https://w3c.github.io/uievents/#determine-keydown-keyup-keyCode]
    // isComposing is for the CJK IME with Modern Browser [https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/isComposing]
    const isComposing = e.nativeEvent.isComposing || e.keyCode === 229

    if (e.defaultPrevented || isComposing) {
      return
    }

    switch (e.key) {
      case "n":
      case "j": {
        // vim keybind down
        if (vimBindings && e.ctrlKey) {
          next(e)
        }
        break
      }
      case "ArrowDown": {
        next(e)
        break
      }
      case "p":
      case "k": {
        // vim keybind up
        if (vimBindings && e.ctrlKey) {
          prev(e)
        }
        break
      }
      case "ArrowUp": {
        prev(e)
        break
      }
      case "Home": {
        // First item
        e.preventDefault()
        updateSelectedToIndex(0)
        break
      }
      case "End": {
        // Last item
        e.preventDefault()
        last()
        break
      }
      case "Enter": {
        // Trigger item onSelect
        e.preventDefault()
        const item = getSelectedItem()
        if (item) {
          const event = new Event(SELECT_EVENT)
          item.dispatchEvent(event)
        }
      }
    }
  })

  return (
    <div
      ref={forwardedRef}
      tabIndex={-1}
      {...etc}
      className={tcx(tv.root({ className }))}
      data-command-root=""
      onKeyDown={handleKeyDown}
    >
      <label
        htmlFor={context.inputId}
        id={context.labelId}
        className="sr-only"
      >
        {label}
      </label>
      {SlottableWithNestedChildren(props, (child) => (
        <StoreContext.Provider value={store}>
          <CommandContext.Provider value={context}>{child}</CommandContext.Provider>
        </StoreContext.Provider>
      ))}
    </div>
  )
})

Command.displayName = "Command"
