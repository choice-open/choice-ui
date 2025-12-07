import type { NumberResult } from "../types"

/**
 * 比较两个数值数组是否相同
 * @param array1 第一个数组
 * @param array2 第二个数组
 * @returns 是否相同
 */
export function compareNumericArrays(
  array1: number[] | undefined,
  array2: number[] | undefined,
): boolean {
  // 如果两个数组都为空或未定义，则认为相同
  if (!array1?.length && !array2?.length) return true

  // 如果只有一个数组为空，则认为不同
  if (!array1?.length || !array2?.length) return false

  // 比较数组长度
  if (array1.length !== array2.length) return false

  // 比较每一个元素
  return array1.every(
    (value, index) => value !== undefined && array2[index] !== undefined && value === array2[index],
  )
}

/**
 * 比较两个对象是否相同
 * @param object1 第一个对象
 * @param object2 第二个对象
 * @returns 是否相同
 */
export function compareNumericObjects(
  object1: Record<string, number> | undefined,
  object2: Record<string, number> | undefined,
): boolean {
  // 如果两个对象都为空或未定义，则认为相同
  if (!object1 && !object2) return true

  // 如果只有一个对象为空，则认为不同
  if (!object1 || !object2) return false

  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  // 比较键的数量
  if (keys1.length !== keys2.length) return false

  // 比较每个键值对
  return keys1.every((key) => object1[key] === object2[key])
}

/**
 * 比较两个 NumberResult 是否相同
 * @param result1 第一个结果
 * @param result2 第二个结果
 * @returns 是否相同
 */
export function compareNumberResults(
  result1: NumberResult | undefined,
  result2: NumberResult | undefined,
): boolean {
  // 如果两个结果都为空或未定义，则认为相同
  if (!result1 && !result2) return true

  // 如果只有一个结果为空，则认为不同
  if (!result1 || !result2) return false

  // 比较数组部分
  const isSameArray = compareNumericArrays(result1.array, result2.array)

  // 比较对象部分
  const isSameObject = compareNumericObjects(result1.object, result2.object)

  // 数组或对象任一相同则认为相同
  return isSameArray || isSameObject
}

/**
 * 检查是否为表达式输入
 * @param displayValue 显示值
 * @param processedValue 处理后的值
 * @returns 是否为表达式输入
 */
export function isExpressionInput(displayValue: string, processedValue: NumberResult): boolean {
  return displayValue !== processedValue.string
}
