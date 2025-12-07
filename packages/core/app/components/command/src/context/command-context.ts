import { createContext } from "react"
import type { Context, Store } from "../types"

export const CommandContext = createContext<Context | undefined>(undefined)
export const StoreContext = createContext<Store | undefined>(undefined)
