import { tcx } from "@choiceform/design-shared"
import { useCallback, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import {
  BezierCurveEditorCurve,
  BezierCurveEditorEndPoints,
  BezierCurveEditorPlane,
} from "./components"
import { useHandleState } from "./hooks"
import { BezierCurveEditorTv } from "./tv"
import type { BezierCurveExpandedValueType, BezierCurveValueType, Point } from "./types"
import { bezierCurveParamsFromSizeAndValue } from "./utils"

interface BezierCurveEditorBaseProps {
  className?: string
  delay?: number
  disabledPoints?: [boolean, boolean]
  duration?: number
  enablePreview?: boolean
  handleSize?: number
  outerAreaSize?: number
  showPlane?: boolean
  size?: number
  strokeWidth?: number
}

interface BezierCurveEditorEditNodeProps {
  allowNodeEditing: true
  onChange?: (value: BezierCurveExpandedValueType) => void
  value?: BezierCurveExpandedValueType
}
interface BezierCurveEditorFixedNodeProps {
  allowNodeEditing?: false
  onChange?: (value: BezierCurveValueType) => void
  value?: BezierCurveValueType
}

export type BezierCurveEditorProps = BezierCurveEditorBaseProps &
  (BezierCurveEditorEditNodeProps | BezierCurveEditorFixedNodeProps)

const tv = BezierCurveEditorTv()

export const BezierCurveEditor = (props: BezierCurveEditorProps) => {
  const {
    className,
    duration = 2,
    delay = 0,
    enablePreview,
    handleSize = 8,
    outerAreaSize = 64,
    size = 192,
    strokeWidth = 1,
    value: valueProp = [0.4, 0, 1, 0.6],
    disabledPoints = [false, false],
    showPlane = true,
  } = props

  const initialValueRef = useRef<BezierCurveExpandedValueType>(
    valueProp.length === 4 ? [0, 0, ...valueProp, 1, 1] : valueProp,
  )

  // 缓存扩展值的计算
  const value = useMemo((): BezierCurveExpandedValueType => {
    return valueProp.length === 4 ? [0, 0, ...valueProp, 1, 1] : valueProp
  }, [valueProp])

  const updateValueRef = useCallback(() => {
    // 从 props 重新计算当前值，确保获取最新状态
    const currentValue: BezierCurveExpandedValueType =
      valueProp.length === 4
        ? ([0, 0, ...valueProp, 1, 1] as BezierCurveExpandedValueType)
        : valueProp
    initialValueRef.current = [...currentValue] as BezierCurveExpandedValueType
  }, [valueProp])

  // 缓存坐标计算结果
  const coordinateParams = useMemo(
    () => bezierCurveParamsFromSizeAndValue(size, value),
    [size, value],
  )

  // 类型安全的回调处理函数
  const handleValueChange = useCallback(
    (clampedValue: BezierCurveExpandedValueType) => {
      if (!props.onChange) return

      if (props.allowNodeEditing) {
        // 编辑模式：传递完整值
        props.onChange(clampedValue)
      } else {
        // 固定模式：只传递控制手柄值
        const controlValues = clampedValue.slice(2, 6) as BezierCurveValueType
        props.onChange(controlValues)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onChange, props.allowNodeEditing],
  )

  const moveStartHandle = useEventCallback((start: Point, movement: Point) => {
    const nextValue = moveHandle(initialValueRef.current, size, [2, 3], start, movement)
    const clampedValue = clampValue(outerAreaSize, size, nextValue)
    handleValueChange(clampedValue)
  })

  const [
    movingStartHandle,
    {
      handlePointerLeaveOrUp: handleStartHandlePointerLeaveOrUp,
      handlePointerMove: handleStartHandlePointerMove,
      handlePointerStartMoving: handleStartHandleStartMoving,
    },
  ] = useHandleState(moveStartHandle, updateValueRef)

  const moveEndHandle = useEventCallback((start: Point, movement: Point) => {
    const nextValue = moveHandle(initialValueRef.current, size, [4, 5], start, movement)
    const clampedValue = clampValue(outerAreaSize, size, nextValue)
    handleValueChange(clampedValue)
  })

  const [
    movingEndHandle,
    {
      handlePointerLeaveOrUp: handleEndHandlePointerLeaveOrUp,
      handlePointerMove: handleEndHandlePointerMove,
      handlePointerStartMoving: handleEndHandleStartMoving,
    },
  ] = useHandleState(moveEndHandle, updateValueRef)

  const moveStartPoint = useEventCallback((start: Point, movement: Point) => {
    const nextValue = moveHandle(initialValueRef.current, size, [0, 1], start, movement)
    const clampedValue = clampValue(outerAreaSize, size, nextValue)
    handleValueChange(clampedValue)
  })

  const [
    movingStartPoint,
    {
      handlePointerLeaveOrUp: handleStartPointPointerLeaveOrUp,
      handlePointerMove: handleStartPointPointerMove,
      handlePointerStartMoving: handleStartPointStartMoving,
    },
  ] = useHandleState(moveStartPoint, updateValueRef)

  const moveEndPoint = useEventCallback((start: Point, movement: Point) => {
    const nextValue = moveHandle(initialValueRef.current, size, [6, 7], start, movement)
    const clampedValue = clampValue(outerAreaSize, size, nextValue)
    handleValueChange(clampedValue)
  })

  const [
    movingEndPoint,
    {
      handlePointerLeaveOrUp: handleEndPointPointerLeaveOrUp,
      handlePointerMove: handleEndPointPointerMove,
      handlePointerStartMoving: handleEndPointStartMoving,
    },
  ] = useHandleState(moveEndPoint, updateValueRef)

  const moveStartHandleLine = useEventCallback((start: Point, movement: Point) => {
    const currentValue = initialValueRef.current
    const nextValue = [...currentValue] as BezierCurveExpandedValueType

    const relXMoved = (movement.x - start.x) / size
    const relYMoved = (movement.y - start.y) / size

    nextValue[2] = currentValue[2] + relXMoved
    nextValue[3] = currentValue[3] - relYMoved

    const clampedValue = clampValue(outerAreaSize, size, nextValue)
    handleValueChange(clampedValue)
  })

  const moveEndHandleLine = useEventCallback((start: Point, movement: Point) => {
    const currentValue = initialValueRef.current
    const nextValue = [...currentValue] as BezierCurveExpandedValueType

    const relXMoved = (movement.x - start.x) / size
    const relYMoved = (movement.y - start.y) / size

    nextValue[4] = currentValue[4] + relXMoved // 结束控制手柄 X
    nextValue[5] = currentValue[5] - relYMoved // 结束控制手柄 Y

    const clampedValue = clampValue(outerAreaSize, size, nextValue)
    handleValueChange(clampedValue)
  })

  const [movingStartHandleLine, setMovingStartHandleLine] = useState(false)
  const [movingEndHandleLine, setMovingEndHandleLine] = useState(false)
  const startHandleLineStartPositionRef = useRef<Point>({ x: 0, y: 0 })
  const endHandleLineStartPositionRef = useRef<Point>({ x: 0, y: 0 })

  const handleStartHandleLineStartMoving = useEventCallback(
    (event: React.PointerEvent<SVGLineElement>) => {
      event.preventDefault()

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        return
      }

      const startX = event.clientX
      const startY = event.clientY
      startHandleLineStartPositionRef.current = { x: startX, y: startY }

      // 设置指针捕获
      event.currentTarget.setPointerCapture(event.pointerId)

      setMovingStartHandleLine(true)
      updateValueRef()
    },
  )

  const handleStartHandleLinePointerMove = useEventCallback(
    (event: React.PointerEvent<SVGLineElement>) => {
      if (movingStartHandleLine && event.currentTarget.hasPointerCapture(event.pointerId)) {
        const x = event.clientX
        const y = event.clientY
        moveStartHandleLine(startHandleLineStartPositionRef.current, { x, y })
      }
    },
  )

  const handleStartHandleLinePointerLeaveOrUp = useEventCallback(
    (event: React.PointerEvent<SVGLineElement>) => {
      setMovingStartHandleLine(false)

      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
      } catch (error) {
        console.warn("Failed to release pointer capture:", error)
      }
    },
  )

  const handleEndHandleLineStartMoving = useEventCallback(
    (event: React.PointerEvent<SVGLineElement>) => {
      event.preventDefault()

      // 如果已经在拖拽中，不要重复开始
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        return
      }

      // 先捕获起始位置
      const startX = event.clientX
      const startY = event.clientY
      endHandleLineStartPositionRef.current = { x: startX, y: startY }

      // 设置指针捕获
      event.currentTarget.setPointerCapture(event.pointerId)

      // 然后更新状态
      setMovingEndHandleLine(true)
      updateValueRef()
    },
  )

  const handleEndHandleLinePointerMove = useEventCallback(
    (event: React.PointerEvent<SVGLineElement>) => {
      if (movingEndHandleLine && event.currentTarget.hasPointerCapture(event.pointerId)) {
        const x = event.clientX
        const y = event.clientY
        moveEndHandleLine(endHandleLineStartPositionRef.current, { x, y })
      }
    },
  )

  const handleEndHandleLinePointerLeaveOrUp = useEventCallback(
    (event: React.PointerEvent<SVGLineElement>) => {
      setMovingEndHandleLine(false)

      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
      } catch (error) {
        console.warn("Failed to release pointer capture:", error)
      }
    },
  )

  // 缓存预览状态计算
  const previewState = useMemo(() => {
    if (!enablePreview) return "hidden"
    return movingStartHandle || movingEndHandle || movingStartHandleLine || movingEndHandleLine
      ? "paused"
      : "running"
  }, [
    enablePreview,
    movingStartHandle,
    movingEndHandle,
    movingStartHandleLine,
    movingEndHandleLine,
  ])

  // 缓存内联样式对象
  const presentationStyle = useMemo(
    () => ({
      left: strokeWidth,
      width: size,
    }),
    [strokeWidth, size],
  )

  const startHandleStyle = useMemo(
    () => ({
      top: coordinateParams.startBezierHandle[1] + outerAreaSize + strokeWidth,
      left: coordinateParams.startBezierHandle[0] + strokeWidth,
      width: handleSize,
      height: handleSize,
    }),
    [coordinateParams.startBezierHandle, outerAreaSize, strokeWidth, handleSize],
  )

  const endHandleStyle = useMemo(
    () => ({
      top: coordinateParams.endBezierHandle[1] + outerAreaSize + strokeWidth,
      left: coordinateParams.endBezierHandle[0] + strokeWidth,
      width: handleSize,
      height: handleSize,
    }),
    [coordinateParams.endBezierHandle, outerAreaSize, strokeWidth, handleSize],
  )

  return (
    <div
      data-slot="base"
      className={tcx(tv.base(), className)}
    >
      <div
        data-slot="wrappr"
        className={tv.wrappr()}
      >
        <div
          data-slot="presentation"
          role="presentation"
          className={tv.presentation()}
          style={presentationStyle}
        />

        {showPlane && (
          <BezierCurveEditorPlane
            size={size}
            outerAreaSize={outerAreaSize}
            strokeWidth={strokeWidth}
            innerAreaColor="none"
          />
        )}

        <BezierCurveEditorCurve
          disabledPoints={disabledPoints}
          value={value}
          size={size}
          strokeWidth={strokeWidth}
          outerAreaSize={outerAreaSize}
          duration={duration}
          delay={delay}
          previewState={previewState}
          isEditable={props.allowNodeEditing}
          movingStartHandleLine={movingStartHandleLine}
          movingEndHandleLine={movingEndHandleLine}
          handleStartHandleLineStartMoving={handleStartHandleLineStartMoving}
          handleStartHandleLinePointerMove={handleStartHandleLinePointerMove}
          handleStartHandleLinePointerLeaveOrUp={handleStartHandleLinePointerLeaveOrUp}
          handleEndHandleLineStartMoving={handleEndHandleLineStartMoving}
          handleEndHandleLinePointerMove={handleEndHandleLinePointerMove}
          handleEndHandleLinePointerLeaveOrUp={handleEndHandleLinePointerLeaveOrUp}
        />

        <BezierCurveEditorEndPoints
          disabledPoints={disabledPoints}
          size={size}
          value={value}
          outerAreaSize={outerAreaSize}
          strokeWidth={strokeWidth}
          handleSize={handleSize}
          isEditable={props.allowNodeEditing}
          movingEndPoint={movingEndPoint}
          movingStartPoint={movingStartPoint}
          handleStartPointStartMoving={handleStartPointStartMoving}
          handleStartPointPointerMove={handleStartPointPointerMove}
          handleStartPointPointerLeaveOrUp={handleStartPointPointerLeaveOrUp}
          handleEndPointStartMoving={handleEndPointStartMoving}
          handleEndPointPointerMove={handleEndPointPointerMove}
          handleEndPointPointerLeaveOrUp={handleEndPointPointerLeaveOrUp}
        />

        {disabledPoints[0] ? null : (
          <button
            data-slot="handle"
            data-state="start"
            data-active={movingStartHandle}
            type="button"
            className={tv.handle()}
            style={startHandleStyle}
            onPointerDown={handleStartHandleStartMoving}
            onPointerMove={handleStartHandlePointerMove}
            onPointerUp={handleStartHandlePointerLeaveOrUp}
            onPointerCancel={handleStartHandlePointerLeaveOrUp}
          />
        )}
        {disabledPoints[1] ? null : (
          <button
            data-slot="handle"
            data-state="end"
            data-active={movingEndHandle}
            type="button"
            className={tv.handle()}
            style={endHandleStyle}
            onPointerDown={handleEndHandleStartMoving}
            onPointerMove={handleEndHandlePointerMove}
            onPointerUp={handleEndHandlePointerLeaveOrUp}
            onPointerCancel={handleEndHandlePointerLeaveOrUp}
          />
        )}
      </div>
    </div>
  )
}

function clampValue(
  outerAreaSize: number,
  size: number,
  value: BezierCurveExpandedValueType,
): BezierCurveExpandedValueType {
  const nextValue = [...value] satisfies BezierCurveExpandedValueType
  const allowedOuterValue = outerAreaSize / size
  nextValue[0] = Math.max(0, Math.min(1, nextValue[0]))
  nextValue[1] = Math.max(0, Math.min(1, nextValue[1]))
  nextValue[2] = Math.max(0, Math.min(1, nextValue[2]))
  nextValue[4] = Math.max(0, Math.min(1, nextValue[4]))
  nextValue[6] = Math.max(0, Math.min(1, nextValue[6]))
  nextValue[7] = Math.max(0, Math.min(1, nextValue[7]))
  nextValue[3] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[3]))
  nextValue[5] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[5]))
  return nextValue
}

function moveHandle(
  value: BezierCurveExpandedValueType,
  size: number,
  targetIndices: [number, number],
  start: Point,
  { x, y }: Point,
): BezierCurveExpandedValueType {
  const nextValue = [...value] satisfies BezierCurveExpandedValueType
  const [xIndex, yIndex] = targetIndices

  const relXMoved = (x - start.x) / size
  const relYMoved = (y - start.y) / size

  nextValue[xIndex] = nextValue[xIndex] + relXMoved
  nextValue[yIndex] = nextValue[yIndex] - relYMoved

  return nextValue
}
