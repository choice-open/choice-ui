# 通用 i18n 工具函数

提供类型安全的国际化配置合并和文本获取功能，适用于任意组件的国际化需求。

## 主要功能

### 1. `useI18n<T>` - 通用 i18n Hook（推荐）

**用途**：一站式解决方案，自动缓存合并结果，直接在组件中使用

```typescript
import { useI18n } from "~/utils"

// 组件默认配置
const defaultConfig = {
  buttons: {
    save: "Save",
    cancel: "Cancel",
  },
  messages: {
    success: "Operation completed successfully",
    error: "An error occurred",
  },
}

// 在组件中使用
export const MyComponent = ({ i18n: userI18n, ...props }) => {
  // 🎯 直接使用通用Hook，无需封装
  const i18n = useI18n(defaultConfig, userI18n)

  return (
    <div>
      <button>{i18n.buttons.save}</button>
      <span>{i18n.messages.success}</span>
    </div>
  )
}
```

### 2. `mergeI18nConfig<T>` - 深度合并配置

**用途**：纯函数版本，适用于非React环境或自定义缓存场景

```typescript
import { mergeI18nConfig } from "~/utils"

// 合并结果（每次调用都重新计算）
const mergedConfig = mergeI18nConfig(defaultConfig, userConfig)
```

### 3. `getI18nText<T>` - 安全获取嵌套文本

**用途**：从嵌套的 i18n 对象中安全获取文本，支持点号路径

```typescript
import { getI18nText } from "~/utils"

const i18n = {
  form: {
    validation: {
      required: "This field is required",
      email: "Please enter a valid email",
    },
  },
}

// 使用点号路径获取
const errorText = getI18nText(i18n, "form.validation.required")
// 结果：'This field is required'

// 路径不存在时使用fallback
const missingText = getI18nText(i18n, "form.unknown.path", "默认文字")
// 结果：'默认文字'
```

## 在组件中的使用模式

### 1. 定义组件的 i18n 接口

```typescript
// 组件特定的 i18n 配置接口
interface MyComponentI18n {
  buttons?: {
    submit?: string
    reset?: string
  }
  messages?: {
    loading?: string
    success?: string
  }
}

// 默认配置
const defaultI18n: Required<MyComponentI18n> = {
  buttons: {
    submit: "Submit",
    reset: "Reset",
  },
  messages: {
    loading: "Loading...",
    success: "Success!",
  },
}
```

### 2. 🚀 直接使用通用Hook（推荐）

```typescript
import { useI18n } from "~/utils"

interface MyComponentProps {
  i18n?: MyComponentI18n
  // ... 其他 props
}

export const MyComponent = (props: MyComponentProps) => {
  const { i18n: userI18n, ...otherProps } = props

  // 🎯 直接使用通用Hook，自动缓存，无需封装
  const i18n = useI18n(defaultI18n, userI18n)

  return (
    <div>
      <button>{i18n.buttons.submit}</button>
      <button>{i18n.buttons.reset}</button>
      <div>{i18n.messages.loading}</div>
    </div>
  )
}
```

## 类型安全特性

- ✅ **完全类型安全**：支持任意嵌套结构的类型推导
- ✅ **部分配置**：用户可以只覆盖需要的部分，其余使用默认值
- ✅ **深度合并**：支持嵌套对象的递归合并
- ✅ **防错机制**：路径不存在时返回安全的 fallback 值

## 与现有组件的兼容性

此工具已在以下组件中成功使用：

- ✅ `CollaborativeEditing` - 文本编辑器组件
- 🔄 其他组件可参考此模式进行集成

## 性能优化

- **缓存优化**：使用 `useMemo` 避免重复计算
- **按需合并**：只有用户提供配置时才进行合并操作
- **类型推导**：编译时类型检查，运行时零成本
