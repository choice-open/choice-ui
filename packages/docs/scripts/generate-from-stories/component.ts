import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { coreComponentsDir, getDocgenParser, storyExt, storybookStoriesDir } from "./constants"
import type { PackageInfo, PropDoc, PropsGroup } from "./types"
import { isFile, readFile, slugifyPart } from "./utils"

export function readComponentPackageJson(storyPath: string): PackageInfo | undefined {
  const relativePath = path.relative(storybookStoriesDir, storyPath)
  const parts = relativePath.split(path.sep)
  if (parts.length < 1) return undefined

  const componentFolder = parts[0]
  const packageJsonPath = path.join(coreComponentsDir, componentFolder, "package.json")

  if (!isFile(packageJsonPath)) return undefined

  try {
    const content = JSON.parse(readFile(packageJsonPath))
    return {
      name: content.name ?? "",
      version: content.version ?? "",
      description: content.description ?? "",
      dependencies: content.dependencies ?? {},
      peerDependencies: content.peerDependencies,
    }
  } catch {
    return undefined
  }
}

/** 从单个文件中提取导出 */
function extractExportsFromFile(filePath: string, visited = new Set<string>()): string[] {
  if (visited.has(filePath) || !isFile(filePath)) return []
  visited.add(filePath)

  try {
    const content = readFile(filePath)
    const sourceFile = ts.createSourceFile(
      path.basename(filePath),
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    )

    const exports: string[] = []
    const dir = path.dirname(filePath)

    for (const statement of sourceFile.statements) {
      // 处理 export { X, Y } from "./xxx"
      if (ts.isExportDeclaration(statement)) {
        const exportClause = statement.exportClause

        // export * from "./xxx" - 递归提取
        if (!exportClause && statement.moduleSpecifier) {
          const modulePath = (statement.moduleSpecifier as ts.StringLiteral).text
          const resolvedPath = resolveModulePath(dir, modulePath)
          if (resolvedPath) {
            exports.push(...extractExportsFromFile(resolvedPath, visited))
          }
          continue
        }

        // export { X, Y } from "./xxx"
        if (exportClause && ts.isNamedExports(exportClause)) {
          for (const element of exportClause.elements) {
            const name = element.name.text
            const isTypeOnly = statement.isTypeOnly || element.isTypeOnly
            exports.push(isTypeOnly ? `type ${name}` : name)
          }
        }
      }

      // 处理 export const/function/class
      if (ts.isVariableStatement(statement)) {
        const hasExport = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
        if (hasExport) {
          for (const decl of statement.declarationList.declarations) {
            if (ts.isIdentifier(decl.name)) {
              exports.push(decl.name.text)
            }
          }
        }
      }

      if (ts.isFunctionDeclaration(statement) && statement.name) {
        const hasExport = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
        if (hasExport) {
          exports.push(statement.name.text)
        }
      }

      // 处理 export type
      if (ts.isTypeAliasDeclaration(statement)) {
        const hasExport = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
        if (hasExport) {
          exports.push(`type ${statement.name.text}`)
        }
      }

      if (ts.isInterfaceDeclaration(statement)) {
        const hasExport = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
        if (hasExport) {
          exports.push(`type ${statement.name.text}`)
        }
      }
    }

    return exports
  } catch {
    return []
  }
}

/** 解析模块路径 */
function resolveModulePath(dir: string, modulePath: string): string | null {
  const basePath = path.join(dir, modulePath)
  const candidates = [
    basePath + ".ts",
    basePath + ".tsx",
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ]

  for (const candidate of candidates) {
    if (isFile(candidate)) {
      return candidate
    }
  }
  return null
}

export function readComponentExports(storyPath: string): string[] {
  const relativePath = path.relative(storybookStoriesDir, storyPath)
  const parts = relativePath.split(path.sep)
  if (parts.length < 1) return []

  const componentFolder = parts[0]
  const indexPath = path.join(coreComponentsDir, componentFolder, "src", "index.ts")

  return extractExportsFromFile(indexPath)
}

export function resolveComponentFromStoryPath(
  storyPath: string,
): { name: string; path: string } | null {
  const relativePath = path.relative(storybookStoriesDir, storyPath)
  const parts = relativePath.split(path.sep)
  if (parts.length < 2) return null

  const componentFolder = parts[0]
  const componentDir = path.join(coreComponentsDir, componentFolder, "src")

  if (!fs.existsSync(componentDir)) return null

  const candidates = [
    path.join(componentDir, `${componentFolder}.tsx`),
    path.join(componentDir, "index.tsx"),
    path.join(componentDir, "index.ts"),
  ]

  for (const candidate of candidates) {
    if (isFile(candidate)) {
      const componentName = componentFolder
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
      return { name: componentName, path: candidate }
    }
  }

  return null
}

export function readComponentDoc(componentPath: string): string {
  if (!componentPath || !isFile(componentPath)) return ""
  const content = readFile(componentPath)
  const docMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
  if (!docMatch) return ""
  const cleaned = docMatch[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter((line) => line.length > 0)
  return cleaned[0] ?? ""
}

/** 解析 prop 类型，展开 enum */
function formatPropType(
  propType: { name: string; raw?: string; value?: Array<{ value: string }> } | undefined,
): string {
  if (!propType) return ""

  // 如果是 enum 类型且有具体值，展开显示
  if (propType.name === "enum" && propType.value && Array.isArray(propType.value)) {
    const values = propType.value.map((v) => v.value).join(" | ")
    return values || "enum"
  }

  // 如果有 raw 类型（原始类型字符串），优先使用
  if (propType.raw) {
    return propType.raw
  }

  return propType.name
}

/** 解析单个文件的 props，使用提供的类型名称列表 */
function parseFileProps(filePath: string, exportedTypeNames: string[]): PropsGroup[] {
  try {
    if (!isFile(filePath)) return []
    const docs = getDocgenParser().parse(filePath)
    if (!docs.length) return []
    return docs.map((doc) => {
      const props = doc.props ?? {}
      const propList: PropDoc[] = Object.entries(props).map(([name, prop]) => ({
        name,
        type: formatPropType(prop.type as { name: string; value?: Array<{ value: string }> }),
        required: prop.required ?? false,
        defaultValue: prop.defaultValue?.value ?? undefined,
        description: prop.description ?? "",
      }))
      // 尝试从导出的类型名称中找到匹配的
      // react-docgen 的 displayName 是组件名，我们需要找到对应的 Props 类型名
      const componentName = doc.displayName ?? ""
      // 在导出的类型中找到包含组件名的类型（如 Segmented -> SegmentedProps）
      const matchedTypeName = exportedTypeNames.find((typeName) => typeName.includes(componentName))
      return {
        displayName: matchedTypeName ?? componentName,
        description: doc.description ?? "",
        props: propList,
      }
    })
  } catch {
    return []
  }
}

interface ComponentFilesInfo {
  files: string[] // 需要解析的文件路径
  allTypeNames: string[] // 所有导出的类型名称（共享给所有文件）
}

/** 从 index.ts 提取所有需要解析的文件路径和导出的类型名称 */
function getComponentFilesFromIndex(indexPath: string): ComponentFilesInfo {
  if (!isFile(indexPath)) return { files: [], allTypeNames: [] }

  const dir = path.dirname(indexPath)
  const content = readFile(indexPath)
  const sourceFile = ts.createSourceFile(
    path.basename(indexPath),
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  const files: string[] = []
  const allTypeNames: string[] = []

  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
      const modulePath = (statement.moduleSpecifier as ts.StringLiteral).text
      const resolvedPath = resolveModulePath(dir, modulePath)
      if (!resolvedPath) continue

      // 收集文件路径（去重）
      if (!files.includes(resolvedPath)) {
        files.push(resolvedPath)
      }

      // 提取 export type { TypeName } 中的类型名称
      const exportClause = statement.exportClause
      const isTypeExport = statement.isTypeOnly

      if (exportClause && ts.isNamedExports(exportClause)) {
        for (const element of exportClause.elements) {
          const exportedName = element.name.text
          const isTypeOnly = isTypeExport || element.isTypeOnly

          // 收集所有类型导出的名称（共享给所有文件）
          if (isTypeOnly && !allTypeNames.includes(exportedName)) {
            allTypeNames.push(exportedName)
          }
        }
      }
    }
  }

  return { files, allTypeNames }
}

export function readComponentProps(componentPath: string): PropsGroup[] {
  try {
    if (!isFile(componentPath)) return []

    // 获取组件目录
    const componentDir = path.dirname(componentPath)
    const indexPath = path.join(componentDir, "index.ts")

    // 解析所有文件并合并 props
    const allProps: PropsGroup[] = []
    const seenDisplayNames = new Set<string>()

    // 如果有 index.ts，从中提取所有导出的文件和类型名称
    if (isFile(indexPath)) {
      const { files, allTypeNames } = getComponentFilesFromIndex(indexPath)

      if (files.length > 0) {
        // 所有文件共享同一个类型名称列表
        for (const filePath of files) {
          const fileProps = parseFileProps(filePath, allTypeNames)
          for (const prop of fileProps) {
            if (!seenDisplayNames.has(prop.displayName)) {
              seenDisplayNames.add(prop.displayName)
              allProps.push(prop)
            }
          }
        }
        return allProps
      }
    }

    // 如果没有从 index.ts 提取到文件，使用传入的 componentPath
    const fileProps = parseFileProps(componentPath, [])
    for (const prop of fileProps) {
      if (!seenDisplayNames.has(prop.displayName)) {
        seenDisplayNames.add(prop.displayName)
        allProps.push(prop)
      }
    }

    return allProps
  } catch {
    return []
  }
}

export function resolveSlug(title?: string, storyPath?: string): string {
  if (title) {
    return title.split("/").map(slugifyPart).filter(Boolean).join("/")
  }

  if (storyPath) {
    const relativePath = path.relative(storybookStoriesDir, storyPath)
    const parts = relativePath.split(path.sep)
    if (parts.length >= 1) {
      const last = parts[parts.length - 1].replace(storyExt, "")
      const relParts = parts.slice(0, parts.length - 1).concat(last)
      return relParts
        .map(slugifyPart)
        .filter((part, index, arr) => part.length > 0 && arr.indexOf(part) === index)
        .join("/")
    }
  }

  return ""
}
