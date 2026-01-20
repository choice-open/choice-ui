import { createContext, useContext } from "react"
import { rangeTv } from "../tv"

export interface RangeContextValue {
  // 状态
  currentValue: number
  disabled: boolean
  readOnly: boolean
  min: number
  max: number
  step: number
  thumbSize: number
  trackHeight: number

  // 计算值
  transforms: { minTransform: number; maxTransform: number; transformX: number }
  defaultStepValue: number | null
  currentStepValue: number
  dotsData: Array<{ value: number; position: number }> | null
  defaultDotPosition: number | null

  // refs
  thumbRef: React.MutableRefObject<HTMLDivElement | null>
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  isDragging: React.MutableRefObject<boolean>

  // 方法
  handlePointerDown: (e: React.PointerEvent) => void
  handleKeyDown: (e: React.KeyboardEvent) => void

  // 样式相关
  tv: ReturnType<typeof rangeTv>
  defaultValue?: number

  // 子组件控制
  hasCustomDot: boolean
  hasCustomConnects: boolean
  isDefaultValue?: boolean
}

export const RangeContext = createContext<RangeContextValue | null>(null)

export function useRangeContext() {
  const context = useContext(RangeContext)
  if (!context) {
    throw new Error("Range.Connects and Range.Thumb must be used within a Range component")
  }
  return context
}
