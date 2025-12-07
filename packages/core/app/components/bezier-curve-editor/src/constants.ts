// 贝兹曲线编辑器配置常量
import { BezierCurveValueType } from "./types"

export const BEZIER_CURVE_EDITOR_DEFAULTS = {
  size: 192,
  handleSize: 8,
  outerAreaSize: 48,
  strokeWidth: 2,
  duration: 2,
  delay: 0,
  disabledPoints: [false, false] as const,
  defaultValue: [0.4, 0, 1, 0.6] as BezierCurveValueType,
}

// 预设缓动函数
export const PRESET_EASINGS: Array<{ name: string; value: BezierCurveValueType }> = [
  { name: "easeInSine", value: [0.12, 0, 0.39, 0] },
  { name: "easeOutSine", value: [0.61, 1, 0.88, 1] },
  { name: "easeInOutSine", value: [0.37, 0, 0.63, 1] },
  { name: "easeInQuad", value: [0.11, 0, 0.5, 0] },
  { name: "easeOutQuad", value: [0.5, 1, 0.89, 1] },
  { name: "easeInOutQuad", value: [0.45, 0, 0.55, 1] },
  { name: "easeInCubic", value: [0.32, 0, 0.67, 0] },
  { name: "easeOutCubic", value: [0.33, 1, 0.68, 1] },
  { name: "easeInOutCubi", value: [0.65, 0, 0.35, 1] },
  { name: "easeInQuart", value: [0.5, 0, 0.75, 0] },
  { name: "easeOutQuart", value: [0.25, 1, 0.5, 1] },
  { name: "easeInOutQuar", value: [0.76, 0, 0.24, 1] },
  { name: "easeInQuint", value: [0.64, 0, 0.78, 0] },
  { name: "easeOutQuint", value: [0.22, 1, 0.36, 1] },
  { name: "easeInOutQuin", value: [0.83, 0, 0.17, 1] },
  { name: "easeInExpo", value: [0.7, 0, 0.84, 0] },
  { name: "easeOutExpo", value: [0.16, 1, 0.3, 1] },
  { name: "easeInOutExpo", value: [0.87, 0, 0.13, 1] },
  { name: "easeInCirc", value: [0.55, 0, 1, 0.45] },
  { name: "easeOutCirc", value: [0, 0.55, 0.45, 1] },
  { name: "easeInOutCirc", value: [0.85, 0, 0.15, 1] },
  { name: "easeInBack", value: [0.36, 0, 0.66, -0.56] },
  { name: "easeOutBack", value: [0.34, 1.56, 0.64, 1] },
  { name: "easeInOutBack", value: [0.68, -0.6, 0.32, 1.6] },
]

// 预览动画样式
export const PREVIEW_KEYFRAMES = (size: number) =>
  ({
    bezierLoop: `@keyframes bezier-preview-loop {from {transform: translateX(0);}to {transform: translateX(${size}px);}}`,
    offsetLoop: "@keyframes preview-loop {from {offset-distance: 0%}to {offset-distance: 100%}}",
  }) as const
