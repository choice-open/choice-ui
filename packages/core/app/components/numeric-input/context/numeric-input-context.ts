import { createContext, useContext } from "react"
import { PressMoveProps } from "~/hooks"
import { NumericInputValue, NumericChangeDetail } from "../types"

export interface NumericInputContextValue {
  decimal?: number
  defaultValue?: NumericInputValue
  disabled?: boolean
  expression?: string
  focused?: boolean
  handlerPressed?: boolean
  handlerProps?: Record<string, unknown>
  max?: number
  min?: number
  onChange?: (value: NumericInputValue, detail: NumericChangeDetail) => void
  onEmpty?: () => void
  onIsEditingChange?: (isEditing: boolean) => void
  onPressEnd?: PressMoveProps["onPressEnd"]
  onPressStart?: PressMoveProps["onPressStart"]
  readOnly?: boolean
  selected?: boolean
  shiftStep?: number
  step?: number
  value?: NumericInputValue
  variant?: "default" | "light" | "dark" | "reset"
}

export const NumericInputContext = createContext<NumericInputContextValue | undefined>(undefined)

export function useNumericInputContext(): NumericInputContextValue {
  const context = useContext(NumericInputContext)

  if (!context) {
    throw new Error("useNumericInputContext must be used within a NumericInput component")
  }

  return context
}
