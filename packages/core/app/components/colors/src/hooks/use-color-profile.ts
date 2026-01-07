import { useEffect, useState } from "react"
import type { ColorProfile } from "../types/colors"

export function useColorProfile(): ColorProfile {
  const [colorProfile, setColorProfile] = useState<ColorProfile>("srgb")

  useEffect(() => {
    const checkDisplayP3Support = () => {
      if (!window.CSS || !CSS.supports) return false

      try {
        // 基本支持检查
        if (!CSS.supports("color", "color(display-p3 0 0 0)")) return false

        // 创建测试元素
        const el = document.createElement("div")
        el.style.display = "none"
        document.body.appendChild(el)

        // 设置 P3 颜色
        el.style.color = "color(display-p3 1 0 0)"
        const computed = getComputedStyle(el).color

        document.body.removeChild(el)

        // 检查是否真正支持 P3
        return computed !== "rgb(255, 0, 0)"
      } catch (error) {
        console.error("Error in checkDisplayP3Support:", error)
        return false
      }
    }

    setColorProfile(checkDisplayP3Support() ? "display-p3" : "srgb")
  }, [])

  return colorProfile
}
