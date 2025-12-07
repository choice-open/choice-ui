import { useCallback } from "react"

/**
 * 计算数值步进大小的钩子
 * @param shiftPressed Shift键是否按下
 * @param metaPressed Meta/Alt键是否按下
 * @param shiftStep Shift按下时的步进值
 * @param step 正常步进值
 * @returns 计算步进值的函数
 */
export function useStepCalculation(
  shiftPressed: boolean,
  metaPressed: boolean,
  shiftStep: number,
  step: number,
) {
  return useCallback(() => {
    if (shiftPressed) return shiftStep
    if (metaPressed) return 1
    return step
  }, [shiftPressed, metaPressed, shiftStep, step])
}
