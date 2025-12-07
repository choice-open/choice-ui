import { DealWithNumericValueOptions, NumberResult } from "../types"
import { extractValuesFromString, parseInputValue } from "./input-parser"
import { formatResult, parsePattern } from "./pattern-parser"
import { applyConstraintsToValues, applyTransform } from "./value-processor"

/**
 * 安全处理数值输入，捕获异常并返回undefined
 * @param options 输入选项
 * @returns 处理结果或undefined（出错时）
 */
export const dealWithNumericValueCatch = (
  options: DealWithNumericValueOptions,
): NumberResult | undefined => {
  try {
    return dealWithNumericInputValue(options)
  } catch (_error) {
    return undefined
  }
}

/**
 * 主处理函数：处理各种类型的数值输入并应用约束
 * @param options 输入选项
 * @returns 处理结果对象
 */
export const dealWithNumericInputValue = ({
  input,
  pattern,
  call,
  max = Infinity,
  min = -Infinity,
  decimal = 2,
}: DealWithNumericValueOptions): NumberResult => {
  // 1. 解析模式
  const { keys, regex } = parsePattern(pattern)

  // 2. 解析输入值
  const { values, isInputNumber, isObjectNumber } = parseInputValue(input)

  // 3. 根据输入类型获取结果对象
  const result: Record<string, number> = {}

  if (typeof input === "string" && input.match(regex) && !isInputNumber && !isObjectNumber) {
    // 处理符合模式的字符串输入
    const extractedValues = extractValuesFromString(input, regex, keys)
    if (extractedValues) {
      Object.assign(result, extractedValues)
    }
  } else if (isInputNumber) {
    // 处理数字或数字数组输入
    keys.forEach((key, index) => {
      result[key] = values[index] ?? values[0]
    })
  } else if (isObjectNumber) {
    // 处理对象输入
    const objInput = input as Record<string, number>

    // 首先保留对象中的所有已有属性
    Object.keys(objInput).forEach((key) => {
      if (typeof objInput[key] === "number") {
        result[key] = objInput[key]
      }
    })

    // 然后确保表达式中定义的键都存在
    keys.forEach((key) => {
      // 只在result[key]未定义时才设置默认值0
      if (result[key] === undefined) {
        result[key] = 0
      }
    })
  } else {
    throw new Error(`Invalid input: ${input}`)
  }

  // 4. 应用转换函数（如果有）
  if (call) {
    applyTransform(result, call)
  }

  // 5. 应用约束（最小值、最大值、小数位数）
  applyConstraintsToValues(result, min, max, decimal)

  // 6. 格式化输出字符串
  const resStr = formatResult(pattern, result)

  // 7. 返回结果对象
  return {
    array: Object.values(result),
    string: resStr,
    object: result,
  }
}
