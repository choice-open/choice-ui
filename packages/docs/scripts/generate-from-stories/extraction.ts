import type { Parameters } from "@storybook/types"
import ts from "typescript"

export function extractDescription(parameters?: Parameters): string {
  const componentDescription =
    parameters?.docs?.description &&
    typeof parameters.docs.description === "object" &&
    "component" in parameters.docs.description
      ? String(parameters.docs.description.component)
      : undefined

  if (componentDescription) return componentDescription

  const docDescription =
    parameters?.docs?.description && typeof parameters.docs.description === "string"
      ? parameters.docs.description
      : undefined

  if (docDescription) return docDescription

  return ""
}

export function extractStoryDescription(parameters?: Parameters): string {
  if (!parameters?.docs?.description) return ""

  const { description } = parameters.docs

  if (typeof description === "object" && "story" in description && description.story) {
    return String(description.story)
  }

  if (typeof description === "string") return description

  return ""
}

export function extractStoryDocblocks(sourceCode: string): Record<string, string> {
  const sourceFile = ts.createSourceFile(
    "story.tsx",
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const docMap: Record<string, string> = {}

  const collectDoc = (node: ts.Node) => {
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const variableNode = node as ts.VariableStatement & { jsDoc?: readonly ts.JSDoc[] }
      const jsDocs = variableNode.jsDoc ?? []
      const doc = jsDocs
        .map((docNode: ts.JSDoc) => {
          const { comment } = docNode
          if (!comment) return ""
          if (typeof comment === "string") return comment
          if (Array.isArray(comment)) {
            return comment
              .map((chunk) => {
                if (typeof chunk === "string") return chunk
                if (typeof (chunk as { text?: unknown }).text === "string") {
                  return String((chunk as { text: string }).text)
                }
                return ""
              })
              .join("")
          }
          return ""
        })
        .join("\n")

      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && doc.trim()) {
          docMap[decl.name.text] = doc.trim()
        }
      }
    }
    ts.forEachChild(node, collectDoc)
  }

  collectDoc(sourceFile)
  return docMap
}

export function extractStorySnippets(sourceCode: string): Record<string, string> {
  const snippets: Record<string, string> = {}
  const lines = sourceCode.split("\n")
  let currentName: string | null = null
  let start = -1

  const flush = (end: number) => {
    if (currentName && start >= 0) {
      const slice = lines.slice(start, end).join("\n").trim()
      if (slice) snippets[currentName] = slice
    }
    currentName = null
    start = -1
  }

  const exportRegex = /^export\s+const\s+([A-Za-z0-9_]+)\s*(?::[^=]*)?=/

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const match = line.match(exportRegex)
    if (match) {
      flush(i)
      currentName = match[1]
      start = i
    }
  }

  flush(lines.length)
  return snippets
}

/** 提取大括号内的内容，处理嵌套和字符串 */
function extractBraceContent(code: string, startIdx: number): string {
  let depth = 0
  let start = -1
  let i = startIdx

  while (i < code.length) {
    const char = code[i]

    // 跳过字符串
    if (char === '"' || char === "'" || char === "`") {
      const quote = char
      i++
      while (i < code.length) {
        if (code[i] === "\\") {
          i += 2 // 跳过转义字符
          continue
        }
        if (code[i] === quote) {
          // 模板字符串中的 ${} 不需要特殊处理，因为我们只计算外层大括号
          break
        }
        i++
      }
      i++
      continue
    }

    // 跳过单行注释
    if (char === "/" && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++
      continue
    }

    // 跳过多行注释
    if (char === "/" && code[i + 1] === "*") {
      i += 2
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++
      i += 2
      continue
    }

    if (char === "{") {
      if (depth === 0) start = i + 1
      depth++
    } else if (char === "}") {
      depth--
      if (depth === 0 && start !== -1) {
        return code.slice(start, i)
      }
    }

    i++
  }
  return ""
}

/** 提取括号内的内容，处理嵌套括号 */
function extractParenContent(code: string, startIdx: number): string {
  let depth = 0
  let start = -1

  for (let i = startIdx; i < code.length; i++) {
    if (code[i] === "(") {
      if (depth === 0) start = i + 1
      depth++
    } else if (code[i] === ")") {
      depth--
      if (depth === 0 && start !== -1) {
        return code.slice(start, i)
      }
    }
  }
  return ""
}

/** 格式化代码缩进 */
function formatIndent(code: string, baseIndent: string): string {
  const lines = code.split("\n")
  const nonEmptyLines = lines.filter((line) => line.trim())
  if (nonEmptyLines.length === 0) return ""

  const minIndent = Math.min(...nonEmptyLines.map((line) => line.match(/^(\s*)/)?.[1].length ?? 0))

  return lines
    .map((line) => {
      if (!line.trim()) return ""
      const lineIndent = line.match(/^(\s*)/)?.[1].length ?? 0
      const relativeIndent = lineIndent - minIndent
      return baseIndent + " ".repeat(relativeIndent) + line.trim()
    })
    .join("\n")
}

/** 检测代码中使用的 React hooks */
function detectReactHooks(code: string): string[] {
  const hooks = [
    "useState",
    "useEffect",
    "useCallback",
    "useMemo",
    "useRef",
    "useContext",
    "useReducer",
    "useLayoutEffect",
    "useImperativeHandle",
    "useDebugValue",
    "useDeferredValue",
    "useTransition",
    "useId",
  ]
  return hooks.filter((hook) => new RegExp(`\\b${hook}\\s*[(<]`).test(code))
}

/** 生成导入语句 */
function generateImports(packageName: string, componentExports: string[], code: string): string {
  const imports: string[] = []

  // 组件导入
  const usedExports = componentExports.filter((exportName) => {
    const pattern = new RegExp(`\\b${exportName}\\b`)
    return pattern.test(code)
  })
  const finalExports = usedExports.length > 0 ? usedExports : componentExports.slice(0, 1)
  imports.push(`import { ${finalExports.join(", ")} } from "${packageName}"`)

  // React hooks 导入
  const usedHooks = detectReactHooks(code)
  if (usedHooks.length > 0) {
    imports.push(`import { ${usedHooks.join(", ")} } from "react"`)
  }

  return imports.join("\n")
}

/** 从 story 代码片段中提取 render 函数内容，转换为示例格式 */
export function formatStoryAsExample(
  storySnippet: string | undefined,
  packageName: string,
  exports: string[],
): string {
  if (!storySnippet) return ""

  const renderIdx = storySnippet.indexOf("render")
  if (renderIdx === -1) return ""

  const afterRender = storySnippet.slice(renderIdx)

  let functionBody = ""
  let jsxOnly = ""

  // 1. 命名函数形式: render: function Name() { ... }
  const namedFuncMatch = afterRender.match(/render:\s*function\s+\w+\s*\([^)]*\)\s*\{/)
  if (namedFuncMatch) {
    const braceStart = renderIdx + namedFuncMatch.index! + namedFuncMatch[0].length - 1
    functionBody = extractBraceContent(storySnippet, braceStart)
  }

  // 2. 箭头函数带大括号: render: () => { ... }
  if (!functionBody) {
    const arrowBraceMatch = afterRender.match(/render:\s*\([^)]*\)\s*=>\s*\{/)
    if (arrowBraceMatch) {
      const braceStart = renderIdx + arrowBraceMatch.index! + arrowBraceMatch[0].length - 1
      functionBody = extractBraceContent(storySnippet, braceStart)
    }
  }

  // 3. 箭头函数带括号直接返回: render: () => ( ... )
  if (!functionBody) {
    const arrowParenMatch = afterRender.match(/render:\s*\([^)]*\)\s*=>\s*\(/)
    if (arrowParenMatch) {
      const parenStart = renderIdx + arrowParenMatch.index! + arrowParenMatch[0].length - 1
      jsxOnly = extractParenContent(storySnippet, parenStart)
    }
  }

  // 4. 箭头函数直接返回 JSX: render: () => <...>
  if (!functionBody && !jsxOnly) {
    const arrowJsxMatch = afterRender.match(/render:\s*\([^)]*\)\s*=>\s*(<[\s\S]+)/m)
    if (arrowJsxMatch) {
      const content = arrowJsxMatch[1]
      const endMatch = content.match(/([\s\S]*?>)\s*,?\s*\n?\s*\}/)
      if (endMatch) {
        jsxOnly = endMatch[1].trim()
      }
    }
  }

  const componentExports = exports.filter((e) => !e.startsWith("type "))

  // 如果只有 JSX，生成简单的返回
  if (jsxOnly && !functionBody) {
    const formattedJsx = formatIndent(jsxOnly, "    ")
    const importStatement = generateImports(packageName, componentExports, jsxOnly)

    return `${importStatement}

export default function App() {
  return (
${formattedJsx}
  );
}`
  }

  if (!functionBody) return ""

  // 生成导入语句
  const importStatement = generateImports(packageName, componentExports, functionBody)

  // 格式化函数体
  const formattedBody = formatIndent(functionBody, "  ")

  return `${importStatement}

export default function App() {
${formattedBody}
}`
}
