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
 * 处理数值输入和转换的钩子
 * @param props 数值处理配置
 * @returns 处理后的值和表达式引用
 */
export function useNumericValueProcessing<T extends NumericInputValue>({
  value,
  defaultValue,
  expression,
  min,
  max,
  decimal,
}: UseNumericValueProcessingProps<T>) {
  // 保存当前表达式的引用，避免不必要的依赖
  const expressionRef = useRef(expression)

  useEffect(() => {
    expressionRef.current = expression
  }, [expression])

  // 处理默认值（只计算一次）
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

  // 处理当前值
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
