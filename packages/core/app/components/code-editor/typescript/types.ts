import type { CompletionResult } from "@codemirror/autocomplete"
import type { Diagnostic } from "@codemirror/lint"
import type ts from "typescript"
import type * as Comlink from "comlink"
import type { ChangeSet } from "@codemirror/state"

export interface HoverInfo {
  end: number
  quickInfo: ts.QuickInfo | undefined
  start: number
  typeDef?: readonly ts.DefinitionInfo[]
}

export type WorkerInitOptions = {
  content: string[]
  id: string
}

export type LanguageServiceWorker = {
  getCompletionsAtPos(pos: number): Promise<{ isGlobal: boolean; result: CompletionResult } | null>
  getDiagnostics(): Diagnostic[]
  getHoverTooltip(pos: number): HoverInfo | null
  getModuleNames(): string[]
  updateFile(changes: ChangeSet): void
  updateNodeTypes(): void
}

export type LanguageServiceWorkerInit = {
  init(options: WorkerInitOptions): Promise<LanguageServiceWorker>
}

export type RemoteLanguageServiceWorkerInit = {
  init(options: WorkerInitOptions): Comlink.Remote<LanguageServiceWorker>
}
