/**
 * Parse pattern string, extract variable keys
 * @param pattern Pattern string (e.g. "{value}px")
 * @returns Parsed result, containing variable keys and regular expression
 */
export function parsePattern(pattern: string): {
  keys: string[]
  regex: RegExp
  regexPattern: string
} {
  const keys: string[] = []

  // Parse variable definitions in the pattern, e.g. {value} or {x,y}
  const regexPattern = pattern.replace(/[\s]*\{([\w|,]+)\}[\s]*/g, (_match, key) => {
    const keyArr = key.split(",")
    keys.push(keyArr[0])
    return "(.+)"
  })

  // Create regular expression for matching input
  const regex = new RegExp(`^${regexPattern}$`)

  return { keys, regexPattern, regex }
}

/**
 * Format result, apply variable values to pattern string
 * @param pattern Pattern string
 * @param result Variable value object
 * @returns Formatted string
 */
export function formatResult(pattern: string, result: Record<string, number>): string {
  return pattern.replace(/\{([\w|,]+)\}/g, (_match, key) => {
    const keyArr = key.split(",")
    return keyArr[1] === "hidden" ? "" : String(result[keyArr[0]])
  })
}
