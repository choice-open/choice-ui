import { useState, useId, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"

/**
 * 基础菜单状态管理 Hook
 *
 * 处理所有菜单组件的通用状态：
 * - open/close 状态及受控逻辑
 * - activeIndex 状态
 * - touch 交互状态
 * - scrollTop 状态
 * - 唯一ID生成
 * - 状态变化回调
 */

export interface MenuStateConfig {
  /** 是否禁用 */
  disabled?: boolean
  /** 打开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 受控的打开状态 */
  open?: boolean
}

export interface MenuStateResult {
  activeIndex: number | null
  // 处理函数
  handleOpenChange: (newOpen: boolean) => void
  isControlledOpen: boolean
  // 唯一标识
  menuId: string
  // 状态
  open: boolean

  scrollTop: number
  setActiveIndex: (index: number | null) => void
  // 状态设置函数
  setOpen: (open: boolean) => void
  setScrollTop: (scrollTop: number) => void

  setTouch: (touch: boolean) => void

  touch: boolean
  triggerId: string
}

export function useMenuState(config: MenuStateConfig = {}): MenuStateResult {
  const { open: controlledOpen, onOpenChange, disabled = false } = config

  // 基础状态
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [touch, setTouch] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  // 唯一ID生成
  const baseId = useId()
  const menuId = `menu-${baseId}`
  const triggerId = `trigger-${baseId}`

  // 受控/非受控状态合并
  const isControlledOpen = controlledOpen !== undefined ? controlledOpen : open

  // 状态变化处理 - 使用 useEventCallback 确保引用稳定
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    // 如果组件被禁用，不允许打开
    if (disabled && newOpen) {
      return
    }

    // 更新非受控状态
    if (controlledOpen === undefined) {
      setOpen(newOpen)
    }

    // 触发回调
    onOpenChange?.(newOpen)
  })

  // 返回状态和处理函数
  const result: MenuStateResult = useMemo(
    () => ({
      // 状态
      open,
      activeIndex,
      touch,
      scrollTop,
      isControlledOpen,

      // 状态设置函数
      setOpen,
      setActiveIndex,
      setTouch,
      setScrollTop,

      // 处理函数
      handleOpenChange,

      // 唯一标识
      menuId,
      triggerId,
    }),
    [open, activeIndex, touch, scrollTop, isControlledOpen, handleOpenChange, menuId, triggerId],
  )

  return result
}
