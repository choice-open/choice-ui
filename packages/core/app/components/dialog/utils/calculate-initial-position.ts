import { DialogPosition } from "../dialog"

export function calculateInitialPosition(
  preset: DialogPosition,
  dialogWidth: number,
  dialogHeight: number,
  positionPadding: number,
  viewportWidth?: number,
  viewportHeight?: number,
): { x: number; y: number } {
  const vw = viewportWidth ?? (typeof window !== "undefined" ? window.innerWidth : 0)
  const vh = viewportHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0)
  const padding = positionPadding // 边距

  // 计算水平位置
  let x = 0
  if (preset.includes("left")) {
    x = padding
  } else if (preset.includes("right")) {
    x = vw - dialogWidth - padding
  } else if (preset.includes("center") || preset === "center") {
    x = (vw - dialogWidth) / 2
  }

  // 计算垂直位置
  let y = 0
  if (preset.includes("top")) {
    y = padding
  } else if (preset.includes("bottom")) {
    y = vh - dialogHeight - padding
  } else if (preset.includes("center") || preset === "center") {
    y = (vh - dialogHeight) / 2
  }

  return { x, y }
}
