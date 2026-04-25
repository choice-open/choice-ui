import { build, parse } from "@terrazzo/parser"
import type { TokenFiles } from "../tokens/defaults"
import { makeConfig } from "./terrazzo-config"

const config = makeConfig()

export async function compileToCss(files: TokenFiles): Promise<string> {
  const colors = files["colors-w3c.json"] as Record<string, unknown> | undefined
  const colorTree = colors?.color as Record<string, unknown> | undefined
  const blueTree = colorTree?.blue as Record<string, unknown> | undefined
  const blue500 = blueTree?.["500"]
  console.debug("[live-theme] compile input color.blue.500", blue500)

  const sources = Object.entries(files).map(([name, content]) => ({
    filename: new URL(`file:///${name}`),
    src: JSON.stringify(content),
  }))
  const parsed = await parse(sources, { config })
  const blueToken = parsed.tokens["color.blue.500"]
  console.debug("[live-theme] compile parsed color.blue.500", {
    originalValue: (blueToken as { originalValue?: unknown } | undefined)?.originalValue,
    $value: (blueToken as { $value?: unknown } | undefined)?.$value,
  })

  const { outputFiles } = await build(parsed.tokens, {
    sources: parsed.sources,
    config,
  })
  const cssFile = outputFiles.find((f: { filename?: string }) =>
    String(f.filename).endsWith("tokens.css"),
  )
  return cssFile ? String((cssFile as { contents: string }).contents) : ""
}
