import { useEffect, useRef, useState } from "react"

interface PerformanceMetrics {
  averageFrameTime: number
  droppedFrames: number
  maxFrameTime: number
  scrollEventFrequency: number
  updateFrequency: number
}

interface PerformanceMonitorOptions {
  enabled?: boolean
  frameTimeThreshold?: number
  logInterval?: number
}

/**
 * 🔍 ScrollArea 性能监控 Hook
 *
 * 用于监控和诊断滚动性能问题，包括：
 * - 帧率监控
 * - 事件频率统计
 * - 性能瓶颈检测
 * - 实时性能报告
 */
export function useScrollPerformanceMonitor(
  viewport: HTMLDivElement | null,
  options: PerformanceMonitorOptions = {},
) {
  const {
    enabled = false, // 默认关闭，只在开发时启用
    logInterval = 5000, // 5秒报告一次
    frameTimeThreshold = 16.67, // 60fps阈值
  } = options

  // 🔧 使用 state 来实时更新指标，而不是只在报告时更新
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    averageFrameTime: 0,
    maxFrameTime: 0,
    droppedFrames: 0,
    scrollEventFrequency: 0,
    updateFrequency: 0,
  })

  const countersRef = useRef({
    frameCount: 0,
    totalFrameTime: 0,
    scrollEventCount: 0,
    updateCount: 0,
    lastReportTime: 0,
    maxFrameTime: 0,
    droppedFrames: 0,
  })

  const lastFrameTimeRef = useRef<number>(0)
  const reportIntervalRef = useRef<number>()
  const updateIntervalRef = useRef<number>()

  useEffect(() => {
    if (!enabled || !viewport) return

    // 性能监控开始时间
    const startTime = performance.now()
    countersRef.current.lastReportTime = startTime

    // 监控滚动事件频率
    const handleScroll = () => {
      countersRef.current.scrollEventCount++
    }

    // 监控帧率和更新频率
    const monitorFrame = () => {
      const now = performance.now()

      if (lastFrameTimeRef.current > 0) {
        const frameTime = now - lastFrameTimeRef.current

        // 累计帧时间统计
        countersRef.current.totalFrameTime += frameTime
        countersRef.current.frameCount++

        // 记录最大帧时间
        if (frameTime > countersRef.current.maxFrameTime) {
          countersRef.current.maxFrameTime = frameTime
        }

        // 检测掉帧（超过阈值）
        if (frameTime > frameTimeThreshold) {
          countersRef.current.droppedFrames++
        }
      }

      lastFrameTimeRef.current = now
      countersRef.current.updateCount++

      // 继续监控下一帧
      requestAnimationFrame(monitorFrame)
    }

    // 开始监控
    viewport.addEventListener("scroll", handleScroll, { passive: true })
    requestAnimationFrame(monitorFrame)

    // 🔧 实时更新指标（每500ms更新一次UI）
    updateIntervalRef.current = window.setInterval(() => {
      const now = performance.now()
      const timeElapsed = Math.max(1, now - (countersRef.current.lastReportTime || startTime))

      // 实时计算性能指标
      const currentMetrics: PerformanceMetrics = {
        averageFrameTime:
          countersRef.current.frameCount > 0
            ? countersRef.current.totalFrameTime / countersRef.current.frameCount
            : 0,
        maxFrameTime: countersRef.current.maxFrameTime,
        droppedFrames: countersRef.current.droppedFrames,
        scrollEventFrequency: (countersRef.current.scrollEventCount / timeElapsed) * 1000,
        updateFrequency: (countersRef.current.updateCount / timeElapsed) * 1000,
      }

      setMetrics(currentMetrics)
    }, 500)

    // 定期报告性能指标
    reportIntervalRef.current = window.setInterval(() => {
      const now = performance.now()
      const timeElapsed = now - countersRef.current.lastReportTime

      // 计算性能指标
      const reportMetrics: PerformanceMetrics = {
        averageFrameTime:
          countersRef.current.frameCount > 0
            ? countersRef.current.totalFrameTime / countersRef.current.frameCount
            : 0,
        maxFrameTime: countersRef.current.maxFrameTime,
        droppedFrames: countersRef.current.droppedFrames,
        scrollEventFrequency: (countersRef.current.scrollEventCount / timeElapsed) * 1000,
        updateFrequency: (countersRef.current.updateCount / timeElapsed) * 1000,
      }

      // 输出性能报告
      console.group("🔍 ScrollArea Performance Report")
      console.log("📊 Frame Performance:")
      console.log(`  • Average frame time: ${reportMetrics.averageFrameTime.toFixed(2)}ms`)
      console.log(`  • Max frame time: ${reportMetrics.maxFrameTime.toFixed(2)}ms`)
      console.log(`  • Dropped frames: ${reportMetrics.droppedFrames}`)
      console.log(`  • Current FPS: ${(1000 / reportMetrics.averageFrameTime).toFixed(1)}`)

      console.log("⚡ Event Frequency:")
      console.log(`  • Scroll events/sec: ${reportMetrics.scrollEventFrequency.toFixed(1)}`)
      console.log(`  • Updates/sec: ${reportMetrics.updateFrequency.toFixed(1)}`)

      // 性能建议
      if (reportMetrics.averageFrameTime > frameTimeThreshold) {
        console.warn("⚠️ Performance Warning: Average frame time exceeds 60fps threshold")
      }
      if (reportMetrics.droppedFrames > 10) {
        console.warn("⚠️ Performance Warning: High number of dropped frames detected")
      }
      if (reportMetrics.scrollEventFrequency > 200) {
        console.warn(
          "⚠️ Performance Warning: Very high scroll event frequency, consider throttling",
        )
      }
      console.groupEnd()

      // 重置计数器
      countersRef.current = {
        frameCount: 0,
        totalFrameTime: 0,
        scrollEventCount: 0,
        updateCount: 0,
        lastReportTime: now,
        maxFrameTime: 0,
        droppedFrames: 0,
      }
    }, logInterval)

    return () => {
      viewport.removeEventListener("scroll", handleScroll)
      if (reportIntervalRef.current) {
        clearInterval(reportIntervalRef.current)
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [enabled, viewport, logInterval, frameTimeThreshold])

  // 返回当前性能指标（用于外部监控）
  return enabled ? metrics : null
}
