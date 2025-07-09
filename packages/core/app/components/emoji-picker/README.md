# EmojiPicker 组件

一个功能完整的 emoji 选择器组件，使用本地 emoji 数据和 `@tanstack/react-virtual` 构建高性能虚拟滚动。

## 特性

- 📊 **虚拟滚动**: 使用 @tanstack/react-virtual 实现高性能的大量 emoji 渲染
- 🗂️ **智能分类**: 基于 emoji ID 范围自动分类，包含 8 个主要分类
- 🔍 **强大搜索**: 支持按名称、emoji 字符、URL 名称搜索
- 📁 **分类浏览**: 支持按分类筛选 emoji，可快速滚动定位
- 💾 **常用记录**: 智能记录用户常用 emoji，支持开关控制
- 🎨 **主题支持**: 支持 dark/light 主题模式
- ⚡ **高性能**: 基于虚拟滚动，支持 1700+ emoji 的流畅滚动
- 📱 **响应式**: 自适应网格布局，可自定义列数
- 💾 **本地数据**: 使用本地 emoji 数据，无网络依赖
- 🎛️ **受控组件**: 支持受控模式，外部状态管理
- 🧩 **模块化**: 组件化设计，Footer 可独立使用

## 组件架构

```
emoji/
├── emoji-picker.tsx          # 主组件
├── emoji-footer.tsx          # Footer 组件 (独立)
├── emoji-item.tsx            # 单个 emoji 项
├── emoji-empty.tsx           # 空状态组件
├── emoji-category-header.tsx # 分类标题组件
├── emoji-data.ts             # emoji 数据源
├── hooks/
│   ├── use-emoji-data.ts     # 数据管理 hook
│   └── use-emoji-scroll.ts   # 滚动管理 hook
├── tv.ts                     # 样式定义
└── index.ts                  # 组件导出
```

## 数据源

组件使用本地 `emoji-data.ts` 文件，包含 1700+ 个精选 emoji，数据结构如下：

```typescript
interface EmojiData {
  id: number // 唯一标识符
  code: string // Unicode 编码
  emoji: string // emoji 字符
  name: string // emoji 名称
  nameUrl: string // URL 友好的名称
}
```

## 分类系统

emoji 按 ID 范围自动分类：

- 😀 **Smileys & People** (ID: 1-460): 包含各种表情、手势、人物等
- 🐶 **Animals & Nature** (ID: 465-591): 动物、植物、自然元素
- 🍎 **Food & Drink** (ID: 592-712): 水果、蔬菜、饮食相关
- 🚗 **Travel & Places** (ID: 713-922): 交通工具、建筑、地点
- ⚽ **Activities** (ID: 923-1001): 运动、游戏、娱乐活动
- 💡 **Objects** (ID: 1002-1234): 日常用品、工具、物件
- ❤️ **Symbols** (ID: 1235-1451): 各种符号、图标、标志
- 🏁 **Flags** (ID: 1452-1719): 世界各国国旗

## 基本用法

```tsx
import { useState } from "react"
import { EmojiPicker, type EmojiData } from "@/components/ui/emoji-picker"

function MyComponent() {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  return (
    <div>
      <div>
        选中的 emoji: {selectedEmoji ? `${selectedEmoji.emoji} (${selectedEmoji.name})` : "无"}
      </div>

      <EmojiPicker
        value={selectedEmoji}
        onChange={setSelectedEmoji}
        height={400}
        variant="dark"
        showSearch={true}
        showCategories={true}
        showFrequentlyUsed={true}
      />
    </div>
  )
}
```

## Props

| 属性                 | 类型                         | 默认值              | 描述                     |
| -------------------- | ---------------------------- | ------------------- | ------------------------ |
| `value`              | `EmojiData \| null`          | -                   | 当前选中的 emoji（受控） |
| `onChange`           | `(emoji: EmojiData) => void` | -                   | emoji 选择变化时的回调   |
| `className`          | `string`                     | -                   | 自定义 CSS 类名          |
| `searchPlaceholder`  | `string`                     | `"Search emoji..."` | 搜索框占位符文本         |
| `height`             | `number`                     | `384`               | 选择器高度（像素）       |
| `columns`            | `number`                     | `8`                 | 每行显示的 emoji 数量    |
| `showCategories`     | `boolean`                    | `true`              | 是否显示分类导航         |
| `showSearch`         | `boolean`                    | `true`              | 是否显示搜索框           |
| `showFrequentlyUsed` | `boolean`                    | `true`              | 是否启用常用 emoji 功能  |
| `variant`            | `"dark" \| "light"`          | `"dark"`            | 主题变体                 |
| `children`           | `React.ReactNode`            | -                   | 额外的子元素             |

## Footer 显示逻辑

Footer 组件采用智能显示策略：

1. **🎯 Hover 优先**: 鼠标悬停时显示 hover 的 emoji
2. **📌 选中备用**: 无 hover 时显示当前选中的 emoji
3. **💡 默认提示**: 无选中无 hover 时显示 "Pick an emoji..."

```tsx
// EmojiFooter 可独立使用
import { EmojiFooter } from "@/components/ui/emoji-picker"
;<EmojiFooter
  hoveredEmoji={hoveredEmoji}
  selectedEmoji={selectedEmoji}
  variant="dark"
/>
```

## 使用场景

### 基础聊天应用

```tsx
function ChatInput() {
  const [message, setMessage] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleEmojiChange = (emoji: EmojiData) => {
    setMessage((prev) => prev + emoji.emoji)
    setSelectedEmoji(emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="relative">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="输入消息..."
      />
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>

      {showEmojiPicker && (
        <div className="absolute right-0 bottom-full z-10">
          <EmojiPicker
            value={selectedEmoji}
            onChange={handleEmojiChange}
            height={350}
            variant="dark"
          />
        </div>
      )}
    </div>
  )
}
```

### 禁用常用功能

```tsx
function SimpleEmojiPicker() {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  return (
    <EmojiPicker
      value={selectedEmoji}
      onChange={setSelectedEmoji}
      height={400}
      variant="light"
      showFrequentlyUsed={false} // 禁用常用 emoji 记录
    />
  )
}
```

### 外部值控制

```tsx
function ControlledEmojiPicker() {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  // 使用真实 emoji 数据
  const setGrinningFace = () => {
    const grinning = emojis.find((e) => e.emoji === "😀")
    if (grinning) setSelectedEmoji(grinning)
  }

  return (
    <div>
      <button onClick={setGrinningFace}>设置为 😀</button>

      <EmojiPicker
        value={selectedEmoji}
        onChange={setSelectedEmoji}
        height={400}
      />
    </div>
  )
}
```

### 表单输入增强

```tsx
function CommentForm() {
  const [comment, setComment] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  const handleEmojiChange = (emoji: EmojiData) => {
    setComment((prev) => prev + emoji.emoji)
    setSelectedEmoji(emoji)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="添加评论..."
        className="w-full rounded-xl border p-3"
      />

      <EmojiPicker
        value={selectedEmoji}
        onChange={handleEmojiChange}
        height={300}
        columns={10}
        searchPlaceholder="为你的评论添加表情..."
        variant="light"
      />
    </div>
  )
}
```

### Popover 集成

```tsx
import { Popover } from "@/components/ui/popover"

function PopoverEmojiPicker() {
  const [open, setOpen] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <Popover.Trigger>
        <Button active={open}>{selectedEmoji?.emoji || "😀"} 选择 Emoji</Button>
      </Popover.Trigger>

      <Popover.Header title="选择 Emoji" />

      <Popover.Content className="p-0">
        <EmojiPicker
          value={selectedEmoji}
          onChange={(emoji) => {
            setSelectedEmoji(emoji)
            setOpen(false)
          }}
          height={400}
          variant="dark"
        />
      </Popover.Content>
    </Popover>
  )
}
```

## 搜索功能

支持多种搜索方式：

- **名称搜索**: 输入 "smile" 找到 "smiling face"
- **emoji 搜索**: 直接输入 "😀"
- **URL 名称搜索**: 输入 "grinning-face"

搜索不区分大小写，支持部分匹配。搜索时会隐藏分类导航，专注于搜索结果。

## 常用功能

- **自动记录**: 用户选择的 emoji 会自动记录到 localStorage
- **智能排序**: 常用 emoji 按使用频次排序
- **限制数量**: 最多保存 24 个常用 emoji
- **可控开关**: 通过 `showFrequentlyUsed` 控制是否启用
- **隐私友好**: 可完全禁用记录功能

## 分类导航

- **可视化图标**: 每个分类都有对应的图标
- **快速定位**: 点击分类图标快速滚动到对应位置
- **实时同步**: 滚动时分类导航会自动更新 active 状态
- **智能隐藏**: 搜索时自动隐藏，常用功能禁用时隐藏对应按钮

## 性能特性

- **虚拟滚动**: 仅渲染可见区域的 emoji，支持流畅滚动大量数据
- **本地数据**: 无需网络请求，加载速度快
- **智能分类**: 基于 ID 范围快速过滤，避免复杂计算
- **响应式**: 自适应不同屏幕尺寸
- **事件优化**: 使用 useEventCallback 避免不必要的重渲染

## 主题系统

支持 dark 和 light 两种主题：

```tsx
// 深色主题（默认）
<EmojiPicker variant="dark" />

// 浅色主题
<EmojiPicker variant="light" />
```

主题会自动应用到所有子组件，包括搜索框、分类导航、Footer 等。

## TypeScript 支持

组件完全支持 TypeScript，提供完整的类型定义：

```typescript
import { EmojiData, EmojiPicker, EmojiFooter, emojis } from "@/components/ui/emoji-picker"

// emoji 数据类型
const emoji: EmojiData = {
  id: 1,
  code: "U+1F600",
  emoji: "😀",
  name: "grinning face",
  nameUrl: "grinning-face",
}

// 受控状态
const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

// 查找特定 emoji
const grinning = emojis.find((e) => e.emoji === "😀")
```

## Storybook 示例

查看 Storybook 了解更多使用示例和交互演示：

```bash
pnpm storybook
```

包含的示例：

- **Basic**: 基本用法
- **LightTheme**: 浅色主题
- **WithoutFrequentlyUsed**: 禁用常用功能
- **ControlledWithPopover**: Popover 集成
- **MultipleControlled**: 多个选择器
- **DraggablePopover**: 可拖拽的 Popover
- **ExternalValueControl**: 外部值控制

## 注意事项

1. **受控组件**: 组件为受控模式，需要通过 `value` 和 `onChange` 管理状态
2. **数据一致性**: 请使用 `emojis` 数组中的真实数据，避免构造假数据
3. **ID 范围**: 分类基于 emoji ID 范围，如需修改分类请调整 `categories` 配置
4. **虚拟滚动**: 大量 emoji 时使用虚拟滚动保证性能
5. **搜索性能**: 搜索在前端执行，对于大量数据保持良好性能
6. **兼容性**: 需要支持现代浏览器的 emoji 渲染
7. **本地存储**: 常用功能依赖 localStorage，在不支持的环境中会静默失败

## 技术栈

- **React**: 组件基础框架
- **TypeScript**: 类型安全
- **@tanstack/react-virtual**: 虚拟滚动核心
- **usehooks-ts**: React hooks 工具库
- **Tailwind CSS**: 样式系统（通过 TV 函数）

## 更新数据

如需更新 emoji 数据，直接修改 `emoji-data.ts` 文件即可。数据格式必须符合 `EmojiData` 接口规范，确保 ID 连续性以保证分类功能正常工作。
