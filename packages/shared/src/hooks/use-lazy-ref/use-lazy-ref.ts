import { useRef, MutableRefObject } from "react"

/**
 * 懒加载引用 Hook
 *
 * 这个 Hook 用于延迟初始化一个引用值，只有在第一次访问时才会执行初始化函数。
 * 适用于创建成本较高的对象（如 Map、Set、复杂对象等）。
 *
 * 与 useState 的懒加载不同，这个 Hook 创建的是一个稳定的引用，
 * 不会触发组件重新渲染，适用于需要在多次渲染间保持同一个对象实例的场景。
 *
 * @param fn - 初始化函数，只会在第一次调用时执行
 * @returns 包含初始化值的稳定引用对象
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   // 只在第一次渲染时创建 Map 实例
 *   const mapRef = useLazyRef(() => new Map<string, any>())
 *
 *   const addItem = (key: string, value: any) => {
 *     mapRef.current!.set(key, value)
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={() => addItem('key1', 'value1')}>
 *         添加项目
 *       </button>
 *       <p>Map 大小: {mapRef.current!.size}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLazyRef<T>(fn: () => T): MutableRefObject<T> {
  const ref = useRef<T | null>(null)
  if (ref.current === null) {
    ref.current = fn()
  }
  return ref as MutableRefObject<T>
}
