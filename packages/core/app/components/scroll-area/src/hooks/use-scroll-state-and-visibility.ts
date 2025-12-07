import { useCallback, useEffect, useRef, useState } from "react"
import type { ScrollState } from "../types"

/**
 * 合并的滚动状态和可见性管理 hook - 避免重复监听滚动事件
 */
export function useScrollStateAndVisibility(viewport: HTMLDivElement | null) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  })

  const [isHovering, setIsHovering] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<number>()
  const rafRef = useRef<number>()
  const resizeObserverRef = useRef<ResizeObserver>()
  const mutationObserverRef = useRef<MutationObserver>()
  const mutationTimeoutRef = useRef<number>()

  // 🚀 性能优化：防止重复更新的状态缓存
  const lastUpdateTimeRef = useRef<number>(0)
  const minUpdateIntervalRef = useRef<number>(16) // ~60fps

  // 🚀 性能优化：智能更新策略 - 根据滚动速度调整更新频率
  const updateScrollState = useCallback(() => {
    if (!viewport) return

    const now = performance.now()
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current

    // 防止过于频繁的更新
    if (timeSinceLastUpdate < minUpdateIntervalRef.current) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        updateScrollState()
      })
      return
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const newState = {
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop,
        scrollWidth: viewport.scrollWidth,
        scrollHeight: viewport.scrollHeight,
        clientWidth: viewport.clientWidth,
        clientHeight: viewport.clientHeight,
      }

      // 🚀 性能优化：使用更精确的浅比较，只在真正有变化时更新状态
      setScrollState((prevState) => {
        // 使用更严格的比较，避免浮点数精度问题
        const scrollLeftChanged = Math.abs(prevState.scrollLeft - newState.scrollLeft) > 0.5
        const scrollTopChanged = Math.abs(prevState.scrollTop - newState.scrollTop) > 0.5
        const scrollWidthChanged = prevState.scrollWidth !== newState.scrollWidth
        const scrollHeightChanged = prevState.scrollHeight !== newState.scrollHeight
        const clientWidthChanged = prevState.clientWidth !== newState.clientWidth
        const clientHeightChanged = prevState.clientHeight !== newState.clientHeight

        const hasChanges =
          scrollLeftChanged ||
          scrollTopChanged ||
          scrollWidthChanged ||
          scrollHeightChanged ||
          clientWidthChanged ||
          clientHeightChanged

        if (hasChanges) {
          lastUpdateTimeRef.current = now
          return newState
        }

        return prevState
      })
    })
  }, [viewport])

  // 延迟更新滚动状态，用于处理 dialog/popover 初始化时的布局延迟
  const delayedUpdateScrollState = useCallback(() => {
    // 使用 setTimeout 确保在 DOM 布局完成后更新
    setTimeout(() => {
      updateScrollState()
    }, 0)
  }, [updateScrollState])

  // 🚀 性能优化：智能滚动检测 - 根据滚动速度调整检测灵敏度
  const handleScroll = useCallback(() => {
    const now = performance.now()
    const timeSinceLastScroll = now - (lastUpdateTimeRef.current || 0)

    // 根据滚动频率动态调整更新间隔
    if (timeSinceLastScroll < 8) {
      // 快速滚动时降低更新频率
      minUpdateIntervalRef.current = 32 // ~30fps
    } else if (timeSinceLastScroll > 100) {
      // 慢速滚动时提高更新精度
      minUpdateIntervalRef.current = 16 // ~60fps
    }

    updateScrollState()

    // 处理滚动状态
    setIsScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
      // 重置更新间隔
      minUpdateIntervalRef.current = 16
    }, 1000)
  }, [updateScrollState])

  useEffect(() => {
    if (!viewport) return

    const handleResize = () => {
      updateScrollState()
    }

    // 🚀 性能优化：使用AbortController和被动事件监听器
    const abortController = new AbortController()
    const signal = abortController.signal

    // 使用被动事件监听器提升滚动性能
    viewport.addEventListener("scroll", handleScroll, {
      passive: true,
      signal,
      capture: false, // 避免不必要的事件捕获
    })

    window.addEventListener("resize", handleResize, {
      passive: true,
      signal,
    })

    // 🔧 ResizeObserver 监听viewport尺寸变化
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        // 🚀 性能优化：批量处理 ResizeObserver 回调
        for (const entry of entries) {
          // 只处理我们关心的元素
          if (entry.target === viewport) {
            updateScrollState()
            break
          }
        }
      })
      resizeObserverRef.current.observe(viewport)
    }

    // 🔧 MutationObserver 监听内容变化（节流处理）
    if (window.MutationObserver) {
      mutationObserverRef.current = new MutationObserver((mutations) => {
        // 🚀 性能优化：智能变化检测 - 只对影响布局的变化响应
        const hasLayoutChanges = mutations.some((mutation) => {
          if (mutation.type === "childList") {
            return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
          }
          if (mutation.type === "attributes") {
            const attr = mutation.attributeName
            return attr === "style" || attr === "class"
          }
          return mutation.type === "characterData"
        })

        if (!hasLayoutChanges) return

        // 节流处理，避免过于频繁的更新
        if (mutationTimeoutRef.current) {
          clearTimeout(mutationTimeoutRef.current)
        }
        mutationTimeoutRef.current = window.setTimeout(() => {
          updateScrollState()
        }, 16) // 约60fps的更新频率
      })

      mutationObserverRef.current.observe(viewport, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"], // 只监听影响布局的属性
        characterData: true,
        characterDataOldValue: false, // 不需要旧值，提升性能
        attributeOldValue: false,
      })
    }

    // 🔧 初始化时使用延迟更新，处理dialog/popover布局延迟问题
    delayedUpdateScrollState()

    return () => {
      // 统一清理所有资源
      abortController.abort()

      // 清理定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = undefined
      }

      if (mutationTimeoutRef.current) {
        clearTimeout(mutationTimeoutRef.current)
        mutationTimeoutRef.current = undefined
      }

      // 清理RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }

      // 🔧 清理观察者
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = undefined
      }

      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect()
        mutationObserverRef.current = undefined
      }
    }
  }, [viewport, handleScroll, delayedUpdateScrollState])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => setIsHovering(false), [])

  return {
    scrollState,
    isHovering,
    isScrolling,
    handleMouseEnter,
    handleMouseLeave,
  }
}
