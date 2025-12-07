import { createContext, useContext } from "react"

export interface CheckboxContextValue {
  descriptionId?: string
  disabled?: boolean
  id: string
  mixed?: boolean
  onChange: (value: boolean) => void
  value?: boolean
  variant?: "default" | "accent" | "outline"
}

export const CheckboxContext = createContext<CheckboxContextValue | null>(null)

export function useCheckboxContext() {
  const context = useContext(CheckboxContext)
  if (!context) {
    throw new Error("Checkbox components must be used within a Checkbox component")
  }
  return context
}
