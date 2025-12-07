import { useCallback, useEffect, useState } from "react"

/**
 * 创建一个平滑滚动到底部的hook
 * @param scrollRef 需要滚动的容器引用
 * @param dependencies 触发自动滚动的依赖项数组
 * @param options 配置选项
 * @returns 滚动控制工具
 */
export function useScrollToBottom<T extends HTMLElement>(
  scrollRef: React.RefObject<T>,
  inputContainerRef: React.RefObject<T>,
  dependencies: unknown[] = [],
  options = {
    behavior: "smooth" as ScrollBehavior,
    threshold: 30, // 判断是否在底部的阈值像素
    delay: 0, // 滚动前的延迟时间（毫秒）
  },
) {
  // 是否应该自动滚动到底部
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)

  // 跟踪输入区域的高度，用于平滑过渡
  const [inputHeight, setInputHeight] = useState(40) // 默认高度

  // 是否正在手动输入（例如评论）
  const [isTyping, setIsTyping] = useState(false)

  /**
   * 平滑滚动到底部
   */
  const smoothScrollToBottom = useCallback(() => {
    if (!scrollRef.current) return

    const scrollElement = scrollRef.current

    const performScroll = () => {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: options.behavior,
      })
    }

    if (options.delay > 0) {
      setTimeout(performScroll, options.delay)
    } else {
      requestAnimationFrame(performScroll)
    }
  }, [scrollRef, options.behavior, options.delay])

  /**
   * 检查是否滚动到了底部
   */
  const isAtBottom = useCallback(() => {
    if (!scrollRef.current) return false

    const scrollElement = scrollRef.current
    return (
      Math.abs(scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight) <
      options.threshold
    )
  }, [scrollRef, options.threshold])

  /**
   * 处理滚动事件，判断是否应该自动滚动
   */
  const handleScroll = useCallback(() => {
    // 如果用户正在输入，不要改变滚动状态
    if (isTyping) return

    setShouldScrollToBottom(isAtBottom())
  }, [isAtBottom, isTyping])

  /**
   * 设置输入状态
   */
  const setTyping = useCallback(
    (typing: boolean) => {
      setIsTyping(typing)

      // 当用户开始输入时，确保滚动到底部
      if (typing) {
        setShouldScrollToBottom(true)
        requestAnimationFrame(smoothScrollToBottom)
      }
    },
    [smoothScrollToBottom],
  )

  /**
   * 当依赖项变化时，检查是否需要滚动到底部
   */
  useEffect(() => {
    if ((shouldScrollToBottom || isTyping) && scrollRef.current) {
      requestAnimationFrame(smoothScrollToBottom)
    }
  }, [...dependencies, shouldScrollToBottom, isTyping])

  /**
   * 在组件挂载时添加滚动事件监听
   */
  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const scrollListener = () => handleScroll()
    scrollElement.addEventListener("scroll", scrollListener)

    return () => {
      scrollElement.removeEventListener("scroll", scrollListener)
    }
  }, [scrollRef, handleScroll])

  // 处理输入区域高度变化的MutationObserver
  useEffect(() => {
    if (!inputContainerRef.current) return

    // 创建一个MutationObserver来监视高度变化
    const observer = new MutationObserver(() => {
      if (!inputContainerRef.current) return

      // 获取当前实际高度
      const newHeight = inputContainerRef.current.clientHeight

      // 只有当高度确实变化时，才更新状态
      if (newHeight !== inputHeight && newHeight > 0) {
        setInputHeight(newHeight)

        // 如果应该滚动到底部，则在高度变化后立即滚动
        if (shouldScrollToBottom || isTyping) {
          requestAnimationFrame(smoothScrollToBottom)
        }
      }
    })

    // 开始观察
    observer.observe(inputContainerRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    })

    // 清理观察器
    return () => observer.disconnect()
  }, [inputHeight, shouldScrollToBottom, isTyping, smoothScrollToBottom])

  return {
    smoothScrollToBottom,
    shouldScrollToBottom,
    setShouldScrollToBottom,
    isTyping,
    setTyping,
    isAtBottom,
    handleScroll,
  }
}
