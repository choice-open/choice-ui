import { memo, useMemo } from "react"
import { BezierCurveEditorTv } from "../tv"
import type { BezierCurveExpandedValueType, BezierCurveType } from "../types"
import { bezierCurveParamsFromSizeAndValue } from "../utils"

type Props = {
  delay: number
  disabledPoints: [boolean, boolean]
  duration: number
  handleEndHandleLinePointerLeaveOrUp?: React.PointerEventHandler<SVGLineElement>
  handleEndHandleLinePointerMove?: React.PointerEventHandler<SVGLineElement>
  handleEndHandleLineStartMoving?: React.PointerEventHandler<SVGLineElement>
  handleStartHandleLinePointerLeaveOrUp?: React.PointerEventHandler<SVGLineElement>
  handleStartHandleLinePointerMove?: React.PointerEventHandler<SVGLineElement>
  handleStartHandleLineStartMoving?: React.PointerEventHandler<SVGLineElement>
  isEditable?: boolean
  movingEndHandleLine?: boolean
  movingStartHandleLine?: boolean
  outerAreaSize: number
  previewState?: "running" | "paused" | "hidden"
  size: number
  strokeWidth: number
  value: BezierCurveExpandedValueType
}

// 将 TV 实例和样式移到组件外部
const tv = BezierCurveEditorTv()

// 预定义样式，避免每次渲染都创建
const PREVIEW_KEYFRAMES =
  "@keyframes preview-loop {from {offset-distance: 0%}to {offset-distance: 100%}}"

function guessBezierCurveType(value: BezierCurveExpandedValueType): BezierCurveType {
  const [, y1, , y2, , y3, , y4] = value

  // 计算控制点的 y 值大于 0.5 和小于等于 0.5 的数量
  const countAboveHalf = [y1, y2, y3, y4].filter((y) => y > 0.5).length
  const countBelowHalf = [y1, y2, y3, y4].filter((y) => y <= 0.5).length

  if (countAboveHalf === 4) {
    return "out"
  } else if (countBelowHalf === 4) {
    return "in"
  } else if (countAboveHalf >= 3) {
    return "out"
  } else if (countBelowHalf >= 3) {
    return "in"
  } else {
    return "inOut"
  }
}

export const BezierCurveEditorCurve = memo<Props>((props) => {
  /* eslint-disable react/prop-types */
  const {
    disabledPoints,
    duration,
    delay,
    outerAreaSize,
    previewState,
    size,
    strokeWidth,
    value,
    isEditable,
    movingStartHandleLine,
    movingEndHandleLine,
    handleStartHandleLineStartMoving,
    handleStartHandleLinePointerMove,
    handleStartHandleLinePointerLeaveOrUp,
    handleEndHandleLineStartMoving,
    handleEndHandleLinePointerMove,
    handleEndHandleLinePointerLeaveOrUp,
  } = props
  /* eslint-enable react/prop-types */

  // 缓存坐标计算结果
  const coordinateParams = useMemo(
    () => bezierCurveParamsFromSizeAndValue(size, value),
    [size, value],
  )

  // 缓存 SVG 尺寸计算
  const svgDimensions = useMemo(
    () => ({
      width: size + strokeWidth * 2,
      height: size + strokeWidth * 2 + outerAreaSize * 2,
    }),
    [size, strokeWidth, outerAreaSize],
  )

  // 缓存贝兹曲线类型
  const curveType = useMemo(() => guessBezierCurveType(value), [value])

  // 缓存路径字符串
  const pathString = useMemo(() => {
    const { startCoordinate, endCoordinate, startBezierHandle, endBezierHandle } = coordinateParams
    return `M${startCoordinate} C${startBezierHandle} ${endBezierHandle} ${endCoordinate}`
  }, [coordinateParams])

  // 缓存预览圆形样式
  const previewStyle = useMemo(
    () => ({
      offsetPath: `path('${pathString}')`,
      animationTimingFunction: `cubic-bezier(${value})`,
      animationPlayState: previewState,
      animationName: "preview-loop",
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      animationIterationCount: "infinite",
      offsetDistance: 0,
    }),
    [pathString, value, previewState, duration, delay],
  )

  // 缓存变换属性
  const transformString = useMemo(
    () => `translate(${strokeWidth}, ${outerAreaSize + strokeWidth})`,
    [strokeWidth, outerAreaSize],
  )

  // 缓存 viewBox 属性
  const viewBoxString = useMemo(
    () => `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
    [svgDimensions.width, svgDimensions.height],
  )

  const { startCoordinate, endCoordinate, startBezierHandle, endBezierHandle } = coordinateParams

  return (
    <>
      <style>{PREVIEW_KEYFRAMES}</style>

      <svg
        fill="none"
        className={tv.curveWrapper()}
        width={svgDimensions.width}
        height={svgDimensions.height}
        viewBox={viewBoxString}
      >
        <g transform={transformString}>
          <rect
            data-slot="rect"
            className={tv.rect()}
            x={0}
            y={endCoordinate[1]}
            width={size}
            height={startCoordinate[1] - endCoordinate[1]}
            pointerEvents="none"
          />

          {disabledPoints[0] ? null : (
            <>
              <line
                data-slot="line"
                data-active={movingStartHandleLine}
                className={tv.line()}
                strokeWidth="8"
                strokeLinecap="round"
                x1={startCoordinate[0]}
                y1={startCoordinate[1]}
                x2={startBezierHandle[0]}
                y2={startBezierHandle[1]}
                style={{
                  stroke: "transparent",
                  pointerEvents: "auto",
                }}
                onPointerDown={handleStartHandleLineStartMoving}
                onPointerMove={handleStartHandleLinePointerMove}
                onPointerUp={handleStartHandleLinePointerLeaveOrUp}
                onPointerCancel={handleStartHandleLinePointerLeaveOrUp}
              />
              {/* 视觉线段 */}
              <line
                data-slot="line"
                data-active={movingStartHandleLine}
                className={tv.line()}
                strokeWidth="1"
                strokeLinecap="round"
                x1={startCoordinate[0]}
                y1={startCoordinate[1]}
                x2={startBezierHandle[0]}
                y2={startBezierHandle[1]}
                style={{
                  pointerEvents: "none",
                }}
              />
            </>
          )}
          {disabledPoints[1] ? null : (
            <>
              <line
                data-slot="line"
                data-active={movingEndHandleLine}
                className={tv.line()}
                strokeWidth="8"
                strokeLinecap="round"
                x1={endCoordinate[0]}
                y1={endCoordinate[1]}
                x2={endBezierHandle[0]}
                y2={endBezierHandle[1]}
                style={{
                  stroke: "transparent",
                  pointerEvents: "auto",
                }}
                onPointerDown={handleEndHandleLineStartMoving}
                onPointerMove={handleEndHandleLinePointerMove}
                onPointerUp={handleEndHandleLinePointerLeaveOrUp}
                onPointerCancel={handleEndHandleLinePointerLeaveOrUp}
              />
              {/* 视觉线段 */}
              <line
                data-slot="line"
                data-active={movingEndHandleLine}
                className={tv.line()}
                strokeWidth="1"
                strokeLinecap="round"
                x1={endCoordinate[0]}
                y1={endCoordinate[1]}
                x2={endBezierHandle[0]}
                y2={endBezierHandle[1]}
                style={{
                  pointerEvents: "none",
                }}
              />
            </>
          )}
          <path
            data-slot="curve"
            className={tv.curve()}
            // stroke={`url(#${curveType})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            d={pathString}
          />

          {previewState !== "hidden" && (
            <circle
              data-slot="preview"
              className={tv.preview()}
              r={4}
              cx={0}
              cy={0}
              strokeWidth={strokeWidth}
              style={previewStyle}
            />
          )}
        </g>
      </svg>
    </>
  )
})

BezierCurveEditorCurve.displayName = "BezierCurveEditorCurve"
