import { build, parse } from "@terrazzo/parser"
import type { TokenFiles } from "../tokens/defaults"
import { makeConfig } from "./terrazzo-config"

const config = makeConfig()

export async function compileToCss(files: TokenFiles): Promise<string> {
  const colors = files["colors-w3c.json"] as Record<string, unknown> | undefined
  const colorTree = colors?.color as Record<string, unknown> | undefined
  const blueTree = colorTree?.blue as Record<string, unknown> | undefined
  const blue500 = blueTree?.["500"]
  console.debug("[live-theme] compile INPUT blue.500", JSON.stringify(blue500))

  const sources = Object.entries(files).map(([name, content]) => ({
    filename: new URL(`file:///${name}`),
    src: JSON.stringify(content),
  }))
  const parsed = await parse(sources, { config })
  const blueToken = parsed.tokens["color.blue.500"] as
    | { originalValue?: unknown; $value?: unknown }
    | undefined
  console.debug("[live-theme] compile PARSED blue.500 originalValue", JSON.stringify(blueToken?.originalValue))
  console.debug("[live-theme] compile PARSED blue.500 $value", JSON.stringify(blueToken?.$value))
  console.debug("[live-theme] compile PARSED token keys", Object.keys(parsed.tokens).filter(k => k.includes("blue.500")))

  const { outputFiles } = await build(parsed.tokens, {
    sources: parsed.sources,
    config,
  })
  const cssFile = outputFiles.find((f: { filename?: string }) =>
    String(f.filename).endsWith("tokens.css"),
  )
  return cssFile ? String((cssFile as { contents: string }).contents) : ""
}
