import { DialogPosition } from "../dialog"

export function calculateInitialPosition(
  preset: DialogPosition,
  dialogWidth: number,
  dialogHeight: number,
  positionPadding: number,
  viewportWidth = window.innerWidth,
  viewportHeight = window.innerHeight,
): { x: number; y: number } {
  const padding = positionPadding // 边距

  // 计算水平位置
  let x = 0
  if (preset.includes("left")) {
    x = padding
  } else if (preset.includes("right")) {
    x = viewportWidth - dialogWidth - padding
  } else if (preset.includes("center") || preset === "center") {
    x = (viewportWidth - dialogWidth) / 2
  }

  // 计算垂直位置
  let y = 0
  if (preset.includes("top")) {
    y = padding
  } else if (preset.includes("bottom")) {
    y = viewportHeight - dialogHeight - padding
  } else if (preset.includes("center") || preset === "center") {
    y = (viewportHeight - dialogHeight) / 2
  }

  return { x, y }
}
