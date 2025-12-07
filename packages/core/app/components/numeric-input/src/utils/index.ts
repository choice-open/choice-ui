/**
 * 数值输入工具函数集合
 */

// 主处理函数
export { dealWithNumericInputValue, dealWithNumericValueCatch } from "./numeric-value-processor"

// 表达式计算相关
export { evaluate, memoizedEvaluate, applyOperation, memoize } from "./expression-evaluator"

// 模式解析相关
export { parsePattern, formatResult } from "./pattern-parser"

// 输入解析相关
export { parseInputValue, extractValuesFromString } from "./input-parser"

// 值处理相关
export { applyConstraints, applyConstraintsToValues, applyTransform } from "./value-processor"

// 错误处理相关
export {
  NumericInputError,
  ExpressionParseError,
  PatternParseError,
  InvalidInputTypeError,
  safeExecute,
} from "./error-handler"

// 值比较相关
export {
  compareNumericArrays,
  compareNumericObjects,
  compareNumberResults,
  isExpressionInput,
} from "./value-comparator"
