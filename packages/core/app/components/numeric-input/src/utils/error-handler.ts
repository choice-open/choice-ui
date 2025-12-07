/**
 * 自定义错误类型
 */
export class NumericInputError extends Error {
  code: string

  constructor(message: string, code: string = "GENERIC_ERROR") {
    super(message)
    this.name = "NumericInputError"
    this.code = code
  }
}

/**
 * 表达式解析错误
 */
export class ExpressionParseError extends NumericInputError {
  constructor(expression: string, details?: string) {
    super(
      `Failed to parse expression: "${expression}"${details ? ` - ${details}` : ""}`,
      "EXPRESSION_PARSE_ERROR",
    )
    this.name = "ExpressionParseError"
  }
}

/**
 * 模式解析错误
 */
export class PatternParseError extends NumericInputError {
  constructor(pattern: string, details?: string) {
    super(
      `Invalid pattern format: "${pattern}"${details ? ` - ${details}` : ""}`,
      "PATTERN_PARSE_ERROR",
    )
    this.name = "PatternParseError"
  }
}

/**
 * 输入值类型错误
 */
export class InvalidInputTypeError extends NumericInputError {
  constructor(input: any, expectedType?: string) {
    super(
      `Invalid input type: ${typeof input}${expectedType ? `, expected ${expectedType}` : ""}`,
      "INVALID_INPUT_TYPE",
    )
    this.name = "InvalidInputTypeError"
  }
}

/**
 * 安全的错误处理封装
 * @param fn 要执行的函数
 * @param fallback 出错时的默认返回值
 * @returns 函数执行结果或默认值
 */
export function safeExecute<T, R>(fn: (arg: T) => R, arg: T, fallback: R): R {
  try {
    return fn(arg)
  } catch (error) {
    console.error("NumericInput operation failed:", error)
    return fallback
  }
}
