import { BezierCurveExpandedValueType, BezierCurveValueType } from "./types"

export function bezierCurveParamsFromSizeAndValue(
  size: number,
  value: BezierCurveExpandedValueType,
) {
  return {
    startCoordinate: getStartPointCoordinate(size, value),
    endCoordinate: getEndPointCoordinate(size, value),
    startBezierHandle: getStartHandleCoordinate(size, value),
    endBezierHandle: getEndHandleCoordinate(size, value),
  }
}

function getStartPointCoordinate(
  size: number,
  value: BezierCurveValueType | BezierCurveExpandedValueType,
): [number, number] {
  // 对于4位数组，起始点固定在(0,0)；对于8位数组，索引0,1是起始点
  const x = value.length === 4 ? 0 : value[0]
  const y = value.length === 4 ? 0 : value[1]
  return [size * x, size * (1 - y)]
}

function getStartHandleCoordinate(
  size: number,
  value: BezierCurveValueType | BezierCurveExpandedValueType,
): [number, number] {
  // 对于4位数组，索引0,1是起始控制点；对于8位数组，索引2,3是起始控制点
  const x = value.length === 4 ? value[0] : value[2]
  const y = value.length === 4 ? value[1] : value[3]
  return [size * x, size * (1 - y)]
}

function getEndPointCoordinate(
  size: number,
  value: BezierCurveValueType | BezierCurveExpandedValueType,
): [number, number] {
  // 对于4位数组，结束点固定在(1,1)；对于8位数组，索引6,7是结束点
  const x = value.length === 4 ? 1 : value[6]
  const y = value.length === 4 ? 1 : value[7]
  return [size * x, size * (1 - y)]
}

function getEndHandleCoordinate(
  size: number,
  value: BezierCurveValueType | BezierCurveExpandedValueType,
): [number, number] {
  // 对于4位数组，索引2,3是结束控制点；对于8位数组，索引4,5是结束控制点
  const x = value.length === 4 ? value[2] : value[4]
  const y = value.length === 4 ? value[3] : value[5]
  return [size * x, size * (1 - y)]
}
