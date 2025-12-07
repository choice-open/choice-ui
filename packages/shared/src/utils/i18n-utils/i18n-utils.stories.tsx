import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { useI18n } from "./i18n-utils"

// Demo component showing how easy it is to use the universal i18n system
const I18nDemoComponent = ({ i18n: userI18n }: { i18n?: Record<string, unknown> }) => {
  // Default configuration
  const defaultConfig = {
    buttons: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
    },
    messages: {
      loading: "Loading...",
      success: "Operation completed successfully",
      error: "An error occurred",
    },
  }

  // 🚀 Use the universal hook directly - no need to wrap!
  const i18n = useI18n(defaultConfig, userI18n)

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  return (
    <div className="rounded border p-4">
      <h3 className="mb-4 font-semibold">i18n Demo Component</h3>

      <div className="mb-4 space-x-2">
        <button
          className="rounded bg-blue-500 px-3 py-1 text-white"
          onClick={() => {
            setStatus("loading")
            setTimeout(() => setStatus("success"), 1000)
          }}
        >
          {i18n.buttons.save}
        </button>
        <button
          className="rounded bg-gray-500 px-3 py-1 text-white"
          onClick={() => setStatus("idle")}
        >
          {i18n.buttons.cancel}
        </button>
        <button
          className="rounded bg-red-500 px-3 py-1 text-white"
          onClick={() => setStatus("error")}
        >
          {i18n.buttons.delete}
        </button>
      </div>

      <div className="rounded bg-gray-100 p-2">
        <strong>Status: </strong>
        {status === "loading" && i18n.messages.loading}
        {status === "success" && i18n.messages.success}
        {status === "error" && i18n.messages.error}
        {status === "idle" && "Ready"}
      </div>
    </div>
  )
}

// Universal i18n utilities demonstration
export default {
  title: "Utils/I18n",
  component: I18nDemoComponent,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    i18n: {
      control: "object",
      description: "Internationalization configuration",
    },
  },
} as Meta<typeof I18nDemoComponent>

/**
 * Default English configuration
 */
export const Default: StoryObj<typeof I18nDemoComponent> = {
  args: {},
}

/**
 * Chinese configuration showing partial override
 */
export const Chinese: StoryObj<typeof I18nDemoComponent> = {
  args: {
    i18n: {
      buttons: {
        save: "保存",
        cancel: "取消",
        delete: "删除",
      },
      messages: {
        loading: "加载中...",
        success: "操作成功完成",
        error: "发生错误",
      },
    },
  },
}

/**
 * French configuration with partial override
 */
export const PartialFrench: StoryObj<typeof I18nDemoComponent> = {
  args: {
    i18n: {
      buttons: {
        save: "Enregistrer",
        // cancel and delete use default English
      },
      messages: {
        loading: "Chargement...",
        // success and error use default English
      },
    },
  },
}

/**
 * Shows how easy it is - just import useI18n and use directly
 */
export const EasyUsage: StoryObj<typeof I18nDemoComponent> = {
  render: () => (
    <div className="max-w-md">
      <h2 className="mb-4 text-lg font-bold">🚀 Super Easy to Use!</h2>
      <pre className="rounded bg-gray-100 p-4 text-sm">
        {`import { useI18n } from "~/utils"

// Just 1 line in your component:
const i18n = useI18n(defaultConfig, userI18n)

// No need to:
❌ Create custom hooks
❌ Write wrapper functions  
❌ Handle caching manually
✅ Everything is automated!`}
      </pre>

      <div className="mt-4">
        <I18nDemoComponent
          i18n={{
            buttons: { save: "保存" },
            messages: { loading: "载入中..." },
          }}
        />
      </div>
    </div>
  ),
}
