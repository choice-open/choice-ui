# ScrollArea 组件可访问性合规性

## 概述

ScrollArea 组件提供了基本的可访问性支持，确保屏幕阅读器用户可以理解滚动区域的结构和内容。

## WAI-ARIA 合规性检查表

### ✅ 已实现的 ARIA 属性

| 属性               | 元素           | 描述                   | 状态 |
| ------------------ | -------------- | ---------------------- | ---- |
| `role="scrollbar"` | Scrollbar      | 标识滚动条控件         | ✅   |
| `aria-controls`    | Scrollbar      | 链接滚动条到控制的视口 | ✅   |
| `aria-valuenow`    | Scrollbar      | 当前滚动位置 (0-100)   | ✅   |
| `aria-valuemin`    | Scrollbar      | 最小值 (0)             | ✅   |
| `aria-valuemax`    | Scrollbar      | 最大值 (100)           | ✅   |
| `aria-valuetext`   | Scrollbar      | 人类可读的滚动位置     | ✅   |
| `aria-orientation` | Scrollbar      | 滚动方向               | ✅   |
| `aria-label`       | Root/Scrollbar | 可访问名称             | ✅   |
| `aria-labelledby`  | Root           | 引用标签元素           | ✅   |
| `aria-hidden`      | Thumb/Corner   | 隐藏装饰性元素         | ✅   |

### ❌ 未实现的特性

| 特性         | 描述                  | 状态 |
| ------------ | --------------------- | ---- |
| 键盘导航     | 使用键盘滚动内容      | ❌   |
| 应用程序角色 | role="application"    | ❌   |
| 焦点管理     | tabindex 和焦点指示器 | ❌   |
| 区域角色     | role="region" 在视口  | ❌   |
| 动态内容通知 | aria-live 区域        | ❌   |
| 使用说明     | 键盘导航使用说明      | ❌   |

### 🔊 屏幕阅读器支持

| 特性         | 描述                                     | 状态 |
| ------------ | ---------------------------------------- | ---- |
| 可访问名称   | 通过 `aria-label` 或 `aria-labelledby`   | ✅   |
| 滚动位置通知 | 通过 `aria-valuetext` 提供位置信息       | ✅   |
| 角色识别     | 正确的 ARIA 角色让屏幕阅读器理解组件功能 | ✅   |

## 实施详情

### 1. 根容器 (Root)

```tsx
<div
  aria-label="Scrollable content"
  aria-labelledby="external-label-id"
>
```

### 2. 视口 (Viewport)

```tsx
<div
  id="viewport-id"
>
```

### 3. 滚动条 (Scrollbar)

```tsx
<div
  role="scrollbar"
  aria-controls="viewport-id"
  aria-orientation="vertical"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={currentPosition}
  aria-valuetext="25% scrolled vertically"
  aria-label="vertical scrollbar"
>
```

## 测试建议

### 自动化测试

1. 使用 `@testing-library/react` 验证 ARIA 属性
2. 使用 `axe-core` 进行无障碍性自动化测试
3. 验证滚动条属性和位置计算

### 手动测试

1. **屏幕阅读器测试**
   - 使用 NVDA/JAWS (Windows)
   - 使用 VoiceOver (macOS)
   - 使用 Orca (Linux)
   - 验证所有元素的可访问名称
   - 验证滚动位置通知

2. **浏览器兼容性**
   - Chrome + ChromeVox
   - Firefox + NVDA
   - Safari + VoiceOver
   - Edge + JAWS

## 代码示例

### 基本使用

```tsx
<ScrollArea
  aria-label="Product list"
  orientation="vertical"
  className="h-96 w-full"
>
  <ScrollArea.Viewport>
    <ScrollArea.Content>{/* 内容 */}</ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea>
```

### 带外部标签

```tsx
<h2 id="list-title">Product Catalog</h2>
<ScrollArea
  aria-labelledby="list-title"
  orientation="vertical"
  className="h-96 w-full"
>
  <ScrollArea.Viewport>
    <ScrollArea.Content>
      {/* 内容 */}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea>
```

## 限制和注意事项

### 当前限制

1. **无键盘导航**: 组件不支持键盘滚动，用户需要使用鼠标或触摸设备
2. **无焦点管理**: 视口不能接收键盘焦点
3. **无动态通知**: 内容变化不会主动通知屏幕阅读器
4. **无应用程序角色**: 不提供应用程序级别的交互体验

### 使用建议

1. 为组件提供合适的 `aria-label` 或 `aria-labelledby`
2. 确保内容本身具有良好的可访问性
3. 考虑为复杂交互提供备用的键盘友好方案
4. 测试屏幕阅读器的滚动位置播报

## 符合的标准

- [WAI-ARIA 1.1 Specification](https://www.w3.org/TR/wai-aria-1.1/) (部分)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) (基本)

## 更新历史

- **2025-07-08**: 移除键盘导航支持，简化为基本可访问性
- **2025-07-08**: 保留滚动条 ARIA 属性和屏幕阅读器支持
- **2025-07-08**: 更新文档以反映当前功能限制

---

_本文档记录了 ScrollArea 组件的基本可访问性实现。如需完整的键盘导航支持，请考虑使用其他具有完整可访问性的滚动组件。_
