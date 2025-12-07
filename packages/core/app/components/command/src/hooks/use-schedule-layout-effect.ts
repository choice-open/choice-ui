import { useCallback, useState } from "react"
import { useIsomorphicLayoutEffect } from "usehooks-ts"
import { useLazyRef } from "@choiceform/design-shared"

/** 在下一个 layout effect 周期内以命令式方式运行函数。 */
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
