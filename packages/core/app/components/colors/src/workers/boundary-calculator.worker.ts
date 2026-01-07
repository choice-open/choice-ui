import type {
  BezierCurveSegment,
  BoundaryCalculationResult,
  BoundaryInfo,
  ChannelFieldSpace,
  CheckColorContrastCategory,
  CheckColorContrastLevel,
  RGB,
} from "../types/colors"
import { getContrastThreshold } from "../utils/colors-convert"
import { calculateContrastRatio } from "../utils/contrast-utils"

// 纯整数 HSL 转 RGB（避免浮点精度问题）
// h: 0-360, s: 0-1, l: 0-1 -> RGB 0-255
const hslToRgbInt = (h: number, s: number, l: number): RGB => {
  // 将 h 归一化到 0-360，并取整
  h = Math.round(h) % 360
  if (h < 0) h += 360

  // 特殊情况：无饱和度（灰度）
  if (s === 0) {
    const gray = Math.round(l * 255)
    return { r: gray, g: gray, b: gray }
  }

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r1 = 0,
    g1 = 0,
    b1 = 0

  if (h < 60) {
    r1 = c
    g1 = x
    b1 = 0
  } else if (h < 120) {
    r1 = x
    g1 = c
    b1 = 0
  } else if (h < 180) {
    r1 = 0
    g1 = c
    b1 = x
  } else if (h < 240) {
    r1 = 0
    g1 = x
    b1 = c
  } else if (h < 300) {
    r1 = x
    g1 = 0
    b1 = c
  } else {
    r1 = c
    g1 = 0
    b1 = x
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  }
}

// 纯整数 HSV/HSB 转 RGB（避免浮点精度问题）
// h: 0-360, s: 0-1, v: 0-1 -> RGB 0-255
const hsvToRgbInt = (h: number, s: number, v: number): RGB => {
  // 将 h 归一化到 0-360，并取整
  h = Math.round(h) % 360
  if (h < 0) h += 360

  // 特殊情况：无饱和度（灰度）
  if (s === 0) {
    const gray = Math.round(v * 255)
    return { r: gray, g: gray, b: gray }
  }

  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r1 = 0,
    g1 = 0,
    b1 = 0

  if (h < 60) {
    r1 = c
    g1 = x
    b1 = 0
  } else if (h < 120) {
    r1 = x
    g1 = c
    b1 = 0
  } else if (h < 180) {
    r1 = 0
    g1 = c
    b1 = x
  } else if (h < 240) {
    r1 = 0
    g1 = x
    b1 = c
  } else if (h < 300) {
    r1 = x
    g1 = 0
    b1 = c
  } else {
    r1 = c
    g1 = 0
    b1 = x
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  }
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

const calculateAngle = (p1: [number, number], p2: [number, number]): number => {
  return Math.atan2(p2[1] - p1[1], p2[0] - p1[0])
}
const angleDifference = (angle1: number, angle2: number): number => {
  let diff = angle2 - angle1
  while (diff <= -Math.PI) diff += 2 * Math.PI
  while (diff > Math.PI) diff -= 2 * Math.PI
  return Math.abs(diff)
}
const pointToLineDistance = (
  p: [number, number],
  start: [number, number],
  end: [number, number],
): number => {
  const [x, y] = p
  const [x1, y1] = start
  const [x2, y2] = end
  const lineSegmentLengthSq = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  if (lineSegmentLengthSq === 0) return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2))
  const t = Math.max(
    0,
    Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / lineSegmentLengthSq),
  )
  const projX = x1 + t * (x2 - x1)
  const projY = y1 + t * (y2 - y1)
  return Math.sqrt(Math.pow(x - projX, 2) + Math.pow(y - projY, 2))
}
const rdp = (pointList: [number, number][], epsilon: number): [number, number][] => {
  if (pointList.length <= 2) return pointList
  let maxDistance = 0
  let maxIndex = 0
  const start = pointList[0]
  const end = pointList[pointList.length - 1]
  for (let i = 1; i < pointList.length - 1; i++) {
    const distance = pointToLineDistance(pointList[i], start, end)
    if (distance > maxDistance) {
      maxDistance = distance
      maxIndex = i
    }
  }
  if (maxDistance > epsilon) {
    const firstHalf = rdp(pointList.slice(0, maxIndex + 1), epsilon)
    const secondHalf = rdp(pointList.slice(maxIndex), epsilon)
    // 确保连接点不重复
    return [...firstHalf.slice(0, -1), ...secondHalf]
  } else {
    return [start, end]
  }
}
const getBoundingBoxSize = (pts: [number, number][]): number => {
  if (pts.length === 0) return 1
  let minX = pts[0][0],
    maxX = pts[0][0],
    minY = pts[0][1],
    maxY = pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    minX = Math.min(minX, pts[i][0])
    maxX = Math.max(maxX, pts[i][0])
    minY = Math.min(minY, pts[i][1])
    maxY = Math.max(maxY, pts[i][1])
  }
  return Math.max(maxX - minX, maxY - minY) || 1
}

const fitSmoothCurve = (
  points: [number, number][],
  height: number,
  width: number,
  cornerThresholdRad: number = Math.PI / 2,
): BezierCurveSegment[] => {
  if (points.length < 2) return []

  try {
    // 对宽度和高度取整，确保一致性
    width = Math.round(width)
    height = Math.round(height)

    const boundingBoxSize = getBoundingBoxSize(points)
    const epsilon = boundingBoxSize * 0.02 // 使用较大的 epsilon 以实现更平滑的曲线
    let keyPoints = rdp(points, epsilon)

    // 增加容差并确保为整数，减少边界条件的差异
    const yTolerance = 5 // 修正点 Y 坐标到 0 或 height 的容差
    const xTolerance = 1

    if (keyPoints.length > 0) {
      // 修正第一个点
      const firstPoint = keyPoints[0]
      if (firstPoint[0] <= xTolerance) firstPoint[0] = 0
      if (firstPoint[1] <= yTolerance) firstPoint[1] = 0
      else if (firstPoint[1] >= height - yTolerance) firstPoint[1] = height

      // 修正最后一个点
      if (keyPoints.length > 1) {
        const lastPointIndex = keyPoints.length - 1
        const lastPoint = keyPoints[lastPointIndex]
        if (lastPoint[1] <= yTolerance) lastPoint[1] = 0
        else if (lastPoint[1] >= height - yTolerance) lastPoint[1] = height
      }

      // 如果修正导致重复点，再次过滤
      keyPoints = keyPoints.filter(
        (point, index, self) =>
          index === 0 || point[0] !== self[index - 1][0] || point[1] !== self[index - 1][1],
      )
    }

    if (keyPoints.length < 2) return []

    // --- 基于角度的角点检测 (保留其他尖锐转弯) ---
    const isCorner = new Array(keyPoints.length).fill(false)
    if (keyPoints.length >= 3) {
      let prevAngle = calculateAngle(keyPoints[0], keyPoints[1])
      for (let i = 1; i < keyPoints.length - 1; i++) {
        const currentAngle = calculateAngle(keyPoints[i], keyPoints[i + 1])
        const diff = angleDifference(prevAngle, currentAngle)
        if (diff > cornerThresholdRad) {
          isCorner[i] = true
        }
        prevAngle = currentAngle
      }
    }

    // --- 计算切线 (仍需要平滑段) ---
    const tangents: [number, number][] = new Array(keyPoints.length)
    if (keyPoints.length >= 2) {
      // 添加检查以确保安全
      const dx0 = keyPoints[1][0] - keyPoints[0][0]
      const dy0 = keyPoints[1][1] - keyPoints[0][1]
      const len0 = Math.sqrt(dx0 * dx0 + dy0 * dy0)
      tangents[0] = len0 ? [dx0 / len0, dy0 / len0] : [0, 0]
      const n = keyPoints.length - 1
      const dxn = keyPoints[n][0] - keyPoints[n - 1][0]
      const dyn = keyPoints[n][1] - keyPoints[n - 1][1]
      const lenn = Math.sqrt(dxn * dxn + dyn * dyn)
      tangents[n] = lenn ? [dxn / lenn, dyn / lenn] : [0, 0]
      for (let i = 1; i < n; i++) {
        if (isCorner[i]) continue
        const prev = keyPoints[i - 1]
        const next = keyPoints[i + 1]
        const dx = next[0] - prev[0]
        const dy = next[1] - prev[1]
        const len = Math.sqrt(dx * dx + dy * dy)
        tangents[i] = len ? [dx / len, dy / len] : [0, 0]
      }
    } else {
      return [] // 点不足，无法计算切线/段
    }

    // --- 生成具有条件硬角的 Bezier 段 (Y=0 和 X=0/Width) ---
    const segments: BezierCurveSegment[] = []
    const tension = 0.75

    for (let i = 0; i < keyPoints.length - 1; i++) {
      const p0 = keyPoints[i]
      const p3 = keyPoints[i + 1]

      // 确定端点是否由于 Y=0/Height、X=0/Width 接近或角度检测而需要尖锐的角
      const isP0Sharp =
        isCorner[i] ||
        p0[1] <= yTolerance ||
        p0[1] >= height - yTolerance ||
        p0[0] <= xTolerance ||
        p0[0] >= width - xTolerance
      const isP3Sharp =
        isCorner[i + 1] ||
        p3[1] <= yTolerance ||
        p3[1] >= height - yTolerance ||
        p3[0] <= xTolerance ||
        p3[0] >= width - xTolerance

      let cp1: [number, number] = [...p0] // 默认尖角
      let cp2: [number, number] = [...p3] // 默认尖角

      // 仅当 p0 不需要尖角时计算平滑 cp1
      if (!isP0Sharp) {
        const t0 = tangents[i]
        const segLen = Math.sqrt(Math.pow(p3[0] - p0[0], 2) + Math.pow(p3[1] - p0[1], 2))
        const smooth_cp1: [number, number] = [
          p0[0] + t0[0] * segLen * tension * 0.5,
          p0[1] + t0[1] * segLen * tension * 0.5,
        ]
        // 应用 Y 边界修正 (已通过尖角检查隐式完成)
        // if (p0[1] === height && smooth_cp1[1] > height) smooth_cp1[1] = height;
        cp1 = smooth_cp1
      }

      // 仅当 p3 不需要尖角时计算平滑 cp2
      if (!isP3Sharp) {
        const t3 = tangents[i + 1]
        const segLen = Math.sqrt(Math.pow(p3[0] - p0[0], 2) + Math.pow(p3[1] - p0[1], 2))
        const smooth_cp2: [number, number] = [
          p3[0] - t3[0] * segLen * tension * 0.5,
          p3[1] - t3[1] * segLen * tension * 0.5,
        ]
        // 应用 Y 边界修正 (已通过尖角检查隐式完成)
        // if (p3[1] === height && smooth_cp2[1] > height) smooth_cp2[1] = height;
        cp2 = smooth_cp2
      }

      segments.push({ start: p0, cp1, cp2, end: p3 })
    }

    return segments
  } catch {
    // 降级：如果拟合失败，返回连接原始点的直线段
    const fallbackSegments: BezierCurveSegment[] = []
    if (points.length >= 2) {
      for (let i = 0; i < points.length - 1; i++) {
        fallbackSegments.push({
          start: points[i],
          cp1: points[i],
          cp2: points[i + 1],
          end: points[i + 1],
        })
      }
    }
    return fallbackSegments
  }
}

// --- 主要边界计算逻辑 ---
const calculateBoundaryPoints = (
  width: number,
  height: number,
  hue: number,
  backgroundColor: RGB,
  foregroundAlpha: number,
  level: CheckColorContrastLevel,
  category: CheckColorContrastCategory,
  selectedElementType: "text" | "graphics",
  colorSpace: ChannelFieldSpace,
): BoundaryCalculationResult => {
  // 对输入参数进行取整处理，确保计算稳定性
  width = Math.round(width)
  height = Math.round(height)
  hue = Math.round(hue)
  foregroundAlpha = Number(foregroundAlpha.toFixed(2))

  const threshold = getContrastThreshold(level, category, selectedElementType)
  const emptyResult: BoundaryCalculationResult = {
    lowerBoundary: null,
    upperBoundary: null,
    threshold,
  }

  if (width <= 0 || height <= 0) return emptyResult

  const isHSL = colorSpace === "hsl"
  const lowerRawPoints: [number, number][] = []
  const upperRawPoints: [number, number][] = []
  const step = 2 // 恢复为 2 以保证性能
  let allPointsAreZeroValue = true // 跟踪是否只有原点 (黑色) 具有对比度

  for (let x = 0; x <= width; x += step) {
    const safeIntervals: { endY: number; startY: number }[] = []
    let currentInterval: { endY: number; startY: number } | null = null

    // 从 0 (顶部) 到 height (底部) 迭代 Y
    for (let y = 0; y <= height; y++) {
      const s = x / width
      const yValue = 1 - y / height // 值/亮度 (0 到 1)。y=0 时为 1，y=height 时为 0

      // 使用纯整数转换函数，避免浮点精度问题导致相同 hue 值产生不同曲线
      const foregroundRgb = isHSL ? hslToRgbInt(hue, s, yValue) : hsvToRgbInt(hue, s, yValue)

      // 检查我们是否正在考虑除纯黑/灰度原点之外的颜色
      // (yValue > 0 对应于 y < height)
      if (s > 0 || yValue > 0) {
        allPointsAreZeroValue = false
      }

      const contrast = calculateContrastRatio(backgroundColor, foregroundRgb, foregroundAlpha)
      const isSafe = contrast >= threshold

      // 跟踪当前 X 坐标下沿 Y 轴的连续安全间隔的逻辑
      if (isSafe && !currentInterval) {
        currentInterval = { startY: y, endY: y } // 开始新的区间
      } else if (isSafe && currentInterval) {
        currentInterval.endY = y // 扩展当前区间
      } else if (!isSafe && currentInterval) {
        safeIntervals.push({ ...currentInterval }) // 结束当前区间
        currentInterval = null
      }
    }
    // 如果在 Y 轴循环结束时仍有未结束的区间
    if (currentInterval) {
      safeIntervals.push({ ...currentInterval })
    }

    // --- 处理此 X 坐标找到的安全间隔 ---
    if (safeIntervals.length === 1) {
      const interval = safeIntervals[0]
      // 间隔从顶部开始 (y=0) -> 将终点添加到下边界
      if (interval.startY === 0) {
        lowerRawPoints.push([x, interval.endY])
      }
      // 间隔在底部结束 (y=height) -> 将起点添加到上边界
      else if (interval.endY === height) {
        upperRawPoints.push([x, interval.startY])
      }
      // 间隔完全包含在内 -> 将点添加到两个边界
      else {
        upperRawPoints.push([x, interval.startY])
        lowerRawPoints.push([x, interval.endY])
      }
    } else if (safeIntervals.length >= 2) {
      // 多个不相交的安全区域，我们通常只关心最外层的
      const firstInterval = safeIntervals[0]
      const lastInterval = safeIntervals[safeIntervals.length - 1]

      // 如果第一个间隔从顶部开始 (y=0)，其终点定义了一个下边界点
      if (firstInterval.startY === 0) {
        lowerRawPoints.push([x, firstInterval.endY])
      } else {
        // 否则，第一个间隔定义了一个上边界点和一个下边界点
        upperRawPoints.push([x, firstInterval.startY])
        lowerRawPoints.push([x, firstInterval.endY])
      }

      // 如果最后一个间隔在底部结束 (y=height)，其起点定义了一个上边界点
      // (仅当与第一个间隔的起点不同时才添加，如果第一个间隔不是从 y=0 开始)
      if (lastInterval.endY === height) {
        if (firstInterval.startY !== 0 || lastInterval.startY !== firstInterval.startY) {
          upperRawPoints.push([x, lastInterval.startY])
        }
      } else {
        // 如果最后一个间隔没有到达底部，它定义了另一对点，
        // 但前提是它确实是与处理的第一个间隔*不同*的间隔。
        if (lastInterval !== firstInterval) {
          // 如果与第一个间隔的上边界点不同，则添加上边界点
          if (lastInterval.startY !== firstInterval.startY) {
            upperRawPoints.push([x, lastInterval.startY])
          }
          // 如果与第一个间隔的下边界点不同，则添加下边界点
          if (lastInterval.endY !== firstInterval.endY) {
            lowerRawPoints.push([x, lastInterval.endY])
          }
        }
      }
    }
  }

  // --- 使用曲线拟合将原始点处理为 BoundaryInfo ---
  const processBoundary = (
    rawPoints: [number, number][],
    isLower: boolean,
  ): BoundaryInfo | null => {
    // 处理只有原点 (S=0, L=0 或 V=0) 有效的边缘情况 (纯黑/灰)
    if (rawPoints.length < 2) {
      if (allPointsAreZeroValue && isLower) {
        // 只有左下角的点可能有效
        // 将其表示为沿底部边缘的线
        const bottomLinePoints: [number, number][] = [
          [0, height],
          [width, height],
        ]
        const segments: BezierCurveSegment[] = [
          {
            start: bottomLinePoints[0],
            cp1: bottomLinePoints[0],
            cp2: bottomLinePoints[1],
            end: bottomLinePoints[1],
          },
        ]
        return {
          points: bottomLinePoints,
          simplifiedPoints: bottomLinePoints,
          bezierSegments: segments,
        }
      }
      // 否则，无法形成有意义的边界
      return null
    }

    // 确保边界从 x=0 开始并在 x=width 结束，如果需要则添加/调整点
    if (rawPoints[0][0] > 0) {
      rawPoints.unshift([0, rawPoints[0][1]]) // 在 x=0 处添加起点
    } else {
      rawPoints[0][0] = 0 // 将第一个点的 x 限制为 0
    }
    if (rawPoints[rawPoints.length - 1][0] < width) {
      rawPoints.push([width, rawPoints[rawPoints.length - 1][1]]) // 在 x=width 处添加终点
    } else {
      rawPoints[rawPoints.length - 1][0] = width // 将最后一个点的 x 限制为 width
    }

    // 移除连续的重复点 (可能在添加起点/终点后出现)
    const uniqueRawPoints = rawPoints.filter(
      (point, index, self) =>
        index === 0 || point[0] !== self[index - 1][0] || point[1] !== self[index - 1][1],
    )

    if (uniqueRawPoints.length < 2) {
      return null // 无法拟合曲线
    }

    // 将曲线拟合到唯一点 - 传递宽度
    let bezierSegments = fitSmoothCurve(uniqueRawPoints, height, width)

    // 将贝塞尔曲线在边缘的 y 值向外扩展，避免在画布边缘看到水平直线
    const edgeOffset = 2
    if (bezierSegments && bezierSegments.length > 0) {
      // 修改第一个段的起点
      const firstSegment = bezierSegments[0]
      if (firstSegment.start[1] <= 1) {
        firstSegment.start = [firstSegment.start[0], -edgeOffset]
        firstSegment.cp1 = [firstSegment.cp1[0], Math.min(firstSegment.cp1[1], -edgeOffset)]
      } else if (firstSegment.start[1] >= height - 1) {
        firstSegment.start = [firstSegment.start[0], height + edgeOffset]
        firstSegment.cp1 = [firstSegment.cp1[0], Math.max(firstSegment.cp1[1], height + edgeOffset)]
      }

      // 修改最后一个段的终点
      const lastSegment = bezierSegments[bezierSegments.length - 1]
      if (lastSegment.end[1] <= 1) {
        lastSegment.end = [lastSegment.end[0], -edgeOffset]
        lastSegment.cp2 = [lastSegment.cp2[0], Math.min(lastSegment.cp2[1], -edgeOffset)]
      } else if (lastSegment.end[1] >= height - 1) {
        lastSegment.end = [lastSegment.end[0], height + edgeOffset]
        lastSegment.cp2 = [lastSegment.cp2[0], Math.max(lastSegment.cp2[1], height + edgeOffset)]
      }
    }

    if (!bezierSegments || bezierSegments.length === 0) {
      // 降级：返回连接唯一点的直线
      if (uniqueRawPoints.length >= 2) {
        const fallbackSegments: BezierCurveSegment[] = []
        for (let i = 0; i < uniqueRawPoints.length - 1; i++) {
          fallbackSegments.push({
            start: uniqueRawPoints[i],
            cp1: uniqueRawPoints[i],
            cp2: uniqueRawPoints[i + 1],
            end: uniqueRawPoints[i + 1],
          })
        }
        return {
          points: rawPoints,
          simplifiedPoints: uniqueRawPoints,
          bezierSegments: fallbackSegments,
        }
      }
      return null
    }

    return {
      points: rawPoints,
      simplifiedPoints: uniqueRawPoints,
      bezierSegments: bezierSegments,
    }
  }

  const lowerBoundary = processBoundary(lowerRawPoints, true)
  const upperBoundary = processBoundary(upperRawPoints, false)

  // --- 处理特殊情况 ---
  const alphaThreshold = 0.01

  // Case 1: Alpha 极低 且 未自然找到边界
  // 结果: 强制沿底部边缘 (y=height) 画一条边界线
  if (foregroundAlpha < alphaThreshold && !lowerBoundary && !upperBoundary) {
    const bottomLinePoints: [number, number][] = [
      [0, height],
      [width, height],
    ]
    const forcedLowerBoundary: BoundaryInfo = {
      points: bottomLinePoints,
      simplifiedPoints: bottomLinePoints,
      bezierSegments: [
        {
          start: bottomLinePoints[0],
          cp1: bottomLinePoints[0],
          cp2: bottomLinePoints[1],
          end: bottomLinePoints[1],
        },
      ],
    }
    return { lowerBoundary: forcedLowerBoundary, upperBoundary: null, threshold }
  }

  // Case 2: 两个边界都没有找到点，且 alpha 不极低。
  // 这意味着对比度在任何地方都没有达到阈值，或者只有原点 (S=0, V/L=0) 达到了阈值。
  // 结果: 强制沿底部边缘 (y=height) 画一条边界线
  // processBoundary 中的 `allPointsAreZeroValue` 检查应处理仅原点的情况。
  // 如果到达这里，意味着没有区域满足对比度。
  if (!lowerBoundary && !upperBoundary) {
    // processBoundary 中的 `allPointsAreZeroValue` 检查应处理仅原点的情况。
    // 如果到达这里，意味着没有区域满足对比度。
    const bottomLinePoints: [number, number][] = [
      [0, height],
      [width, height],
    ]
    const forcedLowerBoundary: BoundaryInfo = {
      points: bottomLinePoints,
      simplifiedPoints: bottomLinePoints,
      bezierSegments: [
        {
          start: bottomLinePoints[0],
          cp1: bottomLinePoints[0],
          cp2: bottomLinePoints[1],
          end: bottomLinePoints[1],
        },
      ],
    }
    return { lowerBoundary: forcedLowerBoundary, upperBoundary: null, threshold }
  }

  // 默认返回：计算出的边界（如果没有找到点，一个或两个边界可能为 null）
  return { lowerBoundary, upperBoundary, threshold }
}

// --- Worker 事件监听器 ---
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { id, params } = event.data

  if (!params) {
    self.postMessage({ id, error: "Received message with undefined params" })
    return
  }

  const {
    width,
    height,
    hue,
    backgroundColor,
    foregroundAlpha,
    level,
    category,
    selectedElementType,
    colorSpace,
  } = params

  try {
    // 执行计算
    const result = calculateBoundaryPoints(
      width,
      height,
      hue,
      backgroundColor,
      foregroundAlpha,
      level,
      category,
      selectedElementType,
      colorSpace,
    )

    // 将结果发送回主线程
    self.postMessage({ id, result })
  } catch (error) {
    // 将错误发送回主线程
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) })
  }
}
