import { round } from "es-toolkit"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import tinycolor from "tinycolor2"
import type {
  BoundaryCalculationResult,
  BoundaryInfo,
  ChannelFieldSpace,
  CheckColorContrastCategory,
  CheckColorContrastLevel,
  PaintState,
  RecommendedPoint,
  RGB,
} from "../types/colors"
import { createBoundaryWorker } from "../workers/boundary-calculator.worker.bundled"

// 计算三次贝塞尔曲线在参数 t 处的值的辅助函数
const evaluateCubicBezier = (p0: number, p1: number, p2: number, p3: number, t: number): number => {
  const u = 1 - t
  const tt = t * t
  const uu = u * u
  const uuu = uu * u
  const ttt = tt * t
  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3
}

interface WorkerParams {
  backgroundColor: RGB
  category: CheckColorContrastCategory
  colorSpace: ChannelFieldSpace
  foregroundAlpha: number
  height: number
  hue: number
  level: CheckColorContrastLevel
  selectedElementType: "text" | "graphics"
  width: number
}

interface WorkerRequest {
  id: number
  params: WorkerParams
}

// 序列化参数用于比较（只比较关键参数）
const serializeParams = (params: WorkerParams): string => {
  return `${params.hue}-${params.width}-${params.height}-${params.foregroundAlpha}-${params.level}-${params.category}-${params.selectedElementType}-${params.colorSpace}-${params.backgroundColor.r}-${params.backgroundColor.g}-${params.backgroundColor.b}`
}

interface WorkerResponse {
  error?: string
  id: number
  result?: BoundaryCalculationResult
}

interface ColorContrastRecommendationOptions {
  onColorChange?: (color: RGB, alpha: number, preserveHue?: number) => void
}

interface ColorContrastRecommendationProps {
  backgroundColor: RGB
  category?: CheckColorContrastCategory
  colorSpace: ChannelFieldSpace
  foregroundAlpha: number
  height: number
  hue: number
  level?: CheckColorContrastLevel
  options?: ColorContrastRecommendationOptions
  paintState: PaintState
  selectedElementType: "text" | "graphics"
  width: number
}

// 计算对比度边界和推荐点位置
export const useColorContrastRecommendation = (props: ColorContrastRecommendationProps) => {
  const {
    width,
    height,
    hue,
    backgroundColor,
    foregroundAlpha = 1,
    level = "AA",
    category = "auto",
    selectedElementType = "graphics",
    options,
    colorSpace = "hsb",
    paintState = { hsl_s: 0, hsv_s: 0, l: 0, v: 0, h: 0 },
  } = props

  // 稳定 backgroundColor 引用，只有当 r, g, b 值变化时才更新
  const stableBackgroundColor = useMemo(
    () => backgroundColor,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backgroundColor?.r, backgroundColor?.g, backgroundColor?.b],
  )

  // 稳定 hue 值，取整后用于依赖比较
  const stableHue = useMemo(() => Math.round(hue), [hue])

  // Worker 是否已准备好接收消息
  const [workerReady, setWorkerReady] = useState(false)

  const [recommendedPoint, setRecommendedPoint] = useState<RecommendedPoint | null>(null)
  const [boundaryData, setBoundaryData] = useState<BoundaryCalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)

  const workerRef = useRef<Worker | null>(null)
  const calculationIdRef = useRef<number>(0)
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const calculationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastExecutionTimeRef = useRef<number>(0)

  // 存储最新的参数，确保延迟执行时使用最新值
  const latestParamsRef = useRef<WorkerParams | null>(null)

  // 存储当前正在计算的参数序列化字符串
  const pendingParamsRef = useRef<string | null>(null)

  // 存储 executeCalculation 函数的引用，供消息处理器调用
  const executeCalculationRef = useRef<(() => void) | null>(null)

  const { onColorChange } = options ?? {}

  const clearCalculationTimeout = () => {
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current)
      calculationTimeoutRef.current = null
    }
  }

  useEffect(() => {
    // 创建 Worker 实例
    const worker = createBoundaryWorker()
    if (!worker) return

    workerRef.current = worker

    const handleWorkerMessage = (event: MessageEvent<WorkerResponse & { status?: string }>) => {
      const { id, result, error, status } = event.data

      // 处理 worker 初始化完成消息
      if (id === 0 && status === "ready") {
        setWorkerReady(true)
        return
      }

      if (id !== calculationIdRef.current) {
        return
      }

      clearCalculationTimeout()
      setIsCalculating(false)

      if (error) {
        console.error("[Hook] Error received from boundary worker:", error)
        setBoundaryData(null)
        pendingParamsRef.current = null
      } else if (result) {
        setBoundaryData(result)

        // 检查当前参数是否与计算时的参数一致
        // 如果不一致，说明在计算期间参数发生了变化，需要重新计算
        if (latestParamsRef.current && pendingParamsRef.current) {
          const currentParamsStr = serializeParams(latestParamsRef.current)
          if (currentParamsStr !== pendingParamsRef.current) {
            // 参数已变化，立即触发新的计算
            pendingParamsRef.current = null
            if (executeCalculationRef.current) {
              executeCalculationRef.current()
            }
          } else {
            pendingParamsRef.current = null
          }
        }
      } else {
        setBoundaryData(null)
        pendingParamsRef.current = null
      }
    }

    const handleWorkerError = (error: ErrorEvent) => {
      console.error("[Hook] Error event in boundary worker:", error)
      clearCalculationTimeout()
      setIsCalculating(false)
      setBoundaryData(null)
      pendingParamsRef.current = null
    }

    worker.addEventListener("message", handleWorkerMessage)
    worker.addEventListener("error", handleWorkerError)

    return () => {
      worker.removeEventListener("message", handleWorkerMessage)
      worker.removeEventListener("error", handleWorkerError)
      worker.terminate()
      workerRef.current = null
      setWorkerReady(false)

      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }

      clearCalculationTimeout()
    }
  }, [])

  // 每次参数变化时更新 latestParamsRef
  useEffect(() => {
    const rawColorSpace: ChannelFieldSpace = colorSpace === "hsl" ? "hsl" : "hsb"
    latestParamsRef.current = {
      width: Math.round(width),
      height: Math.round(height),
      hue: stableHue,
      backgroundColor: stableBackgroundColor,
      foregroundAlpha: Number(foregroundAlpha.toFixed(2)),
      level,
      category,
      selectedElementType,
      colorSpace: rawColorSpace,
    }
  }, [
    width,
    height,
    stableHue,
    stableBackgroundColor,
    foregroundAlpha,
    level,
    category,
    selectedElementType,
    colorSpace,
  ])

  // 在 Worker 中触发计算（节流）
  useEffect(() => {
    const throttleDelay = 100
    const calculationTimeoutMs = 2000

    // 如果 worker 未准备好或维度无效，则不继续
    if (!workerRef.current || width <= 0 || height <= 0) {
      setBoundaryData(null)
      setIsCalculating(false)
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current)
      clearCalculationTimeout()
      return
    }

    // 如果 Worker 还没准备好，等待
    if (!workerReady) {
      return
    }

    // 核心计算逻辑 - 使用 ref 中存储的最新参数
    const executeCalculation = () => {
      if (!workerRef.current || !latestParamsRef.current) return

      clearCalculationTimeout()
      setIsCalculating(true)

      const currentId = ++calculationIdRef.current
      // 使用 ref 中的最新参数，而不是闭包中捕获的值
      const params = latestParamsRef.current

      // 记录当前正在计算的参数，用于后续比较
      pendingParamsRef.current = serializeParams(params)

      const message: WorkerRequest = { id: currentId, params }
      workerRef.current.postMessage(message)

      lastExecutionTimeRef.current = Date.now()

      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
        throttleTimeoutRef.current = null
      }

      // 计算超时
      calculationTimeoutRef.current = setTimeout(() => {
        if (calculationIdRef.current === currentId) {
          setIsCalculating(false)
          pendingParamsRef.current = null
        }
      }, calculationTimeoutMs)
    }

    // 将 executeCalculation 存储到 ref，供消息处理器调用
    executeCalculationRef.current = executeCalculation

    const now = Date.now()
    const timeSinceLastExec = now - lastExecutionTimeRef.current

    // 清除之前的 timeout
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current)
      throttleTimeoutRef.current = null
    }

    // 节流逻辑：立即执行或延迟执行
    if (timeSinceLastExec >= throttleDelay) {
      // 距离上次执行超过节流延迟，立即执行
      executeCalculation()
    } else {
      // 还在节流期间，安排延迟执行
      const delay = throttleDelay - timeSinceLastExec
      throttleTimeoutRef.current = setTimeout(() => {
        executeCalculation()
      }, delay)
    }
  }, [
    width,
    height,
    stableHue,
    stableBackgroundColor,
    foregroundAlpha,
    level,
    category,
    selectedElementType,
    colorSpace,
    workerReady,
  ])

  // 在边界上找到距离当前点最近的点（支持 XY 两轴移动）
  // 只返回在有效范围内的安全点
  const findNearestPointOnBoundary = useCallback(
    (
      boundary: BoundaryInfo | null,
      currentX: number,
      currentY: number,
      safetyOffset: number, // 负数表示向上偏移（进入 lowerBoundary 上方），正数表示向下偏移
      canvasHeight: number,
    ): { x: number; y: number; distance: number } | null => {
      if (!boundary) return null

      let nearestPoint: { x: number; y: number; distance: number } | null = null

      // 使用贝塞尔曲线段采样
      if (boundary.bezierSegments?.length) {
        const segments = boundary.bezierSegments
        const samplesPerSegment = 20

        for (const segment of segments) {
          const [x0, y0] = segment.start
          const [x1, y1] = segment.cp1
          const [x2, y2] = segment.cp2
          const [x3, y3] = segment.end

          for (let i = 0; i <= samplesPerSegment; i++) {
            const t = i / samplesPerSegment
            // 计算贝塞尔曲线上的点
            const bx = evaluateCubicBezier(x0, x1, x2, x3, t)
            const by = evaluateCubicBezier(y0, y1, y2, y3, t)

            // 应用安全偏移（向安全区域内移动）
            const safeX = bx
            const safeY = by + safetyOffset

            // 确保推荐点在有效范围内（不能超出画布边界）
            // 如果偏移后超出边界，跳过这个点
            if (safeY < 0 || safeY > canvasHeight) {
              continue
            }

            // 计算到当前点的距离
            const dx = safeX - currentX
            const dy = safeY - currentY
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (!nearestPoint || distance < nearestPoint.distance) {
              nearestPoint = { x: safeX, y: safeY, distance }
            }
          }
        }
      } else if (boundary.simplifiedPoints?.length >= 2) {
        // 降级：使用简化点进行线性插值
        const points = boundary.simplifiedPoints
        const samplesPerSegment = 10

        for (let i = 0; i < points.length - 1; i++) {
          const [x0, y0] = points[i]
          const [x1, y1] = points[i + 1]

          for (let j = 0; j <= samplesPerSegment; j++) {
            const t = j / samplesPerSegment
            const bx = x0 + (x1 - x0) * t
            const by = y0 + (y1 - y0) * t

            const safeX = bx
            const safeY = by + safetyOffset

            // 确保推荐点在有效范围内
            if (safeY < 0 || safeY > canvasHeight) {
              continue
            }

            const dx = safeX - currentX
            const dy = safeY - currentY
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (!nearestPoint || distance < nearestPoint.distance) {
              nearestPoint = { x: safeX, y: safeY, distance }
            }
          }
        }
      }

      return nearestPoint
    },
    [],
  )

  // 获取边界的 X 范围
  const getBoundaryXRange = useCallback(
    (boundary: BoundaryInfo | null): { minX: number; maxX: number } | null => {
      if (!boundary) return null

      if (boundary.bezierSegments?.length) {
        let minX = Infinity
        let maxX = -Infinity
        for (const segment of boundary.bezierSegments) {
          minX = Math.min(minX, segment.start[0], segment.end[0])
          maxX = Math.max(maxX, segment.start[0], segment.end[0])
        }
        return { minX, maxX }
      }

      if (boundary.simplifiedPoints?.length >= 2) {
        const points = boundary.simplifiedPoints
        let minX = Infinity
        let maxX = -Infinity
        for (const point of points) {
          minX = Math.min(minX, point[0])
          maxX = Math.max(maxX, point[0])
        }
        return { minX, maxX }
      }

      return null
    },
    [],
  )

  // 在边界上的指定 X 位置找到 Y 值
  const findYAtX = useCallback(
    (boundary: BoundaryInfo | null, x: number): number | null => {
      if (!boundary) return null

      if (boundary.bezierSegments?.length) {
        const segments = boundary.bezierSegments

        // 首先找到整个边界的 X 范围
        let boundaryMinX = Infinity
        let boundaryMaxX = -Infinity
        let leftEndY = 0
        let rightEndY = 0

        for (const segment of segments) {
          const [x0] = segment.start
          const [x3] = segment.end
          if (x0 < boundaryMinX) {
            boundaryMinX = x0
            leftEndY = segment.start[1]
          }
          if (x3 < boundaryMinX) {
            boundaryMinX = x3
            leftEndY = segment.end[1]
          }
          if (x0 > boundaryMaxX) {
            boundaryMaxX = x0
            rightEndY = segment.start[1]
          }
          if (x3 > boundaryMaxX) {
            boundaryMaxX = x3
            rightEndY = segment.end[1]
          }
        }

        // 如果 x 在曲线左边，返回左端点 Y
        if (x < boundaryMinX) {
          return leftEndY
        }
        // 如果 x 在曲线右边，返回右端点 Y
        if (x > boundaryMaxX) {
          return rightEndY
        }

        // x 在曲线范围内，找到对应的段
        for (const segment of segments) {
          const [x0] = segment.start
          const [x3] = segment.end
          const minX = Math.min(x0, x3)
          const maxX = Math.max(x0, x3)

          if (x >= minX - 1 && x <= maxX + 1) {
            // 在这个段内，采样找到最接近的 X
            const samples = 50
            let bestY = null
            let bestDiff = Infinity

            for (let i = 0; i <= samples; i++) {
              const t = i / samples
              const bx = evaluateCubicBezier(segment.start[0], segment.cp1[0], segment.cp2[0], segment.end[0], t)
              const by = evaluateCubicBezier(segment.start[1], segment.cp1[1], segment.cp2[1], segment.end[1], t)
              const diff = Math.abs(bx - x)
              if (diff < bestDiff) {
                bestDiff = diff
                bestY = by
              }
            }
            if (bestY !== null) return bestY
          }
        }
      }

      // 降级到简化点
      if (boundary.simplifiedPoints?.length >= 2) {
        const points = boundary.simplifiedPoints

        // 找到简化点的 X 范围
        const firstX = points[0][0]
        const lastX = points[points.length - 1][0]
        const minX = Math.min(firstX, lastX)
        const maxX = Math.max(firstX, lastX)

        // 如果 x 在范围外，返回端点 Y
        if (x < minX) {
          return firstX < lastX ? points[0][1] : points[points.length - 1][1]
        }
        if (x > maxX) {
          return firstX < lastX ? points[points.length - 1][1] : points[0][1]
        }

        for (let i = 0; i < points.length - 1; i++) {
          const [x0, y0] = points[i]
          const [x1, y1] = points[i + 1]
          if ((x >= x0 && x <= x1) || (x >= x1 && x <= x0)) {
            if (x1 === x0) return y0
            const t = (x - x0) / (x1 - x0)
            return y0 + t * (y1 - y0)
          }
        }
      }

      return null
    },
    [],
  )

  // --- 计算推荐点 ---
  const calculateRecommendedPoint = useCallback(() => {
    if (
      !boundaryData ||
      (!boundaryData.lowerBoundary && !boundaryData.upperBoundary) ||
      width <= 0 ||
      height <= 0
    ) {
      return null
    }

    const isHSL = colorSpace === "hsl"

    const currentSat = isHSL ? paintState.hsl_s : paintState.hsv_s
    const currentVal = isHSL ? paintState.l : paintState.v
    const currentX = round(currentSat * width, 0)
    const currentY = round((1 - currentVal) * height, 0)

    const { lowerBoundary, upperBoundary } = boundaryData
    const safetyMargin = 3
    const edgeThreshold = 5

    // 边界定义（Canvas 坐标系，Y=0 在顶部）：
    // - lowerBoundary：安全区域的下边界，安全区域在它上方（Y < lowerBoundary Y值）
    // - upperBoundary：安全区域的上边界，安全区域在它下方（Y > upperBoundary Y值）

    // 计算边界的平均 Y 值，用于判断是否在边缘
    const getAvgY = (boundary: BoundaryInfo | null): number | null => {
      if (!boundary?.bezierSegments?.length) return null
      const segments = boundary.bezierSegments
      return segments.reduce((sum, seg) => sum + seg.start[1] + seg.end[1], 0) / (segments.length * 2)
    }

    const upperAvgY = getAvgY(upperBoundary)
    const lowerAvgY = getAvgY(lowerBoundary)

    // 判断是否为"假双边界"（其中一个边界在画布边缘）
    const isUpperAtTopEdge = upperAvgY !== null && upperAvgY < edgeThreshold
    const isLowerAtBottomEdge = lowerAvgY !== null && lowerAvgY > height - edgeThreshold

    // 有效边界：排除在边缘的边界
    const effectiveLowerBoundary = isLowerAtBottomEdge ? null : lowerBoundary
    const effectiveUpperBoundary = isUpperAtTopEdge ? null : upperBoundary

    // 获取边界的 X 范围
    const lowerXRange = getBoundaryXRange(effectiveLowerBoundary)
    const upperXRange = getBoundaryXRange(effectiveUpperBoundary)

    // 检查当前点是否在边界的 X 范围内
    const isInLowerXRange = lowerXRange && currentX >= lowerXRange.minX && currentX <= lowerXRange.maxX
    const isInUpperXRange = upperXRange && currentX >= upperXRange.minX && currentX <= upperXRange.maxX

    // 首先检查当前点相对于边界的位置（使用有效边界）
    const lowerY = findYAtX(effectiveLowerBoundary, currentX)
    const upperY = findYAtX(effectiveUpperBoundary, currentX)

    // 判断当前点是否在安全区域内
    // 对于 lowerBoundary: 安全区域在上方，currentY < lowerY 表示在安全区域
    // 对于 upperBoundary: 安全区域在下方，currentY > upperY 表示在安全区域
    // 注意：只有当 currentX 在边界 X 范围内时，Y 比较才有效
    const isAboveLower = lowerY !== null && isInLowerXRange && currentY < lowerY - safetyMargin
    const isBelowUpper = upperY !== null && isInUpperXRange && currentY > upperY + safetyMargin

    // 如果只有 effectiveLowerBoundary，安全区域在上方
    if (effectiveLowerBoundary && !effectiveUpperBoundary) {
      if (isAboveLower) {
        // 已在安全区域，不需要推荐
        return null
      }
    }

    // 如果只有 effectiveUpperBoundary，安全区域在下方
    if (effectiveUpperBoundary && !effectiveLowerBoundary) {
      if (isBelowUpper) {
        // 已在安全区域，不需要推荐
        return null
      }
    }

    // 如果两条有效边界都存在
    if (effectiveLowerBoundary && effectiveUpperBoundary) {
      // 两条边界之间是不安全区域
      // 安全区域：Y < lowerY 或 Y > upperY（且在对应边界的 X 范围内）
      if (isAboveLower || isBelowUpper) {
        return null
      }
    }

    // 当前点在不安全区域，需要找到最近的安全点
    // 分析当前点相对于边界的位置，决定应该往哪个方向移动

    let recommendedX: number | null = null
    let recommendedY: number | null = null

    // 只有 effectiveLowerBoundary 的情况（最常见）：当前点在曲线下方，需要移动到曲线上方
    if (effectiveLowerBoundary && !effectiveUpperBoundary) {
      // 找到曲线上距离当前点最近的点，然后向上偏移进入安全区域
      const nearest = findNearestPointOnBoundary(effectiveLowerBoundary, currentX, currentY, -safetyMargin, height)
      if (nearest) {
        recommendedX = nearest.x
        recommendedY = nearest.y
      }
    }
    // 只有 effectiveUpperBoundary 的情况：当前点在曲线上方，需要移动到曲线下方
    else if (effectiveUpperBoundary && !effectiveLowerBoundary) {
      const nearest = findNearestPointOnBoundary(effectiveUpperBoundary, currentX, currentY, safetyMargin, height)
      if (nearest) {
        recommendedX = nearest.x
        recommendedY = nearest.y
      }
    }
    // 两条有效边界都存在的情况：当前点在两条曲线之间
    else if (effectiveLowerBoundary && effectiveUpperBoundary) {
      // 找到两条边界上距离当前点最近的点
      const nearestOnLower = findNearestPointOnBoundary(effectiveLowerBoundary, currentX, currentY, -safetyMargin, height)
      const nearestOnUpper = findNearestPointOnBoundary(effectiveUpperBoundary, currentX, currentY, safetyMargin, height)

      // 选择距离更近的
      if (nearestOnLower && nearestOnUpper) {
        if (nearestOnLower.distance < nearestOnUpper.distance) {
          recommendedX = nearestOnLower.x
          recommendedY = nearestOnLower.y
        } else {
          recommendedX = nearestOnUpper.x
          recommendedY = nearestOnUpper.y
        }
      } else if (nearestOnLower) {
        recommendedX = nearestOnLower.x
        recommendedY = nearestOnLower.y
      } else if (nearestOnUpper) {
        recommendedX = nearestOnUpper.x
        recommendedY = nearestOnUpper.y
      }
    }

    if (recommendedX === null || recommendedY === null) {
      return null
    }

    // 确保在有效范围内
    recommendedX = Math.max(0, Math.min(width, recommendedX))
    recommendedY = Math.max(0, Math.min(height, recommendedY))

    const slX = recommendedX / width
    const slY = 1 - recommendedY / height

    return {
      x: recommendedX,
      y: recommendedY,
      slX,
      slY,
    }
  }, [width, height, boundaryData, findNearestPointOnBoundary, findYAtX, getBoundaryXRange, colorSpace, paintState])

  // --- 每当边界变化时更新推荐点状态 ---
  useEffect(() => {
    const point = calculateRecommendedPoint()
    setRecommendedPoint(point)
  }, [boundaryData, calculateRecommendedPoint])

  // --- 手动更新推荐点 ---
  const updateRecommendedPoint = useCallback(() => {
    const point = calculateRecommendedPoint()
    setRecommendedPoint(point)
    return point
  }, [calculateRecommendedPoint])

  // --- 应用推荐点 ---
  const applyRecommendedPoint = useCallback(() => {
    if (!recommendedPoint) {
      return false
    }

    const isHSL = colorSpace === "hsl"
    const s = recommendedPoint.slX
    const lv = recommendedPoint.slY

    let finalColor: tinycolor.Instance | null = null
    if (isHSL) {
      finalColor = tinycolor({ h: hue, s, l: lv, a: foregroundAlpha })
    } else {
      finalColor = tinycolor({ h: hue, s, v: lv, a: foregroundAlpha })
    }

    if (!finalColor || !finalColor.isValid()) {
      return false
    }

    // 传递当前 hue 值，避免 RGB→HSL 转换导致的 hue 漂移
    const finalRgb = finalColor.toRgb()
    onColorChange?.({ r: finalRgb.r, g: finalRgb.g, b: finalRgb.b }, foregroundAlpha, hue)
    return true
  }, [recommendedPoint, colorSpace, onColorChange, foregroundAlpha, hue])

  return {
    recommendedPoint,
    boundaryData,
    isCalculating,
    calculateRecommendedPoint,
    updateRecommendedPoint,
    applyRecommendedPoint,
  }
}
