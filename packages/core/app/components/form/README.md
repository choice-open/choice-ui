# Form 组件系统

基于 TanStack Form 构建的表单状态管理系统，专为组件库设计，提供强大的表单功能。

## 核心特性

- ✅ **状态管理** - 统一的表单状态管理
- ✅ **验证系统** - 同步/异步验证支持
- ✅ **错误处理** - 统一的错误显示和处理
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **组件适配** - 现有组件库无缝集成
- ✅ **高性能** - 精确的重新渲染控制

## 基础用法

### 1. 简单表单

```tsx
import { Form, FormField, FormSubmit, InputAdapter } from "~/components/form"

function LoginForm() {
  return (
    <Form
      defaultValues={{ username: "", password: "" }}
      onSubmit={async (values) => {
        console.log("提交数据:", values)
      }}
    >
      <FormField
        name="username"
        label="用户名"
        required
        component={InputAdapter}
        componentProps={{ placeholder: "请输入用户名" }}
      />

      <FormField
        name="password"
        label="密码"
        required
        component={InputAdapter}
        componentProps={{ type: "password", placeholder: "请输入密码" }}
      />

      <FormSubmit>登录</FormSubmit>
    </Form>
  )
}
```

### 2. 使用 Render Props

```tsx
import { Form, FormField, FormSubmit, InputAdapter, SelectAdapter } from "~/components/form"

function UserForm() {
  return (
    <Form
      defaultValues={{ name: "", age: "", gender: "" }}
      onSubmit={async (values) => {
        console.log("用户信息:", values)
      }}
    >
      <FormField
        name="name"
        label="姓名"
      >
        {(field) => (
          <InputAdapter
            value={field.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            placeholder="请输入姓名"
          />
        )}
      </FormField>

      <FormField
        name="gender"
        label="性别"
      >
        {(field) => (
          <SelectAdapter
            value={field.value}
            onChange={field.handleChange}
            options={[
              { label: "男", value: "male" },
              { label: "女", value: "female" },
            ]}
          />
        )}
      </FormField>

      <FormSubmit>保存</FormSubmit>
    </Form>
  )
}
```

### 3. 使用 Hooks

```tsx
import { useFormContext, useFormField } from "~/components/form"

function CustomFormField() {
  const { formApi } = useFormContext()
  const nameField = useFormField<string>("name")

  return (
    <div>
      <input
        value={nameField.value}
        onChange={(e) => nameField.handleChange(e.target.value)}
        onBlur={nameField.handleBlur}
      />
      {nameField.state.error && <span className="error">{nameField.state.error}</span>}
    </div>
  )
}
```

## API 参考

### Form Props

```tsx
interface FormProps<T> {
  children?: ReactNode
  defaultValues?: Partial<T>
  onSubmit?: (values: T) => void | Promise<void>
  validators?: FormValidators<T>
  disabled?: boolean
  className?: string
  variant?: "default" | "dark"
  size?: "default" | "large"
}
```

### FormField Props

```tsx
interface FormFieldProps<T> {
  name: string
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  component?: React.ComponentType
  componentProps?: Record<string, unknown>
  children?: ReactNode | ((field: SimpleFieldApi<T>) => ReactNode)
  className?: string
}
```

### FormSubmit Props

```tsx
interface FormSubmitProps {
  children?: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "large"
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  className?: string
}
```

## 适配器

### InputAdapter

用于文本输入的适配器：

```tsx
<FormField
  name="email"
  component={InputAdapter}
  componentProps={{
    type: "email",
    placeholder: "请输入邮箱",
  }}
/>
```

### SelectAdapter

用于选择器的适配器：

```tsx
<FormField
  name="city"
  component={SelectAdapter}
  componentProps={{
    options: [
      { label: "北京", value: "beijing" },
      { label: "上海", value: "shanghai" },
    ],
  }}
/>
```

## 验证

### 字段级验证

```tsx
<FormField
  name="email"
  validators={{
    onChange: (value) => {
      if (!value.includes("@")) {
        return "请输入有效的邮箱地址"
      }
    },
  }}
  component={InputAdapter}
/>
```

### 表单级验证

```tsx
<Form
  validators={{
    onSubmit: (values) => {
      if (values.password !== values.confirmPassword) {
        return "两次输入的密码不一致"
      }
    },
  }}
>
  {/* 表单字段 */}
</Form>
```

## 扩展适配器

创建自定义适配器：

```tsx
import type { InputAdapterProps } from "~/components/form"

export function CustomInputAdapter(props: InputAdapterProps) {
  return (
    <div className="custom-input-wrapper">
      <InputAdapter {...props} />
      {props.error && <div className="custom-error">{props.error}</div>}
    </div>
  )
}
```

## 最佳实践

1. **类型安全** - 为表单数据定义接口
2. **错误处理** - 统一使用 FormField 处理错误显示
3. **验证策略** - 根据需要选择合适的验证时机
4. **性能优化** - 使用 useMemo 缓存复杂计算
5. **组件复用** - 创建可复用的表单组件和适配器
