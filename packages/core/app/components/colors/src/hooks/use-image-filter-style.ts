import { useMemo } from "react"
import type { ImageFilters } from "../types"

/**
 * 将-100到100范围的滤镜值映射到CSS滤镜的实际有效范围
 * @param filters 图片滤镜配置对象
 * @returns 包含CSS filter属性的样式对象
 */
export const useImageFilterStyle = (filters?: Partial<ImageFilters>) => {
  return useMemo(() => {
    // 映射函数：将-100到100的值映射到适当的滤镜范围
    const mapBrightness = (value: number | undefined) => {
      const val = value ?? 0
      // -100 映射到 25%（暗），0 映射到 100%（正常），100 映射到 175%（亮）
      return val === 0
        ? 100
        : val < 0
          ? 100 - Math.abs(val) * 0.75 // -100 -> 25%, 0 -> 100%
          : 100 + val * 0.75 // 0 -> 100%, 100 -> 175%
    }

    const mapContrast = (value: number | undefined) => {
      const val = value ?? 0
      // -100 映射到 50%（低对比度），0 映射到 100%（正常），100 映射到 150%（高对比度）
      return val === 0
        ? 100
        : val < 0
          ? 100 - Math.abs(val) * 0.5 // -100 -> 50%, 0 -> 100%
          : 100 + val * 0.5 // 0 -> 100%, 100 -> 150%
    }

    const mapSaturation = (value: number | undefined) => {
      const val = value ?? 0
      // -100 映射到 0%（黑白），0 映射到 100%（正常），100 映射到 200%（高饱和度）
      return val === 0
        ? 100
        : val < 0
          ? 100 - Math.abs(val) // -100 -> 0%, 0 -> 100%
          : 100 + val // 0 -> 100%, 100 -> 200%
    }

    // 色温和色调使用角度，不需要同样的映射
    const mapTemperature = (value: number | undefined) => (value ?? 0) * 0.3 // -100 -> -30deg, 100 -> 30deg
    const mapTint = (value: number | undefined) => Math.max(0, value ?? 0) // 只使用正值，0-100 -> 0-100%

    return {
      filter: `brightness(${mapBrightness(filters?.exposure)}%) contrast(${mapContrast(filters?.contrast)}%) saturate(${mapSaturation(filters?.saturation)}%) hue-rotate(${mapTemperature(filters?.temperature)}deg) sepia(${mapTint(filters?.tint)}%)`,
    }
  }, [filters])
}
