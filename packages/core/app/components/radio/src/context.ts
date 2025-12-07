import { createContext, useContext } from "react"

// Radio 组件的 Context
export interface RadioContextType {
  descriptionId: string
  disabled?: boolean
  id: string
}

export const RadioContext = createContext<RadioContextType | null>(null)

export function useRadioContext() {
  const context = useContext(RadioContext)
  if (!context) {
    throw new Error("Radio.Label must be used within a Radio component")
  }
  return context
}

// RadioGroup 组件的 Context
export interface RadioGroupContextType {
  disabled?: boolean
  name: string
  onChange: (value: string) => void
  readOnly?: boolean
  value: string
  variant?: "default" | "accent" | "outline"
}

export const RadioGroupContext = createContext<RadioGroupContextType | null>(null)

export function useRadioGroupContext() {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup")
  }
  return context
}
