import { createContext, useContext } from "react"

type Direction = "ltr" | "rtl"

/**
 * 文本方向上下文
 *
 * 用于在组件树中传递文本方向信息（从左到右或从右到左）
 */
export const DirectionContext = createContext<Direction | undefined>(undefined)

/**
 * 获取文本方向的 Hook
 *
 * 这个 Hook 用于确定组件的文本方向，支持国际化应用。
 * 优先级：props > context > 默认值(ltr)
 *
 * @param dirProp - 通过 props 传入的方向值
 * @returns 最终确定的文本方向
 *
 * @example
 * ```tsx
 * const Component = ({ dir }) => {
 *   const direction = useDirection(dir)
 *
 *   return (
 *     <div dir={direction}>
 *       {direction === 'rtl' ? 'من اليمين إلى اليسار' : 'Left to Right'}
 *     </div>
 *   )
 * }
 * ```
 */
export function useDirection(dirProp?: Direction): Direction {
  const contextDir = useContext(DirectionContext)
  return dirProp ?? contextDir ?? "ltr"
}
