import type * as tsvfs from "@typescript/vfs"
import type ts from "typescript"
import { type Completion } from "@codemirror/autocomplete"
import { TS_COMPLETE_BLOCKLIST, TYPESCRIPT_AUTOCOMPLETE_THRESHOLD } from "./constants"

function convertTsKindtoEditorCompletionType(kind: ts.ScriptElementKind) {
  if (!kind) return undefined

  const type = String(kind)
  if (type === "member") return "property"

  return type
}

function typescriptCompletionToEditor(
  completionInfo: ts.WithMetadata<ts.CompletionInfo>,
  entry: ts.CompletionEntry,
): Completion {
  const boost = -Number(entry.sortText) || 0
  const type = convertTsKindtoEditorCompletionType(entry.kind)

  return {
    label: entry.name,
    type: convertTsKindtoEditorCompletionType(entry.kind),
    commitCharacters: entry.commitCharacters ?? completionInfo.defaultCommitCharacters,
    detail: entry.labelDetails?.detail,
    boost,
  }
}

function filterTypescriptCompletions(
  completionInfo: ts.WithMetadata<ts.CompletionInfo>,
  entry: ts.CompletionEntry,
) {
  return (
    !TS_COMPLETE_BLOCKLIST.includes(entry.kind) &&
    (entry.sortText < TYPESCRIPT_AUTOCOMPLETE_THRESHOLD ||
      completionInfo.optionalReplacementSpan?.length)
  )
}

export async function getCompletionsAtPos({
  pos,
  fileName,
  env,
}: {
  env: tsvfs.VirtualTypeScriptEnvironment
  fileName: string
  pos: number
}) {
  const sourceFile = env.getSourceFile(fileName)

  if (sourceFile) {
    const text = sourceFile.getFullText()
    const beforeText = text.substring(Math.max(0, pos - 100), pos)

    const importMatch = beforeText.match(/(?:import\s+.*?\s+from\s*|import\s*\(\s*)['"`]([^'"`]*)$/)

    if (importMatch) {
      const query = importMatch[1] || ""
      const availableModules = getModuleNamesFromVfs(env)

      const moduleCompletions = availableModules
        .filter((moduleName) => moduleName.toLowerCase().includes(query.toLowerCase()))
        .map((moduleName) => ({
          label: moduleName,
          type: "module" as const,
          boost: moduleName.toLowerCase().startsWith(query.toLowerCase()) ? 100 : 50,
        }))

      if (moduleCompletions.length > 0) {
        return {
          result: {
            from: pos - query.length,
            options: moduleCompletions,
          },
          isGlobal: false,
        }
      }
    }
  }

  const completionInfo = env.languageService.getCompletionsAtPosition(fileName, pos, {}, {})

  if (!completionInfo) return null

  const options = completionInfo.entries
    .filter((entry) => filterTypescriptCompletions(completionInfo, entry))
    .map((entry) => typescriptCompletionToEditor(completionInfo, entry))

  return {
    result: { from: pos, options },
    isGlobal: completionInfo.isGlobalCompletion,
  }
}

export function getModuleNamesFromVfs(env: tsvfs.VirtualTypeScriptEnvironment): string[] {
  const moduleNames: string[] = []

  // react
  if (
    env.getSourceFile("/node_modules/react/index.d.ts") ||
    env.getSourceFile("/node_modules/@types/react/index.d.ts")
  ) {
    moduleNames.push("react")
  }

  return moduleNames
}
