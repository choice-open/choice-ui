import { mergeRefs, tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps, useEffect, useMemo, useRef, useState } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { useColorParser } from "../hooks/use-color-parser"
import type { RGB } from "../types/colors"
import { hexInputTv } from "./tv"

export interface HexInputProps extends Omit<
  HTMLProps<HTMLInputElement>,
  "onChange" | "onBlur" | "value"
> {
  onAlphaChange?: (alpha: number) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (value: RGB) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  value?: RGB
}

export const HexInput = forwardRef<HTMLInputElement, HexInputProps>(function HexInput(props, ref) {
  const { className, value, onChange, onAlphaChange, onBlur, onFocus, disabled, ...rest } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const lastValidValue = useRef<string>("")
  const isComposing = useRef(false)

  const [inputValue, setInputValue] = useState("")

  const displayValue = useMemo(() => inputValue.replace("#", ""), [inputValue])

  const { parseColor } = useColorParser()

  // 同步外部 RGB value 变化
  useEffect(() => {
    if (!value) return

    // 先比较 RGB 值是否真的变化
    const lastRgb = tinycolor(lastValidValue.current).toRgb()
    if (
      lastValidValue.current &&
      lastRgb.r === value.r &&
      lastRgb.g === value.g &&
      lastRgb.b === value.b
    ) {
      return
    }

    const newHexValue = tinycolor({ r: value.r, g: value.g, b: value.b })
      .toHexString()
      .toUpperCase()

    // 如果新的 hex 值与当前值相同，不更新
    if (newHexValue === lastValidValue.current) {
      return
    }

    setInputValue(newHexValue)
    lastValidValue.current = newHexValue
  }, [value]) // 只依赖 value 本身，在组件内部比较值是否真的变化

  const completeHexColor = (hex: string) => {
    // 移除 # 和空格
    hex = hex.replace(/[#\s]/g, "").toLowerCase()

    // 如果是有效的 hex 颜色，直接返回
    if (/^[0-9a-f]{6}$/.test(hex)) {
      return `#${hex}`
    }

    // 处理不完整的 hex
    if (/^[0-9a-f]{1,6}$/.test(hex)) {
      // 找出数字的模式
      const pattern = findPattern(hex)
      if (pattern) {
        return `#${pattern}`
      }

      // 如果没有明显的模式，使用智能补全
      const completed = smartComplete(hex)
      return `#${completed}`
    }
    return null
  }

  const findPattern = (hex: string): string | null => {
    // 检查是否所有字符都相同
    if (new Set(hex).size === 1) {
      return hex[0].repeat(6)
    }

    // 检查是否是递增或递减序列
    const nums = hex.split("").map((c) => parseInt(c, 16))
    const diff = nums[1] - nums[0]
    let isSequence = true
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] - nums[i - 1] !== diff) {
        isSequence = false
        break
      }
    }
    if (isSequence && hex.length >= 2) {
      // 使用序列的前两个数字创建渐变
      return `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[1]}${hex[1]}`
    }

    // 检查交替模式
    if (hex.length >= 2) {
      const isAlternating = hex
        .split("")
        .every((c, i) => (i % 2 === 0 ? c === hex[0] : c === hex[1]))
      if (isAlternating) {
        return hex.slice(0, 2).repeat(3)
      }
    }

    return null
  }

  const smartComplete = (hex: string): string => {
    if (hex.length === 1) {
      // 单个数字，创建渐变
      return `${hex}${hex}${hex}${hex}${hex}${hex}`
    }

    if (hex.length === 2) {
      // 两个数字，创建交替模式
      return hex.repeat(3)
    }

    if (hex.length === 3) {
      // 三个数字，创建对称模式
      return `${hex}${hex.split("").reverse().join("")}`
    }

    // 对于更长的输入，保持前面的数字并智能补全
    return hex.padEnd(6, hex[hex.length - 1])
  }

  const handleBlur = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const currentValue = inputValue

    onBlur?.(e)

    // 如果值没有改变，不进行验证
    if (currentValue === lastValidValue.current) {
      return
    }

    try {
      // 尝试补全 hex 颜色
      const completedHex = completeHexColor(currentValue)
      if (completedHex) {
        const { color, hasAlpha, alpha } = parseColor(completedHex)
        if (color) {
          const hexValue = color.hex().toUpperCase()
          setInputValue(hexValue)
          lastValidValue.current = hexValue
          const [r, g, b] = color.rgb()
          onChange?.({ r, g, b })
          if (hasAlpha) {
            onAlphaChange?.(alpha)
          }
          return
        }
      }

      // 处理其他颜色格式
      const { color, hasAlpha, alpha } = parseColor(currentValue)
      if (color) {
        const hexValue = color.hex().toUpperCase()
        setInputValue(hexValue)
        lastValidValue.current = hexValue
        const [r, g, b] = color.rgb()
        onChange?.({ r, g, b })
        if (hasAlpha) {
          onAlphaChange?.(alpha)
        }
      } else {
        // 如果颜色无效，恢复到原始值
        if (value) {
          const hexValue = tinycolor({ r: value.r, g: value.g, b: value.b })
            .toHexString()
            .toUpperCase()
          setInputValue(hexValue)
          lastValidValue.current = hexValue
        } else {
          setInputValue("")
          lastValidValue.current = ""
        }
      }
    } catch {
      // 如果颜色无效，恢复到原始值
      if (value) {
        const hexValue = tinycolor({ r: value.r, g: value.g, b: value.b })
          .toHexString()
          .toUpperCase()
        setInputValue(hexValue)
        lastValidValue.current = hexValue
      } else {
        setInputValue("")
        lastValidValue.current = ""
      }
    }
  })

  const handleChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  })

  const handleCompositionStart = useEventCallback(() => {
    isComposing.current = true
  })

  const handleCompositionEnd = useEventCallback(() => {
    isComposing.current = false
  })

  const handleFocus = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e)
    e.target.select()
  })

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === "Enter" && !isComposing.current) {
      inputRef.current?.blur()
    }
  })

  const handleKeyUp = useEventCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
  })

  const styles = hexInputTv()

  return (
    <input
      data-1p-ignore
      ref={mergeRefs(ref, inputRef)}
      spellCheck={false}
      autoComplete="off"
      className={tcx(styles, className)}
      value={displayValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={disabled}
      {...rest}
    />
  )
})

HexInput.displayName = "HexInput"
