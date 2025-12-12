/**
 * Apply numeric constraints (minimum value, maximum value, decimal places)
 * @param value Original value
 * @param min Minimum value
 * @param max Maximum value
 * @param decimal Decimal places
 * @returns Processed value
 */
export function applyConstraints(
  value: number,
  min: number = -Infinity,
  max: number = Infinity,
  decimal: number = 2,
): number {
  // Apply decimal places limit
  const roundedValue = parseFloat(value.toFixed(decimal))

  // Apply range limit
  return Math.min(Math.max(roundedValue, min), max)
}

/**
 * Batch apply constraints to multiple values
 * @param values Value object
 * @param min Minimum value
 * @param max Maximum value
 * @param decimal Decimal places
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
 * Apply custom transformation function to values
 * @param values Value object
 * @param transformFn Transformation function
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
