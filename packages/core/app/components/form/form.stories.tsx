import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { z } from "zod"
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query"
import { useStore } from "@tanstack/react-store"
import type { AnyFieldApi } from "@tanstack/react-form"
import { useForm } from "./index"
import Highlight from "react-syntax-highlighter"
import { LinkButton } from "../link-button"
import { tcx } from "../../utils"
import { Badge } from "../badge"

const meta: Meta = {
  title: "Components/Form",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

/**
 * Basic form example with Input and Select fields using TanStack Form
 */
export const Basic: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("")

    const form = useForm({
      defaultValues: {
        username: "",
        email: "",
        role: "admin",
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2))
      },
    })

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="username">
            {(field) => (
              <form.Input
                name={field.name}
                label="Username"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter username"
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <form.Input
                name={field.name}
                label="Email"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
              />
            )}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <form.Select
                name={field.name}
                label="Role"
                value={field.state.value as string}
                onChange={field.handleChange}
                options={[
                  { label: "Select Role" },
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                  { divider: true },
                  { label: "Other", value: "other" },
                ]}
              />
            )}
          </form.Field>

          <form.Field name="isAdmin">
            {(field) => (
              <form.Checkbox
                variant="accent"
                name={field.name}
                label="Is Admin"
                value={field.state.value as boolean}
                onChange={field.handleChange}
              />
            )}
          </form.Field>

          <form.Field name="gender">
            {(field) => (
              <form.RadioGroup
                name={field.name}
                label="Gender"
                value={field.state.value as string}
                onChange={field.handleChange}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
            )}
          </form.Field>

          <form.Field name="apply">
            {(field) => (
              <form.Switch
                name={field.name}
                label="Apply"
                value={field.state.value as boolean}
                onChange={field.handleChange}
              />
            )}
          </form.Field>

          <form.Field name="age">
            {(field) => (
              <form.Range
                label="Age"
                value={field.state.value as number}
                onChange={field.handleChange}
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 rounded-xl p-4">
          <strong>Form Result:</strong>
          <Highlight
            language="json"
            customStyle={{
              backgroundColor: "transparent",
            }}
            lineProps={{
              style: {
                backgroundColor: "transparent",
              },
            }}
          >
            {result}
          </Highlight>
        </div>
      </>
    )
  },
}

/**
 * Form example with description
 * 1. description is a string
 * 2. description is a ReactNode
 */
export const WithDescription: Story = {
  render: function WithDescriptionRender() {
    const [result, setResult] = useState<string>("")

    const form = useForm({
      defaultValues: {
        username: "",
        email: "",
        role: "admin",
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2))
      },
    })

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="username">
            {(field) => (
              <form.Input
                name={field.name}
                label="Username"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter username"
                description="Username is required"
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <form.Input
                name={field.name}
                label="Email"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
                description={
                  <>
                    <span>Email is required</span>{" "}
                    <LinkButton className="float-right">Learn more</LinkButton>
                  </>
                }
              />
            )}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <form.Select
                name={field.name}
                label="Role"
                value={field.state.value as string}
                onChange={field.handleChange}
                options={[
                  { label: "Select Role" },
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                  { divider: true },
                  { label: "Other", value: "other" },
                ]}
                description="Role is required"
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 rounded-xl p-4">
          <strong>Form Result:</strong>
          <Highlight
            language="json"
            customStyle={{
              backgroundColor: "transparent",
            }}
            lineProps={{
              style: {
                backgroundColor: "transparent",
              },
            }}
          >
            {result}
          </Highlight>
        </div>
      </>
    )
  },
}

/**
 * Form with validation rules and error handling
 */
export const WithValidation: Story = {
  render: function WithValidationRender() {
    const [result, setResult] = useState<string>("")

    const form = useForm({
      defaultValues: {
        password: "",
        confirmPassword: "",
        age: "",
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2))
      },
    })

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if ((value as string).length < 6) {
                  return "Password must be at least 6 characters"
                }
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Password"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="password"
                placeholder="Enter password"
                error={field.state.meta.errors.join(", ")}
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value }) => {
                if (value !== form.state.values.password) {
                  return "Passwords do not match"
                }
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Confirm Password"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="password"
                placeholder="Confirm password"
                error={field.state.meta.errors.join(", ")}
              />
            )}
          </form.Field>

          <form.Field
            name="age"
            validators={{
              onChange: ({ value }) => {
                const age = parseInt(value as string)
                if (isNaN(age) || age < 1) {
                  return "Please enter a valid age"
                }
                if (age < 18 || age > 80) {
                  return "Must be 18 or older and less than 80"
                }
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Age"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="number"
                placeholder="Enter age"
                error={field.state.meta.errors.join(", ")}
              />
            )}
          </form.Field>

          <form.Button type="submit">Create Account</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 rounded-xl p-4">
          <strong>Form Result:</strong>
          <Highlight
            language="json"
            customStyle={{
              backgroundColor: "transparent",
            }}
            lineProps={{
              style: {
                backgroundColor: "transparent",
              },
            }}
          >
            {result}
          </Highlight>
        </div>
      </>
    )
  },
}

/**
 * Form with Zod schema validation
 */
export const WithSchemaValidation: Story = {
  render: function WithSchemaValidationRender() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState<string | null>(null)

    // 辅助函数：格式化错误信息
    const formatErrors = (errors: unknown[]): string[] => {
      const formatted = errors.map((error) => {
        if (typeof error === "string") return error
        if (error && typeof error === "object" && "message" in error) {
          return String(error.message)
        }
        return String(error)
      })
      // 去重处理
      return [...new Set(formatted)]
    }

    // 定义约束常量
    const NAME_MIN_LENGTH = 2
    const AGE_MIN_VALUE = 18
    const AGE_MAX_VALUE = 100
    const BIO_MAX_LENGTH = 200

    // 定义 Zod schema
    const userSchema = z.object({
      name: z
        .string()
        .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters`)
        .refine((value) => value.length > 0, "Name is required"),
      email: z.email("Please enter a valid email address"),
      age: z
        .number()
        .min(AGE_MIN_VALUE, `Must be at least ${AGE_MIN_VALUE} years old`)
        .max(AGE_MAX_VALUE, `Age must be less than ${AGE_MAX_VALUE}`),
      website: z.url("Please enter a valid website").optional().or(z.literal("")),
      bio: z
        .string()
        .max(BIO_MAX_LENGTH, `Bio must be less than ${BIO_MAX_LENGTH} characters`)
        .optional(),
    })

    const form = useForm({
      defaultValues: {
        name: "",
        email: "",
        age: 18,
        website: "",
        bio: "",
      },
      validators: {
        // 使用 Zod schema 进行整体验证
        onChange: userSchema,
        onBlur: userSchema,
      },
      onSubmit: async ({ value }) => {
        setIsSubmitting(true)
        setSubmitResult(null)

        try {
          // 这里可以调用 API 提交数据
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setSubmitResult("Form submitted successfully!")
          console.log("Submitted data:", value)
        } catch (error) {
          setSubmitResult("Form submission failed, please try again")
        } finally {
          setIsSubmitting(false)
        }
      },
    })

    return (
      <div className="w-80">
        <h3 className="font-medium">Schema Validation</h3>
        <p className="text-secondary-foreground mt-2">
          Use Zod Schema to validate the form, support complex validation rules
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="mt-4 w-80 space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <form.Input
                label="Name"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter name"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <form.Input
                label="Email"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="age">
            {(field) => (
              <form.Input
                label="Age"
                name={field.name}
                value={String(field.state.value)}
                onChange={(value) => field.handleChange(parseInt(value) || 0)}
                onBlur={field.handleBlur}
                type="number"
                placeholder="Enter age"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="website">
            {(field) => (
              <form.Input
                label="Website"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="url"
                placeholder="https://example.com"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="bio">
            {(field) => (
              <>
                <form.Textarea
                  label="Bio"
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter bio"
                  error={formatErrors(field.state.meta.errors).join(", ")}
                  description={`${(field.state.value as string).length}/${BIO_MAX_LENGTH} characters`}
                />
              </>
            )}
          </form.Field>

          <form.Button
            type="submit"
            disabled={isSubmitting || !form.state.canSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </form.Button>
        </form>

        {submitResult && (
          <div
            className={tcx(
              "rounded-xl p-4",
              submitResult.includes("success")
                ? "text-success-foreground bg-green-100"
                : "text-danger-foreground bg-red-100",
            )}
          >
            {submitResult}
          </div>
        )}

        <div className="bg-secondary-background mt-4 grid grid-cols-[auto_1fr] place-items-start gap-2 rounded-xl p-4">
          <div className="col-span-2 font-medium">Form state:</div>
          <span>Can submit:</span> <Badge>{form.state.canSubmit ? "Yes" : "No"}</Badge>
          <span>Is dirty:</span> <Badge>{form.state.isDirty ? "Yes" : "No"}</Badge>
          <span>Validating:</span> <Badge>{form.state.isValidating ? "Yes" : "No"}</Badge>
          <span>Submitting:</span> <Badge>{form.state.isSubmitting ? "Yes" : "No"}</Badge>
          <span>Valid:</span> <Badge>{form.state.isValid ? "Yes" : "No"}</Badge>
        </div>
      </div>
    )
  },
}

// FieldInfo 组件用于显示字段验证信息
function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <div className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</div>
      ) : null}
      {field.state.meta.isValidating ? (
        <div className="text-sm text-blue-500">验证中...</div>
      ) : null}
    </>
  )
}

// 模拟数据库类
class MockUserDB {
  private data: { email: string; firstName: string; lastName: string }

  constructor() {
    this.data = {
      firstName: "张三",
      lastName: "李四",
      email: "zhangsan@example.com",
    }
  }

  async getData(): Promise<{ email: string; firstName: string; lastName: string }> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { ...this.data }
  }

  async saveUser(value: {
    email: string
    firstName: string
    lastName: string
  }): Promise<{ email: string; firstName: string; lastName: string }> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 模拟服务器验证错误
    if (value.firstName.includes("error")) {
      throw new Error("服务器错误：姓名不能包含'error'")
    }

    this.data = value
    return value
  }
}

// 模拟数据库实例
const mockDB = new MockUserDB()

const QueryIntegrationExample = () => {
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  // 使用 TanStack Query 获取数据
  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const result = await mockDB.getData()
      return result
    },
    staleTime: 5000, // 5秒内数据被认为是新鲜的
  })

  // 使用 TanStack Query 的 mutation 进行数据更新
  const saveUserMutation = useMutation({
    mutationFn: async (value: { email: string; firstName: string; lastName: string }) => {
      return await mockDB.saveUser(value)
    },
    onSuccess: (data) => {
      setSubmitResult(`用户信息保存成功！姓名：${data.firstName} ${data.lastName}`)
    },
    onError: (error: Error) => {
      setSubmitResult(`保存失败：${error.message}`)
    },
  })

  const form = useForm({
    defaultValues: {
      firstName: userData?.firstName ?? "",
      lastName: userData?.lastName ?? "",
      email: userData?.email ?? "",
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null)

      try {
        // 使用 mutation 保存数据
        await saveUserMutation.mutateAsync(
          value as { email: string; firstName: string; lastName: string },
        )

        // 重新获取数据以确保同步
        await refetch()

        // 重置表单
        form.reset()
      } catch (error) {
        // 错误已经在 mutation 的 onError 中处理
        console.error("Form submission error:", error)
      }
    },
  })

  // 当数据加载完成后，更新表单默认值
  React.useEffect(() => {
    if (userData) {
      form.setFieldValue("firstName", userData.firstName)
      form.setFieldValue("lastName", userData.lastName)
      form.setFieldValue("email", userData.email)
    }
  }, [userData, form])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">加载用户数据中...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <h3 className="text-lg font-semibold">TanStack Query 集成示例</h3>
        <p className="text-sm text-gray-600">
          演示表单与 TanStack Query 的集成，支持数据获取、更新和重新验证
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              return !stringValue
                ? "姓名不能为空"
                : stringValue.length < 2
                  ? "姓名至少需要2个字符"
                  : undefined
            },
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              await new Promise((resolve) => setTimeout(resolve, 1000))
              const stringValue = String(value || "")
              return stringValue.includes("error") && "姓名不能包含'error'"
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">姓名 *</label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="请输入姓名"
              />
              <FieldInfo field={field} />
            </fieldset>
          )}
        </form.Field>

        <form.Field
          name="lastName"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              return !stringValue
                ? "姓氏不能为空"
                : stringValue.length < 2
                  ? "姓氏至少需要2个字符"
                  : undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">姓氏 *</label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="请输入姓氏"
              />
              <FieldInfo field={field} />
            </fieldset>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              if (!stringValue) return "邮箱不能为空"
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return !emailRegex.test(stringValue) ? "请输入有效的邮箱地址" : undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">邮箱 *</label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="请输入邮箱地址"
              />
              <FieldInfo field={field} />
            </fieldset>
          )}
        </form.Field>

        <div className="flex gap-2">
          <form.Button
            type="submit"
            disabled={!form.state.canSubmit || saveUserMutation.isPending}
          >
            {saveUserMutation.isPending ? "保存中..." : "保存用户"}
          </form.Button>

          <form.Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            重置表单
          </form.Button>
        </div>

        {submitResult && (
          <div
            className={`rounded p-3 text-sm ${
              submitResult.includes("成功")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitResult}
          </div>
        )}
      </form>

      <div className="space-y-2 rounded bg-gray-100 p-4 text-sm">
        <div className="font-medium">状态信息：</div>
        <div className="grid grid-cols-2 gap-2">
          <div>表单可提交: {form.state.canSubmit ? "是" : "否"}</div>
          <div>表单提交中: {form.state.isSubmitting ? "是" : "否"}</div>
          <div>数据加载中: {isLoading ? "是" : "否"}</div>
          <div>保存中: {saveUserMutation.isPending ? "是" : "否"}</div>
        </div>
      </div>

      <div className="rounded bg-blue-50 p-4 text-sm">
        <div className="font-medium">当前数据：</div>
        <pre className="mt-2 text-xs">{JSON.stringify(userData, null, 2)}</pre>
      </div>
    </div>
  )
}

// 使用 QueryClient 包装的示例
const QueryIntegrationExampleWithProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <QueryIntegrationExample />
    </QueryClientProvider>
  )
}

/**
 * Form with TanStack Query integration
 */
export const WithQueryIntegration: Story = {
  render: () => <QueryIntegrationExampleWithProvider />,
}

// 模拟 API 服务
class UserAPIService {
  private users = [
    { id: 1, name: "张三", email: "zhangsan@example.com", age: 28, department: "技术部" },
    { id: 2, name: "李四", email: "lisi@example.com", age: 32, department: "产品部" },
    { id: 3, name: "王五", email: "wangwu@example.com", age: 25, department: "设计部" },
  ]

  async getUserById(
    id: number,
  ): Promise<{ age: number; department: string; email: string; id: number; name: string }> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 模拟偶发的网络错误
    if (Math.random() < 0.1) {
      throw new Error("网络错误：无法获取用户信息")
    }

    const user = this.users.find((u) => u.id === id)
    if (!user) {
      throw new Error(`用户 ID ${id} 不存在`)
    }

    return { ...user }
  }

  async updateUser(
    id: number,
    data: Partial<{ age: number; department: string; email: string; name: string }>,
  ): Promise<{ age: number; department: string; email: string; id: number; name: string }> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userIndex = this.users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      throw new Error(`用户 ID ${id} 不存在`)
    }

    this.users[userIndex] = { ...this.users[userIndex], ...data }
    return { ...this.users[userIndex] }
  }
}

const userAPI = new UserAPIService()

const AsyncInitialValuesExample = () => {
  const [selectedUserId, setSelectedUserId] = useState<number>(1)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<{
    age: number
    department: string
    email: string
    name: string
  } | null>(null)

  // 辅助函数：格式化错误信息
  const formatErrors = (errors: unknown[]): string[] => {
    const formatted = errors.map((error) => {
      if (typeof error === "string") return error
      if (error && typeof error === "object" && "message" in error) {
        return String(error.message)
      }
      return String(error)
    })
    // 去重处理
    return [...new Set(formatted)]
  }

  // 异步加载初始值
  const loadInitialValues = async (userId: number) => {
    setIsInitialLoading(true)
    setLoadError(null)
    setSubmitResult(null)
    setInitialData(null)

    try {
      const userData = await userAPI.getUserById(userId)

      // 设置初始数据，这将触发表单重新渲染
      setInitialData({
        name: userData.name,
        email: userData.email,
        age: userData.age,
        department: userData.department,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "加载失败"
      setLoadError(errorMessage)
    } finally {
      setIsInitialLoading(false)
    }
  }

  // 只在有初始数据时创建表单
  const form = useForm({
    defaultValues: initialData || {
      name: "",
      email: "",
      age: 0,
      department: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null)
      try {
        const result = await userAPI.updateUser(
          selectedUserId,
          value as { age: number; department: string; email: string; name: string },
        )
        setSubmitResult(`用户信息更新成功！姓名：${result.name}`)
      } catch (error) {
        setSubmitResult(`更新失败：${error instanceof Error ? error.message : "未知错误"}`)
      }
    },
  })

  // 初始化时加载数据
  React.useEffect(() => {
    loadInitialValues(selectedUserId)
  }, [selectedUserId])

  // 当初始数据改变时，更新表单值
  React.useEffect(() => {
    if (initialData) {
      form.setFieldValue("name", initialData.name)
      form.setFieldValue("email", initialData.email)
      form.setFieldValue("age", initialData.age)
      form.setFieldValue("department", initialData.department)
    }
  }, [initialData, form])

  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId)
  }

  const handleReload = () => {
    loadInitialValues(selectedUserId)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <h3 className="text-lg font-semibold">异步初始值示例</h3>
        <p className="text-sm text-gray-600">
          演示如何异步加载表单的初始值，常用于编辑现有数据的场景
        </p>
      </div>

      {/* 用户选择器 */}
      <div className="rounded border p-4">
        <label className="text-sm font-medium">选择要编辑的用户：</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3].map((id) => (
            <button
              key={id}
              onClick={() => handleUserChange(id)}
              className={`rounded px-3 py-1 text-sm ${
                selectedUserId === id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              用户 {id}
            </button>
          ))}
        </div>
      </div>

      {/* 加载状态 */}
      {isInitialLoading && (
        <div className="flex items-center justify-center rounded bg-blue-50 p-8">
          <div className="text-center">
            <div className="text-lg">正在加载用户数据...</div>
            <div className="mt-2 text-sm text-gray-600">请稍候</div>
          </div>
        </div>
      )}

      {/* 加载错误 */}
      {loadError && (
        <div className="rounded bg-red-50 p-4">
          <div className="text-sm text-red-800">
            <div className="font-medium">加载失败</div>
            <div className="mt-1">{loadError}</div>
          </div>
          <button
            onClick={handleReload}
            className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
          >
            重新加载
          </button>
        </div>
      )}

      {/* 表单内容 */}
      {!isInitialLoading && !loadError && initialData && (
        <form
          key={`form-${selectedUserId}`}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "")
                return !stringValue
                  ? "姓名不能为空"
                  : stringValue.length < 2
                    ? "姓名至少需要2个字符"
                    : undefined
              },
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">姓名 *</label>
                <form.Input
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="请输入姓名"
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="text-sm text-red-500">
                    {formatErrors(field.state.meta.errors).join(", ")}
                  </div>
                )}
              </fieldset>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "")
                if (!stringValue) return "邮箱不能为空"
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return !emailRegex.test(stringValue) ? "请输入有效的邮箱地址" : undefined
              },
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">邮箱 *</label>
                <form.Input
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  type="email"
                  placeholder="请输入邮箱地址"
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="text-sm text-red-500">
                    {formatErrors(field.state.meta.errors).join(", ")}
                  </div>
                )}
              </fieldset>
            )}
          </form.Field>

          <form.Field
            name="age"
            validators={{
              onChange: ({ value }) => {
                const numValue = Number(value)
                if (isNaN(numValue) || numValue <= 0) return "请输入有效的年龄"
                if (numValue < 18) return "年龄不能小于18岁"
                if (numValue > 100) return "年龄不能大于100岁"
                return undefined
              },
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">年龄 *</label>
                <form.Input
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={(value) => field.handleChange(parseInt(value) || 0)}
                  onBlur={field.handleBlur}
                  type="number"
                  placeholder="请输入年龄"
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="text-sm text-red-500">
                    {formatErrors(field.state.meta.errors).join(", ")}
                  </div>
                )}
              </fieldset>
            )}
          </form.Field>

          <form.Field
            name="department"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "")
                return !stringValue ? "部门不能为空" : undefined
              },
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">部门 *</label>
                <form.Select
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  options={[
                    { label: "技术部", value: "技术部" },
                    { label: "产品部", value: "产品部" },
                    { label: "设计部", value: "设计部" },
                    { label: "市场部", value: "市场部" },
                    { label: "人事部", value: "人事部" },
                  ]}
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="text-sm text-red-500">
                    {formatErrors(field.state.meta.errors).join(", ")}
                  </div>
                )}
              </fieldset>
            )}
          </form.Field>

          <div className="flex gap-2">
            <form.Button
              type="submit"
              disabled={!form.state.canSubmit || form.state.isSubmitting}
            >
              {form.state.isSubmitting ? "更新中..." : "更新用户"}
            </form.Button>

            <form.Button
              type="button"
              variant="secondary"
              onClick={handleReload}
            >
              重新加载
            </form.Button>
          </div>

          {submitResult && (
            <div
              className={`rounded p-3 text-sm ${
                submitResult.includes("成功")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitResult}
            </div>
          )}
        </form>
      )}

      {/* 表单状态信息 */}
      {!isInitialLoading && !loadError && (
        <div className="space-y-2 rounded bg-gray-100 p-4 text-sm">
          <div className="font-medium">表单状态：</div>
          <div className="grid grid-cols-2 gap-2">
            <div>可提交: {form.state.canSubmit ? "是" : "否"}</div>
            <div>已修改: {form.state.isDirty ? "是" : "否"}</div>
            <div>提交中: {form.state.isSubmitting ? "是" : "否"}</div>
            <div>有效: {form.state.isValid ? "是" : "否"}</div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Form with async initial values
 */
export const WithAsyncInitialValues: Story = {
  render: () => <AsyncInitialValuesExample />,
}

const ArrayFormExample = () => {
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  // 辅助函数：格式化错误信息
  const formatErrors = (errors: unknown[]): string[] => {
    const formatted = errors.map((error) => {
      if (typeof error === "string") return error
      if (error && typeof error === "object" && "message" in error) {
        return String(error.message)
      }
      return String(error)
    })
    // 去重处理
    return [...new Set(formatted)]
  }

  const form = useForm({
    defaultValues: {
      name: "",
      skills: [] as string[],
      hobbies: [{ name: "", description: "", yearsOfExperience: 0 }] as Array<{
        description: string
        name: string
        yearsOfExperience: number
      }>,
      contacts: [
        { type: "email", value: "", isPrimary: true },
        { type: "phone", value: "", isPrimary: false },
      ] as Array<{
        isPrimary: boolean
        type: string
        value: string
      }>,
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null)
      try {
        // 模拟提交延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Form submitted:", value)
        const formData = value as {
          contacts: Array<{ isPrimary: boolean; type: string; value: string }>
          hobbies: Array<{ description: string; name: string; yearsOfExperience: number }>
          name: string
          skills: string[]
        }
        setSubmitResult(
          `表单提交成功！共 ${formData.skills.length} 个技能，${formData.hobbies.length} 个爱好，${formData.contacts.length} 个联系方式`,
        )
      } catch (error) {
        setSubmitResult(`提交失败：${error instanceof Error ? error.message : "未知错误"}`)
      }
    },
  })

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold">数组字段示例</h3>
        <p className="text-sm text-gray-600">
          演示如何处理数组类型的表单字段，包括简单数组和对象数组
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        {/* 基本字段 */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              return !stringValue ? "姓名不能为空" : undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">姓名 *</label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="请输入姓名"
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500">
                  {formatErrors(field.state.meta.errors).join(", ")}
                </div>
              )}
            </fieldset>
          )}
        </form.Field>

        {/* 简单数组 - 技能列表 */}
        <form.Field
          name="skills"
          mode="array"
        >
          {(skillsField) => (
            <fieldset className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">技能列表</label>
                <button
                  type="button"
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(skillsField as any).pushValue("")
                  }}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  添加技能
                </button>
              </div>

              <div className="space-y-2">
                {(skillsField.state.value as string[]).length === 0 ? (
                  <div className="text-sm text-gray-500">
                    暂无技能，点击&quot;添加技能&quot;按钮添加
                  </div>
                ) : (
                  (skillsField.state.value as string[]).map((_, index) => (
                    <form.Field
                      key={index}
                      name={`skills[${index}]`}
                      validators={{
                        onChange: ({ value }) => {
                          const stringValue = String(value || "")
                          return !stringValue ? "技能不能为空" : undefined
                        },
                      }}
                    >
                      {(skillField) => (
                        <div className="flex gap-2">
                          <form.Input
                            name={skillField.name}
                            value={String(skillField.state.value || "")}
                            onChange={skillField.handleChange}
                            onBlur={skillField.handleBlur}
                            placeholder={`技能 ${index + 1}`}
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => skillsField.removeValue(index)}
                            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            删除
                          </button>
                          {skillField.state.meta.errors.length > 0 && (
                            <div className="text-sm text-red-500">
                              {formatErrors(skillField.state.meta.errors).join(", ")}
                            </div>
                          )}
                        </div>
                      )}
                    </form.Field>
                  ))
                )}
              </div>
            </fieldset>
          )}
        </form.Field>

        {/* 对象数组 - 爱好列表 */}
        <form.Field
          name="hobbies"
          mode="array"
        >
          {(hobbiesField) => (
            <fieldset className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">爱好列表</label>
                <button
                  type="button"
                  onClick={() => {
                    ;(hobbiesField as any).pushValue({
                      name: "",
                      description: "",
                      yearsOfExperience: 0,
                    })
                  }}
                  className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                >
                  添加爱好
                </button>
              </div>

              <div className="space-y-4">
                {(
                  hobbiesField.state.value as Array<{
                    description: string
                    name: string
                    yearsOfExperience: number
                  }>
                ).length === 0 ? (
                  <div className="text-sm text-gray-500">
                    暂无爱好，点击&quot;添加爱好&quot;按钮添加
                  </div>
                ) : (
                  (
                    hobbiesField.state.value as Array<{
                      description: string
                      name: string
                      yearsOfExperience: number
                    }>
                  ).map((_, index) => (
                    <div
                      key={index}
                      className="rounded border p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">爱好 {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => hobbiesField.removeValue(index)}
                          className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                        >
                          删除
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <form.Field
                          name={`hobbies[${index}].name`}
                          validators={{
                            onChange: ({ value }) => {
                              const stringValue = String(value || "")
                              return !stringValue ? "爱好名称不能为空" : undefined
                            },
                          }}
                        >
                          {(field) => (
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-gray-600">名称 *</label>
                              <form.Input
                                name={field.name}
                                value={String(field.state.value || "")}
                                onChange={field.handleChange}
                                onBlur={field.handleBlur}
                                placeholder="如：篮球、阅读"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <div className="text-xs text-red-500">
                                  {formatErrors(field.state.meta.errors).join(", ")}
                                </div>
                              )}
                            </div>
                          )}
                        </form.Field>

                        <form.Field
                          name={`hobbies[${index}].yearsOfExperience`}
                          validators={{
                            onChange: ({ value }) => {
                              const numValue = Number(value)
                              if (isNaN(numValue) || numValue < 0) return "请输入有效的年数"
                              return undefined
                            },
                          }}
                        >
                          {(field) => (
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-gray-600">经验年数</label>
                              <form.Input
                                name={field.name}
                                value={String(field.state.value || 0)}
                                onChange={(value) => field.handleChange(parseInt(value) || 0)}
                                onBlur={field.handleBlur}
                                type="number"
                                placeholder="0"
                              />
                              {field.state.meta.errors.length > 0 && (
                                <div className="text-xs text-red-500">
                                  {formatErrors(field.state.meta.errors).join(", ")}
                                </div>
                              )}
                            </div>
                          )}
                        </form.Field>

                        <form.Field name={`hobbies[${index}].description`}>
                          {(field) => (
                            <div className="flex flex-col gap-1 md:col-span-2">
                              <label className="text-xs text-gray-600">描述</label>
                              <textarea
                                name={field.name}
                                value={String(field.state.value || "")}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder="描述你的爱好..."
                                rows={2}
                                className="min-w-0 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                          )}
                        </form.Field>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </fieldset>
          )}
        </form.Field>

        {/* 复杂对象数组 - 联系方式 */}
        <form.Field
          name="contacts"
          mode="array"
        >
          {(contactsField) => (
            <fieldset className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">联系方式</label>
                <button
                  type="button"
                  onClick={() => {
                    ;(contactsField as any).pushValue({
                      type: "email",
                      value: "",
                      isPrimary: false,
                    })
                  }}
                  className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
                >
                  添加联系方式
                </button>
              </div>

              <div className="space-y-3">
                {(
                  contactsField.state.value as Array<{
                    isPrimary: boolean
                    type: string
                    value: string
                  }>
                ).map((_, index) => (
                  <div
                    key={index}
                    className="rounded border p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium">联系方式 {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => contactsField.removeValue(index)}
                        className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        删除
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <form.Field name={`contacts[${index}].type`}>
                        {(field) => (
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600">类型</label>
                            <form.Select
                              name={field.name}
                              value={String(field.state.value || "")}
                              onChange={field.handleChange}
                              options={[
                                { label: "邮箱", value: "email" },
                                { label: "电话", value: "phone" },
                                { label: "微信", value: "wechat" },
                                { label: "QQ", value: "qq" },
                              ]}
                            />
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name={`contacts[${index}].value`}
                        validators={{
                          onChange: ({ value }) => {
                            const stringValue = String(value || "")
                            return !stringValue ? "联系方式不能为空" : undefined
                          },
                        }}
                      >
                        {(field) => (
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600">值 *</label>
                            <form.Input
                              name={field.name}
                              value={String(field.state.value || "")}
                              onChange={field.handleChange}
                              onBlur={field.handleBlur}
                              placeholder="输入联系方式"
                            />
                            {field.state.meta.errors.length > 0 && (
                              <div className="text-xs text-red-500">
                                {formatErrors(field.state.meta.errors).join(", ")}
                              </div>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name={`contacts[${index}].isPrimary`}>
                        {(field) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={Boolean(field.state.value)}
                              onChange={(e) => field.handleChange(e.target.checked)}
                              className="rounded"
                            />
                            <label className="text-xs text-gray-600">主要联系方式</label>
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          )}
        </form.Field>

        <div className="flex gap-2">
          <form.Button
            type="submit"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
          >
            {form.state.isSubmitting ? "提交中..." : "提交表单"}
          </form.Button>

          <form.Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            重置表单
          </form.Button>
        </div>

        {submitResult && (
          <div
            className={`rounded p-3 text-sm ${
              submitResult.includes("成功")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitResult}
          </div>
        )}
      </form>

      {/* 表单状态和数据预览 */}
      <div className="space-y-4">
        <div className="rounded bg-gray-100 p-4 text-sm">
          <div className="mb-2 font-medium">表单状态：</div>
          <div className="grid grid-cols-2 gap-2">
            <div>可提交: {form.state.canSubmit ? "是" : "否"}</div>
            <div>已修改: {form.state.isDirty ? "是" : "否"}</div>
            <div>提交中: {form.state.isSubmitting ? "是" : "否"}</div>
            <div>有效: {form.state.isValid ? "是" : "否"}</div>
          </div>
        </div>

        <div className="rounded bg-blue-50 p-4 text-sm">
          <div className="mb-2 font-medium">当前表单数据：</div>
          <pre className="overflow-auto text-xs">{JSON.stringify(form.state.values, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

/**
 * Form with array fields
 */
export const WithArrayFields: Story = {
  render: () => <ArrayFormExample />,
}

const LinkedFieldsExample = () => {
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  // 辅助函数：格式化错误信息
  const formatErrors = (errors: unknown[]): string[] => {
    const formatted = errors.map((error) => {
      if (typeof error === "string") return error
      if (error && typeof error === "object" && "message" in error) {
        return String(error.message)
      }
      return String(error)
    })
    // 去重处理
    return [...new Set(formatted)]
  }

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newEmail: "",
      confirmNewEmail: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null)
      try {
        // 模拟提交延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Form submitted:", value)
        setSubmitResult("用户注册成功！")
      } catch (error) {
        setSubmitResult(`注册失败：${error instanceof Error ? error.message : "未知错误"}`)
      }
    },
  })

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h3 className="text-lg font-semibold">关联字段示例</h3>
        <p className="text-sm text-gray-600">
          演示如何关联两个字段，当一个字段值改变时，另一个字段的验证会重新运行
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* 基本字段 */}
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              if (!stringValue) return "用户名不能为空"
              if (stringValue.length < 3) return "用户名至少需要3个字符"
              return undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">用户名 *</label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="请输入用户名"
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500">
                  {formatErrors(field.state.meta.errors).join(", ")}
                </div>
              )}
            </fieldset>
          )}
        </form.Field>

        {/* 邮箱字段 */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              if (!stringValue) return "邮箱不能为空"
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return !emailRegex.test(stringValue) ? "请输入有效的邮箱地址" : undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">邮箱 *</label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="请输入邮箱地址"
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500">
                  {formatErrors(field.state.meta.errors).join(", ")}
                </div>
              )}
            </fieldset>
          )}
        </form.Field>

        <div className="rounded bg-yellow-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-yellow-800">密码关联验证示例</h4>
          <p className="mb-3 text-xs text-yellow-700">
            试试这个流程：1) 输入确认密码 → 2) 修改密码 → 确认密码会自动重新验证
          </p>

          {/* 密码字段 */}
          <div className="space-y-3">
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const stringValue = String(value || "")
                  if (!stringValue) return "密码不能为空"
                  if (stringValue.length < 6) return "密码至少需要6个字符"
                  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(stringValue)) {
                    return "密码必须包含大小写字母和数字"
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">密码 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="请输入密码"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500">
                      {formatErrors(field.state.meta.errors).join(", ")}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    密码要求：至少6位，包含大小写字母和数字
                  </div>
                </fieldset>
              )}
            </form.Field>

            {/* 确认密码字段 - 关联到密码字段 */}
            <form.Field
              name="confirmPassword"
              validators={{
                onChangeListenTo: ["password"], // 监听密码字段的变化
                onChange: ({ value, fieldApi }) => {
                  const stringValue = String(value || "")
                  const password = String(fieldApi.form.getFieldValue("password") || "")

                  if (!stringValue) return "请确认密码"
                  if (stringValue !== password) return "两次输入的密码不一致"

                  return undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">确认密码 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="请再次输入密码"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500">
                      {formatErrors(field.state.meta.errors).join(", ")}
                    </div>
                  )}
                  {field.state.meta.errors.length === 0 && String(field.state.value) && (
                    <div className="text-sm text-green-600">✓ 密码匹配</div>
                  )}
                </fieldset>
              )}
            </form.Field>
          </div>
        </div>

        <div className="rounded bg-blue-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-blue-800">邮箱关联验证示例</h4>
          <p className="mb-3 text-xs text-blue-700">
            演示更复杂的关联场景：新邮箱不能与当前邮箱相同，且确认新邮箱必须匹配
          </p>

          <div className="space-y-3">
            {/* 新邮箱字段 */}
            <form.Field
              name="newEmail"
              validators={{
                onChangeListenTo: ["email"], // 监听原邮箱字段
                onChange: ({ value, fieldApi }) => {
                  const stringValue = String(value || "")
                  const currentEmail = String(fieldApi.form.getFieldValue("email") || "")

                  if (!stringValue) return undefined // 新邮箱可以为空

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  if (!emailRegex.test(stringValue)) return "请输入有效的邮箱地址"

                  if (stringValue === currentEmail) return "新邮箱不能与当前邮箱相同"

                  return undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">新邮箱</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="输入新邮箱（可选）"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500">
                      {formatErrors(field.state.meta.errors).join(", ")}
                    </div>
                  )}
                </fieldset>
              )}
            </form.Field>

            {/* 确认新邮箱字段 */}
            <form.Field
              name="confirmNewEmail"
              validators={{
                onChangeListenTo: ["newEmail"], // 监听新邮箱字段
                onChange: ({ value, fieldApi }) => {
                  const stringValue = String(value || "")
                  const newEmail = String(fieldApi.form.getFieldValue("newEmail") || "")

                  // 如果新邮箱为空，确认邮箱也应该为空
                  if (!newEmail && !stringValue) return undefined
                  if (!newEmail && stringValue) return "请先输入新邮箱"
                  if (newEmail && !stringValue) return "请确认新邮箱"

                  if (stringValue !== newEmail) return "两次输入的邮箱不一致"

                  return undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">确认新邮箱</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="再次输入新邮箱"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500">
                      {formatErrors(field.state.meta.errors).join(", ")}
                    </div>
                  )}
                  {field.state.meta.errors.length === 0 && String(field.state.value) && (
                    <div className="text-sm text-green-600">✓ 邮箱匹配</div>
                  )}
                </fieldset>
              )}
            </form.Field>
          </div>
        </div>

        <div className="flex gap-2">
          <form.Button
            type="submit"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
          >
            {form.state.isSubmitting ? "注册中..." : "注册账户"}
          </form.Button>

          <form.Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            重置表单
          </form.Button>
        </div>

        {submitResult && (
          <div
            className={`rounded p-3 text-sm ${
              submitResult.includes("成功")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitResult}
          </div>
        )}
      </form>

      {/* 表单状态和字段状态 */}
      <div className="space-y-4">
        <div className="rounded bg-gray-100 p-4 text-sm">
          <div className="mb-2 font-medium">表单状态：</div>
          <div className="grid grid-cols-2 gap-2">
            <div>可提交: {form.state.canSubmit ? "是" : "否"}</div>
            <div>已修改: {form.state.isDirty ? "是" : "否"}</div>
            <div>提交中: {form.state.isSubmitting ? "是" : "否"}</div>
            <div>有效: {form.state.isValid ? "是" : "否"}</div>
          </div>
        </div>

        <div className="rounded bg-green-50 p-4 text-sm">
          <div className="mb-2 font-medium">字段关联状态：</div>
          <div className="space-y-1 text-xs">
            <div>• 确认密码监听：password 字段</div>
            <div>• 新邮箱监听：email 字段</div>
            <div>• 确认新邮箱监听：newEmail 字段</div>
          </div>
        </div>

        <div className="rounded bg-blue-50 p-4 text-sm">
          <div className="mb-2 font-medium">当前表单数据：</div>
          <pre className="overflow-auto text-xs">{JSON.stringify(form.state.values, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

/**
 * Form with linked fields
 */
export const WithLinkedFields: Story = {
  render: () => <LinkedFieldsExample />,
}

const ReactivityExample = () => {
  const [submitResult, setSubmitResult] = useState<string | null>(null)

  // 辅助函数：格式化错误信息
  const formatErrors = (errors: unknown[]): string[] => {
    const formatted = errors.map((error) => {
      if (typeof error === "string") return error
      if (error && typeof error === "object" && "message" in error) {
        return String(error.message)
      }
      return String(error)
    })
    // 去重处理
    return [...new Set(formatted)]
  }

  const form = useForm({
    defaultValues: {
      userType: "personal" as "personal" | "business",
      name: "",
      email: "",
      company: "",
      website: "",
      plan: "basic" as "basic" | "pro" | "enterprise",
      newsletter: false,
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      budget: 1000,
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Form submitted:", value)
        setSubmitResult("表单提交成功！")
      } catch (error) {
        setSubmitResult(`提交失败：${error instanceof Error ? error.message : "未知错误"}`)
      }
    },
  })

  // 使用 useStore 订阅特定的表单值
  const userType = useStore(form.store, (state) => state.values.userType)
  const formValues = useStore(form.store, (state) => state.values)
  const canSubmit = useStore(form.store, (state) => state.canSubmit)
  const isDirty = useStore(form.store, (state) => state.isDirty)
  const isValid = useStore(form.store, (state) => state.isValid)

  // 根据用户类型计算价格
  const calculatePrice = () => {
    const basePrices = { basic: 10, pro: 50, enterprise: 200 }
    const multiplier = userType === "business" ? 2 : 1
    const plan = String(formValues.plan || "basic") as keyof typeof basePrices
    return basePrices[plan] * multiplier
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold">响应式订阅示例</h3>
        <p className="text-sm text-gray-600">
          演示如何使用 useStore 和 form.Subscribe 来访问响应式的表单值
        </p>
      </div>

      {/* 使用 useStore 的响应式状态显示 */}
      <div className="rounded bg-green-50 p-4">
        <h4 className="mb-2 font-medium text-green-800">useStore 订阅示例</h4>
        <div className="space-y-1 text-sm">
          <div>
            • 当前用户类型:{" "}
            <span className="font-medium">{userType === "personal" ? "个人用户" : "企业用户"}</span>
          </div>
          <div>
            • 计算价格: <span className="font-medium">${calculatePrice()}/月</span>
          </div>
          <div>
            • 表单状态:
            <span
              className={`ml-1 rounded px-2 py-1 text-xs ${canSubmit ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}
            >
              {canSubmit ? "可提交" : "不可提交"}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* 用户类型选择 */}
        <form.Field name="userType">
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">用户类型</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="personal"
                    checked={String(field.state.value) === "personal"}
                    onChange={() => field.handleChange("personal")}
                  />
                  <span>个人用户</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="business"
                    checked={String(field.state.value) === "business"}
                    onChange={() => field.handleChange("business")}
                  />
                  <span>企业用户</span>
                </label>
              </div>
            </fieldset>
          )}
        </form.Field>

        {/* 基本信息 */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              return !stringValue ? "姓名不能为空" : undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {userType === "personal" ? "姓名" : "联系人姓名"} *
              </label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder={userType === "personal" ? "请输入您的姓名" : "请输入联系人姓名"}
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500">
                  {formatErrors(field.state.meta.errors).join(", ")}
                </div>
              )}
            </fieldset>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const stringValue = String(value || "")
              if (!stringValue) return "邮箱不能为空"
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return !emailRegex.test(stringValue) ? "请输入有效的邮箱地址" : undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">邮箱 *</label>
              <form.Input
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="请输入邮箱地址"
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500">
                  {formatErrors(field.state.meta.errors).join(", ")}
                </div>
              )}
            </fieldset>
          )}
        </form.Field>

        {/* 条件渲染 - 企业用户额外字段 */}
        {userType === "business" && (
          <div className="space-y-4 rounded bg-blue-50 p-4">
            <h4 className="font-medium text-blue-800">企业信息</h4>

            <form.Field
              name="company"
              validators={{
                onChange: ({ value }) => {
                  // 只有在企业用户时才验证公司名称
                  if (userType === "business") {
                    const stringValue = String(value || "")
                    return !stringValue ? "公司名称不能为空" : undefined
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">公司名称 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="请输入公司名称"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500">
                      {formatErrors(field.state.meta.errors).join(", ")}
                    </div>
                  )}
                </fieldset>
              )}
            </form.Field>

            <form.Field name="website">
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">公司网站</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="url"
                    placeholder="https://example.com"
                  />
                </fieldset>
              )}
            </form.Field>
          </div>
        )}

        {/* 套餐选择 */}
        <form.Field name="plan">
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">选择套餐</label>
              <form.Select
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                options={[
                  { label: "基础版 - $10/月", value: "basic" },
                  { label: "专业版 - $50/月", value: "pro" },
                  { label: "企业版 - $200/月", value: "enterprise" },
                ]}
              />
            </fieldset>
          )}
        </form.Field>

        {/* 使用 form.Subscribe 的响应式组件 */}
        <form.Subscribe selector={(state) => [state.values.plan, state.values.userType]}>
          {([plan, userType]) => (
            <div className="rounded bg-purple-50 p-4">
              <h4 className="mb-2 font-medium text-purple-800">form.Subscribe 订阅示例</h4>
              <div className="text-sm text-purple-700">
                <div>
                  • 选择的套餐: <span className="font-medium">{String(plan)}</span>
                </div>
                <div>
                  • 用户类型: <span className="font-medium">{String(userType)}</span>
                </div>
                <div>
                  • 实际价格:{" "}
                  <span className="text-lg font-medium">
                    $
                    {({ basic: 10, pro: 50, enterprise: 200 }[plan as keyof typeof plan] || 0) *
                      (userType === "business" ? 2 : 1)}
                    /月
                  </span>
                </div>
                {userType === "business" && (
                  <div className="mt-2 text-xs">企业用户享受2倍功能，价格相应调整</div>
                )}
              </div>
            </div>
          )}
        </form.Subscribe>

        {/* 预算滑块 */}
        <form.Field name="budget">
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">预算范围</label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={Number(field.state.value) || 1000}
                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600">${Number(field.state.value) || 1000}</div>
            </fieldset>
          )}
        </form.Field>

        {/* 通知设置 */}
        <div className="space-y-3">
          <h4 className="font-medium">通知设置</h4>

          <form.Field name="newsletter">
            {(field) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(field.state.value)}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <span className="text-sm">订阅新闻通讯</span>
              </label>
            )}
          </form.Field>

          <form.Field name="notifications.email">
            {(field) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(field.state.value)}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <span className="text-sm">邮件通知</span>
              </label>
            )}
          </form.Field>

          <form.Field name="notifications.sms">
            {(field) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(field.state.value)}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <span className="text-sm">短信通知</span>
              </label>
            )}
          </form.Field>

          <form.Field name="notifications.push">
            {(field) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(field.state.value)}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <span className="text-sm">推送通知</span>
              </label>
            )}
          </form.Field>
        </div>

        {/* 响应式提交按钮 */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}>
          {([canSubmit, isSubmitting, isDirty]) => (
            <div className="flex gap-2">
              <form.Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "提交中..." : "提交表单"}
              </form.Button>

              <form.Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
                disabled={!isDirty}
              >
                重置表单
              </form.Button>
            </div>
          )}
        </form.Subscribe>

        {submitResult && (
          <div
            className={`rounded p-3 text-sm ${
              submitResult.includes("成功")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitResult}
          </div>
        )}
      </form>

      {/* 响应式状态监控 */}
      <div className="space-y-4">
        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isDirty,
            state.isValid,
            state.isSubmitting,
            state.errorMap,
          ]}
        >
          {([canSubmit, isDirty, isValid, isSubmitting, errorMap]) => (
            <div className="rounded bg-gray-100 p-4 text-sm">
              <div className="mb-2 font-medium">实时表单状态 (form.Subscribe)：</div>
              <div className="grid grid-cols-2 gap-2">
                <div className={canSubmit ? "text-green-600" : "text-red-600"}>
                  可提交: {canSubmit ? "是" : "否"}
                </div>
                <div className={isDirty ? "text-blue-600" : "text-gray-600"}>
                  已修改: {isDirty ? "是" : "否"}
                </div>
                <div className={isValid ? "text-green-600" : "text-red-600"}>
                  有效: {isValid ? "是" : "否"}
                </div>
                <div className={isSubmitting ? "text-orange-600" : "text-gray-600"}>
                  提交中: {isSubmitting ? "是" : "否"}
                </div>
              </div>
              {Object.keys(errorMap).length > 0 && (
                <div className="mt-2 text-red-600">
                  错误字段: {Object.keys(errorMap).join(", ")}
                </div>
              )}
            </div>
          )}
        </form.Subscribe>

        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <div className="rounded bg-blue-50 p-4 text-sm">
              <div className="mb-2 font-medium">实时表单数据 (form.Subscribe)：</div>
              <pre className="max-h-40 overflow-auto text-xs">
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
          )}
        </form.Subscribe>

        {/* 性能对比说明 */}
        <div className="rounded bg-yellow-50 p-4 text-sm">
          <div className="mb-2 font-medium text-yellow-800">性能优化说明：</div>
          <div className="space-y-1 text-xs text-yellow-700">
            <div>
              • <strong>useStore</strong>: 适合在组件逻辑中使用表单值
            </div>
            <div>
              • <strong>form.Subscribe</strong>: 适合响应式渲染，只有订阅的值变化时才重新渲染
            </div>
            <div>
              • <strong>选择器</strong>: 使用精确的选择器避免不必要的重新渲染
            </div>
            <div>
              • <strong>多值订阅</strong>: 可以同时订阅多个值，减少订阅次数
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Form with reactivity patterns
 */
export const WithReactivity: Story = {
  render: () => <ReactivityExample />,
}

const ListenersExample = () => {
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [activityLog, setActivityLog] = useState<string[]>([])

  // 辅助函数：格式化错误信息
  const formatErrors = (errors: unknown[]): string[] => {
    const formatted = errors.map((error) => {
      if (typeof error === "string") return error
      if (error && typeof error === "object" && "message" in error) {
        return String(error.message)
      }
      return String(error)
    })
    // 去重处理
    return [...new Set(formatted)]
  }

  // 添加活动日志
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setActivityLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]) // 保留最近10条
  }

  // 模拟国家-省份数据
  const countryProvinceData = {
    china: [
      { label: "北京市", value: "beijing" },
      { label: "上海市", value: "shanghai" },
      { label: "广东省", value: "guangdong" },
      { label: "浙江省", value: "zhejiang" },
    ],
    usa: [
      { label: "California", value: "california" },
      { label: "New York", value: "newyork" },
      { label: "Texas", value: "texas" },
      { label: "Florida", value: "florida" },
    ],
    japan: [
      { label: "東京都", value: "tokyo" },
      { label: "大阪府", value: "osaka" },
      { label: "神奈川県", value: "kanagawa" },
      { label: "愛知県", value: "aichi" },
    ],
  }

  const form = useForm({
    defaultValues: {
      // 级联选择
      country: "",
      province: "",
      city: "",

      // 用户类型相关
      userType: "individual" as "individual" | "company" | "organization",
      personalInfo: {
        firstName: "",
        lastName: "",
        idNumber: "",
      },
      companyInfo: {
        companyName: "",
        taxId: "",
        industry: "",
      },
      organizationInfo: {
        orgName: "",
        orgType: "",
        registrationNumber: "",
      },

      // 其他字段
      email: "",
      phone: "",
      newsletter: false,
      notifications: {
        email: true,
        sms: false,
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null)
      addLog("表单提交开始")
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Form submitted:", value)
        setSubmitResult("表单提交成功！")
        addLog("表单提交成功")
      } catch (error) {
        const errorMsg = `提交失败：${error instanceof Error ? error.message : "未知错误"}`
        setSubmitResult(errorMsg)
        addLog(errorMsg)
      }
    },
  })

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold">监听器 API 示例</h3>
        <p className="text-sm text-gray-600">
          演示如何使用 Listeners API 处理字段间的副作用和级联逻辑
        </p>
      </div>

      {/* 活动日志 */}
      <div className="rounded bg-gray-50 p-4">
        <h4 className="mb-2 font-medium">活动日志</h4>
        <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
          {activityLog.length === 0 ? (
            <div className="text-gray-500">暂无活动</div>
          ) : (
            activityLog.map((log, index) => (
              <div
                key={index}
                className="text-gray-700"
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        {/* 级联选择示例 - 国家-省份 */}
        <div className="space-y-4 rounded bg-blue-50 p-4">
          <h4 className="font-medium text-blue-800">级联选择示例</h4>
          <p className="text-sm text-blue-700">
            演示经典的国家-省份级联选择，当国家改变时自动重置省份
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 国家选择 */}
            <form.Field
              name="country"
              listeners={{
                onChange: ({ value }) => {
                  // 当国家改变时，重置省份和城市
                  form.setFieldValue("province", "")
                  form.setFieldValue("city", "")
                  addLog(`国家改变为: ${value || "空"}, 已重置省份和城市`)
                },
                onMount: () => {
                  addLog("国家字段已挂载")
                },
              }}
              validators={{
                onChange: ({ value }) => {
                  const stringValue = String(value || "")
                  return !stringValue ? "请选择国家" : undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">国家 *</label>
                  <form.Select
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    options={[
                      { label: "中国", value: "china" },
                      { label: "美国", value: "usa" },
                      { label: "日本", value: "japan" },
                    ]}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500">
                      {formatErrors(field.state.meta.errors).join(", ")}
                    </div>
                  )}
                </fieldset>
              )}
            </form.Field>

            {/* 省份选择 */}
            <form.Field
              name="province"
              listeners={{
                onChange: ({ value }) => {
                  // 当省份改变时，重置城市
                  form.setFieldValue("city", "")
                  addLog(`省份改变为: ${value || "空"}, 已重置城市`)
                },
                onBlur: ({ value }) => {
                  if (value) {
                    addLog(`省份字段失焦，当前值: ${value}`)
                  }
                },
              }}
              validators={{
                onChange: ({ value }) => {
                  const country = form.getFieldValue("country")
                  if (country && !value) return "请选择省份"
                  return undefined
                },
              }}
            >
              {(field) => {
                const currentCountry = String(form.getFieldValue("country") || "")
                const provinces = currentCountry
                  ? countryProvinceData[currentCountry as keyof typeof countryProvinceData] || []
                  : []

                return (
                  <fieldset className="flex flex-col gap-2">
                    <label className="text-sm font-medium">省份</label>
                    <form.Select
                      name={field.name}
                      value={String(field.state.value || "")}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      options={provinces}
                      disabled={!currentCountry}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="text-sm text-red-500">
                        {formatErrors(field.state.meta.errors).join(", ")}
                      </div>
                    )}
                    {!currentCountry && <div className="text-xs text-gray-500">请先选择国家</div>}
                  </fieldset>
                )
              }}
            </form.Field>

            {/* 城市输入 */}
            <form.Field
              name="city"
              listeners={{
                onChange: ({ value }) => {
                  if (value) {
                    addLog(`城市输入: ${value}`)
                  }
                },
              }}
            >
              {(field) => {
                const currentProvince = String(form.getFieldValue("province") || "")

                return (
                  <fieldset className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium">城市</label>
                    <form.Input
                      name={field.name}
                      value={String(field.state.value || "")}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      placeholder="请输入城市名称"
                      disabled={!currentProvince}
                    />
                    {!currentProvince && <div className="text-xs text-gray-500">请先选择省份</div>}
                  </fieldset>
                )
              }}
            </form.Field>
          </div>
        </div>

        {/* 用户类型切换示例 */}
        <div className="space-y-4 rounded bg-green-50 p-4">
          <h4 className="font-medium text-green-800">用户类型切换示例</h4>
          <p className="text-sm text-green-700">演示当用户类型改变时，重置相关信息字段</p>

          {/* 用户类型选择 */}
          <form.Field
            name="userType"
            listeners={{
              onChange: ({ value }) => {
                // 重置所有类型相关的字段
                form.setFieldValue("personalInfo", {
                  firstName: "",
                  lastName: "",
                  idNumber: "",
                })
                form.setFieldValue("companyInfo", {
                  companyName: "",
                  taxId: "",
                  industry: "",
                })
                form.setFieldValue("organizationInfo", {
                  orgName: "",
                  orgType: "",
                  registrationNumber: "",
                })
                addLog(`用户类型切换为: ${value}, 已重置所有相关信息`)
              },
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">用户类型</label>
                <div className="flex gap-4">
                  {[
                    { label: "个人", value: "individual" },
                    { label: "企业", value: "company" },
                    { label: "组织", value: "organization" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={String(field.state.value) === option.value}
                        onChange={() => field.handleChange(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </form.Field>

          {/* 条件渲染不同类型的信息字段 */}
          {form.getFieldValue("userType") === "individual" && (
            <div className="space-y-3">
              <h5 className="font-medium">个人信息</h5>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <form.Field
                  name="personalInfo.firstName"
                  listeners={{
                    onMount: () => addLog("个人信息-姓字段已挂载"),
                    onBlur: ({ value }) => {
                      if (value) addLog(`个人信息-姓输入完成: ${value}`)
                    },
                  }}
                >
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">姓</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入姓"
                      />
                    </fieldset>
                  )}
                </form.Field>

                <form.Field name="personalInfo.lastName">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">名</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入名"
                      />
                    </fieldset>
                  )}
                </form.Field>

                <form.Field
                  name="personalInfo.idNumber"
                  listeners={{
                    onChange: ({ value }) => {
                      // 身份证号变化时的格式化或验证
                      if (value && String(value).length === 18) {
                        addLog("身份证号输入完成，格式验证中...")
                      }
                    },
                  }}
                >
                  {(field) => (
                    <fieldset className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-medium">身份证号</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入身份证号"
                      />
                    </fieldset>
                  )}
                </form.Field>
              </div>
            </div>
          )}

          {form.getFieldValue("userType") === "company" && (
            <div className="space-y-3">
              <h5 className="font-medium">企业信息</h5>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <form.Field
                  name="companyInfo.companyName"
                  listeners={{
                    onMount: () => addLog("企业信息-公司名称字段已挂载"),
                    onChange: ({ value }) => {
                      if (value && String(value).length >= 3) {
                        addLog(`公司名称更新: ${value}`)
                      }
                    },
                  }}
                >
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">公司名称</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入公司名称"
                      />
                    </fieldset>
                  )}
                </form.Field>

                <form.Field name="companyInfo.taxId">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">税务登记号</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入税务登记号"
                      />
                    </fieldset>
                  )}
                </form.Field>

                <form.Field name="companyInfo.industry">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-medium">行业</label>
                      <form.Select
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        options={[
                          { label: "科技", value: "technology" },
                          { label: "金融", value: "finance" },
                          { label: "制造业", value: "manufacturing" },
                          { label: "服务业", value: "service" },
                        ]}
                      />
                    </fieldset>
                  )}
                </form.Field>
              </div>
            </div>
          )}

          {form.getFieldValue("userType") === "organization" && (
            <div className="space-y-3">
              <h5 className="font-medium">组织信息</h5>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <form.Field name="organizationInfo.orgName">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">组织名称</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入组织名称"
                      />
                    </fieldset>
                  )}
                </form.Field>

                <form.Field name="organizationInfo.orgType">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">组织类型</label>
                      <form.Select
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        options={[
                          { label: "非营利组织", value: "nonprofit" },
                          { label: "政府机构", value: "government" },
                          { label: "教育机构", value: "education" },
                          { label: "慈善机构", value: "charity" },
                        ]}
                      />
                    </fieldset>
                  )}
                </form.Field>

                <form.Field name="organizationInfo.registrationNumber">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-medium">注册号</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入注册号"
                      />
                    </fieldset>
                  )}
                </form.Field>
              </div>
            </div>
          )}
        </div>

        {/* 通知设置示例 */}
        <div className="space-y-4 rounded bg-purple-50 p-4">
          <h4 className="font-medium text-purple-800">通知设置联动示例</h4>
          <p className="text-sm text-purple-700">演示复选框间的联动逻辑</p>

          <div className="space-y-3">
            <form.Field
              name="newsletter"
              listeners={{
                onChange: ({ value }) => {
                  if (!value) {
                    // 如果取消订阅新闻通讯，也取消邮件通知
                    form.setFieldValue("notifications.email", false)
                    addLog("取消新闻通讯订阅，同时取消邮件通知")
                  } else {
                    addLog("订阅新闻通讯")
                  }
                },
              }}
            >
              {(field) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(field.state.value)}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  <span className="text-sm">订阅新闻通讯</span>
                </label>
              )}
            </form.Field>

            <form.Field
              name="notifications.email"
              listeners={{
                onChange: ({ value }) => {
                  if (value) {
                    // 如果开启邮件通知，自动订阅新闻通讯
                    form.setFieldValue("newsletter", true)
                    addLog("开启邮件通知，自动订阅新闻通讯")
                  } else {
                    addLog("关闭邮件通知")
                  }
                },
              }}
            >
              {(field) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(field.state.value)}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  <span className="text-sm">邮件通知</span>
                </label>
              )}
            </form.Field>

            <form.Field
              name="notifications.sms"
              listeners={{
                onChange: ({ value }) => {
                  addLog(`短信通知 ${value ? "开启" : "关闭"}`)
                },
              }}
            >
              {(field) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(field.state.value)}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  <span className="text-sm">短信通知</span>
                </label>
              )}
            </form.Field>
          </div>
        </div>

        {/* 基本联系信息 */}
        <div className="space-y-4">
          <h4 className="font-medium">联系信息</h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="email"
              listeners={{
                onBlur: ({ value }) => {
                  if (value && String(value).includes("@")) {
                    addLog(`邮箱输入完成: ${value}`)
                  }
                },
              }}
              validators={{
                onChange: ({ value }) => {
                  const stringValue = String(value || "")
                  if (!stringValue) return "邮箱不能为空"
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  return !emailRegex.test(stringValue) ? "请输入有效的邮箱地址" : undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">邮箱 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="请输入邮箱地址"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500">
                      {formatErrors(field.state.meta.errors).join(", ")}
                    </div>
                  )}
                </fieldset>
              )}
            </form.Field>

            <form.Field
              name="phone"
              listeners={{
                onChange: ({ value }) => {
                  const phone = String(value || "")
                  if (phone.length === 11) {
                    addLog(`手机号输入完成: ${phone}`)
                  }
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">手机号</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="tel"
                    placeholder="请输入手机号"
                  />
                </fieldset>
              )}
            </form.Field>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-2">
          <form.Button
            type="submit"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
          >
            {form.state.isSubmitting ? "提交中..." : "提交表单"}
          </form.Button>

          <form.Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset()
              addLog("表单已重置")
              setActivityLog([])
            }}
          >
            重置表单
          </form.Button>
        </div>

        {submitResult && (
          <div
            className={`rounded p-3 text-sm ${
              submitResult.includes("成功")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitResult}
          </div>
        )}
      </form>

      {/* 表单状态监控 */}
      <div className="rounded bg-gray-100 p-4 text-sm">
        <div className="mb-2 font-medium">当前表单数据预览：</div>
        <pre className="max-h-60 overflow-auto rounded bg-white p-2 text-xs">
          {JSON.stringify(form.state.values, null, 2)}
        </pre>
      </div>

      {/* 监听器说明 */}
      <div className="rounded bg-yellow-50 p-4 text-sm">
        <div className="mb-2 font-medium text-yellow-800">监听器事件说明：</div>
        <div className="space-y-1 text-xs text-yellow-700">
          <div>
            • <strong>onChange</strong>: 字段值变化时触发（最常用）
          </div>
          <div>
            • <strong>onBlur</strong>: 字段失去焦点时触发
          </div>
          <div>
            • <strong>onMount</strong>: 字段首次挂载时触发
          </div>
          <div>
            • <strong>onSubmit</strong>: 表单提交时触发
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Form with listeners API
 */
export const WithListeners: Story = {
  render: () => <ListenersExample />,
}

// 自定义错误类型定义
interface ValidationError {
  code?: string
  details?: Record<string, unknown>
  field?: string
  message: string
  severity?: "error" | "warning" | "info"
  type: "required" | "format" | "length" | "custom" | "server"
}

interface PasswordStrengthError {
  message: string
  requirements: {
    length: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
    uppercase: boolean
  }
  score: number
  suggestions: string[]
  type: "password_strength"
}

interface FileValidationError {
  file: string
  issues: Array<{
    current?: string | number
    limit?: string | number
    message: string
    type: "size" | "format" | "name" | "content"
  }>
  message: string
  type: "file_validation"
}

// 联合错误类型
type CustomError = ValidationError | PasswordStrengthError | FileValidationError

const CustomErrorsExample = () => {
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, ValidationError[]>>({})

  // 辅助函数：格式化不同类型的错误
  const formatCustomErrors = (errors: unknown[]): React.ReactNode[] => {
    return errors.map((error, index) => {
      // 字符串错误
      if (typeof error === "string") {
        return (
          <div
            key={index}
            className="text-sm text-red-600"
          >
            {error}
          </div>
        )
      }

      // 验证错误对象
      if (error && typeof error === "object" && "type" in error) {
        const validationError = error as CustomError

        if (validationError.type === "password_strength") {
          const pwdError = error as PasswordStrengthError
          return (
            <div
              key={index}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-red-600">{pwdError.message}</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">强度评分:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 w-4 rounded-sm ${
                          level <= pwdError.score
                            ? pwdError.score >= 4
                              ? "bg-green-500"
                              : pwdError.score >= 3
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({pwdError.score}/5)</span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">要求:</div>
                  {Object.entries(pwdError.requirements).map(([key, met]) => (
                    <div
                      key={key}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span className={met ? "text-green-600" : "text-red-600"}>
                        {met ? "✓" : "✗"}
                      </span>
                      <span className={met ? "text-green-600" : "text-red-600"}>
                        {key === "length" && "至少8个字符"}
                        {key === "uppercase" && "包含大写字母"}
                        {key === "lowercase" && "包含小写字母"}
                        {key === "numbers" && "包含数字"}
                        {key === "symbols" && "包含特殊字符"}
                      </span>
                    </div>
                  ))}
                </div>
                {pwdError.suggestions.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">建议:</div>
                    {pwdError.suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className="text-xs text-blue-600"
                      >
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        }

        if (validationError.type === "file_validation") {
          const fileError = error as FileValidationError
          return (
            <div
              key={index}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-red-600">{fileError.message}</div>
              <div className="space-y-1 text-xs">
                <div className="text-gray-600">文件: {fileError.file}</div>
                <div className="space-y-1">
                  {fileError.issues.map((issue, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1"
                    >
                      <span className="text-xs text-red-500">•</span>
                      <div className="text-xs text-red-600">
                        <div>{issue.message}</div>
                        {issue.limit && issue.current && (
                          <div className="mt-1 text-gray-500">
                            当前: {issue.current}, 限制: {issue.limit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        // 普通验证错误
        return (
          <div
            key={index}
            className="space-y-1"
          >
            <div
              className={`text-sm ${
                validationError.severity === "warning"
                  ? "text-yellow-600"
                  : validationError.severity === "info"
                    ? "text-blue-600"
                    : "text-red-600"
              }`}
            >
              {validationError.message}
            </div>
            {validationError.code && (
              <div className="text-xs text-gray-500">错误代码: {validationError.code}</div>
            )}
            {validationError.details && (
              <div className="text-xs text-gray-500">
                详细信息: {JSON.stringify(validationError.details)}
              </div>
            )}
          </div>
        )
      }

      // 数组错误
      if (Array.isArray(error)) {
        return (
          <div
            key={index}
            className="space-y-1"
          >
            {error.map((err, i) => (
              <div
                key={i}
                className="text-sm text-red-600"
              >
                • {typeof err === "string" ? err : JSON.stringify(err)}
              </div>
            ))}
          </div>
        )
      }

      // 其他类型错误
      return (
        <div
          key={index}
          className="text-sm text-red-600"
        >
          {JSON.stringify(error)}
        </div>
      )
    })
  }

  // 密码强度验证器
  const validatePasswordStrength = (password: string): PasswordStrengthError | undefined => {
    if (!password) return undefined

    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    const score = Object.values(requirements).filter(Boolean).length
    const suggestions: string[] = []

    if (!requirements.length) suggestions.push("增加密码长度至少8个字符")
    if (!requirements.uppercase) suggestions.push("添加大写字母")
    if (!requirements.lowercase) suggestions.push("添加小写字母")
    if (!requirements.numbers) suggestions.push("添加数字")
    if (!requirements.symbols) suggestions.push("添加特殊字符")

    // 如果所有要求都满足，返回 undefined (无错误)
    if (score === 5) return undefined

    return {
      type: "password_strength",
      message: "密码强度不够",
      requirements,
      score,
      suggestions,
    }
  }

  // 文件验证器
  const validateFile = (filename: string): FileValidationError | undefined => {
    if (!filename) return undefined

    const issues: FileValidationError["issues"] = []

    // 检查文件扩展名
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"]
    const extension = filename.toLowerCase().substring(filename.lastIndexOf("."))
    if (!allowedExtensions.includes(extension)) {
      issues.push({
        type: "format",
        message: `不支持的文件格式: ${extension}`,
        current: extension,
        limit: allowedExtensions.join(", "),
      })
    }

    // 检查文件名长度
    if (filename.length > 100) {
      issues.push({
        type: "name",
        message: "文件名过长",
        current: filename.length,
        limit: 100,
      })
    }

    // 模拟文件大小检查
    const mockFileSize = filename.length * 1024 // 模拟文件大小
    if (mockFileSize > 5 * 1024 * 1024) {
      // 5MB
      issues.push({
        type: "size",
        message: "文件大小超过限制",
        current: `${(mockFileSize / 1024 / 1024).toFixed(1)}MB`,
        limit: "5MB",
      })
    }

    if (issues.length === 0) return undefined

    return {
      type: "file_validation",
      message: "文件验证失败",
      file: filename,
      issues,
    }
  }

  // 模拟服务器验证
  const simulateServerValidation = async (
    field: string,
    value: string,
  ): Promise<ValidationError | undefined> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (field === "username" && value === "admin") {
      return {
        type: "server",
        message: "用户名已被占用",
        code: "USERNAME_TAKEN",
        field: "username",
        severity: "error",
        details: { suggestions: ["admin123", "admin2024", "user_admin"] },
      }
    }

    if (field === "email" && value === "test@example.com") {
      return {
        type: "server",
        message: "此邮箱已注册",
        code: "EMAIL_EXISTS",
        field: "email",
        severity: "error",
        details: { registeredAt: "2024-01-01" },
      }
    }

    return undefined
  }

  // 复合验证器 - 返回多种错误类型
  const validateComplex = (
    value: string,
    field: string,
  ): ValidationError[] | string | undefined => {
    if (!value) {
      return [
        {
          type: "required",
          message: `${field}是必填项`,
          code: "REQUIRED_FIELD",
          severity: "error",
        } as ValidationError,
      ]
    }

    const errors: ValidationError[] = []

    // 长度检查
    if (value.length < 3) {
      errors.push({
        type: "length",
        message: `${field}长度至少3个字符`,
        code: "MIN_LENGTH",
        severity: "error",
        details: { minLength: 3, currentLength: value.length },
      })
    }

    // 格式检查
    if (field === "用户名" && !/^[a-zA-Z0-9_]+$/.test(value)) {
      errors.push({
        type: "format",
        message: "用户名只能包含字母、数字和下划线",
        code: "INVALID_FORMAT",
        severity: "error",
      })
    }

    // 警告级别的检查
    if (field === "用户名" && value.length > 20) {
      errors.push({
        type: "length",
        message: "用户名过长，建议控制在20个字符以内",
        code: "LONG_USERNAME",
        severity: "warning",
        details: { maxRecommended: 20, currentLength: value.length },
      })
    }

    return errors.length > 0 ? errors : undefined
  }

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fileName: "",
      description: "",
      tags: "",
      score: 0,
      agreement: false,
    },
    onSubmit: async ({ value }) => {
      setSubmitResult(null)
      setServerErrors({})

      try {
        // 模拟服务器端验证
        const serverValidationErrors: Record<string, ValidationError[]> = {}

        // 检查用户名
        const usernameError = await simulateServerValidation("username", value.username)
        if (usernameError) {
          serverValidationErrors.username = [usernameError]
        }

        // 检查邮箱
        const emailError = await simulateServerValidation("email", value.email)
        if (emailError) {
          serverValidationErrors.email = [emailError]
        }

        if (Object.keys(serverValidationErrors).length > 0) {
          setServerErrors(serverValidationErrors)
          setSubmitResult("服务器验证失败，请检查错误信息")
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Form submitted:", value)
        setSubmitResult("表单提交成功！")
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "未知错误"
        setSubmitResult(`提交失败：${errorMsg}`)
      }
    },
  })

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold">自定义错误处理示例</h3>
        <p className="text-sm text-gray-600">
          演示如何使用 TanStack Form 的灵活错误处理机制，支持多种错误类型和自定义错误显示
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        {/* 复合验证示例 */}
        <div className="space-y-4 rounded bg-red-50 p-4">
          <h4 className="font-medium text-red-800">复合验证示例</h4>
          <p className="text-sm text-red-700">演示返回多种错误类型：对象、数组、不同严重级别</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) => validateComplex(String(value), "用户名"),
                onBlurAsync: async ({ value }) => {
                  if (!value) return undefined
                  const serverError = await simulateServerValidation("username", String(value))
                  return serverError
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">用户名 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="请输入用户名"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
                  )}
                  {serverErrors.username && (
                    <div className="space-y-1">{formatCustomErrors(serverErrors.username)}</div>
                  )}
                  {field.state.meta.isValidating && (
                    <div className="text-sm text-blue-600">验证中...</div>
                  )}
                </fieldset>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const email = String(value || "")
                  if (!email)
                    return { type: "required", message: "邮箱是必填项", severity: "error" }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  if (!emailRegex.test(email)) {
                    return {
                      type: "format",
                      message: "请输入有效的邮箱地址",
                      code: "INVALID_EMAIL_FORMAT",
                      severity: "error",
                      details: { pattern: emailRegex.source },
                    }
                  }
                  return undefined
                },
                onBlurAsync: async ({ value }) => {
                  if (!value) return undefined
                  return await simulateServerValidation("email", String(value))
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">邮箱 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="请输入邮箱地址"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
                  )}
                  {serverErrors.email && (
                    <div className="space-y-1">{formatCustomErrors(serverErrors.email)}</div>
                  )}
                  {field.state.meta.isValidating && (
                    <div className="text-sm text-blue-600">验证中...</div>
                  )}
                </fieldset>
              )}
            </form.Field>
          </div>
        </div>

        {/* 密码强度验证示例 */}
        <div className="space-y-4 rounded bg-blue-50 p-4">
          <h4 className="font-medium text-blue-800">密码强度验证示例</h4>
          <p className="text-sm text-blue-700">演示复杂的密码强度验证，返回详细的错误对象</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => validatePasswordStrength(String(value || "")),
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">密码 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="请输入密码"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
                  )}
                </fieldset>
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value }) => {
                  const password = form.getFieldValue("password")
                  const confirmPassword = String(value || "")

                  if (!confirmPassword) {
                    return {
                      type: "required",
                      message: "请确认密码",
                      severity: "error",
                    }
                  }

                  if (password !== confirmPassword) {
                    return {
                      type: "custom",
                      message: "两次输入的密码不一致",
                      code: "PASSWORD_MISMATCH",
                      severity: "error",
                      details: {
                        originalLength: String(password).length,
                        confirmLength: confirmPassword.length,
                      },
                    }
                  }

                  return undefined
                },
              }}
            >
              {(field) => (
                <fieldset className="flex flex-col gap-2">
                  <label className="text-sm font-medium">确认密码 *</label>
                  <form.Input
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="请再次输入密码"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
                  )}
                </fieldset>
              )}
            </form.Field>
          </div>
        </div>

        {/* 文件验证示例 */}
        <div className="space-y-4 rounded bg-green-50 p-4">
          <h4 className="font-medium text-green-800">文件验证示例</h4>
          <p className="text-sm text-green-700">演示复杂的文件验证逻辑，包含多种验证规则</p>

          <form.Field
            name="fileName"
            validators={{
              onChange: ({ value }) => validateFile(String(value || "")),
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">文件名</label>
                <form.Input
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="请输入文件名 (例如: document.pdf)"
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
                )}
                <div className="text-xs text-gray-500">
                  支持的格式: .jpg, .jpeg, .png, .pdf, .doc, .docx
                </div>
              </fieldset>
            )}
          </form.Field>
        </div>

        {/* 数组错误示例 */}
        <div className="space-y-4 rounded bg-purple-50 p-4">
          <h4 className="font-medium text-purple-800">数组错误示例</h4>
          <p className="text-sm text-purple-700">演示返回错误数组的验证逻辑</p>

          <form.Field
            name="tags"
            validators={{
              onChange: ({ value }) => {
                const tags = String(value || "")
                if (!tags) return undefined

                const errors: string[] = []
                const tagList = tags.split(",").map((tag) => tag.trim())

                // 检查标签数量
                if (tagList.length > 5) {
                  errors.push("标签数量不能超过5个")
                }

                // 检查标签长度
                const longTags = tagList.filter((tag) => tag.length > 10)
                if (longTags.length > 0) {
                  errors.push(`标签过长: ${longTags.join(", ")}`)
                }

                // 检查重复标签
                const uniqueTags = new Set(tagList)
                if (uniqueTags.size !== tagList.length) {
                  errors.push("存在重复标签")
                }

                // 检查特殊字符
                const invalidTags = tagList.filter((tag) => /[!@#$%^&*(),.?":{}|<>]/.test(tag))
                if (invalidTags.length > 0) {
                  errors.push(`标签包含特殊字符: ${invalidTags.join(", ")}`)
                }

                return errors.length > 0 ? errors : undefined
              },
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">标签</label>
                <form.Input
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="请输入标签，用逗号分隔"
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
                )}
                <div className="text-xs text-gray-500">
                  用逗号分隔多个标签，最多5个，每个标签不超过10个字符
                </div>
              </fieldset>
            )}
          </form.Field>
        </div>

        {/* 数值验证示例 */}
        <div className="space-y-4 rounded bg-yellow-50 p-4">
          <h4 className="font-medium text-yellow-800">数值验证示例</h4>
          <p className="text-sm text-yellow-700">演示返回数值或布尔值作为错误的场景</p>

          <form.Field
            name="score"
            validators={{
              onChange: ({ value }) => {
                const score = Number(value)

                // 返回布尔值 - true 表示错误
                if (isNaN(score)) return true

                // 返回数字 - 非零表示错误
                if (score < 0) return -1
                if (score > 100) return 1

                // 返回 undefined 表示无错误
                return undefined
              },
            }}
          >
            {(field) => (
              <fieldset className="flex flex-col gap-2">
                <label className="text-sm font-medium">分数</label>
                <form.Input
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  type="number"
                  placeholder="请输入分数 (0-100)"
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="space-y-1">
                    {field.state.meta.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-sm text-red-600"
                      >
                        {error === true && "请输入有效的数值"}
                        {error === -1 && "分数不能为负数"}
                        {error === 1 && "分数不能超过100"}
                        {typeof error === "string" && error}
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>
            )}
          </form.Field>
        </div>

        {/* 描述字段 */}
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => {
              const desc = String(value || "")
              if (desc.length > 200) {
                return {
                  type: "length",
                  message: "描述不能超过200个字符",
                  severity: "warning",
                  details: { maxLength: 200, currentLength: desc.length },
                }
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="text-sm font-medium">描述</label>
              <textarea
                name={field.name}
                value={String(field.state.value || "")}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={4}
                placeholder="请输入描述"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              {field.state.meta.errors.length > 0 && (
                <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
              )}
              <div className="text-xs text-gray-500">
                当前字符数: {String(field.state.value || "").length}/200
              </div>
            </fieldset>
          )}
        </form.Field>

        {/* 协议同意 */}
        <form.Field
          name="agreement"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return {
                  type: "required",
                  message: "请同意用户协议",
                  severity: "error",
                }
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(field.state.value)}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <span className="text-sm">我已阅读并同意用户协议 *</span>
              </label>
              {field.state.meta.errors.length > 0 && (
                <div className="space-y-1">{formatCustomErrors(field.state.meta.errors)}</div>
              )}
            </fieldset>
          )}
        </form.Field>

        {/* 提交按钮 */}
        <div className="flex gap-2">
          <form.Button
            type="submit"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
          >
            {form.state.isSubmitting ? "提交中..." : "提交表单"}
          </form.Button>

          <form.Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset()
              setServerErrors({})
            }}
          >
            重置表单
          </form.Button>
        </div>

        {submitResult && (
          <div
            className={`rounded p-3 text-sm ${
              submitResult.includes("成功")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitResult}
          </div>
        )}
      </form>

      {/* 错误类型说明 */}
      <div className="rounded bg-gray-50 p-4 text-sm">
        <div className="mb-2 font-medium">支持的错误类型：</div>
        <div className="space-y-1 text-xs text-gray-700">
          <div>
            • <strong>字符串</strong>: 最常见的错误类型
          </div>
          <div>
            • <strong>对象</strong>: 包含类型、消息、严重级别等详细信息
          </div>
          <div>
            • <strong>数组</strong>: 多个错误的集合
          </div>
          <div>
            • <strong>布尔值</strong>: true 表示错误，false 表示正确
          </div>
          <div>
            • <strong>数值</strong>: 非零值表示错误
          </div>
          <div>
            • <strong>undefined/null</strong>: 表示无错误
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Form with custom errors
 */
export const WithCustomErrors: Story = {
  render: () => <CustomErrorsExample />,
}

// 提交元数据类型定义
interface SubmitMetadata {
  action: "save_draft" | "save_continue" | "save_exit" | "publish" | "preview" | "schedule"
  additionalData?: Record<string, unknown>
  priority?: "low" | "medium" | "high"
  redirect?: string
  saveLocation?: "local" | "server" | "cloud"
  showNotification?: boolean
}

// 提交结果类型
interface SubmitResult {
  data?: unknown
  message: string
  nextAction?: string
  redirectUrl?: string
  success: boolean
}

const SubmissionHandlingExample = () => {
  const [submitHistory, setSubmitHistory] = useState<
    Array<{
      action: string
      metadata: SubmitMetadata
      result: SubmitResult
      timestamp: string
    }>
  >([])
  const [currentResult, setCurrentResult] = useState<SubmitResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 模拟不同的提交处理逻辑
  const handleFormSubmit = async (
    values: Record<string, unknown>,
    metadata: SubmitMetadata,
  ): Promise<SubmitResult> => {
    console.log("Form submitted with values:", values)
    console.log("Submission metadata:", metadata)

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const timestamp = new Date().toLocaleTimeString()
    let result: SubmitResult

    switch (metadata.action) {
      case "save_draft":
        result = {
          success: true,
          message: "草稿已保存",
          data: { id: `draft_${Date.now()}`, savedAt: timestamp },
          nextAction: "continue_editing",
        }
        break

      case "save_continue":
        result = {
          success: true,
          message: "已保存，可以继续编辑",
          data: { id: `doc_${Date.now()}`, version: 1 },
          nextAction: "stay_on_form",
        }
        break

      case "save_exit":
        result = {
          success: true,
          message: "已保存并退出",
          data: { id: `doc_${Date.now()}`, finalVersion: true },
          redirectUrl: "/dashboard",
          nextAction: "redirect",
        }
        break

      case "publish": {
        // 模拟发布可能失败的情况
        const publishSuccess = Math.random() > 0.3
        result = {
          success: publishSuccess,
          message: publishSuccess ? "内容已发布" : "发布失败：服务器错误",
          data: publishSuccess
            ? {
                id: `pub_${Date.now()}`,
                publishedAt: timestamp,
                url: `https://example.com/posts/${Date.now()}`,
              }
            : undefined,
          nextAction: publishSuccess ? "redirect" : "stay_on_form",
        }
        break
      }

      case "preview": {
        result = {
          success: true,
          message: "预览已生成",
          data: { previewUrl: `https://preview.example.com/${Date.now()}` },
          nextAction: "open_preview",
        }
        break
      }

      case "schedule": {
        const scheduleTime = (values as Record<string, unknown>).scheduleTime as string
        result = {
          success: true,
          message: `已安排在 ${scheduleTime} 发布`,
          data: {
            id: `scheduled_${Date.now()}`,
            scheduledFor: scheduleTime,
            status: "pending",
          },
          nextAction: "stay_on_form",
        }
        break
      }

      default:
        result = {
          success: false,
          message: "未知操作",
          nextAction: "stay_on_form",
        }
    }

    // 记录提交历史
    setSubmitHistory((prev) =>
      [
        ...prev,
        {
          timestamp,
          action: metadata.action,
          result,
          metadata,
        },
      ].slice(-10),
    ) // 保留最近10条记录

    return result
  }

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      status: "draft" as "draft" | "published" | "scheduled",
      scheduleTime: "",
      priority: "medium" as "low" | "medium" | "high",
      notifications: true,
      autoSave: false,
    },
    onSubmit: async ({ value, formApi }: { formApi: any; value: unknown }) => {
      setIsSubmitting(true)
      setCurrentResult(null)

      try {
        // 获取提交元数据，如果没有提供则使用默认值
        const metadata = {
          action: "save_draft",
          showNotification: true,
          saveLocation: "server",
          priority: "medium",
        } as SubmitMetadata

        const result = await handleFormSubmit(value as Record<string, unknown>, metadata)
        setCurrentResult(result)

        // 根据结果执行不同的后续操作
        if (result.success) {
          if (metadata.showNotification) {
            // 这里可以显示通知
            console.log("Showing notification:", result.message)
          }

          // 根据 nextAction 执行不同操作
          switch (result.nextAction) {
            case "redirect":
              if (result.redirectUrl) {
                console.log("Redirecting to:", result.redirectUrl)
                // 在真实应用中这里会执行路由跳转
              }
              break
            case "open_preview":
              if (result.data && typeof result.data === "object" && "previewUrl" in result.data) {
                console.log("Opening preview:", result.data.previewUrl)
                // 在真实应用中这里会打开预览窗口
              }
              break
            case "stay_on_form":
            case "continue_editing":
              // 保持在表单页面
              break
          }
        }
      } catch (error) {
        setCurrentResult({
          success: false,
          message: `提交失败: ${error instanceof Error ? error.message : "未知错误"}`,
          nextAction: "stay_on_form",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold">提交处理示例</h3>
        <p className="text-sm text-gray-600">
          演示如何使用 onSubmitMeta 传递额外数据，实现不同的提交行为
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 表单区域 */}
        <div className="lg:col-span-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            {/* 基础字段 */}
            <div className="space-y-4 rounded border bg-white p-4">
              <h4 className="font-medium">基础信息</h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) => {
                      const title = String(value || "")
                      if (!title) return "标题不能为空"
                      if (title.length > 100) return "标题不能超过100个字符"
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">标题 *</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="请输入标题"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <div className="text-sm text-red-500">
                          {field.state.meta.errors.join(", ")}
                        </div>
                      )}
                    </fieldset>
                  )}
                </form.Field>

                <form.Field name="category">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">分类</label>
                      <form.Select
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        options={[
                          { label: "技术", value: "tech" },
                          { label: "设计", value: "design" },
                          { label: "产品", value: "product" },
                          { label: "营销", value: "marketing" },
                        ]}
                      />
                    </fieldset>
                  )}
                </form.Field>
              </div>

              <form.Field name="content">
                {(field) => (
                  <fieldset className="flex flex-col gap-2">
                    <label className="text-sm font-medium">内容</label>
                    <textarea
                      name={field.name}
                      value={String(field.state.value || "")}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      rows={6}
                      placeholder="请输入内容..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </fieldset>
                )}
              </form.Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="tags">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">标签</label>
                      <form.Input
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="用逗号分隔标签"
                      />
                    </fieldset>
                  )}
                </form.Field>

                <form.Field name="priority">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">优先级</label>
                      <form.Select
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        options={[
                          { label: "低", value: "low" },
                          { label: "中", value: "medium" },
                          { label: "高", value: "high" },
                        ]}
                      />
                    </fieldset>
                  )}
                </form.Field>
              </div>
            </div>

            {/* 发布设置 */}
            <div className="space-y-4 rounded border bg-white p-4">
              <h4 className="font-medium">发布设置</h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="status">
                  {(field) => (
                    <fieldset className="flex flex-col gap-2">
                      <label className="text-sm font-medium">状态</label>
                      <form.Select
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        options={[
                          { label: "草稿", value: "draft" },
                          { label: "已发布", value: "published" },
                          { label: "定时发布", value: "scheduled" },
                        ]}
                      />
                    </fieldset>
                  )}
                </form.Field>

                {form.getFieldValue("status") === "scheduled" && (
                  <form.Field name="scheduleTime">
                    {(field) => (
                      <fieldset className="flex flex-col gap-2">
                        <label className="text-sm font-medium">发布时间</label>
                        <form.Input
                          name={field.name}
                          value={String(field.state.value || "")}
                          onChange={field.handleChange}
                          onBlur={field.handleBlur}
                          type="datetime-local"
                        />
                      </fieldset>
                    )}
                  </form.Field>
                )}
              </div>

              <div className="space-y-2">
                <form.Field name="notifications">
                  {(field) => (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(field.state.value)}
                        onChange={(e) => field.handleChange(e.target.checked)}
                      />
                      <span className="text-sm">发送通知</span>
                    </label>
                  )}
                </form.Field>

                <form.Field name="autoSave">
                  {(field) => (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(field.state.value)}
                        onChange={(e) => field.handleChange(e.target.checked)}
                      />
                      <span className="text-sm">启用自动保存</span>
                    </label>
                  )}
                </form.Field>
              </div>
            </div>

            {/* 提交按钮组 */}
            <div className="rounded bg-gray-50 p-4">
              <h4 className="mb-4 font-medium">提交操作</h4>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {/* 保存草稿 */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    form.handleSubmit({
                      action: "save_draft",
                      showNotification: true,
                      saveLocation: "server",
                      priority: "low",
                    } as SubmitMetadata)
                  }}
                  className="rounded bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-600 disabled:opacity-50"
                >
                  {isSubmitting ? "处理中..." : "保存草稿"}
                </button>

                {/* 保存并继续 */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    form.handleSubmit({
                      action: "save_continue",
                      showNotification: true,
                      saveLocation: "server",
                      priority: "medium",
                    } as SubmitMetadata)
                  }}
                  className="rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? "处理中..." : "保存并继续"}
                </button>

                {/* 保存并退出 */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    form.handleSubmit({
                      action: "save_exit",
                      showNotification: true,
                      saveLocation: "server",
                      priority: "medium",
                      redirect: "/dashboard",
                    } as SubmitMetadata)
                  }}
                  className="rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600 disabled:opacity-50"
                >
                  {isSubmitting ? "处理中..." : "保存并退出"}
                </button>

                {/* 发布 */}
                <button
                  type="button"
                  disabled={isSubmitting || !form.state.canSubmit}
                  onClick={() => {
                    form.handleSubmit({
                      action: "publish",
                      showNotification: true,
                      saveLocation: "server",
                      priority: "high",
                      additionalData: {
                        publishImmediately: true,
                        notifySubscribers: form.getFieldValue("notifications"),
                      },
                    } as SubmitMetadata)
                  }}
                  className="rounded bg-purple-500 px-3 py-2 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                >
                  {isSubmitting ? "处理中..." : "立即发布"}
                </button>

                {/* 预览 */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    form.handleSubmit({
                      action: "preview",
                      showNotification: false,
                      saveLocation: "local",
                      priority: "low",
                    } as SubmitMetadata)
                  }}
                  className="rounded bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  {isSubmitting ? "处理中..." : "预览"}
                </button>

                {/* 定时发布 */}
                <button
                  type="button"
                  disabled={isSubmitting || !form.getFieldValue("scheduleTime")}
                  onClick={() => {
                    form.handleSubmit({
                      action: "schedule",
                      showNotification: true,
                      saveLocation: "server",
                      priority: "medium",
                      additionalData: {
                        scheduledTime: form.getFieldValue("scheduleTime"),
                        autoPublish: true,
                      },
                    } as SubmitMetadata)
                  }}
                  className="rounded bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {isSubmitting ? "处理中..." : "定时发布"}
                </button>
              </div>
            </div>

            {/* 提交结果显示 */}
            {currentResult && (
              <div
                className={`rounded p-4 ${
                  currentResult.success
                    ? "border border-green-200 bg-green-50"
                    : "border border-red-200 bg-red-50"
                }`}
              >
                <div
                  className={`font-medium ${
                    currentResult.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {currentResult.message}
                </div>
                {currentResult.data && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>返回数据:</strong>
                    <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2 text-xs">
                      {JSON.stringify(currentResult.data, null, 2)}
                    </pre>
                  </div>
                )}
                {currentResult.nextAction && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>下一步操作:</strong> {currentResult.nextAction}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* 侧边栏 - 提交历史 */}
        <div className="space-y-4">
          <div className="rounded border bg-white p-4">
            <h4 className="mb-4 font-medium">提交历史</h4>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {submitHistory.length === 0 ? (
                <div className="text-sm text-gray-500">暂无提交记录</div>
              ) : (
                submitHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="border-b pb-3 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{entry.action}</div>
                      <div className="text-xs text-gray-500">{entry.timestamp}</div>
                    </div>
                    <div
                      className={`text-sm ${
                        entry.result.success ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {entry.result.message}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      优先级: {entry.metadata.priority} | 位置: {entry.metadata.saveLocation} |
                      通知: {entry.metadata.showNotification ? "是" : "否"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 表单状态 */}
          <div className="rounded border bg-white p-4">
            <h4 className="mb-4 font-medium">表单状态</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>可提交:</span>
                <span className={form.state.canSubmit ? "text-green-600" : "text-red-600"}>
                  {form.state.canSubmit ? "是" : "否"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>已修改:</span>
                <span className={form.state.isDirty ? "text-yellow-600" : "text-gray-600"}>
                  {form.state.isDirty ? "是" : "否"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>验证通过:</span>
                <span className={form.state.isValid ? "text-green-600" : "text-red-600"}>
                  {form.state.isValid ? "是" : "否"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>提交中:</span>
                <span className={form.state.isSubmitting ? "text-blue-600" : "text-gray-600"}>
                  {form.state.isSubmitting ? "是" : "否"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="rounded bg-blue-50 p-4 text-sm">
        <div className="mb-2 font-medium text-blue-800">使用说明：</div>
        <div className="space-y-1 text-blue-700">
          <div>
            • 每个提交按钮都会传递不同的 <code>onSubmitMeta</code> 数据
          </div>
          <div>
            • 在 <code>onSubmit</code> 函数中可以通过 <code>formApi.submitMeta</code> 访问元数据
          </div>
          <div>• 如果没有提供元数据，会使用默认值</div>
          <div>• 可以根据元数据执行不同的提交逻辑和后续操作</div>
          <div>• 元数据可以包含任何自定义信息：优先级、保存位置、通知设置等</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Form with submission handling
 */
export const WithSubmissionHandling: Story = {
  render: () => <SubmissionHandlingExample />,
}
