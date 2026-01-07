import { nanoid } from "nanoid"
import { useEffect, useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { BLACK, DEFAULT_ALPHA, DEFAULT_COLOR, DEFAULT_GRADIENT_TRANSFORM } from "../contents"
import type { PickerType, RGB, RGBA } from "../types/colors"
import type { LibrariesDisplayType, LibrariesType } from "../types/libraries"
import type { GradientPaint, Paint } from "../types/paint"
import type { PaintStyle, Style } from "../types/style"
import type { Variable } from "../types/variable"
import { getColorArr } from "../utils/color"

// 默认值常量

// 状态接口定义
interface ColorState {
  alpha: number
  color: RGB
}

interface LibrariesState {
  displayType: LibrariesDisplayType
  pickerType: PickerType
  selected: { item: Variable | Style; type: LibrariesType } | null
  selectedCategory: string
}

/**
 * Color Picker Hook
 *
 * 管理颜色选择器的状态和行为
 *
 * @returns {Object} 颜色选择器状态和处理函数
 */
export const useColorPicker = () => {
  // 合并相关状态
  const [colorState, setColorState] = useState<ColorState>({
    color: DEFAULT_COLOR,
    alpha: DEFAULT_ALPHA,
  })

  const [paintsType, setPaintsType] = useState<Paint["type"]>("SOLID")

  const [librariesState, setLibrariesState] = useState<LibrariesState>({
    selected: null,
    selectedCategory: "all",
    displayType: "LIST",
    pickerType: "CUSTOM",
  })

  // 初始化渐变配置
  const [gradient, setGradient] = useState<GradientPaint>({
    gradientStops: [
      { id: nanoid(), position: 0, color: DEFAULT_COLOR, alpha: 0 },
      { id: nanoid(), position: 1, color: DEFAULT_COLOR, alpha: 1 },
    ],
    type: "GRADIENT_LINEAR",
    gradientTransform: DEFAULT_GRADIENT_TRANSFORM,
    opacity: 1,
  })

  // 事件处理器
  const handleColorChange = useEventCallback((color: RGB) => {
    setColorState((prev) => ({ ...prev, color }))
  })

  const handleAlphaChange = useEventCallback((alpha: number) => {
    setColorState((prev) => ({ ...prev, alpha }))
  })

  const handleGradientChange = useEventCallback((gradient: GradientPaint) => {
    setGradient(gradient)
  })

  const handlePickerTypeChange = useEventCallback((type: PickerType) => {
    setLibrariesState((prev) => ({ ...prev, pickerType: type }))
  })

  const handlePaintsTypeChange = useEventCallback((type: Paint["type"]) => {
    setPaintsType(type)
  })

  const handleLibraryChange = useEventCallback(
    (item: { item: Variable | Style; type: LibrariesType }) => {
      try {
        console.log("item", item)
        // const libraryColor =
        //   item.type === "VARIABLE"
        //     ? ((item.item as Variable)?.value as RGBA)
        //     : ((item.item as PaintStyle)?.fills?.[0]?.color as RGBA)
        // if (!libraryColor) {
        //   console.warn("Invalid library color format")
        //   return
        // }
        // // 批量更新状态以减少重渲染
        // const updates = () => {
        //   setLibrariesState((prev) => ({
        //     ...prev,
        //     selected: item,
        //     pickerType: "LIBRARIES",
        //   }))
        //   setPaintsType("SOLID")
        //   setColorState({
        //     color: libraryColor,
        //     alpha: libraryColor?.a ?? DEFAULT_ALPHA,
        //   })
        // }
        // // 使用 requestAnimationFrame 优化性能
        // requestAnimationFrame(updates)
      } catch (error) {
        console.error("Error handling library change:", error)
      }
    },
  )

  const handleCategoryChange = useEventCallback((category: string) => {
    setLibrariesState((prev) => ({ ...prev, selectedCategory: category }))
  })

  const handleDisplayTypeChange = useEventCallback((displayType: LibrariesDisplayType) => {
    setLibrariesState((prev) => ({ ...prev, displayType }))
  })

  // 计算派生状态
  const variableColor = useMemo(() => {
    if (!librariesState.selected) {
      return { color: DEFAULT_COLOR, alpha: DEFAULT_ALPHA }
    }

    try {
      let color: RGB
      if (librariesState.selected.type === "VARIABLE") {
        color = (librariesState.selected.item as Variable).value as RGB
      } else {
        const firstFill = (librariesState.selected.item as PaintStyle).fills[0]
        if (firstFill.type === "SOLID") {
          color = firstFill.color as RGB
        }

        color = BLACK
      }

      return getColorArr(color as RGB | RGBA) || { color: DEFAULT_COLOR, alpha: DEFAULT_ALPHA }
    } catch (error) {
      console.error("Error computing variable color:", error)
      return { color: DEFAULT_COLOR, alpha: DEFAULT_ALPHA }
    }
  }, [librariesState.selected])

  useEffect(() => {
    if (paintsType !== "SOLID") {
      setLibrariesState((prev) => ({
        ...prev,
        selected: null,
      }))
    }
  }, [paintsType])

  useEffect(() => {
    if (!librariesState.selected) return

    const { color, alpha } = colorState
    const { color: varColor, alpha: varAlpha } = variableColor

    if (
      varColor.r !== color.r ||
      varColor.g !== color.g ||
      varColor.b !== color.b ||
      varAlpha !== alpha
    ) {
      setLibrariesState((prev) => ({
        ...prev,
        selected: null,
      }))
    }
  }, [colorState, variableColor, librariesState.selected])

  return {
    pickerType: librariesState.pickerType,
    paintsType,
    color: colorState.color,
    alpha: colorState.alpha,
    gradient,
    libraries: librariesState,
    variableColor,
    handleColorChange,
    handleAlphaChange,
    handleGradientChange,
    handlePickerTypeChange,
    handlePaintsTypeChange,
    handleLibraryChange,
    handleCategoryChange,
    handleDisplayTypeChange,
  }
}
