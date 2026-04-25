import { create } from "zustand"
import { cloneDefaults, TOKEN_FILES, type TokenFileName, type TokenFiles } from "../tokens/defaults"
import { getNodeAtPath, type W3CTree } from "../lib/w3c"

type Mode = "light" | "dark"

type EditorState = {
  files: TokenFiles
  dirty: Set<string>
  mode: Mode
  setMode: (mode: Mode) => void
  /**
   * Write `value` into `$extensions.mode.{mode}` of the token at `path`.
   * Used by every mode-aware token type (colors, shadows). The base
   * `$value` is left untouched; Terrazzo prefers the mode override.
   */
  setModeValue: (
    file: TokenFileName,
    path: string[],
    mode: Mode,
    value: unknown,
  ) => void
  /**
   * Write a new `$value` onto an atomic token (typography / spacing / radius
   * / dimension / weight / family). Mode-aware tokens use `setModeValue`.
   */
  setTokenValue: (file: TokenFileName, path: string[], value: unknown) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  files: cloneDefaults(),
  dirty: new Set<string>(),
  mode: "light",
  setMode: (mode) => set({ mode }),
  setModeValue: (file, path, mode, value) =>
    set((state) => {
      const nextFile = cloneTreeWithUpdate(state.files[file], path, (token) => {
        if (!token || typeof token !== "object") return token
        const next = { ...(token as Record<string, unknown>) }
        const ext = { ...((next.$extensions as Record<string, unknown> | undefined) ?? {}) }
        const modes = { ...((ext.mode as Record<string, unknown> | undefined) ?? {}) }
        modes[mode] = value
        ext.mode = modes
        next.$extensions = ext
        return next
      })
      return {
        files: { ...state.files, [file]: nextFile },
        dirty: recomputeDirty(state.dirty, file, path, nextFile),
      }
    }),
  setTokenValue: (file, path, value) =>
    set((state) => {
      const nextFile = cloneTreeWithUpdate(state.files[file], path, (token) => {
        if (!token || typeof token !== "object") return token
        return { ...(token as Record<string, unknown>), $value: value }
      })
      return {
        files: { ...state.files, [file]: nextFile },
        dirty: recomputeDirty(state.dirty, file, path, nextFile),
      }
    }),
  reset: () => set({ files: cloneDefaults(), dirty: new Set<string>() }),
}))

/**
 * Compare the rewritten token node against the bundled baseline at the same
 * path, byte-for-byte (JSON), and add or remove the dirty key accordingly.
 * Mirrors `buildDiffPatch`'s strict equality so the dirty set never reports
 * pending edits that would not appear in an exported patch.
 */
function recomputeDirty(
  prev: Set<string>,
  file: TokenFileName,
  path: string[],
  nextFile: W3CTree,
): Set<string> {
  const key = `${file}#${path.join(".")}`
  const baselineNode = getNodeAtPath(TOKEN_FILES[file] as W3CTree, path)
  const currentNode = getNodeAtPath(nextFile, path)
  const isUnchanged = JSON.stringify(baselineNode) === JSON.stringify(currentNode)
  if (isUnchanged && !prev.has(key)) return prev
  if (!isUnchanged && prev.has(key)) return prev
  const next = new Set(prev)
  if (isUnchanged) next.delete(key)
  else next.add(key)
  return next
}

function cloneTreeWithUpdate(
  tree: W3CTree,
  path: string[],
  update: (node: unknown) => unknown,
): W3CTree {
  if (path.length === 0) return tree
  const [head, ...rest] = path
  const child = (tree as Record<string, unknown>)[head]
  const nextChild =
    rest.length === 0 ? update(child) : cloneTreeWithUpdate(child as W3CTree, rest, update)
  return { ...tree, [head]: nextChild } as W3CTree
}
