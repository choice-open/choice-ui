import { motion } from "framer-motion"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import tinycolor from "tinycolor2"
import { COLOR_SPACES } from "../contents"
import type {
  BoundaryCalculationResult,
  BoundaryInfo,
  ChannelFieldSpace,
  PaintState,
  RecommendedPoint,
} from "../types/colors"

interface CheckColorContrastBoundaryProps {
  boundaryData: BoundaryCalculationResult
  colorSpace: ChannelFieldSpace
  foregroundAlpha?: number
  height?: number
  paintState: PaintState
  recommendedPoint: RecommendedPoint | null
  showRecommendedPoint?: boolean
  updateRecommendedPoint: () => RecommendedPoint | null
  width?: number
}

// 线性插值
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t

// 缓动函数（ease-out立方）
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export const CheckColorContrastBoundary = memo(function CheckColorContrastBoundary(
  props: CheckColorContrastBoundaryProps,
) {
  const {
    width = 0,
    height = 0,
    foregroundAlpha = 1,
    showRecommendedPoint = false,
    recommendedPoint,
    boundaryData,
    updateRecommendedPoint,
    colorSpace,
    paintState,
  } = props

  // 使用两个独立的Canvas分别绘制曲线和点
  const boundaryCanvasRef = useRef<HTMLCanvasElement>(null)
  const pointCanvasRef = useRef<HTMLCanvasElement>(null)

  const isHSL = colorSpace === COLOR_SPACES.HSL
  const hue = paintState.h
  const saturation = isHSL ? paintState.hsl_s : paintState.hsv_s
  const luminance = isHSL ? paintState.l : paintState.v
  const roundedHue = Math.round(hue)

  // 动画位置的状态
  const [animatedPointPos, setAnimatedPointPos] = useState<{ x: number; y: number } | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const animationStateRef = useRef<{
    duration: number
    startPos: { x: number; y: number } | null
    startTime: number | null
    targetPos: { x: number; y: number } | null
  }>({ startTime: null, startPos: null, targetPos: null, duration: 50 })

  useEffect(() => {
    if (showRecommendedPoint) {
      // 不重新计算boundaryData，只更新推荐点位置
      updateRecommendedPoint()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRecommendedPoint])

  const runAnimationLoop = () => {
    const state = animationStateRef.current
    if (!state.startTime || !state.startPos || !state.targetPos) {
      return
    }

    const elapsed = performance.now() - state.startTime
    const progress = Math.min(elapsed / state.duration, 1)
    const easedProgress = easeOutCubic(progress)

    const currentX = lerp(state.startPos.x, state.targetPos.x, easedProgress)
    const currentY = lerp(state.startPos.y, state.targetPos.y, easedProgress)

    setAnimatedPointPos({ x: currentX, y: currentY })

    if (progress < 1) {
      animationFrameId.current = requestAnimationFrame(runAnimationLoop)
    } else {
      animationFrameId.current = null
      state.startTime = null
    }
  }

  useEffect(() => {
    const stopAnimation = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
      animationStateRef.current.startTime = null
    }

    if (showRecommendedPoint && recommendedPoint) {
      const targetPos = { x: recommendedPoint.x, y: recommendedPoint.y }
      let startPos = animatedPointPos

      if (!startPos) {
        const startSat = isHSL ? paintState.hsl_s : paintState.hsv_s
        const startVal = isHSL ? paintState.l : paintState.v
        startPos = {
          x: startSat * width,
          y: (1 - startVal) * height,
        }
      }

      if (
        !animationStateRef.current.startTime &&
        (Math.abs(startPos.x - targetPos.x) > 0.1 || Math.abs(startPos.y - targetPos.y) > 0.1)
      ) {
        stopAnimation()
        animationStateRef.current.startPos = startPos
        animationStateRef.current.targetPos = targetPos
        animationStateRef.current.startTime = performance.now()
        setAnimatedPointPos(startPos)
        animationFrameId.current = requestAnimationFrame(runAnimationLoop)
      } else if (!animationStateRef.current.startTime) {
        setAnimatedPointPos(targetPos)
      }
    } else {
      stopAnimation()
      setAnimatedPointPos(null)
    }

    return stopAnimation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRecommendedPoint, recommendedPoint, width, height, isHSL, saturation, luminance])

  const boundaryPaths = useMemo(() => {
    if (!boundaryData || width <= 0 || height <= 0) {
      return null
    }

    const { lowerBoundary, upperBoundary } = boundaryData
    if (!lowerBoundary && !upperBoundary) {
      return null
    }

    const paths = {
      lowerPath: null as string | null,
      upperPath: null as string | null,
    }

    if (lowerBoundary?.bezierSegments?.length) {
      const segments = lowerBoundary.bezierSegments
      let pathD = `M${segments[0].start[0]},${segments[0].start[1]}`

      for (const segment of segments) {
        pathD += ` C${segment.cp1[0]},${segment.cp1[1]} ${segment.cp2[0]},${segment.cp2[1]} ${segment.end[0]},${segment.end[1]}`
      }

      pathD += ` L${width},${height} L0,${height} Z`
      paths.lowerPath = pathD
    }

    if (upperBoundary?.bezierSegments?.length) {
      const segments = upperBoundary.bezierSegments
      let pathD = `M${segments[0].start[0]},${segments[0].start[1]}`

      for (const segment of segments) {
        pathD += ` C${segment.cp1[0]},${segment.cp1[1]} ${segment.cp2[0]},${segment.cp2[1]} ${segment.end[0]},${segment.end[1]}`
      }

      pathD += ` L${width},0 L0,0 Z`
      paths.upperPath = pathD
    }

    return paths
  }, [boundaryData, width, height])

  useEffect(() => {
    if (width <= 0 || height <= 0 || !boundaryData) return

    const { lowerBoundary, upperBoundary } = boundaryData
    if (!lowerBoundary && !upperBoundary) return

    const canvas = boundaryCanvasRef.current
    if (!canvas) return

    // 设置canvas尺寸 (考虑高DPI显示)
    // canvas 使用 -inset-[3px] 偏移，所以实际尺寸是 width + 6, height + 6
    const dpr = window.devicePixelRatio || 1
    const canvasWidth = width + 6
    const canvasHeight = height + 6
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(dpr, dpr)

    // 偏移 3px 来补偿 -inset-[3px]
    ctx.translate(3, 3)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // 绘制边界区域和网格点
    ctx.save()
    ctx.beginPath()

    // 使用贝塞尔曲线创建覆盖不安全区域的裁剪路径
    if (lowerBoundary && upperBoundary) {
      const lowerSegments = lowerBoundary.bezierSegments
      const upperSegments = upperBoundary.bezierSegments

      if (lowerSegments?.length && upperSegments?.length) {
        // 检查是否是真正的双边界（两条曲线都在画布内部）
        // 计算 upperBoundary 的平均 Y 值
        const upperAvgY =
          upperSegments.reduce((sum, seg) => sum + seg.start[1] + seg.end[1], 0) /
          (upperSegments.length * 2)
        // 计算 lowerBoundary 的平均 Y 值
        const lowerAvgY =
          lowerSegments.reduce((sum, seg) => sum + seg.start[1] + seg.end[1], 0) /
          (lowerSegments.length * 2)

        const edgeThreshold = 5 // 边缘阈值

        // upperBoundary 在顶部边缘 -> 实际是单边界（只有 lowerBoundary 可见）
        if (upperAvgY < edgeThreshold) {
          // 不安全区在 lowerBoundary 下方
          ctx.moveTo(lowerSegments[0].start[0], lowerSegments[0].start[1])
          for (const segment of lowerSegments) {
            ctx.bezierCurveTo(
              segment.cp1[0],
              segment.cp1[1],
              segment.cp2[0],
              segment.cp2[1],
              segment.end[0],
              segment.end[1],
            )
          }
          ctx.lineTo(width, height)
          ctx.lineTo(0, height)
          ctx.closePath()
        }
        // lowerBoundary 在底部边缘 -> 实际是单边界（只有 upperBoundary 可见）
        else if (lowerAvgY > height - edgeThreshold) {
          // 不安全区在 upperBoundary 上方
          ctx.moveTo(upperSegments[0].start[0], upperSegments[0].start[1])
          for (const segment of upperSegments) {
            ctx.bezierCurveTo(
              segment.cp1[0],
              segment.cp1[1],
              segment.cp2[0],
              segment.cp2[1],
              segment.end[0],
              segment.end[1],
            )
          }
          ctx.lineTo(width, 0)
          ctx.lineTo(0, 0)
          ctx.closePath()
        }
        // 真正的双边界：不安全区在中间
        else {
          ctx.moveTo(upperSegments[0].start[0], upperSegments[0].start[1])
          for (const segment of upperSegments) {
            ctx.bezierCurveTo(
              segment.cp1[0],
              segment.cp1[1],
              segment.cp2[0],
              segment.cp2[1],
              segment.end[0],
              segment.end[1],
            )
          }
          const lastLowerSegment = lowerSegments[lowerSegments.length - 1]
          ctx.lineTo(lastLowerSegment.end[0], lastLowerSegment.end[1])
          for (let i = lowerSegments.length - 1; i >= 0; i--) {
            const segment = lowerSegments[i]
            ctx.bezierCurveTo(
              segment.cp2[0],
              segment.cp2[1],
              segment.cp1[0],
              segment.cp1[1],
              segment.start[0],
              segment.start[1],
            )
          }
          ctx.closePath()
        }
      }
    } else if (lowerBoundary) {
      // 只有 lower 边界：裁剪低于它
      const lowerSegments = lowerBoundary.bezierSegments

      if (lowerSegments?.length) {
        ctx.moveTo(lowerSegments[0].start[0], lowerSegments[0].start[1])
        for (const segment of lowerSegments) {
          ctx.bezierCurveTo(
            segment.cp1[0],
            segment.cp1[1],
            segment.cp2[0],
            segment.cp2[1],
            segment.end[0],
            segment.end[1],
          )
        }
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
      } else {
        const lowerPoints = lowerBoundary.simplifiedPoints
        if (lowerPoints?.length >= 2) {
          ctx.moveTo(lowerPoints[0][0], lowerPoints[0][1])
          for (let i = 1; i < lowerPoints.length; i++) {
            ctx.lineTo(lowerPoints[i][0], lowerPoints[i][1])
          }
          ctx.lineTo(width, height)
          ctx.lineTo(0, height)
          ctx.closePath()
        } else {
          ctx.moveTo(0, height)
          ctx.lineTo(width, height)
          ctx.lineTo(width, 0)
          ctx.lineTo(0, 0)
          ctx.closePath()
        }
      }
    } else if (upperBoundary) {
      // 只有 upper 边界：裁剪高于它
      const upperSegments = upperBoundary.bezierSegments

      if (upperSegments?.length) {
        ctx.moveTo(upperSegments[0].start[0], upperSegments[0].start[1])
        for (const segment of upperSegments) {
          ctx.bezierCurveTo(
            segment.cp1[0],
            segment.cp1[1],
            segment.cp2[0],
            segment.cp2[1],
            segment.end[0],
            segment.end[1],
          )
        }
        ctx.lineTo(width, 0)
        ctx.lineTo(0, 0)
        ctx.closePath()
      } else {
        // 如果段缺失，则回退
        const upperPoints = upperBoundary.simplifiedPoints
        if (upperPoints?.length >= 2) {
          ctx.moveTo(upperPoints[0][0], upperPoints[0][1])
          for (let i = 1; i < upperPoints.length; i++) {
            ctx.lineTo(upperPoints[i][0], upperPoints[i][1])
          }
          ctx.lineTo(width, 0)
          ctx.lineTo(0, 0)
          ctx.closePath()
        }
      }
    }

    // 应用裁剪
    ctx.clip()

    // 在裁剪区域内绘制网格点
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)"
    const dotSize = 1
    const dotSpacing = 6 // 常量点间距

    // 绘制网格点
    for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
      for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
        ctx.beginPath()
        ctx.arc(x, y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()

    // --- 绘制边界线 ---
    const drawBoundaryLine = (boundary: BoundaryInfo | null) => {
      if (!boundary) return

      // 如果可用，则使用贝塞尔段，否则回退到简化点
      if (boundary.bezierSegments?.length) {
        const segments = boundary.bezierSegments
        ctx.beginPath()
        ctx.moveTo(segments[0].start[0], segments[0].start[1])
        for (const segment of segments) {
          ctx.bezierCurveTo(
            segment.cp1[0],
            segment.cp1[1],
            segment.cp2[0],
            segment.cp2[1],
            segment.end[0],
            segment.end[1],
          )
        }
      } else if (boundary.simplifiedPoints?.length >= 2) {
        // 如果没有任何贝塞尔段，则回退到直线
        const points = boundary.simplifiedPoints
        ctx.beginPath()
        ctx.moveTo(points[0][0], points[0][1])
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1])
        }
      } else {
        // 如果既没有段也没有足够的点，则无法绘制
        return
      }

      // 样式和绘制路径
      ctx.lineWidth = 1
      ctx.strokeStyle = "white"
      ctx.lineJoin = "round"
      ctx.lineCap = "round"
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
      ctx.shadowBlur = 1
      ctx.shadowOffsetY = 0.5
      ctx.stroke()
      ctx.shadowColor = "transparent"
    }

    drawBoundaryLine(lowerBoundary)
    drawBoundaryLine(upperBoundary)
    // boundaryPaths 在依赖数组中用于确保路径变化时触发重绘
  }, [width, height, roundedHue, foregroundAlpha, isHSL, boundaryData, boundaryPaths])

  // 单独的函数来处理推荐点的绘制
  useEffect(() => {
    const canvas = pointCanvasRef.current
    if (!canvas || !canvas.getContext) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 获取DPI比例
    const dpr = window.devicePixelRatio || 1

    // canvas 使用 -inset-[3px] 偏移，所以实际尺寸是 width + 6, height + 6
    const canvasWidth = width + 6
    const canvasHeight = height + 6

    // 清除整个点位canvas（无论是否有动画点位都要清除）
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr

    // 如果没有动画点位或尺寸无效，只清除画布不绘制
    if (!animatedPointPos || width <= 0 || height <= 0) return

    // 设置缩放
    ctx.scale(dpr, dpr)

    // 点的位置 - 需要加上 3px 偏移来补偿 -inset-[3px]
    const { x, y } = animatedPointPos
    const drawX = x + 3
    const drawY = y + 3

    // 外层白色圆圈
    ctx.beginPath()
    ctx.arc(drawX, drawY, 6, 0, Math.PI * 2)
    ctx.fillStyle = "white"
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
    ctx.shadowBlur = 2
    ctx.shadowOffsetY = 1
    ctx.fill()

    // 内层彩色圆圈
    ctx.beginPath()
    ctx.arc(drawX, drawY, 4, 0, Math.PI * 2)
    ctx.shadowColor = "transparent"

    let innerColor = "black"
    if (recommendedPoint) {
      // 直接使用recommendedPoint原始精确值
      const s = recommendedPoint.slX
      const yValue = recommendedPoint.slY
      let color: tinycolor.Instance | undefined
      if (isHSL) {
        color = tinycolor({ h: roundedHue, s, l: yValue, a: foregroundAlpha })
      } else {
        color = tinycolor({ h: roundedHue, s, v: yValue, a: foregroundAlpha })
      }
      if (color?.isValid()) {
        innerColor = color.toRgbString()
      }
    }

    ctx.fillStyle = innerColor
    ctx.fill()
  }, [animatedPointPos, recommendedPoint, roundedHue, foregroundAlpha, isHSL, width, height])

  if (width <= 0 || height <= 0) return null

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 block overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        className="absolute -inset-[3px] block overflow-hidden"
        ref={boundaryCanvasRef}
        style={{
          width: `${width + 6}px`,
          height: `${height + 6}px`,
        }}
      />
      <canvas
        className="absolute -inset-[3px] block overflow-hidden"
        ref={pointCanvasRef}
        style={{
          width: `${width + 6}px`,
          height: `${height + 6}px`,
        }}
      />
    </motion.div>
  )
})

export type { BoundaryCalculationResult, BoundaryInfo }
