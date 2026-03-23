import fs from "node:fs"
import path from "node:path"
import { outputComponentsDir, outputIndex, outputRegistry } from "./constants"
import type { ComponentDetail, DocsData } from "./types"

/** 只更新单个组件的 JSON 文件 */
export function generateSingleOutput(detail: ComponentDetail) {
  const fileName = detail.slug.replace(/\//g, "-") + ".json"
  const filePath = path.join(outputComponentsDir, fileName)
  fs.writeFileSync(filePath, JSON.stringify(detail, null, 2), "utf8")
}

/** 生成所有输出文件 */
export function generateOutputs(data: DocsData) {
  const entries = Object.entries(data)

  // 生成索引文件
  const indexItems = entries
    .map(([, { index }]) => index)
    .sort((a, b) => a.title.localeCompare(b.title))
  fs.writeFileSync(outputIndex, JSON.stringify({ components: indexItems }, null, 2), "utf8")

  // 生成每个组件的详情文件
  for (const [, { detail }] of entries) {
    generateSingleOutput(detail)
  }

  // 生成组件详情映射 TypeScript 文件
  const componentImports = entries
    .map(([, { detail }], idx) => {
      const fileName = detail.slug.replace(/\//g, "-") + ".json"
      const importVar = `ComponentDetail${idx}`
      return `import ${importVar} from "./${fileName}"`
    })
    .join("\n")

  const componentMap = entries
    .map(([, { detail }], idx) => {
      const importVar = `ComponentDetail${idx}`
      return `  "${detail.slug}": ${importVar} as ComponentDetail,`
    })
    .join("\n")

  const componentsDetailsContent = `import type { ComponentDetail } from "../../scripts/generate-from-stories/types"

${componentImports}

export const componentsDetails = {
${componentMap}
} as Record<string, ComponentDetail>
`

  const componentsDetailsPath = path.join(outputComponentsDir, "components-details.ts")
  fs.writeFileSync(componentsDetailsPath, componentsDetailsContent, "utf8")

  // 生成 registry.ts - 使用动态 import() 实现按需加载，避免一次性加载所有 story 模块
  const registryEntries = entries.map(([, { detail, storyPath }]) => {
    const importPath = path
      .relative(path.dirname(outputRegistry), storyPath)
      .replace(/\\/g, "/")
      .replace(/\.tsx?$/, "")

    return { importPath, slug: detail.slug }
  })

  const registryMap = registryEntries
    .map(
      ({ importPath, slug }) =>
        `  "${slug}": () => import("${importPath.startsWith(".") ? importPath : `./${importPath}`}"),`,
    )
    .join("\n")

  const registryContent = `export const storyRegistry: Record<string, () => Promise<Record<string, unknown>>> = {
${registryMap}
}
`

  fs.writeFileSync(outputRegistry, registryContent, "utf8")
}
