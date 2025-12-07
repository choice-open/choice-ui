import path from "node:path"
import { outputDir, workspaceRoot } from "./constants"
import { buildAll } from "./build"
import { startWatch } from "./watch"

export { buildAll } from "./build"
export { startWatch } from "./watch"

export async function run() {
  const args = process.argv.slice(2)
  const isWatch = args.includes("--watch") || args.includes("-w")

  if (isWatch) {
    await startWatch()
  } else {
    const startTime = Date.now()
    const cache = buildAll(false)
    const docCount = Object.keys(cache.entries).length
    console.log(
      `✅ Generated docs for ${docCount} components -> ${path.relative(workspaceRoot, outputDir)} (${Date.now() - startTime}ms)`,
    )
  }
}

// 直接运行时执行
run().catch(console.error)
