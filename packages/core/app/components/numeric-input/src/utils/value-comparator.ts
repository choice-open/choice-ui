import type { NumberResult } from "../types"

/**
 * Compare two numeric arrays whether they are the same
 * @param array1 First array
 * @param array2 Second array
 * @returns Whether they are the same
 */
export function compareNumericArrays(
  array1: number[] | undefined,
  array2: number[] | undefined,
): boolean {
  // If both arrays are empty or undefined, consider them the same
  if (!array1?.length && !array2?.length) return true

  // If only one array is empty, consider them different
  if (!array1?.length || !array2?.length) return false

  // Compare array lengths
  if (array1.length !== array2.length) return false

  // Compare each element
  return array1.every(
    (value, index) => value !== undefined && array2[index] !== undefined && value === array2[index],
  )
}

/**
 * Compare two objects whether they are the same
 * @param object1 First object
 * @param object2 Second object
 * @returns Whether they are the same
 */
export function compareNumericObjects(
  object1: Record<string, number> | undefined,
  object2: Record<string, number> | undefined,
): boolean {
  // If both objects are empty or undefined, consider them the same
  if (!object1 && !object2) return true

  // If only one object is empty, consider them different
  if (!object1 || !object2) return false

  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  // Compare key quantities
  if (keys1.length !== keys2.length) return false

  // Compare each key-value pair
  return keys1.every((key) => object1[key] === object2[key])
}

/**
 * Compare two NumberResult whether they are the same
 * @param result1 First result
 * @param result2 Second result
 * @returns Whether they are the same
 */
export function compareNumberResults(
  result1: NumberResult | undefined,
  result2: NumberResult | undefined,
): boolean {
  // If both results are empty or undefined, consider them the same
  if (!result1 && !result2) return true

  // If only one result is empty, consider them different
  if (!result1 || !result2) return false

  // Compare array part
  const isSameArray = compareNumericArrays(result1.array, result2.array)

  // Compare object part
  const isSameObject = compareNumericObjects(result1.object, result2.object)

  // If array or object is the same, consider them the same
  return isSameArray || isSameObject
}

/**
 * Check whether it is an expression input
 * @param displayValue Display value
 * @param processedValue Processed value
 * @returns Whether it is an expression input
 */
export function isExpressionInput(displayValue: string, processedValue: NumberResult): boolean {
  return displayValue !== processedValue.string
}
