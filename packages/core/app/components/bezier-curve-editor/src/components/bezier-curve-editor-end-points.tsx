import React, { memo, useMemo } from "react"
import { BezierCurveEditorTv } from "../tv"
import { BezierCurveExpandedValueType } from "../types"
import { bezierCurveParamsFromSizeAndValue } from "../utils"

interface Props {
  disabledPoints?: [boolean, boolean]
  handleEndPointPointerLeaveOrUp: React.PointerEventHandler<HTMLButtonElement>
  handleEndPointPointerMove: React.PointerEventHandler<HTMLButtonElement>
  handleEndPointStartMoving: React.PointerEventHandler<HTMLButtonElement>
  handleSize: number
  handleStartPointPointerLeaveOrUp: React.PointerEventHandler<HTMLButtonElement>
  handleStartPointPointerMove: React.PointerEventHandler<HTMLButtonElement>
  handleStartPointStartMoving: React.PointerEventHandler<HTMLButtonElement>
  isEditable?: boolean
  movingEndPoint: boolean
  movingStartPoint: boolean
  outerAreaSize: number
  size: number
  strokeWidth: number
  value: BezierCurveExpandedValueType
}

// 将 TV 实例移到组件外部
const tv = BezierCurveEditorTv()

export const BezierCurveEditorEndPoints = memo<Props>((props) => {
  /* eslint-disable react/prop-types */
  const { size, value, outerAreaSize, strokeWidth, handleSize, isEditable } = props

  const {
    disabledPoints = [false, false],
    movingEndPoint,
    movingStartPoint,
    handleEndPointPointerLeaveOrUp,
    handleEndPointPointerMove,
    handleEndPointStartMoving,
    handleStartPointPointerLeaveOrUp,
    handleStartPointPointerMove,
    handleStartPointStartMoving,
  } = props
  /* eslint-enable react/prop-types */

  // 缓存坐标计算结果
  const coordinateParams = useMemo(
    () => bezierCurveParamsFromSizeAndValue(size, value),
    [size, value],
  )

  const { startCoordinate, endCoordinate } = coordinateParams

  // 缓存样式对象
  const startPointStyle = useMemo(
    () => ({
      top: startCoordinate[1] + outerAreaSize + strokeWidth,
      left: startCoordinate[0] + strokeWidth,
      width: handleSize / 2,
      height: handleSize / 2,
    }),
    [startCoordinate, outerAreaSize, strokeWidth, handleSize],
  )

  const endPointStyle = useMemo(
    () => ({
      top: endCoordinate[1] + outerAreaSize + strokeWidth,
      left: endCoordinate[0] + strokeWidth,
      width: handleSize / 2,
      height: handleSize / 2,
    }),
    [endCoordinate, outerAreaSize, strokeWidth, handleSize],
  )

  if (isEditable !== true) {
    return (
      <>
        {disabledPoints[0] ? null : (
          <span
            className={tv.handle({ fixed: true })}
            style={startPointStyle}
          />
        )}
        {disabledPoints[1] ? null : (
          <span
            className={tv.handle({ fixed: true })}
            style={endPointStyle}
          />
        )}
      </>
    )
  }

  return (
    <>
      <button
        data-slot="handle"
        data-active={movingStartPoint}
        type="button"
        className={tv.handle({ fixed: true })}
        style={startPointStyle}
        onPointerDown={handleStartPointStartMoving}
        onPointerMove={handleStartPointPointerMove}
        onPointerUp={handleStartPointPointerLeaveOrUp}
        onPointerCancel={handleStartPointPointerLeaveOrUp}
      />
      <button
        data-slot="handle"
        data-active={movingEndPoint}
        type="button"
        className={tv.handle({ fixed: true })}
        style={endPointStyle}
        onPointerDown={handleEndPointStartMoving}
        onPointerMove={handleEndPointPointerMove}
        onPointerUp={handleEndPointPointerLeaveOrUp}
        onPointerCancel={handleEndPointPointerLeaveOrUp}
      />
    </>
  )
})

BezierCurveEditorEndPoints.displayName = "BezierCurveEditorEndPoints"
