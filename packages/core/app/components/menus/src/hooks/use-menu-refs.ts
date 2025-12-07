import { useRef, useMemo } from "react"
import type { SideObject } from "@floating-ui/react"

/**
 * 菜单引用管理 Hook
 *
 * 统一管理菜单组件中所有需要的引用：
 * - 滚动容器引用
 * - 列表项引用数组
 * - 列表内容引用数组
 * - 定时器引用
 * - Select 专用引用（overflow, allowSelect 等）
 */

export interface MenuRefsConfig {
  /** 是否为 Select 类型（需要额外的选择相关引用） */
  isSelect?: boolean
}

export interface MenuRefsResult {
  allowMouseUpRef?: React.MutableRefObject<boolean>
  allowSelectRef?: React.MutableRefObject<boolean>
  // 工具函数
  clearSelectTimeout: () => void

  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>

  labelsRef: React.MutableRefObject<Array<string | null>>
  // Select 专用引用（仅在 isSelect=true 时存在）
  overflowRef?: React.MutableRefObject<SideObject | null>
  resetRefs: () => void

  // 通用引用 - 使用 MutableRefObject 以兼容 FloatingUI
  scrollRef: React.MutableRefObject<HTMLDivElement | null>
  // 定时器引用
  selectTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>
}

export function useMenuRefs(config: MenuRefsConfig = {}): MenuRefsResult {
  const { isSelect = false } = config

  // 通用引用 - 使用 MutableRefObject
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const elementsRef = useRef<Array<HTMLElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  // Select 专用引用
  const overflowRef = useRef<SideObject | null>(null)
  const allowSelectRef = useRef<boolean>(false)
  const allowMouseUpRef = useRef<boolean>(true)

  // 工具函数
  const clearSelectTimeout = () => {
    if (selectTimeoutRef.current) {
      clearTimeout(selectTimeoutRef.current)
      selectTimeoutRef.current = undefined
    }
  }

  const resetRefs = () => {
    // 清理定时器
    clearSelectTimeout()

    // 重置数组引用
    elementsRef.current = []
    labelsRef.current = []

    // 重置 Select 专用引用
    if (isSelect) {
      if (allowSelectRef.current) {
        allowSelectRef.current = false
      }
      if (!allowMouseUpRef.current) {
        allowMouseUpRef.current = true
      }
    }
  }

  // 构建结果对象
  const result: MenuRefsResult = useMemo(() => {
    const baseResult = {
      // 通用引用
      scrollRef,
      elementsRef,
      labelsRef,
      selectTimeoutRef,

      // 工具函数
      clearSelectTimeout,
      resetRefs,
    }

    // 如果是 Select 类型，添加额外的引用
    if (isSelect) {
      return {
        ...baseResult,
        overflowRef,
        allowSelectRef,
        allowMouseUpRef,
      }
    }

    return baseResult
  }, [isSelect])

  return result
}
