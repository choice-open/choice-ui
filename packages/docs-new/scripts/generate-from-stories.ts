"use strict"

import fs from "node:fs"
import path from "node:path"
import { loadCsf } from "@storybook/csf-tools"
import type { ArgTypes, Parameters } from "@storybook/types"
import { withCustomConfig } from "react-docgen-typescript"
import ts from "typescript"

interface ArgTypeSummary {
  name: string
  description: string
  type: string
  defaultValue?: string
}

interface GeneratedStory {
  id: string
  name: string
  exportName: string
  description: string
  args: Record<string, unknown>
  argTypes: Record<string, ArgTypeSummary>
  tags: string[]
  source?: string
}

interface PropDoc {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description: string
}

interface PropDocGroup {
  displayName: string
  description: string
  props: PropDoc[]
}

interface GeneratedDoc {
  title: string
  componentName: string
  description: string
  stories: GeneratedStory[]
  metaArgTypes: Record<string, ArgTypeSummary>
  sourceFile: string
  slug: string[]
  groups: string[]
  props?: PropDocGroup[]
}

interface ComponentImportInfo {
  componentName: string
  componentPath: string
}

const workspaceRoot = path.resolve(__dirname, "../../..")
const coreComponentsDir = path.resolve(workspaceRoot, "packages/core/app/components")
const outputDir = path.resolve(__dirname, "../generated")
const outputJson = path.join(outputDir, "components.json")
const outputRegistry = path.join(outputDir, "registry.ts")

const storyExt = ".stories.tsx"
const coreTsconfig = path.resolve(workspaceRoot, "packages/core/tsconfig.json")
const docgenParser = withCustomConfig(coreTsconfig, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  propFilter: (prop) => {
    if (prop.parent) {
      return !prop.parent.fileName.includes("node_modules")
    }
    return true
  },
})

function toExportName(storyId: string): string {
  const [, storySlug] = storyId.split("--")
  if (!storySlug) {
    return ""
  }

  return storySlug
    .split("-")
    .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1) : ""))
    .join("")
}

function ensureOutputDir() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
}

function walkStories(dir: string): string[] {
  const result: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      result.push(...walkStories(full))
    } else if (entry.isFile() && entry.name.endsWith(storyExt)) {
      result.push(full)
    }
  }

  return result
}

function readFile(filePath: string) {
  return fs.readFileSync(filePath, "utf8")
}

function isFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

function extractDescription(parameters?: Parameters): string {
  const componentDescription =
    parameters?.docs?.description &&
    typeof parameters.docs.description === "object" &&
    "component" in parameters.docs.description
      ? String(parameters.docs.description.component)
      : undefined

  if (componentDescription) {
    return componentDescription
  }

  const docDescription =
    parameters?.docs?.description && typeof parameters.docs.description === "string"
      ? parameters.docs.description
      : undefined

  if (docDescription) {
    return docDescription
  }

  return ""
}

function extractStoryDescription(parameters?: Parameters): string {
  if (!parameters?.docs?.description) {
    return ""
  }

  const { description } = parameters.docs

  if (typeof description === "object" && "story" in description && description.story) {
    return String(description.story)
  }

  if (typeof description === "string") {
    return description
  }

  return ""
}

function extractStoryDocblocks(sourceCode: string): Record<string, string> {
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
          if (!comment) {
            return ""
          }
          if (typeof comment === "string") {
            return comment
          }
          if (Array.isArray(comment)) {
            return comment
              .map((chunk) => {
                if (typeof chunk === "string") {
                  return chunk
                }
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

function extractStorySnippets(sourceCode: string): Record<string, string> {
  const snippets: Record<string, string> = {}
  const lines = sourceCode.split("\n")
  let currentName: string | null = null
  let start = -1

  const flush = (end: number) => {
    if (currentName && start >= 0) {
      const slice = lines.slice(start, end).join("\n").trim()
      if (slice) {
        snippets[currentName] = slice
      }
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

function resolveComponentImport(
  storyPath: string,
  storySource: string,
): ComponentImportInfo | null {
  const storyDir = path.dirname(storyPath)
  const sourceFile = ts.createSourceFile(
    "story.tsx",
    storySource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  const findExistingPath = (modulePath: string): string | null => {
    const resolvedBase = path.resolve(storyDir, modulePath)
    const candidates = [
      resolvedBase,
      `${resolvedBase}.tsx`,
      `${resolvedBase}.ts`,
      path.join(resolvedBase, "index.tsx"),
      path.join(resolvedBase, "index.ts"),
    ]
    const existing = candidates.find((candidate) => isFile(candidate))
    return existing ?? null
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue
    }
    if (!ts.isStringLiteralLike(statement.moduleSpecifier)) {
      continue
    }
    const modulePath = statement.moduleSpecifier.text
    if (!modulePath.startsWith(".")) {
      continue
    }
    const importClause = statement.importClause
    const namedBindings = importClause?.namedBindings
    if (namedBindings && ts.isNamedImports(namedBindings)) {
      const firstElement = namedBindings.elements[0]
      if (firstElement) {
        const resolvedPath = findExistingPath(modulePath)
        if (resolvedPath) {
          return { componentName: firstElement.name.text, componentPath: resolvedPath }
        }
      }
    }
    const defaultImport = importClause?.name?.text
    if (defaultImport) {
      const resolvedPath = findExistingPath(modulePath)
      if (resolvedPath) {
        return { componentName: defaultImport, componentPath: resolvedPath }
      }
    }
  }

  return null
}

function readComponentDoc(componentPath: string): string {
  if (!componentPath || !isFile(componentPath)) {
    return ""
  }
  const content = readFile(componentPath)
  const docMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
  if (!docMatch) {
    return ""
  }
  const cleaned = docMatch[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter((line) => line.length > 0)
  // 仅取首行作为组件描述
  return cleaned[0] ?? ""
}

function readComponentProps(componentPath: string): PropDocGroup[] {
  try {
    if (!isFile(componentPath)) return []
    const docs = docgenParser.parse(componentPath)
    if (!docs.length) return []
    return docs.map((doc) => {
      const props = doc.props ?? {}
      const propList: PropDoc[] = Object.entries(props).map(([name, prop]) => ({
        name,
        type: prop.type?.name ?? "",
        required: prop.required ?? false,
        defaultValue: prop.defaultValue?.value ?? undefined,
        description: prop.description ?? "",
      }))
      return {
        displayName: doc.displayName ?? "",
        description: doc.description ?? "",
        props: propList,
      }
    })
  } catch {
    return []
  }
}

function toArgTypeSummary(argTypes?: ArgTypes): Record<string, ArgTypeSummary> {
  if (!argTypes) {
    return {}
  }

  const summaries: Record<string, ArgTypeSummary> = {}
  for (const [name, config] of Object.entries(argTypes)) {
    if (!config) {
      continue
    }

    const description = config.description ?? ""
    const type =
      (config.table && config.table.type && config.table.type.summary) ||
      (typeof config.type === "object" && config.type && "name" in config.type
        ? String(config.type.name)
        : "")
    const defaultValue =
      (config.table && config.table.defaultValue && config.table.defaultValue.summary) || undefined

    summaries[name] = {
      name,
      description,
      type,
      defaultValue,
    }
  }

  return summaries
}

type MetaLike = {
  argTypes?: ArgTypes
  parameters?: Parameters
  component?: unknown
  title?: string
  tags?: string[]
}

type StoryLike = {
  id: string
  name?: string
  parameters?: Parameters
  exportName?: string
}

function slugifyPart(part: string): string {
  return part
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function resolveSlug(title?: string, storyPath?: string): string[] {
  if (title) {
    return title.split("/").map(slugifyPart).filter(Boolean)
  }

  if (storyPath) {
    const parts = storyPath.split(path.sep)
    const idx = parts.lastIndexOf("components")
    if (idx >= 0 && idx + 1 < parts.length) {
      const relParts = parts
        .slice(idx + 1)
        .filter((part) => part !== "stories" && part !== "src")
      if (!relParts.length) {
        return []
      }
      const last = relParts[relParts.length - 1].replace(storyExt, "")
      return relParts
        .slice(0, relParts.length - 1)
        .concat(last)
        .map(slugifyPart)
        .filter((part, index, arr) => part.length > 0 && arr.indexOf(part) === index)
    }
  }

  return []
}

function collectDocFromStory(storyPath: string): GeneratedDoc {
  const code = readFile(storyPath)
  const storyDocblocks = extractStoryDocblocks(code)
  const storySnippets = extractStorySnippets(code)
  const componentImport = resolveComponentImport(storyPath, code)
  const componentDoc = componentImport ? readComponentDoc(componentImport.componentPath) : ""
  const csf = loadCsf(code, {
    fileName: storyPath,
    makeTitle: (userTitle?: string) => userTitle ?? "Component",
  })
  csf.parse()

  const meta = (csf.meta ?? {}) as MetaLike
  const metaArgTypes = toArgTypeSummary((meta as { argTypes?: ArgTypes }).argTypes)
  const metaDescription =
    extractDescription((meta as { parameters?: Parameters }).parameters) || componentDoc
  const componentPathForProps = componentImport?.componentPath ?? null
  const propDocs = componentPathForProps ? readComponentProps(componentPathForProps) : []
  const componentName =
    (typeof meta.component === "function" && (meta.component as { name?: string }).name) ||
    (typeof meta.component === "object" &&
    meta.component !== null &&
    "displayName" in meta.component
      ? String((meta.component as { displayName?: string }).displayName ?? "")
      : "") ||
    (componentImport?.componentName ?? "") ||
    "Component"

  const stories: GeneratedStory[] = (csf.stories as StoryLike[]).map((story) => {
    const parameters = (story.parameters ?? {}) as Parameters
    const storyName = story.name ?? story.id
    const description = extractStoryDescription(parameters) || storyDocblocks[storyName] || ""
    const exportName = story.exportName ?? toExportName(story.id)

    const argTypes = toArgTypeSummary({
      ...(meta.argTypes ?? {}),
      ...(parameters.argTypes ?? {}),
    })

    return {
      id: story.id,
      name: storyName,
      exportName,
      description,
      args: (parameters.args as Record<string, unknown>) ?? {},
      argTypes,
      tags: (parameters.tags as string[] | undefined) ?? meta.tags ?? [],
      source: storySnippets[exportName] ?? storySnippets[storyName],
    }
  })

  return {
    title: meta.title ?? componentName,
    componentName,
    description: metaDescription,
    stories,
    metaArgTypes,
    sourceFile: path.relative(workspaceRoot, storyPath),
    slug: resolveSlug(meta.title, storyPath),
    groups: (meta.title ?? componentName)
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean),
    props: propDocs,
  }
}

function main() {
  ensureOutputDir()
  const storyFiles = walkStories(coreComponentsDir)
  const docs = storyFiles.map((filePath) => collectDocFromStory(filePath))

  docs.sort((a, b) => a.title.localeCompare(b.title))

  fs.writeFileSync(outputJson, JSON.stringify(docs, null, 2), "utf8")

  const registryEntries = docs
    .map((doc, idx) => {
      const importVar = `StoryModule${idx}`
      const importPath = path
        .relative(path.dirname(outputRegistry), path.resolve(workspaceRoot, doc.sourceFile))
        .replace(/\\/g, "/")
        .replace(/\.tsx?$/, "")
      const slugKey = doc.slug.join("/")
      return { importVar, importPath, slugKey }
    })
    .map(
      ({ importVar, importPath }) =>
        `import * as ${importVar} from "${importPath.startsWith(".") ? importPath : `./${importPath}`}"`,
    )
    .join("\n")

  const registryMap = docs
    .map((doc, idx) => {
      const slugKey = doc.slug.join("/")
      return `  "${slugKey}": StoryModule${idx},`
    })
    .join("\n")

  const registryContent = `${registryEntries}

export const storyRegistry: Record<string, Record<string, unknown>> = {
${registryMap}
}
`

  fs.writeFileSync(outputRegistry, registryContent, "utf8")

  // eslint-disable-next-line no-console
  console.log(
    `✅ Generated docs for ${docs.length} components -> ${path.relative(
      workspaceRoot,
      outputJson,
    )} and registry.ts`,
  )
}

main()
