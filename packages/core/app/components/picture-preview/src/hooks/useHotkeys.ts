import { useEffect, useCallback } from "react"
import isHotkey from "is-hotkey"

// 快捷键配置类型
interface HotkeyConfig {
  handler: (e: KeyboardEvent) => void
  hotkey: string
}

/**
 * 键盘快捷键Hook
 * @param configs 快捷键配置数组
 */
export function useHotkeys(configs: HotkeyConfig[]) {
  // 全局按键处理函数
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 遍历所有快捷键配置
      for (const { hotkey, handler } of configs) {
        // 检查是否匹配当前按键
        if (isHotkey(hotkey, event)) {
          // 防止默认行为
          event.preventDefault()

          // 调用处理函数
          handler(event)

          // 找到匹配后停止循环
          break
        }
      }
    },
    [configs],
  )

  // 添加和移除全局事件监听器
  useEffect(() => {
    // 只有在有配置时才添加监听器
    if (configs.length > 0) {
      window.addEventListener("keydown", handleKeyDown)

      // 清理函数
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [configs, handleKeyDown])
}

export const HOTKEYS = {
  ZOOM_IN: "mod+=",
  ZOOM_OUT: "mod+-",
  ZOOM_RESET: "mod+0",
  FIT_TO_SCREEN: "mod+1",
}
