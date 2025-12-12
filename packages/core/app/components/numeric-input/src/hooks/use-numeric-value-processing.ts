import { useEffect, useMemo, useRef } from "react"
import { NumericInputValue } from "../types"
import { dealWithNumericValueCatch } from "../utils"

interface UseNumericValueProcessingProps<T extends NumericInputValue> {
  decimal?: number
  defaultValue?: T
  expression: string
  max?: number
  min?: number
  value?: T
}

/**
 * Hook to handle numeric input and conversion
 * @param props Numeric processing configuration
 * @returns Processed value and expression reference
 */
export function useNumericValueProcessing<T extends NumericInputValue>({
  value,
  defaultValue,
  expression,
  min,
  max,
  decimal,
}: UseNumericValueProcessingProps<T>) {
  // Save current expression reference, avoid unnecessary dependencies
  const expressionRef = useRef(expression)

  useEffect(() => {
    expressionRef.current = expression
  }, [expression])

  // Process default value (only calculate once)
  const defaultValuePre = useMemo(
    () =>
      defaultValue !== undefined && defaultValue !== null && defaultValue !== ""
        ? dealWithNumericValueCatch({
            input: defaultValue,
            pattern: expression,
            min,
            max,
            decimal,
          })
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Process current value
  const valuePre = useMemo(
    () =>
      value !== undefined && value !== null && value !== ""
        ? dealWithNumericValueCatch({
            input: value,
            pattern: expression,
            min,
            max,
            decimal,
          })
        : undefined,
    [value, expression, min, max, decimal],
  )

  return { valuePre, defaultValuePre, expressionRef }
}
