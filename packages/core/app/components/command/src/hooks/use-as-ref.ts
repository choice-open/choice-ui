import React, { useRef } from "react"
import { useIsomorphicLayoutEffect } from "usehooks-ts"

export function useAsRef<T>(data: T): React.MutableRefObject<T> {
  const ref = useRef<T>(data)

  useIsomorphicLayoutEffect(() => {
    ref.current = data
  })

  return ref
}
