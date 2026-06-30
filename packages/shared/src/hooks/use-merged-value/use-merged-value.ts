import { SetStateAction, useEffect, useRef } from "react"
import { useMemoizedFn, useUpdate } from "ahooks"

type Options<T> = {
  allowEmpty?: boolean
  defaultStateValue?: T | (() => T)
  defaultValue?: T
  onChange?: (value: T) => void
  onUnchange?: () => void
  value?: T
}

function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined
}

function getInitialValue<T>(options: Options<T>): T {
  const { value, defaultValue, defaultStateValue } = options

  if (!isUndefined(value)) {
    return value
  }

  if (!isUndefined(defaultValue)) {
    return defaultValue
  }

  if (typeof defaultStateValue === "function") {
    return (defaultStateValue as () => T)()
  }

  return defaultStateValue as T
}

function areValuesEqual<T>(a: T, b: T): boolean {
  if (a !== a && b !== b) {
    return true
  }
  return Object.is(a, b)
}

export function useMergedValue<T>(options: Options<T>) {
  const { value, onChange, onUnchange } = options
  const update = useUpdate()

  const stateRef = useRef<T>(getInitialValue(options))
  const isControlledRef = useRef(!isUndefined(value))
  const prevValueRef = useRef(value)

  useEffect(() => {
    const isControlled = !isUndefined(value)
    isControlledRef.current = isControlled

    if (isControlled) {
      if (!areValuesEqual(value as T, stateRef.current)) {
        stateRef.current = value as T
        update()
      }
    } else if (prevValueRef.current !== value) {
      stateRef.current = value as T
      update()
    }

    prevValueRef.current = value
  }, [value, update])

  const setState = useMemoizedFn((v: SetStateAction<T>, forceTrigger = false) => {
    const nextValue = typeof v === "function" ? (v as (prevState: T) => T)(stateRef.current) : v

    if (!forceTrigger && areValuesEqual(nextValue, stateRef.current)) {
      onUnchange?.()
      return
    }

    if (isControlledRef.current) {
      onChange?.(nextValue)
      return
    }

    stateRef.current = nextValue
    update()
    onChange?.(nextValue)
  })

  return [stateRef.current, setState] as const
}
