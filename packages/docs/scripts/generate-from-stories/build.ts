import fs from "node:fs"
import path from "node:path"
import { loadCsf } from "@storybook/csf-tools"
import type { Parameters } from "@storybook/types"
import { computeFileHash, getCacheKey, loadCache, saveCache } from "./cache"
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
  outputIndex,
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
import { generateOutputs } from "./output"
import type {
  CacheData,
  CacheEntry,
  ComponentDetail,
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

  const stories: StoryItem[] = (csf.stories as StoryLike[]).map((story) => {
    const parameters = (story.parameters ?? {}) as Parameters
    const storyName = story.name ?? story.id
    const description = extractStoryDescription(parameters) || storyDocblocks[storyName] || ""
    const exportName = story.exportName ?? toExportName(story.id)
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

  const defaultPackage: PackageInfo = {
    name: `@choice-ui/${slug.split("/").pop() ?? "unknown"}`,
    version: "0.0.0",
    description: metaDescription,
    dependencies: {},
  }

  const index: IndexItem = {
    slug,
    name: packageInfo?.name ?? defaultPackage.name,
    title,
    description: metaDescription,
    version: packageInfo?.version ?? "0.0.0",
  }

  const detail: ComponentDetail = {
    slug,
    title,
    package: packageInfo ?? defaultPackage,
    exports: componentExports.length > 0 ? componentExports : [componentName],
    props,
    stories,
  }

  return { index, detail }
}

/** 计算 story 及其关联组件文件的组合 hash */
function computeCombinedHash(storyPath: string): string {
  const hashes: string[] = [computeFileHash(storyPath)]

  // 获取关联的组件目录
  const relativePath = path.relative(storybookStoriesDir, storyPath)
  const parts = relativePath.split(path.sep)
  if (parts.length >= 1) {
    const componentFolder = parts[0]
    const componentSrcDir = path.join(coreComponentsDir, componentFolder, "src")

    // 添加组件源文件的 hash
    if (fs.existsSync(componentSrcDir)) {
      const componentFiles = fs.readdirSync(componentSrcDir, { withFileTypes: true })
      for (const file of componentFiles) {
        if (file.isFile() && (file.name.endsWith(".ts") || file.name.endsWith(".tsx"))) {
          const filePath = path.join(componentSrcDir, file.name)
          hashes.push(computeFileHash(filePath))
        }
      }
    }

    // 添加 package.json 的 hash
    const packageJsonPath = path.join(coreComponentsDir, componentFolder, "package.json")
    if (fs.existsSync(packageJsonPath)) {
      hashes.push(computeFileHash(packageJsonPath))
    }
  }

  // 组合所有 hash
  return hashes.sort().join("-")
}

function processFile(storyPath: string, cache: CacheData): { updated: boolean; entry: CacheEntry } {
  const cacheKey = getCacheKey(storyPath)
  const currentHash = computeCombinedHash(storyPath)
  const cached = cache.entries[cacheKey]

  if (cached && cached.hash === currentHash) {
    return { updated: false, entry: cached }
  }

  const { index, detail } = collectDocFromStory(storyPath)
  const entry: CacheEntry = { hash: currentHash, index, detail }
  cache.entries[cacheKey] = entry
  return { updated: true, entry }
}

function removeDeletedFiles(storyFiles: string[], cache: CacheData): boolean {
  const currentKeys = new Set(storyFiles.map(getCacheKey))
  const cachedKeys = Object.keys(cache.entries)
  let changed = false

  for (const key of cachedKeys) {
    if (!currentKeys.has(key)) {
      const entry = cache.entries[key]
      if (entry) {
        const fileName = entry.detail.slug.replace(/\//g, "-") + ".json"
        const filePath = path.join(outputComponentsDir, fileName)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
      delete cache.entries[key]
      changed = true
    }
  }

  return changed
}

export function buildAll(isWatch = false): CacheData {
  ensureDir(outputDir)
  ensureDir(outputComponentsDir)

  const cache = loadCache()
  const storyFiles = walkStories(storybookStoriesDir)

  let updatedCount = 0

  for (const storyPath of storyFiles) {
    try {
      const result = processFile(storyPath, cache)
      if (result.updated) {
        updatedCount++
        if (isWatch) {
          console.log(`  📝 ${path.relative(workspaceRoot, storyPath)}`)
        }
      }
    } catch (err) {
      console.error(`  ❌ Error processing ${path.relative(workspaceRoot, storyPath)}:`, err)
    }
  }

  const hasDeleted = removeDeletedFiles(storyFiles, cache)
  const outputExists = fs.existsSync(outputIndex)

  if (updatedCount > 0 || hasDeleted || !outputExists) {
    generateOutputs(cache)
    saveCache(cache)
  }

  return cache
}

export function processSingleFile(storyPath: string, cache: CacheData, force = false): boolean {
  try {
    // 强制更新时，先删除缓存
    if (force) {
      const cacheKey = getCacheKey(storyPath)
      delete cache.entries[cacheKey]
    }

    const result = processFile(storyPath, cache)
    if (result.updated || force) {
      generateOutputs(cache)
      saveCache(cache)
      return true
    }
  } catch (err) {
    console.error(`  ❌ Error processing ${path.relative(workspaceRoot, storyPath)}:`, err)
  }
  return false
}

/** 根据组件文件路径找到对应的 story 文件 */
export function findStoryForComponent(componentPath: string): string | null {
  // 从组件路径提取组件文件夹名
  // 例如: /packages/core/app/components/button/src/button.tsx -> button
  const relativePath = path.relative(coreComponentsDir, componentPath)
  const parts = relativePath.split(path.sep)
  if (parts.length < 1) return null

  const componentFolder = parts[0]

  // 查找对应的 story 文件
  const storyDir = path.join(storybookStoriesDir, componentFolder)
  if (!fs.existsSync(storyDir)) return null

  // 查找 story 文件
  const entries = fs.readdirSync(storyDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(storyExt)) {
      return path.join(storyDir, entry.name)
    }
  }

  return null
}

export function handleFileDelete(storyPath: string, cache: CacheData) {
  const cacheKey = getCacheKey(storyPath)
  const entry = cache.entries[cacheKey]
  if (entry) {
    const fileName = entry.detail.slug.replace(/\//g, "-") + ".json"
    const filePath = path.join(outputComponentsDir, fileName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    delete cache.entries[cacheKey]
    generateOutputs(cache)
    saveCache(cache)
    console.log(`  🗑️  Removed ${path.relative(workspaceRoot, storyPath)}`)
  }
}
