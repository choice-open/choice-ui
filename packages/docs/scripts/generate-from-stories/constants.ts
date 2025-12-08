import path from "node:path"
import { withCustomConfig } from "react-docgen-typescript"

export const workspaceRoot = path.resolve(__dirname, "../../../..")
export const storybookStoriesDir = path.resolve(workspaceRoot, "packages/storybook/stories")
export const coreComponentsDir = path.resolve(workspaceRoot, "packages/core/app/components")
export const outputDir = path.resolve(__dirname, "../../generated")
export const outputIndex = path.join(outputDir, "index.json")
export const outputComponentsDir = path.join(outputDir, "components")
export const outputRegistry = path.join(outputDir, "registry.ts")

export const storyExt = ".stories.tsx"
export const coreTsconfig = path.resolve(workspaceRoot, "packages/core/tsconfig.json")

let docgenParser: ReturnType<typeof withCustomConfig> | null = null

export function getDocgenParser() {
  if (!docgenParser) {
    docgenParser = withCustomConfig(coreTsconfig, {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes("node_modules")
        }
        return true
      },
    })
  }
  return docgenParser
}
