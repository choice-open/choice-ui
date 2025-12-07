import { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface UseNodeWidthOptions {
  /**
   * 节点标识，用于唯一标识此节点
   */
  nodeId: string

  /**
   * 节点名称，名称变化时会触发重新测量
   */
  name: string

  /**
   * 缩进级别，影响计算的总宽度
   */
  level: number

  /**
   * 是否处于重命名状态
   */
  isRenaming: boolean

  /**
   * 重命名时的值
   */
  renameValue?: string

  /**
   * 是否被hover
   */
  isHovered?: boolean

  /**
   * 容器宽度，用于计算滚动时的宽度
   */
  containerWidth?: number

  /**
   * 宽度变化时的回调函数
   */
  onWidthChange?: (nodeId: string, width: number) => void

  /**
   * 重置重命名状态的回调函数
   */
  onResetRenaming?: () => void
}

/**
 * 用于测量和跟踪节点宽度的 hook
 */
export function useNodeWidth({
  nodeId,
  name,
  level,
  isRenaming,
  renameValue,
  isHovered = false,
  containerWidth,
  onWidthChange,
  onResetRenaming,
}: UseNodeWidthOptions) {
  // 内容引用
  const contentRef = useRef<HTMLDivElement | null>(null)

  // 缓存上次测量的宽度，避免不必要的更新
  const lastWidthRef = useRef<number>(0)

  // 跟踪滚动位置
  const scrollXRef = useRef<number>(0)

  // 当前节点宽度
  const [nodeWidth, setNodeWidth] = useState<string>("100%")

  const defaultWidth = useMemo(() => {
    return containerWidth ? `${containerWidth - 12}px` : "100%"
  }, [containerWidth])

  // 测量函数 - 使用useCallback避免重复创建
  const measureWidth = useCallback(() => {
    if (!contentRef.current) return 0

    try {
      // 测量内容宽度，优先使用精确计算
      const textSpan = contentRef.current.querySelector("span")
      const inputElement = contentRef.current.querySelector("input")

      // 获取节点宽度 - 尝试更精确的计算
      let contentWidth = 0

      if (textSpan) {
        // 对于文本，获取实际文本内容的宽度
        const text = textSpan.textContent || ""
        // 使用 Canvas 测量文本宽度，这比 getBoundingClientRect 更精确
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (context) {
          // 获取元素的实际计算样式
          const computedStyle = window.getComputedStyle(textSpan)
          context.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`
          contentWidth = context.measureText(text).width
        } else {
          // 回退到 getBoundingClientRect
          contentWidth = textSpan.getBoundingClientRect().width
        }
      } else if (inputElement) {
        // 对于输入框，直接使用其宽度
        contentWidth = inputElement.scrollWidth
      } else {
        // 回退方案
        contentWidth = contentRef.current.scrollWidth
      }

      // 计算缩进
      const indentWidth = level * 24 // 缩进宽度

      // 添加内边距和按钮的空间，但保持较小值
      const paddingLeft = 8 // 左内边距
      const paddingRight = 16 // 右内边距和操作按钮空间

      // 计算总宽度，添加小额缓冲区
      const totalWidth = Math.ceil(indentWidth + contentWidth + paddingLeft + paddingRight + 4)

      // 安全检查，防止极端值
      const maxReasonableWidth = 3000 // 设置一个合理的最大宽度
      const finalWidth = Math.min(totalWidth, maxReasonableWidth)

      // 只有当宽度实际变化时才通知变化
      if (Math.abs(finalWidth - lastWidthRef.current) > 1) {
        // 1px容差避免浮点误差
        lastWidthRef.current = finalWidth
        onWidthChange?.(nodeId, finalWidth)
      }

      return finalWidth
    } catch (e) {
      // 出现异常时使用上次的宽度
      console.warn("Error measuring node width:", e)
      return lastWidthRef.current
    }
  }, [level, nodeId, onWidthChange])

  // 在组件挂载和ref变化时进行初始测量
  useEffect(() => {
    if (!contentRef.current) return

    // 初始测量
    measureWidth()

    // 使用 ResizeObserver 监听元素大小变化
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        measureWidth()
      })
    })

    resizeObserver.observe(contentRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [measureWidth])

  // 监听可能导致宽度变化的因素
  useEffect(() => {
    // 使用 requestAnimationFrame 减少性能影响
    const measureId = requestAnimationFrame(() => {
      measureWidth()
    })

    return () => {
      cancelAnimationFrame(measureId)
    }
  }, [name, isRenaming, renameValue, level, measureWidth])

  // 更新节点宽度 - 基于滚动位置
  const updateNodeWidth = useCallback(() => {
    if (!isHovered && !isRenaming) {
      // 如果既不是悬浮状态也不是重命名状态，使用默认宽度
      setNodeWidth("100%")
      return
    }

    // scroll x = 0 的时候，宽度为 containerWidth
    // scroll x > 0 的时候，宽度为 containerWidth + scroll x
    const scrollX = scrollXRef.current
    const baseWidth = containerWidth || 0 // 使用提供的容器宽度或默认值

    if (scrollX > 0) {
      const newWidth = `${baseWidth + scrollX}px`
      setNodeWidth(newWidth)
    } else {
      setNodeWidth(defaultWidth)
    }
  }, [containerWidth, isHovered, isRenaming, defaultWidth])

  // 处理基于 hover 和滚动的宽度计算
  useEffect(() => {
    if (!isHovered && !isRenaming) {
      // 当不处于悬浮状态且不在重命名状态时，重置为默认宽度
      setNodeWidth("100%")
      return
    }

    // 获取滚动容器
    const scrollContainer = document.querySelector(".tree-list__scroll-container") as HTMLElement
    if (!scrollContainer) return

    // 初始化滚动位置
    scrollXRef.current = scrollContainer.scrollLeft

    // 初始化宽度计算
    updateNodeWidth()

    // 滚动处理函数
    const handleScroll = () => {
      if (!scrollContainer) return

      // 更新滚动位置
      scrollXRef.current = scrollContainer.scrollLeft

      // 如果是重命名状态且开始滚动，结束重命名
      if (isRenaming && scrollXRef.current > 0) {
        onResetRenaming?.()
      }

      // 更新宽度 - 在hover状态或重命名状态下更新
      updateNodeWidth()
    }

    // 添加滚动监听
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })

    // 清理函数
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [isHovered, isRenaming, containerWidth, defaultWidth, updateNodeWidth, onResetRenaming])

  // 手动触发测量的函数，用于特殊情况下的主动测量
  const triggerMeasure = useCallback(() => {
    requestAnimationFrame(measureWidth)
  }, [measureWidth])

  return {
    contentRef,
    triggerMeasure,
    nodeWidth,
  }
}
