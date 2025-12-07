import { memo, useMemo } from "react"
import { BezierCurveEditorTv } from "../tv"

type Props = {
  innerAreaColor?: string
  outerAreaSize: number
  size: number
  strokeWidth: number
}

// 将 TV 实例移到组件外部
const tv = BezierCurveEditorTv()

export const BezierCurveEditorPlane = memo<Props>((props) => {
  /* eslint-disable react/prop-types */
  const { size, outerAreaSize, strokeWidth, innerAreaColor } = props
  /* eslint-enable react/prop-types */

  // 缓存平面样式对象
  const planeStyle = useMemo(
    () => ({
      top: outerAreaSize + strokeWidth,
      left: strokeWidth,
      width: size,
      height: size,
    }),
    [outerAreaSize, strokeWidth, size],
  )

  return (
    <div
      data-slot="plane"
      className={tv.plane()}
      style={planeStyle}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="100"
          height="100"
          className={tv.planeInner()}
          fill={innerAreaColor}
        />

        {/* 左侧边界实线 */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* 下侧边界实线 */}
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* 右上边界虚线 */}
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6,6"
          opacity="0.2"
        />

        {/* 右侧边界虚线 */}
        <line
          x1="100"
          y1="0"
          x2="100"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6,6"
          opacity="0.2"
        />

        {/* 对角线（从左下角到右上角） */}
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="0"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>
    </div>
  )
})

BezierCurveEditorPlane.displayName = "BezierCurveEditorPlane"
