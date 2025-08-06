import * as Comlink from "comlink"
import type { LanguageServiceWorker, LanguageServiceWorkerInit } from "../types"
import { indexedDbCache } from "./cache"
import { bufferChangeSets } from "./utils"
import { pascalCase } from "change-case"
import { getCompletionsAtPos, getModuleNamesFromVfs } from "./completions"
import { LUXON_VERSION } from "./constants"
import { setupTypescriptEnv } from "./env"
import { getHoverTooltip } from "./hover-tooltip"
import { getDiagnostics } from "./linter"
import { getUsedNodeNames } from "./typescript-ast"
import { loadTypes } from "./npm-types-loader"
import { ChangeSet, Text } from "@codemirror/state"

self.process = { env: {} } as NodeJS.Process

// 类型定义
interface LoadedNodeType {
  type: string
  typeName: string
}

interface WorkerState {
  busyApplyingChangesToCode: boolean
  loadedNodeTypesMap: Map<string, LoadedNodeType>
}

// 事件监听器类型
type StateChangeListener = (state: WorkerState, changedProperty: keyof WorkerState) => void

// 简单的状态管理类
class WorkerStateManager {
  private state: WorkerState
  private listeners: StateChangeListener[] = []

  constructor() {
    this.state = {
      loadedNodeTypesMap: new Map(),
      busyApplyingChangesToCode: false,
    }
  }

  getState(): WorkerState {
    return this.state
  }

  setState<K extends keyof WorkerState>(property: K, value: WorkerState[K]): void {
    this.state[property] = value
    this.notifyListeners(property)
  }

  addListener(listener: StateChangeListener): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(changedProperty: keyof WorkerState): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state, changedProperty)
      } catch (error) {
        console.error("Error in state change listener:", error)
      }
    })
  }
}

export const worker: LanguageServiceWorkerInit = {
  async init(options) {
    const stateManager = new WorkerStateManager()
    const codeFileName = `${options.id}.js`

    const cache = await indexedDbCache("typescript-cache", "fs-map")
    const env = await setupTypescriptEnv({
      cache,
      code: { content: Text.of(options.content).toString(), fileName: codeFileName },
    })

    function editorPositionToTypescript(pos: number) {
      return pos
    }

    function typescriptPositionToEditor(pos: number) {
      return pos
    }

    async function loadNodeTypes(nodeName: string) {
      const typeName = pascalCase(nodeName)

      // 简化版本：直接使用默认类型
      const jsonType = `type ${typeName}Json = N8nJson`
      const paramsType = `type ${typeName}Params = {}`
      const binaryType = `type ${typeName}BinaryKeys = string`
      const contextType = `type ${typeName}Context = {}`
      const type = [jsonType, binaryType, paramsType, contextType].join("\n")

      // 更新 loadedNodeTypesMap
      const currentMap = stateManager.getState().loadedNodeTypesMap
      currentMap.set(nodeName, { type, typeName })
      stateManager.setState("loadedNodeTypesMap", currentMap)
    }

    async function loadTypesIfNeeded() {
      const file = env.getSourceFile(codeFileName)

      if (!file) return

      const nodeNames = await getUsedNodeNames(file)

      for (const nodeName of nodeNames) {
        const currentMap = stateManager.getState().loadedNodeTypesMap
        if (!currentMap.has(nodeName)) {
          await loadNodeTypes(nodeName)
        }
      }
    }

    async function loadLuxonTypes() {
      if (cache.getItem("/node_modules/@types/luxon/package.json")) {
        const fileMap = await cache.getAllWithPrefix("/node_modules/@types/luxon")

        for (const [path, content] of Object.entries(fileMap)) {
          updateFile(path, content)
        }
      } else {
        await loadTypes("luxon", LUXON_VERSION, (path, types) => {
          cache.setItem(path, types)
          updateFile(path, types)
        })
      }
    }

    function updateFile(fileName: string, content: string) {
      const exists = env.getSourceFile(fileName)
      if (exists) {
        env.updateFile(fileName, content)
      } else {
        env.createFile(fileName, content)
      }
    }

    await Promise.all([loadTypesIfNeeded(), loadLuxonTypes()])

    const applyChangesToCode = bufferChangeSets((bufferedChanges) => {
      bufferedChanges.iterChanges((start, end, fromNew, _toNew, text) => {
        const length = end - start

        env.updateFile(codeFileName, text.toString(), {
          start: editorPositionToTypescript(fromNew),
          length,
        })
      })

      void loadTypesIfNeeded()
    })

    const waitForChangesAppliedToCode = async () => {
      const maxAttempts = 50 // 500ms / 10ms = 50 attempts
      let attempts = 0

      while (stateManager.getState().busyApplyingChangesToCode && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 10))
        attempts++
      }

      if (attempts >= maxAttempts) {
        console.warn("Timeout waiting for changes to be applied to code")
      }
    }

    return Comlink.proxy<LanguageServiceWorker>({
      updateFile: async (changes) => {
        stateManager.setState("busyApplyingChangesToCode", true)
        void applyChangesToCode(ChangeSet.fromJSON(changes)).then(() => {
          stateManager.setState("busyApplyingChangesToCode", false)
        })
      },
      async getCompletionsAtPos(pos) {
        await waitForChangesAppliedToCode()

        return await getCompletionsAtPos({
          pos: editorPositionToTypescript(pos),
          fileName: codeFileName,
          env,
        })
      },
      getModuleNames() {
        return getModuleNamesFromVfs(env)
      },
      getDiagnostics() {
        return getDiagnostics({ env, fileName: codeFileName }).map((diagnostic) => ({
          ...diagnostic,
          from: typescriptPositionToEditor(diagnostic.from),
          to: typescriptPositionToEditor(diagnostic.to),
        }))
      },
      getHoverTooltip(pos) {
        const tooltip = getHoverTooltip({
          pos: editorPositionToTypescript(pos),
          fileName: codeFileName,
          env,
        })

        if (!tooltip) return null

        tooltip.start = typescriptPositionToEditor(tooltip.start)
        tooltip.end = typescriptPositionToEditor(tooltip.end)

        return tooltip
      },
      async updateNodeTypes() {
        const loadedNodeNames = Array.from(stateManager.getState().loadedNodeTypesMap.keys())
        await Promise.all(loadedNodeNames.map(async (nodeName) => await loadNodeTypes(nodeName)))
      },
    })
  },
}

Comlink.expose(worker)
