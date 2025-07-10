import { Hide, Show } from "@choiceform/icons-react"
import type { Decorator } from "@storybook/react-vite"
import { Preview } from "@storybook/react-vite"
import { themes } from "storybook/theming"
import { motion } from "framer-motion"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Markdown from "react-markdown"
import { Prism } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Splitter, ToggleButton, TooltipProvider } from "../app/components"
import "../app/tailwind.css"
import "./global.css"

const SyntaxHighlighter = Prism as unknown as React.ComponentType<any>

const LOCALES = [
  { value: "us", label: "🇺🇸 English" },
  { value: "cn", label: "🇨🇳 中文" },
]

const lightTheme = {
  brandTitle: "@choiceform/design-system",
  brandUrl: "https://ui.choiceform.app",
  brandImage: "https://assets.choiceform.app/favicons/dev/brand.png",

  colorPrimary: "rgba(13, 153, 255, 1)",
  colorSecondary: "rgba(13, 153, 255, 1)",
  appBorderColor: "rgba(230, 230, 230, 1)",
  appBorderRadius: 5,
  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  barBg: "rgba(255, 255, 255, 1)",
  buttonBorder: "rgba(230, 230, 230, 1)",
  barTextColor: "rgba(0, 0, 0, 1)",
}

const darkTheme = {
  brandTitle: "@choiceform/design-system",
  brandUrl: "https://ui.choiceform.app",
  brandImage: "https://assets.choiceform.app/favicons/dev/brand_dark.png",

  colorPrimary: "rgba(7, 104, 207, 1)",
  colorSecondary: "rgba(13, 153, 255, 1)",
  appBorderColor: "rgba(68, 68, 68, 1)",
  appBorderRadius: 5,
  appBg: "rgba(30, 30, 30, 1)",
  appContentBg: "rgba(30, 30, 30, 1)",
  appPreviewBg: "rgba(30, 30, 30, 1)",
  barBg: "rgba(30, 30, 30, 1)",
  buttonBorder: "rgba(68, 68, 68, 1)",
  barTextColor: "rgba(255, 255, 255, 1)",
}

declare global {
  interface Window {
    prettier: {
      format: (code: string, options: Record<string, unknown>) => string
    }
    prettierPlugins: {
      html?: unknown
      typescript?: unknown
      babel?: unknown
    }
  }
}

// 缓存 Prettier 实例和加载状态
const prettierCache = {
  loaded: false,
  loadPromise: null as Promise<void> | null,
}

// 使用 React.memo 包装 StoryRenderer 组件以减少不必要的重新渲染
const StoryRenderer = React.memo(({ StoryFn, storyId }: { StoryFn: any; storyId: string }) => {
  return (
    <div
      key={storyId}
      className="bg-default-background flex w-full flex-col items-center justify-center"
    >
      <StoryFn />
    </div>
  )
})

// 使用 React.memo 包装 DocsPanel 组件
const DocsPanel = React.memo(
  ({
    visible,
    formattedTypes,
    formattedCode,
    title,
    componentName,
    name,
    description,
    source,
    type,
    storyId,
  }: any) => {
    if (!visible) return null

    return (
      <article
        key={storyId}
        className="prose-pre:p-0 prose-pre:text-(--code-text) prose-sm prose-neutral prose dark:prose-invert h-full w-full max-w-none overflow-y-auto border-l px-4 pb-16"
      >
        {name && (
          <div className="bg-default-background sticky top-0 mb-4 flex flex-col border-b py-4">
            <span className="text-secondary-foreground text-xl">{title}</span>
            <h3 className="mt-0 mb-0 text-lg">
              {componentName} / {name}
            </h3>
          </div>
        )}

        {description && (
          <Markdown
            children={description}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props
                const match = /language-(\w+)/.exec(className || "")
                return match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={oneLight}
                    customStyle={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      backgroundColor: "var(--code-background)",
                      borderRadius: "5px",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    {...rest}
                    className={className}
                  >
                    {children}
                  </code>
                )
              },
            }}
          />
        )}

        <hr className="mt-4 mb-4" />

        <p>Types</p>
        {type && (
          <SyntaxHighlighter
            language="typescript"
            style={oneLight}
            customStyle={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--code-background)",
              borderRadius: "5px",
            }}
          >
            {formattedTypes || ""}
          </SyntaxHighlighter>
        )}

        <p>Source</p>
        {source && (
          <SyntaxHighlighter
            language="tsx"
            style={oneLight}
            wrapLines={true}
            wrapLongLines={true}
            customStyle={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--code-background)",
              borderRadius: "5px",
            }}
          >
            {formattedCode || source}
          </SyntaxHighlighter>
        )}
      </article>
    )
  },
)

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 优化的加载 Prettier 函数
const loadPrettier = async (): Promise<void> => {
  if (prettierCache.loaded) return

  if (prettierCache.loadPromise) {
    return prettierCache.loadPromise
  }

  prettierCache.loadPromise = Promise.all([
    loadScript("https://unpkg.com/prettier@2.8.8/standalone.js"),
    loadScript("https://unpkg.com/prettier@2.8.8/parser-typescript.js"),
    loadScript("https://unpkg.com/prettier@2.8.8/parser-babel.js"),
  ]).then(() => {
    prettierCache.loaded = true
  })

  return prettierCache.loadPromise
}

const withCustomDecorator: Decorator = (StoryFn, context) => {
  const [formattedCode, setFormattedCode] = useState("")
  const [formattedTypes, setFormattedTypes] = useState("")

  // 使用 useRef 进行缓存，减少重新计算
  const contextRef = useRef({
    source: context.parameters?.docs?.source?.originalSource,
    argTypes: context.argTypes,
  })

  // 使用 useRef 来保存上次渲染的结果，减少不必要的状态更新
  const prevFormattedRef = useRef({
    code: "",
    types: "",
  })

  // 使用 localStorage 保存可见状态，避免在导航时丢失
  const [visible, setVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("storybook-docs-visible")
      return savedState === null ? true : savedState === "true"
    }
    return true
  })

  // 更高效的格式化代码函数
  const formatCode = useCallback(async (code: string) => {
    if (!code) return ""

    try {
      await loadPrettier()

      let processedCode = code
      if (code.startsWith("{\n  render:")) {
        processedCode = code
          .replace(/^{\s*render:\s*/, "")
          .replace(/}$/, "")
          .trim()
      }

      if (!window.prettier) return code

      const formatted = window.prettier.format(processedCode, {
        parser: "typescript",
        plugins: [window.prettierPlugins.typescript, window.prettierPlugins.babel],
        semi: true,
        singleQuote: false,
        printWidth: 70,
        tabWidth: 2,
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: "avoid",
      })
      return formatted
    } catch (error) {
      console.error("Failed to format code:", error)
      return code
    }
  }, [])

  // 仅在源代码变化时更新格式化代码
  useEffect(() => {
    let isMounted = true
    const source = context.parameters?.docs?.source?.originalSource

    // 如果源代码相同，避免重新格式化
    if (source && source !== contextRef.current.source) {
      contextRef.current.source = source

      formatCode(source).then((code) => {
        if (isMounted && code !== prevFormattedRef.current.code) {
          prevFormattedRef.current.code = code
          setFormattedCode(code)
        }
      })
    }

    return () => {
      isMounted = false
    }
  }, [context.parameters?.docs?.source?.originalSource, formatCode])

  // 仅在参数类型变化时更新格式化类型
  useEffect(() => {
    let isMounted = true
    const argTypes = context.argTypes

    // 避免不必要的重新计算
    if (argTypes && argTypes !== contextRef.current.argTypes) {
      contextRef.current.argTypes = argTypes

      const typeString = Object.entries(argTypes)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => {
          const typeValue = Array.isArray((value.type as any)?.value)
            ? (value.type as any).value.map((v: string) => `"${v}"`).join(" | ")
            : ((value.type as any)?.value ?? value.type?.name)

          // Quote property names that contain hyphens or other special characters
          const propName = /[-\s]/.test(key) ? `"${key}"` : key

          return `${propName}: ${typeValue};`
        })
        .join("\n")

      formatCode(`interface Props {\n${typeString}\n}`).then((code) => {
        if (isMounted && code !== prevFormattedRef.current.types) {
          prevFormattedRef.current.types = code
          setFormattedTypes(code)
        }
      })
    }

    return () => {
      isMounted = false
    }
  }, [context.argTypes, formatCode])

  // 保存可见状态到 localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("storybook-docs-visible", String(visible))
    }
  }, [visible])

  const title = context.title
  const componentName = context.component?.displayName
  const name = context.parameters?.docs?.title ?? context.name
  const type = context.argTypes
  const description =
    context.parameters?.docs?.description?.story || context.parameters?.docs?.description?.component
  const source = context.parameters?.docs?.source?.originalSource

  return (
    <TooltipProvider
      delay={{
        open: 400,
        close: 200,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="app h-screen w-screen"
      >
        <ToggleButton
          value={visible}
          onChange={setVisible}
          className="absolute top-2 right-2 z-2"
        >
          {visible ? <Hide /> : <Show />}
        </ToggleButton>
        <Splitter defaultSizes={[1024, 360]}>
          <Splitter.Pane className="bg-default-background flex flex-col items-center justify-center">
            <StoryRenderer
              StoryFn={StoryFn}
              storyId={context.storyId}
            />
          </Splitter.Pane>
          <Splitter.Pane visible={visible}>
            <DocsPanel
              visible={visible}
              formattedTypes={formattedTypes}
              formattedCode={formattedCode}
              title={title}
              componentName={componentName}
              name={name}
              description={description}
              source={source}
              type={type}
              storyId={context.storyId}
            />
          </Splitter.Pane>
        </Splitter>
      </motion.div>
    </TooltipProvider>
  )
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider
        delay={{
          open: 400,
          close: 200,
        }}
      >
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "centered",

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    darkMode: {
      classTarget: "html",
      stylePreview: true,
      dark: {
        ...themes.dark,
        ...darkTheme,
      },
      light: {
        ...themes.light,
        ...lightTheme,
      },
    },

    docs: {
      codePanel: true,
    },
  },
}

export default preview
