import JSZip from "jszip"
import { TOKEN_FILES, type TokenFileName, type TokenFiles } from "../tokens/defaults"
import { compileToCss } from "./compile"
import { downloadBlob, downloadText } from "./download"
import type { W3CTokenNode, W3CTree } from "./w3c"

export async function exportCss(files: TokenFiles): Promise<void> {
  const css = await compileToCss(files)
  downloadText(css, "tokens.css", "text/css")
}

export async function exportW3cZip(files: TokenFiles): Promise<void> {
  const zip = new JSZip()
  const folder = zip.folder("tokens")!
  for (const [name, tree] of Object.entries(files) as [TokenFileName, W3CTree][]) {
    folder.file(name, JSON.stringify(tree, null, 2))
  }
  const blob = await zip.generateAsync({ type: "blob" })
  downloadBlob(blob, "choice-ui-tokens.zip")
}

export type DiffEdit = {
  file: TokenFileName
  path: string
  $type: string
  node: W3CTokenNode
}

export type DiffPatch = {
  version: 1
  generatedAt: string
  edits: DiffEdit[]
}

export function buildDiffPatch(files: TokenFiles): DiffPatch {
  const edits: DiffEdit[] = []
  for (const name of Object.keys(files) as TokenFileName[]) {
    diffTree(name, files[name], TOKEN_FILES[name] as W3CTree, [], edits)
  }
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    edits,
  }
}

export async function exportDiffPatch(files: TokenFiles): Promise<void> {
  const patch = buildDiffPatch(files)
  downloadText(
    JSON.stringify(patch, null, 2),
    "choice-ui-tokens.patch.json",
    "application/json",
  )
}

function diffTree(
  file: TokenFileName,
  current: unknown,
  baseline: unknown,
  path: string[],
  out: DiffEdit[],
) {
  if (isTokenLeaf(current) && isTokenLeaf(baseline)) {
    if (!shallowEqualToken(current, baseline)) {
      out.push({
        file,
        path: path.join("."),
        $type: current.$type ?? "unknown",
        node: current,
      })
    }
    return
  }
  if (typeof current !== "object" || current === null) return
  if (typeof baseline !== "object" || baseline === null) return
  const cur = current as Record<string, unknown>
  const base = baseline as Record<string, unknown>
  const keys = new Set([...Object.keys(cur), ...Object.keys(base)])
  for (const key of keys) {
    if (key.startsWith("$")) continue
    diffTree(file, cur[key], base[key], [...path, key], out)
  }
}

function isTokenLeaf(node: unknown): node is W3CTokenNode {
  return (
    typeof node === "object" &&
    node !== null &&
    "$type" in (node as Record<string, unknown>) &&
    "$value" in (node as Record<string, unknown>)
  )
}

function shallowEqualToken(a: W3CTokenNode, b: W3CTokenNode) {
  return JSON.stringify(a) === JSON.stringify(b)
}
