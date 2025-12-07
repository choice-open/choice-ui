import { SetStateAction, useEffect, useRef } from "react"
import { useMemoizedFn, useUpdate } from "ahooks"

/**
 * useMergedValue 钩子的配置选项
 * @template T - 状态值的类型
 */
type Options<T> = {
  /**
   * 是否允许使用空值。当设置为 true 时，
   * 即使所有值源都是 undefined，也不会显示警告。
   */
  allowEmpty?: boolean
  /**
   * 内部状态的默认值，当 value 和 defaultValue 都未提供时使用。
   * 可以是一个值或返回值的函数（惰性初始化）。
   */
  defaultStateValue?: T | (() => T)
  /**
   * 非受控模式下的初始值。仅在组件首次渲染时使用。
   * 只有在未提供 value 时才会使用此值。
   */
  defaultValue?: T
  /**
   * 值变化时的回调函数。
   * 在受控模式下，此回调应更新 value。
   */
  onChange?: (value: T) => void
  /**
   * 当尝试设置与当前值相同的值时触发的回调。
   */
  onUnchange?: () => void
  /**
   * 受控模式下的值。提供此参数会使组件进入受控模式。
   * 在受控模式下，组件状态完全由此值控制。
   */
  value?: T
}

/**
 * 检查值是否为 undefined
 */
function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined
}

/**
 * 确定初始状态值
 */
function getInitialValue<T>(options: Options<T>): T {
  const { value, defaultValue, defaultStateValue, allowEmpty } = options

  if (!isUndefined(value)) {
    return value
  }

  if (!isUndefined(defaultValue)) {
    return defaultValue
  }

  if (typeof defaultStateValue === "function") {
    return (defaultStateValue as () => T)()
  }

  // if (isUndefined(defaultStateValue) && !allowEmpty) {
  //   console.warn(
  //     "useMergedValue: No value source provided. Either value, defaultValue, or defaultStateValue must be provided.",
  //   )
  // }

  return defaultStateValue as T
}

/**
 * 判断两个值是否相等，正确处理 NaN
 */
function areValuesEqual<T>(a: T, b: T): boolean {
  // 处理 NaN 情况
  if (a !== a && b !== b) {
    return true
  }
  return Object.is(a, b)
}

/**
 * 合并受控和非受控状态的 Hook
 *
 * 该 Hook 处理组件的受控和非受控两种模式：
 * - 受控模式：当提供 value 时，组件状态完全由外部控制
 * - 非受控模式：当仅提供 defaultValue 时，组件内部维护自己的状态
 *
 * @template T - 状态值的类型
 * @param options - 配置选项
 * @returns [currentValue, setValue] - 当前值和设置值的函数
 */
export function useMergedValue<T>(options: Options<T>) {
  const { value, onChange, onUnchange } = options
  const update = useUpdate()

  // 存储当前状态值
  const stateRef = useRef<T>(getInitialValue(options))

  // 追踪组件是否处于受控模式
  const isControlledRef = useRef(!isUndefined(value))

  // 追踪前一个值以检测变化
  const prevValueRef = useRef(value)

  // 同步外部受控值到内部状态
  useEffect(() => {
    const isControlled = !isUndefined(value)
    isControlledRef.current = isControlled

    if (isControlled) {
      // 仅当值实际变化时更新
      if (!areValuesEqual(value as T, stateRef.current)) {
        stateRef.current = value as T
        update()
      }
    } else if (prevValueRef.current !== value) {
      // 处理从受控切换到非受控的情况
      // 仅当切换模式时更新
      stateRef.current = value as T
      update()
    }

    prevValueRef.current = value
  }, [value, update])

  // 确保 setState 函数引用稳定
  const setState = useMemoizedFn((v: SetStateAction<T>, forceTrigger = false) => {
    const nextValue = typeof v === "function" ? (v as (prevState: T) => T)(stateRef.current) : v

    // 如果值未变化且不强制触发，则跳过更新
    if (!forceTrigger && areValuesEqual(nextValue, stateRef.current)) {
      onUnchange?.()
      return
    }

    // 受控模式下，仅触发 onChange 而不更新内部状态
    if (isControlledRef.current) {
      // 仅通知父组件关于预期的变更
      onChange?.(nextValue)
      return
    }

    // 非受控模式下，更新内部状态并触发 onChange
    stateRef.current = nextValue
    update()
    onChange?.(nextValue)
  })

  return [stateRef.current, setState] as const
}
