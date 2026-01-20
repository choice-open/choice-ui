import type { CSSProperties, MutableRefObject, RefObject } from "react"
import { createContext, useContext } from "react"
import type { PickerSliderType } from "../types/colors"
import { ColorSliderTv } from "./tv"

export interface ColorSliderContextValue {
  // State
  position: number
  disabled: boolean
  type: PickerSliderType
  hue: number

  // Sizes
  thumbSize: number
  trackWidth: number
  trackHeight: number

  // Computed values
  thumbWrapperStyle: CSSProperties
  thumbStyle: CSSProperties
  trackStyle: CSSProperties

  // Refs
  thumbRef: RefObject<HTMLDivElement>
  inputRef: RefObject<HTMLInputElement>
  isDragging: MutableRefObject<boolean>

  // Handlers
  handlePointerDown: (e: React.PointerEvent) => void
  handleKeyDown: (e: React.KeyboardEvent) => void

  // Styles from tv
  tv: ReturnType<typeof ColorSliderTv>
}

export const ColorSliderContext = createContext<ColorSliderContextValue | null>(null)

export function useColorSlider() {
  const context = useContext(ColorSliderContext)
  if (!context) {
    throw new Error("ColorSlider compound components must be used within ColorSlider")
  }
  return context
}
