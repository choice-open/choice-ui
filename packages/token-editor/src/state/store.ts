import { create } from "zustand"
import { cloneDefaults, type TokenFileName, type TokenFiles } from "../tokens/defaults"
import type { W3CColorTokenValue, W3CTree } from "../lib/w3c"

type Mode = "light" | "dark"

type EditorState = {
  files: TokenFiles
  dirty: Set<string>
  mode: Mode
  setMode: (mode: Mode) => void
  setColorMode: (
    file: TokenFileName,
    path: string[],
    mode: Mode,
    value: W3CColorTokenValue,
  ) => void
  /**
   * Write a new `$value` onto an atomic token (typography / spacing / radius
   * / dimension / weight / family). Mode-aware tokens use `setColorMode`.
   */
  setTokenValue: (file: TokenFileName, path: string[], value: unknown) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  files: cloneDefaults(),
  dirty: new Set<string>(),
  mode: "light",
  setMode: (mode) => set({ mode }),
  setColorMode: (file, path, mode, value) =>
    set((state) => {
      const nextFiles = { ...state.files, [file]: cloneTreeWithUpdate(state.files[file], path, (token) => {
        if (!token || typeof token !== "object") return token
        const next = { ...(token as Record<string, unknown>) }
        const ext = { ...((next.$extensions as Record<string, unknown> | undefined) ?? {}) }
        const modes = { ...((ext.mode as Record<string, unknown> | undefined) ?? {}) }
        modes[mode] = value
        ext.mode = modes
        next.$extensions = ext
        return next
      }) }
      const nextDirty = new Set(state.dirty)
      nextDirty.add(`${file}#${path.join(".")}`)
      return { files: nextFiles, dirty: nextDirty }
    }),
  setTokenValue: (file, path, value) =>
    set((state) => {
      const nextFiles = {
        ...state.files,
        [file]: cloneTreeWithUpdate(state.files[file], path, (token) => {
          if (!token || typeof token !== "object") return token
          return { ...(token as Record<string, unknown>), $value: value }
        }),
      }
      const nextDirty = new Set(state.dirty)
      nextDirty.add(`${file}#${path.join(".")}`)
      return { files: nextFiles, dirty: nextDirty }
    }),
  reset: () => set({ files: cloneDefaults(), dirty: new Set<string>() }),
}))

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
