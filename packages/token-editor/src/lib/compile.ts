import { build, parse } from "@terrazzo/parser"
import type { TokenFiles } from "../tokens/defaults"
import { makeConfig } from "./terrazzo-config"

const config = makeConfig()

export async function compileToCss(files: TokenFiles): Promise<string> {
  const sources = Object.entries(files).map(([name, content]) => ({
    filename: new URL(`file:///${name}`),
    src: JSON.stringify(content),
  }))
  const parsed = await parse(sources, { config })
  const { outputFiles } = await build(parsed.tokens, {
    sources: parsed.sources,
    config,
  })
  const cssFile = outputFiles.find((f: { filename?: string }) =>
    String(f.filename).endsWith("tokens.css"),
  )
  return cssFile ? String((cssFile as { contents: string }).contents) : ""
}
