import { useCallback } from "react"

/**
 * Hook to calculate the step size of numeric input
 * @param shiftPressed Whether Shift key is pressed
 * @param metaPressed Whether Meta/Alt key is pressed
 * @param shiftStep Step size when Shift key is pressed
 * @param step Normal step size
 * @returns Function to calculate step size
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
