import { useCallback, useEffect, useMemo } from "react"
import { Descendant, Node, Element as SlateElement, Text } from "slate"

interface UseValidationProps {
  displayValue: Descendant[]
  setDisplayValue: React.Dispatch<React.SetStateAction<Descendant[]>>
  setValidationMessage?: React.Dispatch<React.SetStateAction<string | null>>
  setValue?: React.Dispatch<React.SetStateAction<Descendant[]>>
  validation?: {
    maxLength?: number
    minLength?: number
    required?: boolean
  }
}

export function useValidation({
  displayValue,
  setDisplayValue,
  setValue,
  setValidationMessage,
  validation,
}: UseValidationProps) {
  // 使用Node API来遍历Slate节点并计算文本总长度
  const countCharacters = (nodes: Descendant[]) => {
    return nodes
      .map((n) => Node.string(n)) // 将每个节点转换为纯文本
      .join("").length // 将所有文本节点连接成一个字符串 // 获取字符串的长度，即字符数
  }
  // 使用useMemo来缓存字符计数，以免在每次渲染时都重新计算
  const charCount = useMemo(() => countCharacters(displayValue), [displayValue])
  // 当编辑器内容发生变化时更新状态
  const handleValidationChange = useCallback(
    (newValue: Descendant[]) => {
      setDisplayValue(newValue)
    },
    [setDisplayValue],
  )

  useEffect(() => {
    if (validation?.maxLength && charCount > validation.maxLength) {
      if (setValidationMessage) {
        setValidationMessage(`Maximum length is ${validation.maxLength} characters`)
      }
      const limitedValue = trimSlateValueToMaxLength({
        value: displayValue,
        maxLength: validation.maxLength,
      })
      if (setValue) {
        setValue(limitedValue)
      }
    } else if (validation?.minLength && charCount < validation.minLength) {
      if (setValidationMessage) {
        setValidationMessage(`Minimum length is ${validation.minLength} characters`)
      }
      if (setValue) {
        setValue([])
      }
    } else {
      if (setValidationMessage) {
        setValidationMessage(null)
      }
      if (setValue) {
        setValue(displayValue)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charCount, validation?.maxLength, validation?.minLength])

  return {
    handleValidationChange,
  }
}

interface TrimSlateValueToMaxLengthProps {
  maxLength: number
  value: Descendant[]
}

function trimSlateValueToMaxLength({
  value,
  maxLength,
}: TrimSlateValueToMaxLengthProps): Descendant[] {
  const trimmedValue: Descendant[] = []
  let lengthSoFar = 0

  for (const node of value) {
    if (lengthSoFar >= maxLength) break

    // 检查节点是否是 Slate Text 节点
    if (Text.isText(node)) {
      const remainingLength = maxLength - lengthSoFar
      const text = node.text.slice(0, remainingLength)
      trimmedValue.push({ ...node, text })
      lengthSoFar += text.length
      // 检查节点是否是 Slate Element 节点
    } else if (SlateElement.isElement(node)) {
      const children = trimSlateValueToMaxLength({
        value: node.children,
        maxLength: maxLength - lengthSoFar,
      })
      trimmedValue.push({ ...node, children } as Descendant)
      // 根据 Slate 的 API, 可能需要如此获取该元素包含的文本长度
      lengthSoFar += Node.string(node).length
    } else {
      // 其他类型的节点，如是 Fragment 或 Selection，不做处理
      trimmedValue.push(node)
    }
  }

  return trimmedValue
}
