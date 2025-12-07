# Condition Item 字段类型组件

这个文件夹包含了按字段类型拆分的条件输入组件。每个字段类型都有对应的独立组件文件，支持多种高级操作符和输入方式。

## 文件结构

```
condition-item/
├── README.md              # 这个说明文件
├── types.ts               # 共享类型定义
├── index.ts               # 导出所有组件
├── text-input.tsx         # 文本输入组件
├── number-input.tsx       # 数字输入组件（包含范围输入）
├── boolean-input.tsx      # 布尔值输入组件
├── date-input.tsx         # 日期输入组件（包含范围输入）
├── select-input.tsx       # 选择输入组件
├── multi-select-input.tsx # 多选输入组件
├── user-input.tsx         # 用户输入组件
├── tag-input.tsx          # 标签输入组件
├── regex-input.tsx        # 正则表达式输入组件 🆕
└── array-length-input.tsx # 数组长度输入组件 🆕
```

## 🚀 核心特性

### ✅ **与 n8n 标准对齐**

基于 n8n 的操作符标准，支持完整的条件查询功能：

- 通用操作符（exists, does not exist）
- 文本操作符（contains, regex matching）
- 数字比较操作符
- 数组和集合操作符
- 日期相关操作符
- 简化布尔操作符

### ✅ **智能操作符分组**

操作符下拉列表按功能分组，包含分割线分隔：

- **General**: 通用操作符
- **Text**: 文本操作符
- **Numbers & Comparison**: 数字和比较
- **Arrays & Collections**: 数组和集合
- **Dates**: 日期操作符
- **Boolean**: 布尔操作符

### ✅ **高级输入组件**

- **正则表达式输入**: 支持模式和标志（i, g, m, s）
- **数组长度输入**: 基于长度的过滤条件
- **日期输入**: 集成 date-fns 和日历选择器
- **存在性检查**: 无需值输入的存在性操作符

## 组件特点

### 1. 模块化设计

每个字段类型都有独立的组件文件，便于维护和扩展。

### 2. 统一接口

所有组件都实现 `BaseFieldInputProps` 接口：

```typescript
interface BaseFieldInputProps {
  condition: Condition
  field: Field
  disabled?: boolean
  onChange: (value: unknown) => void
}
```

### 3. 范围输入支持

数字和日期类型支持范围输入，使用 `RangeFieldInputProps` 接口：

```typescript
interface RangeFieldInputProps extends BaseFieldInputProps {
  onSecondValueChange: (value: unknown) => void
}
```

### 4. 特殊操作符处理

某些操作符需要特定的输入组件：

- **正则表达式操作符** → `RegexInput`
- **长度比较操作符** → `ArrayLengthInput`
- **存在性操作符** → 无输入组件（自动处理）

## 🆕 新增组件详解

### RegexInput（正则表达式输入）

支持正则表达式模式匹配：

```tsx
// 特性：
- 实时正则表达式验证
- 支持标志选择（i, g, m, s）
- 错误提示和模式预览
- 类型安全的值结构

// 值格式：
{
  pattern: string,
  flags?: string
}
```

### ArrayLengthInput（数组长度输入）

用于基于长度的过滤：

```tsx
// 特性：
- 数字输入验证
- 最小值限制（≥ 0）
- 整数步进
- 友好的单位显示（"items"）

// 支持操作符：
- LengthEquals
- LengthGreaterThan
- LengthLessThan
- LengthGreaterThanOrEqual
- LengthLessThanOrEqual
```

## 📋 支持的操作符

### 通用操作符

- `Exists` - 检查字段是否存在
- `DoesNotExist` - 检查字段是否不存在
- `Equals` - 等于
- `NotEquals` - 不等于

### 文本操作符

- `Contains` / `NotContains` - 包含/不包含
- `StartsWith` / `EndsWith` - 开始于/结束于
- `MatchesRegex` / `DoesNotMatchRegex` - 正则匹配/不匹配

### 数字比较操作符

- `GreaterThan` / `LessThan` - 大于/小于
- `GreaterThanOrEqual` / `LessThanOrEqual` - 大于等于/小于等于
- `Between` - 介于之间

### 数组和集合操作符

- `In` / `NotIn` - 在/不在列表中
- `IsEmpty` / `IsNotEmpty` - 为空/非空
- `LengthEquals` - 长度等于
- `LengthGreaterThan` / `LengthLessThan` - 长度大于/小于

### 日期操作符

- `IsAfter` / `IsBefore` - 在...之后/之前
- `IsToday` / `IsYesterday` / `IsTomorrow` - 今天/昨天/明天
- `IsThisWeek` / `IsLastWeek` / `IsNextWeek` - 本周/上周/下周
- `IsThisMonth` / `IsLastMonth` / `IsNextMonth` - 本月/上月/下月

### 布尔操作符

- `IsTrue` / `IsFalse` - 为真/为假（简化版）

## 添加新字段类型

要添加新的字段类型组件：

1. 在 `../types.ts` 中定义新的字段类型和操作符
2. 在 `../constants.ts` 中添加操作符配置和映射
3. 创建新的组件文件，例如 `custom-input.tsx`
4. 在 `index.ts` 中导出新组件
5. 在父级 `condition-item.tsx` 中添加新的处理逻辑
6. 更新操作符分组配置

### 示例：添加颜色选择器

```tsx
// color-input.tsx
import type { BaseFieldInputProps } from "./types"
import { FieldType } from "../types"

export function ColorInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== FieldType.Color) {
    return null
  }

  return (
    <input
      type="color"
      value={String(condition.value || "#000000")}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-10 w-16 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  )
}
```

然后在操作符分组中添加相关操作符：

```tsx
// 在 condition-item.tsx 的 operatorGroups 中
{
  label: "Visual",
  operators: [
    ComparisonOperator.ColorEquals,
    ComparisonOperator.ColorSimilar,
  ],
}
```

## 设计原则

1. **单一职责**：每个组件只负责一种字段类型或特定操作符的输入
2. **一致性**：所有组件使用相同的样式类和交互模式
3. **可扩展性**：新增字段类型不需要修改现有组件
4. **类型安全**：充分利用 TypeScript 的类型检查
5. **用户体验**：智能分组、实时验证、清晰的错误提示

## 🛠️ 技术栈

### 核心依赖

- **date-fns**: 日期处理和格式化
- **React Hooks**: 状态管理和副作用处理
- **TypeScript**: 完整的类型安全

### 设计系统组件

- `Input` - 基础文本输入
- `NumericInput` - 数字输入（支持拖拽和键盘快捷键）
- `Checkbox` - 复选框
- `DateInput` - 智能日期输入
- `MonthCalendar` - 日历选择器
- `Popover` - 浮层容器

## 最佳实践

1. **优先使用设计系统组件**而不是原生HTML元素
2. **实时验证**用户输入，提供即时反馈
3. **支持键盘导航**和无障碍功能
4. **缓存计算结果**避免不必要的重新渲染
5. **错误边界处理**确保单个组件错误不影响整体功能

## 🔄 状态管理

组件使用受控模式，所有状态由父组件管理：

```tsx
// 值变更流程
UserInput → onChange → Parent State → condition.value → Component Re-render
```

这确保了：

- 单一数据源
- 可预测的状态更新
- 易于调试和测试
- 支持撤销/重做功能
