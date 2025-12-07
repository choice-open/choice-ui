import React from "react"

export type CommandFilter = (value: string, search: string, keywords?: string[]) => number

export interface CommandProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Optional default item value when it is initially rendered.
   */
  defaultValue?: string
  /**
   * Optionally set to `true` to disable selection via pointer events.
   */
  disablePointerSelection?: boolean
  /**
   * Custom filter function for whether each command menu item should matches the given search query.
   * It should return a number between 0 and 1, with 1 being the best match and 0 being hidden entirely.
   * By default, uses the `command-score` library.
   */
  filter?: CommandFilter
  /**
   * Accessible label for this command menu. Not shown visibly.
   */
  label?: string
  /**
   * Optionally set to `true` to turn on looping around when using the arrow keys.
   */
  loop?: boolean
  /**
   * Event handler called when the selected item of the menu changes.
   */
  onChange?: (value: string) => void
  /**
   * Optionally set to `false` to turn off the automatic filtering and sorting.
   * If `false`, you must conditionally render valid items based on the search query yourself.
   */
  shouldFilter?: boolean
  size?: "default" | "large"
  /**
   * Optional controlled state of the selected command menu item.
   */
  value?: string
  variant?: "default" | "dark"
  /**
   * Set to `false` to disable ctrl+n/j/p/k shortcuts. Defaults to `true`.
   */
  vimBindings?: boolean
}

export type Context = {
  filter: () => boolean
  getDisablePointerSelection: () => boolean
  group: (id: string) => () => void
  inputId: string
  item: (id: string, groupId?: string) => () => void
  label?: string
  labelId: string
  // Ids
  listId: string
  // Refs
  listInnerRef: React.MutableRefObject<HTMLDivElement | null>
  size?: "default" | "large"
  store: Store
  value: (id: string, value?: string, keywords?: string[]) => void
  variant?: "default" | "dark"
}

export type State = {
  filtered: { count: number; groups: Set<string>; items: Map<string, number> }
  search: string
  selectedItemId?: string
  value: string
}

export type Store = {
  emit: () => void
  setState: <K extends keyof State>(key: K, value: State[K], opts?: unknown) => void
  snapshot: () => State
  subscribe: (callback: () => void) => () => void
}

export type Group = {
  forceMount?: boolean
  id: string
}
