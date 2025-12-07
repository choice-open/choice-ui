import fs from "node:fs"
import path from "node:path"
import { coreComponentsDir, storyExt, storybookStoriesDir, workspaceRoot } from "./constants"
import { buildAll, handleFileDelete, processSingleFile, findStoryForComponent } from "./build"
import type { CacheData } from "./types"

/** 递归获取目录下所有文件 */
function getAllFiles(dir: string, ext?: string): string[] {
  const files: string[] = []
  if (!fs.existsSync(dir)) return files

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext))
    } else if (!ext || entry.name.endsWith(ext)) {
      files.push(fullPath)
    }
  }
  return files
}

/** 监听目录变化 */
function watchDirectory(
  dir: string,
  filter: (file: string) => boolean,
  onChange: (file: string) => void,
) {
  const watchers: fs.FSWatcher[] = []

  function watchDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) return

    try {
      const watcher = fs.watch(dirPath, { persistent: true }, (eventType, filename) => {
        if (!filename) return
        const fullPath = path.join(dirPath, filename)

        if (eventType === "change" && filter(fullPath)) {
          onChange(fullPath)
        }

        // 如果是新目录，添加监听
        if (eventType === "rename" && fs.existsSync(fullPath)) {
          try {
            const stat = fs.statSync(fullPath)
            if (stat.isDirectory()) {
              watchDir(fullPath)
            }
          } catch {
            // 文件可能已被删除
          }
        }
      })
      watchers.push(watcher)
    } catch (err) {
      console.error(`   ❌ Failed to watch ${dirPath}:`, err)
    }

    // 递归监听子目录
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isDirectory()) {
          watchDir(path.join(dirPath, entry.name))
        }
      }
    } catch {
      // ignore
    }
  }

  watchDir(dir)
  return () => watchers.forEach((w) => w.close())
}

export async function startWatch() {
  console.log("🔍 Building initial docs...")
  const startTime = Date.now()
  const cache = buildAll(false)
  const docCount = Object.keys(cache.entries).length
  console.log(`✅ Generated docs for ${docCount} components (${Date.now() - startTime}ms)`)
  console.log("👀 Watching for changes...")
  console.log(`   📂 Story path: ${storybookStoriesDir}`)
  console.log(`   📂 Component path: ${coreComponentsDir}\n`)

  // 防抖：记录最近处理的文件
  const recentlyProcessed = new Map<string, number>()
  const DEBOUNCE_MS = 300

  function shouldProcess(file: string): boolean {
    const now = Date.now()
    const lastProcessed = recentlyProcessed.get(file) ?? 0
    if (now - lastProcessed < DEBOUNCE_MS) return false
    recentlyProcessed.set(file, now)
    return true
  }

  // 监听 story 文件
  const closeStoryWatcher = watchDirectory(
    storybookStoriesDir,
    (file) => file.endsWith(storyExt),
    (file) => {
      if (!shouldProcess(file)) return
      console.log(`📝 Story changed: ${path.relative(workspaceRoot, file)}`)
      const updated = processSingleFile(file, cache)
      console.log(`   ${updated ? "✅ Updated" : "⏭️ No changes"}\n`)
    },
  )
  console.log("   📚 Story watcher ready")

  // 监听组件文件
  const closeComponentWatcher = watchDirectory(
    coreComponentsDir,
    (file) => file.includes("/src/") && (file.endsWith(".ts") || file.endsWith(".tsx")),
    (file) => {
      if (!shouldProcess(file)) return
      console.log(`📦 Component changed: ${path.relative(workspaceRoot, file)}`)
      const storyPath = findStoryForComponent(file)
      if (storyPath) {
        console.log(`   → Rebuilding: ${path.relative(workspaceRoot, storyPath)}`)
        const updated = processSingleFile(storyPath, cache, true)
        console.log(`   ${updated ? "✅ Updated" : "⏭️ No changes"}\n`)
      } else {
        console.log(`   ⚠️ No story found\n`)
      }
    },
  )
  console.log("   📦 Component watcher ready\n")

  // 保持进程运行
  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("\n👋 Stopping watcher...")
      closeStoryWatcher()
      closeComponentWatcher()
      resolve()
    })
  })
}
