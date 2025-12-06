export type BezierCurveValueType = [number, number, number, number]
export type BezierCurveExpandedValueType = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]
export type BezierCurveType = "in" | "out" | "inOut" | "unknown"

export interface Point {
  x: number
  y: number
}
