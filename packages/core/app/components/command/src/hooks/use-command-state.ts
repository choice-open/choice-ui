import React from "react"
import { State } from "../types"
import { StoreContext } from "../context"

export const useStore = () => {
  const store = React.useContext(StoreContext)
  if (!store) {
    throw new Error("useStore must be used within a Command component")
  }
  return store
}

/** Run a selector against the store state. */
export function useCommandState<T>(selector: (state: State) => T): T {
  const store = useStore()
  const cb = () => selector(store.snapshot())
  return React.useSyncExternalStore(store.subscribe, cb, cb)
}
