import { MutableRefObject, useCallback, useContext, useSyncExternalStore } from "react"
import { useLazyRef } from "@choiceform/design-shared"
import { FILE_UPLOAD_ERRORS } from "../constants"
import { StoreContext } from "../contexts"
import { StoreState } from "../types"

/**
 * 获取文件上传状态管理器上下文的 Hook
 *
 * 这个 Hook 用于获取文件上传组件的状态管理器实例。
 * 必须在 FileUpload 组件树内部使用。
 *
 * @param name - 组件名称，用于生成错误信息
 * @returns 状态管理器实例
 * @throws 如果在非文件上传组件树中使用，抛出错误
 */
export function useStoreContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name])
  }
  return context
}

/**
 * 文件上传状态订阅 Hook
 *
 * 这个 Hook 使用 useSyncExternalStore 来订阅文件上传状态的变化。
 * 它实现了选择器模式，只有当选择器返回的值发生变化时，组件才会重新渲染。
 *
 * 内部使用了优化策略：
 * - 缓存上一次的状态和选择器结果
 * - 只有当状态引用发生变化时才重新计算选择器
 * - 避免不必要的重新渲染
 *
 * @param selector - 状态选择器函数，用于从完整状态中提取所需的部分
 * @returns 选择器返回的状态值
 *
 * @example
 * ```tsx
 * const FileList = () => {
 *   // 只订阅文件列表的变化
 *   const files = useStore(state => Array.from(state.files.values()))
 *
 *   // 只订阅拖拽状态的变化
 *   const isDragging = useStore(state => state.dragOver)
 *
 *   return (
 *     <div>
 *       <p>文件数量: {files.length}</p>
 *       <p>拖拽状态: {isDragging ? '拖拽中' : '未拖拽'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useStoreContext("FileUpload")

  const lastValueRef = useLazyRef<{ state: StoreState; value: T } | null>(() => null)

  const getSnapshot = useCallback(() => {
    const state = store.getState()
    const prevValue = lastValueRef.current

    if (prevValue && prevValue.state === state) {
      return prevValue.value
    }

    const nextValue = selector(state)
    const ref = lastValueRef as MutableRefObject<{ state: StoreState; value: T } | null>
    ref.current = {
      value: nextValue,
      state,
    }
    return nextValue
  }, [store, selector, lastValueRef])

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}
