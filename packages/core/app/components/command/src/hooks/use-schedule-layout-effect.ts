import { useCallback, useState } from "react"
import { useIsomorphicLayoutEffect } from "usehooks-ts"
import { useLazyRef } from "@choice-ui/shared"

/** Run functions imperatively in the next layout effect cycle. */
export const useScheduleLayoutEffect = () => {
  const [updateCount, setUpdateCount] = useState(0)
  const fns = useLazyRef(() => new Map<string | number, () => void>())

  useIsomorphicLayoutEffect(() => {
    fns.current.forEach((f) => f())
    fns.current = new Map()
  }, [updateCount])

  return useCallback((id: string | number, cb: () => void) => {
    fns.current.set(id, cb)
    setUpdateCount((prev) => prev + 1)
  }, [])
}
