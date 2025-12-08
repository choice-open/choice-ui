import fs from "node:fs"
import path from "node:path"
import { loadCsf } from "@storybook/csf-tools"
import type { Parameters } from "@storybook/types"
import {
  readComponentDoc,
  readComponentExports,
  readComponentPackageJson,
  readComponentProps,
  resolveComponentFromStoryPath,
  resolveSlug,
} from "./component"
import {
  coreComponentsDir,
  outputComponentsDir,
  outputDir,
  storyExt,
  storybookStoriesDir,
  workspaceRoot,
} from "./constants"
import {
  extractDescription,
  extractStoryDescription,
  extractStoryDocblocks,
  extractStorySnippets,
  formatStoryAsExample,
} from "./extraction"
import { generateOutputs, generateSingleOutput } from "./output"
import type {
  ComponentDetail,
  DocsData,
  IndexItem,
  MetaLike,
  PackageInfo,
  StoryItem,
  StoryLike,
} from "./types"
import { ensureDir, readFile, toExportName, walkStories } from "./utils"

function collectDocFromStory(storyPath: string): { index: IndexItem; detail: ComponentDetail } {
  const code = readFile(storyPath)
  const storyDocblocks = extractStoryDocblocks(code)
  const storySnippets = extractStorySnippets(code)
  const componentInfo = resolveComponentFromStoryPath(storyPath)
  const componentDoc = componentInfo ? readComponentDoc(componentInfo.path) : ""
  const packageInfo = readComponentPackageJson(storyPath)
  const componentExports = readComponentExports(storyPath)

  const csf = loadCsf(code, {
    fileName: storyPath,
    makeTitle: (userTitle?: string) => userTitle ?? "Component",
  })
  csf.parse()

  const meta = (csf.meta ?? {}) as MetaLike
  const metaDescription =
    extractDescription((meta as { parameters?: Parameters }).parameters) || componentDoc

  const componentName =
    (typeof meta.component === "function" && (meta.component as { name?: string }).name) ||
    (typeof meta.component === "object" &&
    meta.component !== null &&
    "displayName" in meta.component
      ? String((meta.component as { displayName?: string }).displayName ?? "")
      : "") ||
    componentInfo?.name ||
    "Component"

  const slug = resolveSlug(meta.title, storyPath)
  const title = meta.title?.split("/").pop() ?? componentName
  const props = componentInfo ? readComponentProps(componentInfo.path) : []

  const stories: StoryItem[] = (csf.stories as StoryLike[])
    .map((story) => {
      const parameters = (story.parameters ?? {}) as Parameters
      const storyName = story.name ?? story.id
      const exportName = story.exportName ?? toExportName(story.id)
      const description =
        extractStoryDescription(parameters) ||
        storyDocblocks[exportName] ||
        storyDocblocks[storyName] ||
        ""
      const rawSnippet = storySnippets[exportName] ?? storySnippets[storyName]

      return {
        id: story.id,
        name: storyName,
        exportName,
        description,
        source: formatStoryAsExample(
          rawSnippet,
          packageInfo?.name ?? `@choice-ui/${slug.split("/").pop() ?? "unknown"}`,
          componentExports,
        ),
      }
    })
    .filter((story) => !story.description.startsWith("[TEST]"))

  const defaultPackage: PackageInfo = {
    name: `@choice-ui/${slug.split("/").pop() ?? "unknown"}`,
    version: "0.0.0",
    description: metaDescription,
    dependencies: {},
  }

  const tags = meta.tags?.filter((tag) => tag !== "autodocs") ?? []

  const index: IndexItem = {
    slug,
    name: packageInfo?.name ?? defaultPackage.name,
    title,
    description: metaDescription,
    version: packageInfo?.version ?? "0.0.0",
    tags: tags.length > 0 ? tags : undefined,
  }

  const detail: ComponentDetail = {
    slug,
    title,
    package: packageInfo ?? defaultPackage,
    exports: componentExports.length > 0 ? componentExports : [componentName],
    props,
    stories,
    tags: tags.length > 0 ? tags : undefined,
  }

  return { index, detail }
}

export function buildAll(): DocsData {
  ensureDir(outputDir)
  ensureDir(outputComponentsDir)

  const storyFiles = walkStories(storybookStoriesDir)
  const data: DocsData = {}

  for (const storyPath of storyFiles) {
    try {
      const { index, detail } = collectDocFromStory(storyPath)
      data[detail.slug] = { index, detail }
    } catch (err) {
      console.error(`  ❌ Error processing ${path.relative(workspaceRoot, storyPath)}:`, err)
    }
  }

  generateOutputs(data)
  return data
}

export function rebuildFile(storyPath: string, data: DocsData): boolean {
  try {
    const { index, detail } = collectDocFromStory(storyPath)
    data[detail.slug] = { index, detail }
    // 只更新对应组件的 JSON 文件
    generateSingleOutput(detail)
    return true
  } catch (err) {
    console.error(`  ❌ Error processing ${path.relative(workspaceRoot, storyPath)}:`, err)
    return false
  }
}

export function findStoryForComponent(componentPath: string): string | null {
  const relativePath = path.relative(coreComponentsDir, componentPath)
  const parts = relativePath.split(path.sep)
  if (parts.length < 1) return null

  const componentFolder = parts[0]
  const storyDir = path.join(storybookStoriesDir, componentFolder)
  if (!fs.existsSync(storyDir)) return null

  const entries = fs.readdirSync(storyDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(storyExt)) {
      return path.join(storyDir, entry.name)
    }
  }

  return null
}

export function handleFileDelete(storyPath: string, data: DocsData) {
  const { detail } = collectDocFromStory(storyPath)
  const fileName = detail.slug.replace(/\//g, "-") + ".json"
  const filePath = path.join(outputComponentsDir, fileName)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  delete data[detail.slug]
  generateOutputs(data)
  console.log(`  🗑️  Removed ${path.relative(workspaceRoot, storyPath)}`)
}
