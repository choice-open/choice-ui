import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ColorProfile } from "../types"

interface ColorsContextType {
  // 当前使用的色彩配置文件
  colorProfile: ColorProfile
  // 设备是否支持广色域
  isWideGamutSupported: boolean
  // 设置用户首选项
  setUserPreference: (profile: ColorProfile | null) => void
  // 用户设置的首选项
  userPreference: ColorProfile | null
}

// 默认值
const defaultContextValue: ColorsContextType = {
  colorProfile: "srgb",
  isWideGamutSupported: false,
  userPreference: null,
  setUserPreference: () => {},
}

export const ColorsContext = createContext<ColorsContextType>(defaultContextValue)

/**
 * 检测设备是否支持 Display P3 广色域
 */
const checkDisplayP3Support = (): boolean => {
  if (typeof window === "undefined") return false
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

    // 检查是否真正支持 P3（如果返回的不是标准 sRGB 红色，说明支持 P3）
    return computed !== "rgb(255, 0, 0)"
  } catch {
    return false
  }
}

export interface ColorsProviderProps {
  children: ReactNode
  /** 初始用户偏好设置 */
  defaultUserPreference?: ColorProfile | null
}

/**
 * 颜色配置 Provider - 提供广色域检测和用户偏好设置
 */
export function ColorsProvider({ children, defaultUserPreference = null }: ColorsProviderProps) {
  const [isWideGamutSupported, setIsWideGamutSupported] = useState(false)
  const [userPreference, setUserPreference] = useState<ColorProfile | null>(defaultUserPreference)

  // 检测广色域支持
  useEffect(() => {
    setIsWideGamutSupported(checkDisplayP3Support())
  }, [])

  // 计算当前使用的色彩配置
  const colorProfile = useMemo<ColorProfile>(() => {
    // 如果用户有明确偏好，使用用户偏好
    if (userPreference) return userPreference
    // 否则根据设备支持情况自动选择
    return isWideGamutSupported ? "display-p3" : "srgb"
  }, [userPreference, isWideGamutSupported])

  const handleSetUserPreference = useCallback((profile: ColorProfile | null) => {
    setUserPreference(profile)
  }, [])

  const value = useMemo<ColorsContextType>(
    () => ({
      colorProfile,
      isWideGamutSupported,
      userPreference,
      setUserPreference: handleSetUserPreference,
    }),
    [colorProfile, isWideGamutSupported, userPreference, handleSetUserPreference],
  )

  return <ColorsContext.Provider value={value}>{children}</ColorsContext.Provider>
}

/**
 * 使用颜色配置的钩子 - 从 Context 中获取颜色配置信息
 * @returns 颜色配置相关信息和操作方法
 */
export const useColors = () => {
  const context = useContext(ColorsContext)
  if (context === undefined) {
    throw new Error("useColors must be used within a ColorsProvider")
  }
  return context
}
