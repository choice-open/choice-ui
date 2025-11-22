import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { CodeBlock } from "."

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible code block component with syntax highlighting, copy functionality, expand/collapse features, and multiple language support. Powered by Shiki for accurate syntax highlighting with automatic theme detection.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof meta>

const tsCode = `export function add(a: number, b: number): number {\n  return a + b\n}`
const jsonCode = `{"name":"prompt-kit","version":"1.0.0","private":true}`
const diffCode = `diff --git a/index.ts b/index.ts\n--- a/index.ts\n+++ b/index.ts\n@@\n- console.log('hello')\n+ console.info('hello world')\n`
const tsxCode = `import React from 'react'\n\nexport function Button({ label }: { label: string }) {\n  return (\n    <button className="px-3 py-1 rounded border">{label}</button>\n  )\n}`
const htmlCode = `<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>Example</title>\n  </head>\n  <body>\n    <div id="app">Hello</div>\n  </body>\n</html>`
const cssCode = `:root {\n  --primary: #0ea5e9;\n}\n\n.button {\n  background: var(--primary);\n  color: white;\n}`
const pyCode = `def add(a: int, b: int) -> int:\n    return a + b\n\nprint(add(2, 3))`

const longTSXExample = `import React, { useState, useEffect, useCallback, useMemo } from "react"
import { 
  ChevronDown, 
  ChevronRight, 
  Code2, 
  Copy, 
  Check,
  Terminal,
  FileCode,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { tcx } from "~/utils"

interface CodeEditorProps {
  initialCode?: string
  language?: "typescript" | "javascript" | "python" | "rust" | "go"
  theme?: "dark" | "light"
  onCodeChange?: (code: string) => void
  readOnly?: boolean
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = "",
  language = "typescript",
  theme = "dark",
  onCodeChange,
  readOnly = false,
  showLineNumbers = true,
  highlightLines = [],
  className
}) => {
  const [code, setCode] = useState(initialCode)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)

  // Memoize syntax highlighting
  const highlightedCode = useMemo(() => {
    return highlightSyntax(code, language)
  }, [code, language])

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    if (!readOnly) {
      setCode(newCode)
      onCodeChange?.(newCode)
    }
  }, [readOnly, onCodeChange])

  // Copy to clipboard functionality
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [code])

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (code !== initialCode) {
        console.log("Auto-saving code...")
        // Implement auto-save logic here
      }
    }, 2000)

    return () => clearTimeout(autoSaveTimer)
  }, [code, initialCode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        console.log("Saving code...")
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "f") {
        e.preventDefault()
        console.log("Formatting code...")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={tcx(
        "relative rounded-lg overflow-hidden shadow-2xl",
        theme === "dark" ? "bg-gray-900" : "bg-white",
        className
      )}
    >
      {/* Header */}
      <div className={tcx(
        "flex items-center justify-between px-4 py-3 border-b",
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
      )}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <FileCode size={18} className="text-blue-500" />
          <span className="text-body-small font-mono">{language}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className={tcx(
              "p-2 rounded transition-all",
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            )}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={16} className="text-green-500" />
                </motion.div>
              ) : (
                <Copy size={16} />
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative">
              {showLineNumbers && (
                <div className={tcx(
                  "absolute left-0 top-0 bottom-0 w-12 text-right pr-2",
                  theme === "dark" ? "bg-gray-850 text-gray-500" : "bg-gray-50 text-gray-400"
                )}>
                  {code.split("\\n").map((_, index) => (
                    <div
                      key={index}
                      className={tcx(
                        "text-xs leading-6 font-mono",
                        highlightLines.includes(index + 1) && "text-yellow-500 font-bold"
                      )}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              )}

              <div
                className={tcx(
                  "p-4 overflow-x-auto",
                  showLineNumbers && "pl-16",
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                )}
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onInput={(e) => handleCodeChange(e.currentTarget.textContent || "")}
                style={{ minHeight: "200px" }}
              >
                <pre className="font-mono text-body-small leading-6">
                  <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Status Bar */}
      <div className={tcx(
        "flex items-center justify-between px-4 py-2 text-xs",
        theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-600"
      )}>
        <div className="flex items-center gap-4">
          <span>Lines: {code.split("\\n").length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={12} />
          <span>AI-powered suggestions available</span>
        </div>
      </div>
    </motion.div>
  )
}

// Utility function for syntax highlighting (simplified)
function highlightSyntax(code: string, language: string): string {
  // This is a simplified version - in production, use a proper syntax highlighter
  const keywords = {
    typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "interface", "type", "import", "export", "from"],
    javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class"],
    python: ["def", "class", "import", "from", "return", "if", "else", "for", "while", "in"],
    rust: ["fn", "let", "mut", "const", "struct", "impl", "trait", "use", "mod", "pub"],
    go: ["func", "var", "const", "type", "struct", "interface", "import", "package", "return"]
  }

  let highlighted = code
  keywords[language]?.forEach(keyword => {
    const regex = new RegExp(\`\\\\b\${keyword}\\\\b\`, "g")
    highlighted = highlighted.replace(regex, \`<span class="text-blue-500">\${keyword}</span>\`)
  })

  return highlighted
}

export default CodeEditor`

/**
 * Demonstrates different programming languages with automatic theme switching.
 * The theme automatically adapts to the system/app theme (light/dark).
 */
export const LanguagesAndThemes: Story = {
  render: function LanguagesAndThemesRender() {
    return (
      <div className="flex max-w-4xl flex-col gap-4">
        <CodeBlock language="ts">
          <CodeBlock.Content code={tsCode} />
        </CodeBlock>

        <CodeBlock language="json">
          <CodeBlock.Content code={jsonCode} />
        </CodeBlock>

        <CodeBlock language="diff">
          <CodeBlock.Content code={diffCode} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Shows how long code content is handled with vertical scrolling.
 * Useful for displaying large code files without taking up too much space.
 */
export const LongCodeWithScroll: Story = {
  render: function LongCodeWithScrollRender() {
    const long = Array.from({ length: 80 }, (_, i) => `console.log('line ${i + 1}')`).join("\n")
    return (
      <div className="max-w-3xl">
        <CodeBlock language="js">
          <CodeBlock.Content code={long} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Demonstrates code block without scroll area container.
 * Use this when you want the code to naturally extend the container height.
 */
export const LongCodeWithoutScroll: Story = {
  render: function LongCodeWithoutScrollRender() {
    const long = Array.from({ length: 80 }, (_, i) => `console.log('line ${i + 1}')`).join("\n")
    return (
      <div className="max-w-3xl">
        <CodeBlock language="js">
          <CodeBlock.Content
            code={long}
            withScrollArea={false}
          />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Showcases popular programming and markup languages.
 * Each language has proper syntax highlighting powered by Shiki.
 */
export const PopularLanguages: Story = {
  render: function PopularLanguagesRender() {
    return (
      <div className="flex max-w-4xl flex-col gap-4">
        <CodeBlock language="tsx">
          <CodeBlock.Content code={tsxCode} />
        </CodeBlock>

        <CodeBlock language="html">
          <CodeBlock.Content code={htmlCode} />
        </CodeBlock>

        <CodeBlock language="js">
          <CodeBlock.Content
            code={`(() => {\n  const msg = 'hello';\n  console.log(msg);\n})();`}
          />
        </CodeBlock>

        <CodeBlock language="css">
          <CodeBlock.Content code={cssCode} />
        </CodeBlock>

        <CodeBlock language="python">
          <CodeBlock.Content code={pyCode} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Real-world example with a complex React component.
 * Demonstrates how readable long code remains with syntax highlighting.
 */
export const LongTSXDemo: Story = {
  render: function LongTSXDemoRender() {
    return (
      <div className="max-w-md">
        <CodeBlock language="tsx">
          <CodeBlock.Content code={longTSXExample} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Code block with interactive header showing filename and controls.
 * Header includes language icon, filename, copy button, and expand/collapse toggle.
 */
export const WithInteractiveHeader: Story = {
  render: function WithInteractiveHeader() {
    return (
      <div className="max-w-3xl">
        <CodeBlock
          language="tsx"
          filename="HelloWorld.tsx"
        >
          <CodeBlock.Header />
          <CodeBlock.Content code={tsxCode} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Full featured code block with header and footer.
 * Footer appears when code exceeds the line threshold, showing expand controls.
 */
export const WithHeaderAndFooter: Story = {
  render: function WithHeaderAndFooterRender() {
    return (
      <div className="max-w-3xl">
        <CodeBlock
          language="tsx"
          filename="LongComponent.tsx"
        >
          <CodeBlock.Header />
          <CodeBlock.Content code={longTSXExample} />
          <CodeBlock.Footer />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Code block collapsed by default to save space.
 * Users can click the expand button to reveal the code content.
 */
export const CollapsedByDefault: Story = {
  render: function CollapsedByDefaultRender() {
    return (
      <div className="max-w-3xl">
        <CodeBlock
          language="python"
          filename="example.py"
          defaultExpanded={false}
        >
          <CodeBlock.Header />
          <CodeBlock.Content code={pyCode} />
          <CodeBlock.Footer />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Long code that starts fully expanded, showing all lines.
 * Useful when you want to display complete code without initial truncation.
 */
export const ExpandedCode: Story = {
  render: function ExpandedCodeRender() {
    return (
      <div className="max-w-3xl">
        <CodeBlock
          language="tsx"
          filename="LongFile.tsx"
          defaultCodeExpanded={true}
        >
          <CodeBlock.Header />
          <CodeBlock.Content code={longTSXExample} />
          <CodeBlock.Footer />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Code block with expand/collapse functionality disabled.
 * Use this for short code snippets that don't need truncation.
 */
export const NonExpandable: Story = {
  render: function NonExpandableRender() {
    return (
      <div className="max-w-3xl">
        <CodeBlock
          language="json"
          filename="config.json"
          expandable={false}
        >
          <CodeBlock.Header />
          <CodeBlock.Content code={jsonCode} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Demonstrates internationalization support with custom labels.
 * You can provide custom translations for buttons and tooltips.
 */
export const CustomI18n: Story = {
  render: function CustomI18nRender() {
    return (
      <div className="max-w-3xl">
        <CodeBlock
          language="tsx"
          filename="国际化示例.tsx"
        >
          <CodeBlock.Header
            i18n={{
              collapse: "折叠",
              copied: "已复制",
              copy: "复制",
              expand: "展开",
            }}
          />
          <CodeBlock.Content code={tsxCode} />
          <CodeBlock.Footer />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Comprehensive showcase of language-specific icons in the header.
 * Icons are automatically selected based on the language or filename.
 * Demonstrates JavaScript, TypeScript, markup, config files, and more.
 */
export const LanguageIcons: Story = {
  render: function LanguageIconsRender() {
    const examples = [
      // JavaScript variants
      { language: "javascript", filename: "script.js", code: `console.log('Hello, World!');` },
      {
        language: "jsx",
        filename: "Component.jsx",
        code: `export const Button = () => <button>Click</button>`,
      },

      // TypeScript variants
      { language: "typescript", filename: "example.ts", code: tsCode },
      { language: "tsx", filename: "App.tsx", code: tsxCode },
      {
        language: "typescript",
        filename: "types.d.ts",
        code: `declare module 'my-lib' {\n  export function hello(): string\n}`,
      },

      // Styles
      { language: "css", filename: "styles.css", code: cssCode },
      {
        language: "scss",
        filename: "theme.scss",
        code: `$primary: #0ea5e9;\n.button {\n  color: $primary;\n}`,
      },

      // Markup
      { language: "html", filename: "index.html", code: htmlCode },
      {
        language: "xml",
        filename: "config.xml",
        code: `<?xml version="1.0"?>\n<root>\n  <item>value</item>\n</root>`,
      },

      // Markdown
      {
        language: "markdown",
        filename: "README.md",
        code: `# Hello World\n\nThis is a markdown file.`,
      },
      {
        language: "mdx",
        filename: "docs.mdx",
        code: `# Component Docs\n\nimport { Button } from './Button'\n\n<Button />`,
      },

      // Config files
      { language: "json", filename: "package.json", code: jsonCode },
      {
        language: "yaml",
        filename: "config.yml",
        code: `name: My App\nversion: 1.0.0\nscripts:\n  - build\n  - test`,
      },

      // Shell
      {
        language: "bash",
        filename: "deploy.sh",
        code: `#!/bin/bash\necho "Deploying..."\nnpm run build`,
      },
      { language: "shell", filename: "setup.sh", code: `#!/bin/sh\nexport NODE_ENV=production` },

      // Python
      { language: "python", filename: "main.py", code: pyCode },

      // Node
      {
        language: "node",
        filename: "server.js",
        code: `const express = require('express')\nconst app = express()\napp.listen(3000)`,
      },

      // Plain text
      {
        language: "text",
        filename: "notes.txt",
        code: `This is a plain text file.\nNo syntax highlighting.`,
      },

      // Languages with default icon
      {
        language: "go",
        filename: "main.go",
        code: `package main\n\nfunc main() {\n  println("Hello")\n}`,
      },
      { language: "rust", filename: "main.rs", code: `fn main() {\n    println!("Hello");\n}` },
      {
        language: "java",
        filename: "Main.java",
        code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello");\n  }\n}`,
      },
    ]

    return (
      <div className="grid max-w-6xl grid-cols-3 place-content-start place-items-start gap-4">
        {examples.map((example, index) => (
          <CodeBlock
            className="w-full"
            key={index}
            language={example.language}
            filename={example.filename}
          >
            <CodeBlock.Header />
            <CodeBlock.Content code={example.code} />
          </CodeBlock>
        ))}
      </div>
    )
  },
}

export const DefaultFilename: Story = {
  render: function DefaultFilenameRender() {
    return (
      <div className="max-w-3xl">
        <CodeBlock language="tsx">
          <CodeBlock.Header />
          <CodeBlock.Content code={tsxCode} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Shows how the lineThreshold property controls when footer appears.
 * Footer with expand controls only shows when code exceeds the threshold.
 * Useful for managing space with varying code lengths.
 */
export const LineCountThreshold: Story = {
  render: function LineCountThresholdRender() {
    const shortCode = `// Short code (5 lines)
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));`

    const mediumCode = `// Medium code (12 lines)
import React from 'react';

function TodoItem({ todo, onToggle }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
    </li>
  );
}`

    return (
      <div className="flex max-w-3xl flex-col gap-4">
        <div>
          <h3 className="font-strong mb-2">10 lines (no footer, below threshold)</h3>
          <CodeBlock
            language="javascript"
            filename="short.js"
            lineThreshold={10}
          >
            <CodeBlock.Header />
            <CodeBlock.Content code={shortCode} />
            <CodeBlock.Footer />
          </CodeBlock>
        </div>

        <div>
          <h3 className="font-strong mb-2">12 lines (footer shown, above threshold)</h3>
          <CodeBlock
            language="javascript"
            filename="medium.js"
            lineThreshold={12}
          >
            <CodeBlock.Header />
            <CodeBlock.Content code={mediumCode} />
            <CodeBlock.Footer />
          </CodeBlock>
        </div>

        <div>
          <h3 className="font-strong mb-2">Custom threshold (3 lines)</h3>
          <CodeBlock
            language="javascript"
            filename="custom.js"
            lineThreshold={3}
          >
            <CodeBlock.Header />
            <CodeBlock.Content code={shortCode} />
            <CodeBlock.Footer />
          </CodeBlock>
        </div>
      </div>
    )
  },
}
