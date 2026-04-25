import { create } from "zustand"
import { PRESETS, type Preset, type PresetEdit } from "../presets"
import { SECTIONS, type SectionId } from "../sections"
import { cloneDefaults, TOKEN_FILES, type TokenFileName, type TokenFiles } from "../tokens/defaults"
import { getNodeAtPath, type W3CTree } from "../lib/w3c"

type Mode = "light" | "dark"

const SECTION_BY_FILE: Record<TokenFileName, SectionId> = {
  "colors-w3c.json": "colors",
  "typography-atomic-w3c.json": "typography",
  "spacing-w3c.json": "spacing",
  "shadows-w3c.json": "shadows",
  "radius-w3c.json": "radius",
  "breakpoints-w3c.json": "breakpoints",
  "zindex-w3c.json": "zindex",
}

type EditorState = {
  files: TokenFiles
  dirty: Set<string>
  /** Active preset id per section, or `null` when the section is in
   *  Custom state (any manual edit since the last apply). */
  activePresets: Record<SectionId, string | null>
  mode: Mode
  setMode: (mode: Mode) => void
  setModeValue: (
    file: TokenFileName,
    path: string[],
    mode: Mode,
    value: unknown,
  ) => void
  setTokenValue: (file: TokenFileName, path: string[], value: unknown) => void
  /**
   * Apply a curated preset's edits in one batch. Sets `activePresets[section]`
   * so the sidebar and picker can highlight the current selection.
   */
  applyPreset: (section: SectionId, preset: Preset) => void
  /**
   * Pick a random preset for every section that has curated content and
   * apply them all in one batch. Sections without presets stay put.
   */
  shuffle: () => void
  reset: () => void
}

function emptyActivePresets(): Record<SectionId, string | null> {
  return {
    colors: null,
    typography: null,
    spacing: null,
    shadows: null,
    radius: null,
    breakpoints: null,
    zindex: null,
  }
}

/**
 * Pure helper for `setModeValue` that returns the next file tree without
 * touching activePresets. Pulled out so `applyPreset` can chain edits in
 * one `set()` call without each one nuking the active preset.
 */
function applyModeWrite(
  files: TokenFiles,
  file: TokenFileName,
  path: string[],
  mode: Mode,
  value: unknown,
): W3CTree {
  const baselineNode = getNodeAtPath(TOKEN_FILES[file] as W3CTree, path) as
    | Record<string, unknown>
    | undefined
  const baselineExt = baselineNode?.$extensions as
    | Record<string, unknown>
    | undefined
  const baselineModes = baselineExt?.mode as Record<string, unknown> | undefined
  const baselineHasOverride =
    baselineModes !== undefined && mode in baselineModes

  return cloneTreeWithUpdate(files[file], path, (token) => {
    if (!token || typeof token !== "object") return token
    const next = { ...(token as Record<string, unknown>) }
    const originalExt = next.$extensions as Record<string, unknown> | undefined
    const ext = { ...(originalExt ?? {}) }
    const modes = { ...((ext.mode as Record<string, unknown> | undefined) ?? {}) }

    if (baselineHasOverride) {
      // Baseline kept this slot explicit, so we must too — otherwise revert
      // would change the JSON shape and `recomputeDirty` could never clear.
      modes[mode] = value
    } else if (JSON.stringify(value) === JSON.stringify(next.$value)) {
      // No baseline override and the new value matches `$value`: writing
      // would create a redundant entry that permanently marks dirty.
      delete modes[mode]
    } else {
      modes[mode] = value
    }

    if (Object.keys(modes).length === 0) {
      delete ext.mode
    } else {
      ext.mode = modes
    }
    if (originalExt === undefined && Object.keys(ext).length === 0) {
      delete next.$extensions
    } else {
      next.$extensions = ext
    }
    return next
  })
}

function applyValueWrite(
  files: TokenFiles,
  file: TokenFileName,
  path: string[],
  value: unknown,
): W3CTree {
  return cloneTreeWithUpdate(files[file], path, (token) => {
    if (!token || typeof token !== "object") return token
    return { ...(token as Record<string, unknown>), $value: value }
  })
}

export const useEditorStore = create<EditorState>((set) => ({
  files: cloneDefaults(),
  dirty: new Set<string>(),
  activePresets: emptyActivePresets(),
  mode: "light",
  setMode: (mode) => set({ mode }),
  setModeValue: (file, path, mode, value) =>
    set((state) => {
      const nextFile = applyModeWrite(state.files, file, path, mode, value)
      return {
        files: { ...state.files, [file]: nextFile },
        dirty: recomputeDirty(state.dirty, file, path, nextFile),
        activePresets: { ...state.activePresets, [SECTION_BY_FILE[file]]: null },
      }
    }),
  setTokenValue: (file, path, value) =>
    set((state) => {
      const nextFile = applyValueWrite(state.files, file, path, value)
      return {
        files: { ...state.files, [file]: nextFile },
        dirty: recomputeDirty(state.dirty, file, path, nextFile),
        activePresets: { ...state.activePresets, [SECTION_BY_FILE[file]]: null },
      }
    }),
  applyPreset: (section, preset) =>
    set((state) => {
      let files = state.files
      let dirty = state.dirty
      for (const edit of preset.edits) {
        const nextFile =
          edit.kind === "mode"
            ? applyModeWrite(files, edit.file, edit.path, edit.mode, edit.value)
            : applyValueWrite(files, edit.file, edit.path, edit.value)
        files = { ...files, [edit.file]: nextFile }
        dirty = recomputeDirty(dirty, edit.file, edit.path, nextFile)
      }
      return {
        files,
        dirty,
        activePresets: { ...state.activePresets, [section]: preset.id },
      }
    }),
  shuffle: () =>
    set((state) => {
      let files = state.files
      let dirty = state.dirty
      const nextActive = { ...state.activePresets }
      for (const section of SECTIONS) {
        const presets = PRESETS[section.id]
        if (presets.length === 0) continue
        const random = presets[Math.floor(Math.random() * presets.length)]
        for (const edit of random.edits) {
          const nextFile =
            edit.kind === "mode"
              ? applyModeWrite(files, edit.file, edit.path, edit.mode, edit.value)
              : applyValueWrite(files, edit.file, edit.path, edit.value)
          files = { ...files, [edit.file]: nextFile }
          dirty = recomputeDirty(dirty, edit.file, edit.path, nextFile)
        }
        nextActive[section.id] = random.id
      }
      return { files, dirty, activePresets: nextActive }
    }),
  reset: () =>
    set({
      files: cloneDefaults(),
      dirty: new Set<string>(),
      activePresets: emptyActivePresets(),
    }),
}))

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

/** Suppress unused-import noise for `PresetEdit`; preset definitions
 *  consume the type elsewhere. */
export type { PresetEdit }
