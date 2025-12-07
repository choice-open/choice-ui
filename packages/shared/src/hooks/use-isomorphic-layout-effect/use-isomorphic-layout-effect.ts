import { useEffect, useLayoutEffect } from "react"

/**
 * 同构布局效果 Hook
 *
 * 这个 Hook 解决了 SSR（服务端渲染）环境中 useLayoutEffect 的兼容性问题。
 * 在浏览器环境中使用 useLayoutEffect，在服务端环境中使用 useEffect。
 *
 * useLayoutEffect 在 DOM 更新后同步执行，适用于需要同步读取 DOM 布局信息的场景。
 * 但在服务端环境中，window 对象不存在，使用 useLayoutEffect 会产生警告。
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const [height, setHeight] = useState(0)
 *   const ref = useRef<HTMLDivElement>(null)
 *
 *   useIsomorphicLayoutEffect(() => {
 *     if (ref.current) {
 *       // 同步读取 DOM 尺寸信息
 *       setHeight(ref.current.offsetHeight)
 *     }
 *   }, [])
 *
 *   return <div ref={ref}>高度: {height}px</div>
 * }
 * ```
 */
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect
