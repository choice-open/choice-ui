import { useMemo } from "react"

/**
 * 通用 i18n 工具系统
 * 提供简洁的API，无需为每个组件单独封装Hook
 */

/**
 * 深度合并两个对象，用户配置会覆盖默认配置
 */
export const mergeI18nConfig = <T extends Record<string, unknown>>(
  defaultConfig: T,
  userConfig?: Partial<T>,
): T => {
  if (!userConfig) return defaultConfig

  const result = { ...defaultConfig }

  for (const key in userConfig) {
    if (Object.prototype.hasOwnProperty.call(userConfig, key)) {
      const userValue = userConfig[key]
      const defaultValue = defaultConfig[key]

      // 检查是否需要递归合并
      if (
        userValue != null &&
        typeof userValue === "object" &&
        !Array.isArray(userValue) &&
        defaultValue != null &&
        typeof defaultValue === "object" &&
        !Array.isArray(defaultValue)
      ) {
        // 递归合并对象
        result[key] = mergeI18nConfig(
          defaultValue as Record<string, unknown>,
          userValue as Partial<Record<string, unknown>>,
        ) as T[Extract<keyof T, string>]
      } else if (userValue !== undefined) {
        // 直接覆盖基础类型
        result[key] = userValue as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}

/**
 * 通用的 i18n Hook，自动缓存合并结果
 * 直接使用，无需为每个组件单独封装
 *
 * @example
 * const i18n = useI18n(defaultConfig, userConfig)
 */
export const useI18n = <T extends Record<string, unknown>>(
  defaultConfig: T,
  userConfig?: Partial<T>,
): T => {
  return useMemo(() => mergeI18nConfig(defaultConfig, userConfig), [defaultConfig, userConfig])
}

/**
 * 从嵌套对象中安全获取值，支持点号路径
 * @example getI18nText(i18n, 'url.placeholder') // 获取 i18n.url.placeholder
 */
export const getI18nText = <T extends Record<string, unknown>>(
  i18n: T,
  path: string,
  fallback = "",
): string => {
  const keys = path.split(".")
  let current: unknown = i18n

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return fallback
    }
  }

  return typeof current === "string" ? current : fallback
}
