export type NumericInputValue =
  | string
  | number
  | (string | number | undefined)[]
  | Record<string, number>

export type Operation = "+" | "-" | "*" | "/" | "(" | ")"
export type NumberResult = {
  array: number[]
  string: string
  object: Record<string, number>
}

export interface DealWithNumericValueOptions {
  input: NumericInputValue
  pattern: string
  call?: (value: number) => number
  max?: number
  min?: number
  decimal?: number
}
export type NumericChangeDetail = NumberResult
