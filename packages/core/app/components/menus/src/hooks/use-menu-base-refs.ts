import { useRef } from "react"

/**
 * 菜单基础引用管理 Hook
 *
 * 统一管理所有菜单组件需要的基础 refs：
 * - scrollRef: 滚动容器引用
 * - elementsRef: 菜单项元素引用数组
 * - labelsRef: 菜单项标签引用数组（用于 typeahead）
 * - selectTimeoutRef: 选择延迟定时器引用
 *
 * 这些 refs 在多个组件中都有使用，统一管理可以保持一致性
 */

export interface MenuBaseRefsResult {
  /** 菜单项元素引用数组 */
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>
  /** 菜单项标签引用数组（用于 typeahead） */
  labelsRef: React.MutableRefObject<Array<string | null>>
  /** 滚动容器引用 */
  scrollRef: React.RefObject<HTMLDivElement>
  /** 选择延迟定时器引用 */
  selectTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>
}

/**
 * 创建菜单基础引用
 */
export function useMenuBaseRefs(): MenuBaseRefsResult {
  const scrollRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<Array<HTMLElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  return {
    scrollRef,
    elementsRef,
    labelsRef,
    selectTimeoutRef,
  }
}
