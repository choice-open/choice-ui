/**
 * 解析模式字符串，提取变量键
 * @param pattern 模式字符串（如 "{value}px"）
 * @returns 解析结果，包含变量键和正则表达式
 */
export function parsePattern(pattern: string): {
  keys: string[]
  regex: RegExp
  regexPattern: string
} {
  const keys: string[] = []

  // 解析模式中的变量定义，如 {value} 或 {x,y}
  const regexPattern = pattern.replace(/[\s]*\{([\w|,]+)\}[\s]*/g, (_match, key) => {
    const keyArr = key.split(",")
    keys.push(keyArr[0])
    return "(.+)"
  })

  // 创建正则表达式用于匹配输入
  const regex = new RegExp(`^${regexPattern}$`)

  return { keys, regexPattern, regex }
}

/**
 * 格式化结果，将变量值应用到模式字符串中
 * @param pattern 模式字符串
 * @param result 变量值对象
 * @returns 格式化后的字符串
 */
export function formatResult(pattern: string, result: Record<string, number>): string {
  return pattern.replace(/\{([\w|,]+)\}/g, (_match, key) => {
    const keyArr = key.split(",")
    return keyArr[1] === "hidden" ? "" : String(result[keyArr[0]])
  })
}
