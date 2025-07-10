# 🚀 ScrollArea 性能优化指南

本指南总结了 ScrollArea 组件的性能优化策略，帮助你构建高性能的滚动体验。

## 📊 性能对比：Radix UI vs 我们的实现

### Radix UI 的核心优势

- **原生滚动**: 保持浏览器原生滚动性能
- **叠加设计**: 滚动条不占用布局空间
- **智能事件**: 只在必要时劫持指针事件
- **零 Transform**: 不使用 CSS 变换，避免重排

### 我们的性能增强

- **智能节流**: 根据滚动速度动态调整更新频率
- **精确检测**: 使用容差避免浮点数精度问题
- **预计算缓存**: 拖拽时预计算转换比例
- **Observer 优化**: 只监听影响布局的变化

## 🔧 性能优化策略

### 1. 事件处理优化

#### ✅ 使用被动事件监听器

```typescript
viewport.addEventListener("scroll", handleScroll, {
  passive: true, // 🚀 提升滚动性能
  signal,
  capture: false,
})
```

#### ✅ 智能节流策略

```typescript
// 根据滚动速度动态调整更新频率
if (timeSinceLastScroll < 8) {
  minUpdateIntervalRef.current = 32 // 快速滚动：~30fps
} else if (timeSinceLastScroll > 100) {
  minUpdateIntervalRef.current = 16 // 慢速滚动：~60fps
}
```

### 2. 状态更新优化

#### ✅ 精确的变化检测

```typescript
// 使用容差避免浮点数精度问题
const scrollLeftChanged = Math.abs(prevState.scrollLeft - newState.scrollLeft) > 0.5
const scrollTopChanged = Math.abs(prevState.scrollTop - newState.scrollTop) > 0.5
```

#### ✅ 时间戳防重复

```typescript
const now = performance.now()
const timeSinceLastUpdate = now - lastUpdateTimeRef.current

// 防止过于频繁的更新
if (timeSinceLastUpdate < minUpdateIntervalRef.current) {
  // 延迟到下一帧
  return
}
```

### 3. Observer 性能优化

#### ✅ 智能 MutationObserver

```typescript
const hasLayoutChanges = mutations.some((mutation) => {
  if (mutation.type === "childList") {
    return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
  }
  if (mutation.type === "attributes") {
    return mutation.attributeName === "style" || mutation.attributeName === "class"
  }
  return mutation.type === "characterData"
})

// 只对影响布局的变化响应
if (!hasLayoutChanges) return
```

#### ✅ 高效 ResizeObserver

```typescript
resizeObserverRef.current = new ResizeObserver((entries) => {
  // 批量处理，只处理目标元素
  for (const entry of entries) {
    if (entry.target === viewport) {
      updateScrollState()
      break
    }
  }
})
```

### 4. 拖拽性能优化

#### ✅ 预计算拖拽上下文

```typescript
// 避免在 mousemove 中重复计算
const scrollableRange = Math.max(0, scrollState.scrollHeight - scrollState.clientHeight)
const scrollbarRange = scrollbarRect.height
const scrollRatio = scrollableRange / scrollbarRange

dragContextRef.current = { scrollableRange, scrollbarRange, scrollRatio }
```

#### ✅ 减少 DOM 操作

```typescript
// 直接设置对应方向的 scroll 值
const newScrollValue = Math.max(0, Math.min(startScroll.current + scrollDelta, scrollableRange))

if (orientation === "vertical") {
  viewport.scrollTop = newScrollValue
} else {
  viewport.scrollLeft = newScrollValue
}
```

## 📈 性能监控

### 启用性能监控

```typescript
import { useScrollPerformanceMonitor } from "./hooks"

// 在开发环境启用
const performanceMetrics = useScrollPerformanceMonitor(viewport, {
  enabled: process.env.NODE_ENV === "development",
  logInterval: 5000,
  frameTimeThreshold: 16.67,
})
```

### 性能指标解读

- **Average frame time**: 平均帧时间，应 < 16.67ms (60fps)
- **Dropped frames**: 掉帧数，应尽可能少
- **Scroll events/sec**: 滚动事件频率，过高需要节流
- **Updates/sec**: 状态更新频率，应与需求匹配

## ⚡ 最佳实践

### 1. DOM 结构优化

#### ✅ 正确的 CSS 设置

```css
/* 隐藏原生滚动条 */
.viewport {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.viewport::-webkit-scrollbar {
  display: none;
}

/* 滚动条叠加设计 */
.scrollbar {
  position: absolute;
  pointer-events: auto;
}
```

#### ✅ 避免不必要的重排

```typescript
// 使用 contain CSS 属性
<div style={{ contain: 'layout style paint' }}>
  {content}
</div>
```

### 2. 内容优化

#### ✅ 大数据集虚拟化

```typescript
// 结合 @tanstack/react-virtual 使用
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => viewport,
  estimateSize: () => 60,
  overscan: 5,
})
```

#### ✅ 避免频繁的内容变化

```typescript
// 批量更新内容
const [items, setItems] = useState([])

// 避免频繁的单个添加
// ❌ items.forEach(item => setItems(prev => [...prev, item]))

// ✅ 批量更新
setItems(newItems)
```

### 3. 动画性能

#### ✅ 使用 CSS 动画

```css
.scrollbar {
  transition: opacity 0.3s ease-out;
  will-change: opacity; /* 提示浏览器优化 */
}
```

#### ✅ 避免 JavaScript 动画

```typescript
// ❌ 避免在 JS 中做动画
// element.style.opacity = `${progress}`

// ✅ 使用 CSS 类切换
element.classList.toggle("visible")
```

## 🛠️ 故障排查

### 性能问题诊断

1. **滚动卡顿**: 检查 scroll event 频率是否过高
2. **拖拽延迟**: 确认是否正确预计算拖拽参数
3. **内容变化不响应**: 验证 MutationObserver 配置
4. **布局抖动**: 检查容差设置和浮点数处理

### 常见性能陷阱

- ❌ 在 scroll 事件中执行重计算
- ❌ 频繁的 DOM 查询和操作
- ❌ 不必要的状态更新
- ❌ 缺少事件清理导致内存泄漏

## 📚 扩展阅读

- [Web 滚动性能优化](https://web.dev/optimize-inp/)
- [JavaScript 事件循环](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment)
- [RequestAnimationFrame 最佳实践](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

## 🎯 总结

通过采用这些优化策略，我们的 ScrollArea 组件在保持 Radix UI 原生滚动优势的基础上，进一步提升了：

- **响应性**: 智能节流和预计算
- **精确性**: 容差处理和精确检测
- **效率**: Observer 优化和事件优化
- **可监控性**: 内置性能监控工具

这些优化确保了即使在复杂场景下（如大数据集、频繁更新、dialog/popover 中使用）也能保持流畅的滚动体验。
