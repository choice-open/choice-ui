import ts from "typescript"

export const TS_COMPLETE_BLOCKLIST: ts.ScriptElementKind[] = [ts.ScriptElementKind.warning]
export const COMPILER_OPTIONS: ts.CompilerOptions = {
  allowJs: true,
  checkJs: true,
  target: ts.ScriptTarget.ESNext,
  lib: ["es2023", "dom", "dom.iterable"],
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  jsxImportSource: "react",
  strict: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  importHelpers: false,
  skipDefaultLibCheck: true,
  noEmit: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  types: [],
}
export const TYPESCRIPT_AUTOCOMPLETE_THRESHOLD = "15"
export const TYPESCRIPT_FILES = {
  GLOBAL_TYPES: "globals.d.ts",
}
export const LUXON_VERSION = "3.2.0"
