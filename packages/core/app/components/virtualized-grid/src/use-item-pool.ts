import { useRef, useMemo, useCallback } from "react"

export interface PooledItem<P> {
  index: number
  item: P
  key: string
  poolId: number
}

export interface ItemPoolOptions {
  maxPoolSize?: number
  poolSize?: number
}

export function useItemPool<P>(
  visibleItems: Array<{ item: P; key: string }>,
  options: ItemPoolOptions = {},
) {
  const { poolSize = 50, maxPoolSize = 200 } = options

  // Pool storage
  const poolRef = useRef<Map<number, PooledItem<P>>>(new Map())
  const keyToPoolIdRef = useRef<Map<string, number>>(new Map())
  const nextPoolIdRef = useRef(0)

  // Get or create pooled item
  const getPooledItem = useCallback(
    (key: string, item: P, index: number): PooledItem<P> => {
      const existingPoolId = keyToPoolIdRef.current.get(key)

      if (existingPoolId !== undefined) {
        const pooledItem = poolRef.current.get(existingPoolId)
        if (pooledItem) {
          pooledItem.item = item
          pooledItem.index = index
          return pooledItem
        }
      }

      // Find an unused pool slot or create new one
      let poolId: number | undefined

      // Check if we can reuse an existing pool slot
      const usedPoolIds = new Set(keyToPoolIdRef.current.values())
      let reusablePoolId: number | undefined

      for (let i = 0; i < nextPoolIdRef.current && i < maxPoolSize; i++) {
        if (!usedPoolIds.has(i)) {
          reusablePoolId = i
          break
        }
      }

      if (reusablePoolId !== undefined) {
        poolId = reusablePoolId
      } else if (nextPoolIdRef.current < maxPoolSize) {
        poolId = nextPoolIdRef.current++
      } else {
        // Pool is full, evict least recently used
        const keysToEvict: string[] = []
        const visibleKeys = new Set(visibleItems.map((v) => v.key))

        for (const [k, pid] of keyToPoolIdRef.current.entries()) {
          if (!visibleKeys.has(k)) {
            keysToEvict.push(k)
            poolId = pid
            break
          }
        }

        keysToEvict.forEach((k) => keyToPoolIdRef.current.delete(k))
      }

      // Ensure poolId is always assigned
      if (poolId === undefined) {
        poolId = 0 // Fallback
      }

      const pooledItem: PooledItem<P> = { key, item, index, poolId }
      poolRef.current.set(poolId, pooledItem)
      keyToPoolIdRef.current.set(key, poolId)

      return pooledItem
    },
    [maxPoolSize, visibleItems],
  )

  // Clean up unused items
  const cleanupPool = useCallback(() => {
    const visibleKeys = new Set(visibleItems.map((v) => v.key))
    const keysToRemove: string[] = []

    for (const [key, poolId] of keyToPoolIdRef.current.entries()) {
      if (!visibleKeys.has(key)) {
        keysToRemove.push(key)

        // Keep pool slots but mark them as reusable
        const pooledItem = poolRef.current.get(poolId)
        if (pooledItem && poolRef.current.size > poolSize) {
          poolRef.current.delete(poolId)
        }
      }
    }

    keysToRemove.forEach((key) => keyToPoolIdRef.current.delete(key))
  }, [visibleItems, poolSize])

  // Generate pooled items
  const pooledItems = useMemo(() => {
    const items = visibleItems.map((visibleItem, index) =>
      getPooledItem(visibleItem.key, visibleItem.item, index),
    )

    // Cleanup after render
    setTimeout(cleanupPool, 0)

    return items
  }, [visibleItems, getPooledItem, cleanupPool])

  return pooledItems
}
