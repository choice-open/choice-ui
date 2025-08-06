import * as tsvfs from "@typescript/vfs"
import { COMPILER_OPTIONS, TYPESCRIPT_FILES } from "./constants"
import ts from "typescript"
import type { IndexedDbCache } from "./cache"
import { wrapInFunction } from "./utils"

import globalTypes from "./type-declarations/globals.d.ts?raw"

type EnvOptions = {
  cache: IndexedDbCache
  code: {
    content: string
    fileName: string
  }
}

export function removeUnusedLibs(fsMap: Map<string, string>) {
  for (const [name] of fsMap.entries()) {
    if (
      name === "lib.d.ts" ||
      name.startsWith("/lib.dom") ||
      name.startsWith("/lib.webworker") ||
      name.startsWith("/lib.scripthost") ||
      name.endsWith(".full.d.ts")
    ) {
      fsMap.delete(name)
    }
  }
}

export async function setupTypescriptEnv({ cache, code }: EnvOptions) {
  const fsMap = await tsvfs.createDefaultMapFromCDN(
    COMPILER_OPTIONS,
    ts.version,
    true,
    ts,
    undefined,
    undefined,
    cache,
  )

  removeUnusedLibs(fsMap)

  fsMap.set(TYPESCRIPT_FILES.GLOBAL_TYPES, globalTypes)
  fsMap.set(code.fileName, wrapInFunction(code.content))

  await loadCDNTypes(fsMap)

  const system = tsvfs.createSystem(fsMap)
  return tsvfs.createVirtualTypeScriptEnvironment(
    system,
    Array.from(fsMap.keys()),
    ts,
    COMPILER_OPTIONS,
  )
}

export async function loadCDNTypes(fsMap: Map<string, string>) {
  const reactIndex = await fetch("https://unpkg.com/@types/react@18/index.d.ts").then((r) =>
    r.text(),
  )
  fsMap.set("/node_modules/@types/react/index.d.ts", reactIndex)

  const jsxRuntime = await fetch("https://unpkg.com/@types/react@18/jsx-runtime.d.ts").then((r) =>
    r.text(),
  )
  fsMap.set("/node_modules/@types/react/jsx-runtime.d.ts", jsxRuntime)

  fsMap.set(
    "/node_modules/react/package.json",
    JSON.stringify({
      name: "react",
      types: "../@types/react/index.d.ts",
    }),
  )

  fsMap.set(
    "/node_modules/react/jsx-runtime.d.ts",
    `export * from '../@types/react/jsx-runtime.d.ts'`,
  )
}
