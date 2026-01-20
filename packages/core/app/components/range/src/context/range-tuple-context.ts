import { createContext, useContext } from "react"
import { rangeTv } from "../tv"

type ThumbIndex = 0 | 1

export interface RangeTupleContextValue {
  // 状态
  currentValue: [number, number]
  disabled: boolean
  readOnly: boolean
  min: number
  max: number
  step: number
  thumbSize: number
  trackHeight: number

  // 计算值
  transforms: {
    minTransform: number
    maxTransform: number
    transformX0: number
    transformX1: number
  }
  defaultStepValue: [number, number] | null
  currentStepValue: [number, number]
  dotsData: Array<{ value: number; position: number }> | null
  defaultDotPositions: [number, number] | null
  normalizedDefaultValue: [number, number] | undefined

  // refs
  thumb0Ref: React.RefObject<HTMLDivElement | null>
  thumb1Ref: React.RefObject<HTMLDivElement | null>
  input0Ref: React.RefObject<HTMLInputElement | null>
  input1Ref: React.RefObject<HTMLInputElement | null>
  isDragging: React.MutableRefObject<ThumbIndex | null>

  // 方法
  handlePointerDown: (e: React.PointerEvent, thumbIndex: ThumbIndex) => void
  handleKeyDown: (e: React.KeyboardEvent, thumbIndex: ThumbIndex) => void

  // 样式相关
  tv: ReturnType<typeof rangeTv>
  thumbTv0: ReturnType<typeof rangeTv>
  thumbTv1: ReturnType<typeof rangeTv>

  // 子组件控制
  hasCustomDot: boolean
  hasCustomConnects: boolean
  isDefaultValue?: boolean
}

export const RangeTupleContext = createContext<RangeTupleContextValue | null>(null)

export function useRangeTupleContext() {
  const context = useContext(RangeTupleContext)
  if (!context) {
    throw new Error(
      "RangeTuple.Connects and RangeTuple.Thumb must be used within a RangeTuple component",
    )
  }
  return context
}
