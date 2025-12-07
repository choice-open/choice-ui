import { isFunction } from "es-toolkit"
import * as React from "react"

export type ReactRef<T> = React.RefObject<T> | React.MutableRefObject<T> | React.Ref<T>

/**
 * Assigns a value to a ref function or object
 *
 * @param ref the ref to assign to
 * @param value the value
 */
export function assignRef<T>(ref: ReactRef<T> | undefined, value: T | null) {
  if (ref == null) return

  if (isFunction(ref)) {
    ref(value)
    return
  }

  try {
    const mutableRef = ref as React.MutableRefObject<T | null>
    mutableRef.current = value
  } catch (_error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`)
  }
}

/**
 * Combine multiple React refs into a single ref function.
 * This is used mostly when you need to allow consumers forward refs to
 * internal components
 *
 * @param refs refs to assign to value to
 */
export function mergeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node))
  }
}
