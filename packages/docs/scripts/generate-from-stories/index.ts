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
    const data = buildAll()
    const docCount = Object.keys(data).length
    console.log(
      `✅ Generated docs for ${docCount} components -> ${path.relative(workspaceRoot, outputDir)} (${Date.now() - startTime}ms)`,
    )
  }
}

run().catch(console.error)
