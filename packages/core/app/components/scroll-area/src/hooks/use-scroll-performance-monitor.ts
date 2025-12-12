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
 * 🔍 ScrollArea performance monitoring Hook
 *
 * Used to monitor and diagnose scroll performance issues, including:
 * - Frame rate monitoring
 * - Event frequency statistics
 * - Performance bottleneck detection
 * - Real-time performance reporting
 */
export function useScrollPerformanceMonitor(
  viewport: HTMLDivElement | null,
  options: PerformanceMonitorOptions = {},
) {
  const {
    enabled = false, // Default disabled, only enabled in development
    logInterval = 5000, // Report every 5 seconds
    frameTimeThreshold = 16.67, // 60fps threshold
  } = options

  // 🔧 Use state to update metrics in real-time, rather than just when reporting
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

    // Performance monitoring start time
    const startTime = performance.now()
    countersRef.current.lastReportTime = startTime

    // Monitor scroll event frequency
    const handleScroll = () => {
      countersRef.current.scrollEventCount++
    }

    // Monitor frame rate and update frequency
    const monitorFrame = () => {
      const now = performance.now()

      if (lastFrameTimeRef.current > 0) {
        const frameTime = now - lastFrameTimeRef.current

        // Accumulate frame time statistics
        countersRef.current.totalFrameTime += frameTime
        countersRef.current.frameCount++

        // Record maximum frame time
        if (frameTime > countersRef.current.maxFrameTime) {
          countersRef.current.maxFrameTime = frameTime
        }

        // Detect dropped frames (exceeding threshold)
        if (frameTime > frameTimeThreshold) {
          countersRef.current.droppedFrames++
        }
      }

      lastFrameTimeRef.current = now
      countersRef.current.updateCount++

      // Continue monitoring the next frame
      requestAnimationFrame(monitorFrame)
    }

    // Start monitoring
    viewport.addEventListener("scroll", handleScroll, { passive: true })
    requestAnimationFrame(monitorFrame)

    // 🔧 Real-time update metrics (update every 500ms UI)
    updateIntervalRef.current = window.setInterval(() => {
      const now = performance.now()
      const timeElapsed = Math.max(1, now - (countersRef.current.lastReportTime || startTime))

      // Real-time calculate performance metrics
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

    // Periodically report performance metrics
    reportIntervalRef.current = window.setInterval(() => {
      const now = performance.now()
      const timeElapsed = now - countersRef.current.lastReportTime

      // Calculate performance metrics
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

      // Output performance report
      console.group("🔍 ScrollArea Performance Report")
      console.log("📊 Frame Performance:")
      console.log(`  • Average frame time: ${reportMetrics.averageFrameTime.toFixed(2)}ms`)
      console.log(`  • Max frame time: ${reportMetrics.maxFrameTime.toFixed(2)}ms`)
      console.log(`  • Dropped frames: ${reportMetrics.droppedFrames}`)
      console.log(`  • Current FPS: ${(1000 / reportMetrics.averageFrameTime).toFixed(1)}`)

      console.log("⚡ Event Frequency:")
      console.log(`  • Scroll events/sec: ${reportMetrics.scrollEventFrequency.toFixed(1)}`)
      console.log(`  • Updates/sec: ${reportMetrics.updateFrequency.toFixed(1)}`)

      // Performance suggestions
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

      // Reset counters
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

  // Return current performance metrics (for external monitoring)
  return enabled ? metrics : null
}
