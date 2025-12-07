import { useRef } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

/**
 * 创建一个始终保持最新值的稳定引用
 *
 * 这个 Hook 解决了闭包中访问过期值的问题，确保在回调函数中始终能访问到最新的 props 或 state。
 * 它会在每次渲染时同步更新 ref 的值，但 ref 对象本身保持不变。
 *
 * @param data - 需要保持最新引用的数据
 * @returns 包含最新数据的稳定引用对象
 *
 * @example
 * ```tsx
 * const Component = ({ onClick }) => {
 *   const onClickRef = useAsRef(onClick)
 *
 *   const handleClick = useCallback(() => {
 *     // 总是调用最新的 onClick 函数
 *     onClickRef.current?.()
 *   }, [onClickRef])
 *
 *   return <button onClick={handleClick}>Click me</button>
 * }
 * ```
 */
export function useAsRef<T>(data: T) {
  const ref = useRef<T>(data)
  useIsomorphicLayoutEffect(() => {
    ref.current = data
  })
  return ref
}
