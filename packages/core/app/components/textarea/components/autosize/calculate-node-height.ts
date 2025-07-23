import forceHiddenStyles from "./force-hidden-styles"
import { isBrowser } from "./utils"
import type { SizingData } from "./get-sizing-data"

export type CalculatedNodeHeights = [height: number, rowHeight: number]

// 使用 WeakMap 来管理隐藏元素，避免内存泄漏
const hiddenTextareaCache = new WeakMap<Document, HTMLTextAreaElement>()

const getOrCreateHiddenTextarea = (): HTMLTextAreaElement | null => {
  if (!isBrowser || !document?.createElement) {
    return null
  }

  let hiddenTextarea = hiddenTextareaCache.get(document)

  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea")
    hiddenTextarea.setAttribute("tabindex", "-1")
    hiddenTextarea.setAttribute("aria-hidden", "true")
    forceHiddenStyles(hiddenTextarea)
    hiddenTextareaCache.set(document, hiddenTextarea)
  }

  return hiddenTextarea
}

const getHeight = (node: HTMLElement, sizingData: SizingData): number => {
  const height = node.scrollHeight

  if (sizingData.sizingStyle.boxSizing === "border-box") {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize
  }

  // remove padding, since height = content
  return height - sizingData.paddingSize
}

export default function calculateNodeHeight(
  sizingData: SizingData,
  value: string,
  minRows = 1,
  maxRows = Infinity,
): CalculatedNodeHeights {
  // SSR 保护：在服务端返回估算值
  if (!isBrowser || !document?.createElement) {
    const estimatedRowHeight = 20
    const estimatedHeight = Math.max(estimatedRowHeight * minRows, estimatedRowHeight)
    return [estimatedHeight, estimatedRowHeight]
  }

  // 边界值检查
  if (minRows < 1) minRows = 1
  if (maxRows < minRows) maxRows = minRows

  const hiddenTextarea = getOrCreateHiddenTextarea()
  if (!hiddenTextarea) {
    // 降级处理
    const fallbackRowHeight = 16
    return [fallbackRowHeight * minRows, fallbackRowHeight]
  }

  // 确保元素在 DOM 中
  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea)
  }

  const { paddingSize, borderSize, sizingStyle } = sizingData
  const { boxSizing } = sizingStyle

  try {
    // 应用样式
    Object.keys(sizingStyle).forEach((_key) => {
      const key = _key as keyof typeof sizingStyle
      const value = sizingStyle[key]
      if (value != null) {
        hiddenTextarea.style[key] = String(value)
      }
    })

    forceHiddenStyles(hiddenTextarea)

    // 设置值并测量
    hiddenTextarea.value = value || "x"
    let height = getHeight(hiddenTextarea, sizingData)

    // Firefox bug 修复：双重设置
    hiddenTextarea.value = value || "x"
    height = getHeight(hiddenTextarea, sizingData)

    // 测量单行高度
    hiddenTextarea.value = "x"
    const rowHeight = Math.max(hiddenTextarea.scrollHeight - paddingSize, 1)

    // 计算最小高度
    let minHeight = rowHeight * minRows
    if (boxSizing === "border-box") {
      minHeight = minHeight + paddingSize + borderSize
    }
    height = Math.max(minHeight, height)

    // 计算最大高度
    if (maxRows !== Infinity) {
      let maxHeight = rowHeight * maxRows
      if (boxSizing === "border-box") {
        maxHeight = maxHeight + paddingSize + borderSize
      }
      height = Math.min(maxHeight, height)
    }

    return [Math.max(height, 1), Math.max(rowHeight, 1)]
  } catch (error) {
    // 错误降级
    console.warn("TextareaAutosize: Failed to calculate height", error)
    const fallbackRowHeight = 16
    return [fallbackRowHeight * minRows, fallbackRowHeight]
  }
}

// 清理函数，用于测试或特殊情况
export const cleanupHiddenTextarea = (): void => {
  if (!isBrowser) return

  const hiddenTextarea = hiddenTextareaCache.get(document)
  if (hiddenTextarea?.parentNode) {
    hiddenTextarea.parentNode.removeChild(hiddenTextarea)
  }
  hiddenTextareaCache.delete(document)
}
