import fs from "node:fs"
import path from "node:path"
import { coreComponentsDir, storyExt, storybookStoriesDir, workspaceRoot } from "./constants"
import { buildAll, rebuildFile, findStoryForComponent } from "./build"
import type { DocsData } from "./types"

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

        if ((eventType === "change" || eventType === "rename") && filter(fullPath)) {
          if (fs.existsSync(fullPath)) {
            onChange(fullPath)
          }
        }

        if (eventType === "rename" && fs.existsSync(fullPath)) {
          try {
            const stat = fs.statSync(fullPath)
            if (stat.isDirectory()) {
              watchDir(fullPath)
            }
          } catch {
            // ignore
          }
        }
      })
      watchers.push(watcher)
    } catch (err) {
      console.error(`   ❌ Failed to watch ${dirPath}:`, err)
    }

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
  const data = buildAll()
  const docCount = Object.keys(data).length
  console.log(`✅ Generated docs for ${docCount} components (${Date.now() - startTime}ms)`)
  console.log("👀 Watching for changes...")
  console.log(`   📂 Story path: ${storybookStoriesDir}`)
  console.log(`   📂 Component path: ${coreComponentsDir}\n`)

  const pending = new Map<string, NodeJS.Timeout>()
  const DEBOUNCE_MS = 100

  function scheduleRebuild(file: string, data: DocsData) {
    const existing = pending.get(file)
    if (existing) clearTimeout(existing)

    pending.set(
      file,
      setTimeout(() => {
        pending.delete(file)
        console.log(`📝 Rebuilding: ${path.relative(workspaceRoot, file)}`)
        const ok = rebuildFile(file, data)
        console.log(`   ${ok ? "✅ Done" : "❌ Failed"}\n`)
      }, DEBOUNCE_MS),
    )
  }

  const closeStoryWatcher = watchDirectory(
    storybookStoriesDir,
    (file) => file.endsWith(storyExt),
    (file) => scheduleRebuild(file, data),
  )
  console.log("   📚 Story watcher ready")

  const closeComponentWatcher = watchDirectory(
    coreComponentsDir,
    (file) => file.includes("/src/") && (file.endsWith(".ts") || file.endsWith(".tsx")),
    (file) => {
      const storyPath = findStoryForComponent(file)
      if (storyPath) {
        scheduleRebuild(storyPath, data)
      }
    },
  )
  console.log("   📦 Component watcher ready\n")

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("\n👋 Stopping watcher...")
      closeStoryWatcher()
      closeComponentWatcher()
      resolve()
    })
  })
}
