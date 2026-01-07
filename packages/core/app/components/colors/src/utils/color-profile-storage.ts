import type { ColorProfile } from "../types/colors"

// 存储用户首选项的 key
const COLOR_PROFILE_STORAGE_KEY = "choiceform-color-profile-preference"

/**
 * 颜色配置文件持久化工具
 *
 * 这个工具负责颜色配置文件偏好的读取、存储和清除，
 * 与组件逻辑完全分离，可以在业务代码中单独使用。
 */
export const colorProfileStorage = {
  /**
   * 获取存储的颜色配置
   * @returns 存储的颜色配置，如果没有则返回 null
   */
  get: (): ColorProfile | null => {
    try {
      const stored = localStorage.getItem(COLOR_PROFILE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed === "srgb" || parsed === "display-p3") {
          return parsed
        }
      }
    } catch (e) {
      console.error("Failed to load color profile preference:", e)
    }
    return null
  },

  /**
   * 设置颜色配置
   * @param profile 要存储的颜色配置
   */
  set: (profile: ColorProfile): void => {
    try {
      localStorage.setItem(COLOR_PROFILE_STORAGE_KEY, JSON.stringify(profile))
      // 触发存储事件，以便其他实例能够监听到变化
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: COLOR_PROFILE_STORAGE_KEY,
          newValue: JSON.stringify(profile),
        }),
      )
    } catch (e) {
      console.error("Failed to save color profile preference:", e)
    }
  },

  /**
   * 清除存储的颜色配置
   */
  clear: (): void => {
    try {
      localStorage.removeItem(COLOR_PROFILE_STORAGE_KEY)
      // 触发存储事件，以便其他实例能够监听到变化
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: COLOR_PROFILE_STORAGE_KEY,
          newValue: null,
        }),
      )
    } catch (e) {
      console.error("Failed to clear color profile preference:", e)
    }
  },

  /**
   * 监听存储变化
   * @param callback 当存储发生变化时的回调函数
   * @returns 一个清理函数，用于移除事件监听
   */
  subscribe: (callback: (profile: ColorProfile | null) => void): (() => void) => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === COLOR_PROFILE_STORAGE_KEY) {
        const newProfile = event.newValue ? (JSON.parse(event.newValue) as ColorProfile) : null
        callback(newProfile)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // 返回清理函数
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  },
}
