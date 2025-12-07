/**
 * 应用数值约束（最小值、最大值、小数位数）
 * @param value 原始数值
 * @param min 最小值
 * @param max 最大值
 * @param decimal 小数位数
 * @returns 处理后的数值
 */
export function applyConstraints(
  value: number,
  min: number = -Infinity,
  max: number = Infinity,
  decimal: number = 2,
): number {
  // 应用小数位数限制
  const roundedValue = parseFloat(value.toFixed(decimal))

  // 应用范围限制
  return Math.min(Math.max(roundedValue, min), max)
}

/**
 * 批量应用约束到多个值
 * @param values 值对象
 * @param min 最小值
 * @param max 最大值
 * @param decimal 小数位数
 */
export function applyConstraintsToValues(
  values: Record<string, number>,
  min: number = -Infinity,
  max: number = Infinity,
  decimal: number = 2,
): void {
  for (const key in values) {
    values[key] = applyConstraints(values[key], min, max, decimal)
  }
}

/**
 * 应用自定义转换函数到值
 * @param values 值对象
 * @param transformFn 转换函数
 */
export function applyTransform(
  values: Record<string, number>,
  transformFn?: (value: number) => number,
): void {
  if (!transformFn) return

  for (const key in values) {
    values[key] = transformFn(values[key])
  }
}
