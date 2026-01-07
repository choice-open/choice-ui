import { RGBA } from "./colors"

export type BaseVariableValue = string | number | boolean | RGBA

export type VariableId = string
export type VariableValue = BaseVariableValue | Record<string, unknown> | Array<BaseVariableValue>
export type VariableType = "color" | "number" | "boolean" | "string" | "enum" | "object" | "array"
export type VariableOption = { id: string; value: string }
export type VariableControlKey =
  | "overflow"
  | "blendingMode"
  | "pointerEvents"
  | "userSelect"
  | "scrollbars"
  | "cursor"

export type Variable = {
  controlKey?: VariableControlKey
  createdAt: number
  description?: string

  id: VariableId
  isComponentVariable?: boolean
  masterId: string

  name: string
  options?: Array<VariableOption>

  referencedConditionIds?: string[]
  referencedNodeIds?: string[]

  referencedVariantIds?: string[]
  type: VariableType

  updatedAt: number | null
  value: VariableValue
}

export type Property = Pick<Variable, "id" | "name" | "type" | "value">
