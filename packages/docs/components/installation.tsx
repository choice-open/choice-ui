"use client"

import { memo, useMemo, useState } from "react"
import { CodeBlock, Tabs } from "~/components"

type InstallKey = "pnpm" | "npm" | "yarn" | "bun"

type ImportKey = "individual" | "global"

function InstallationComponent({
  packageName,
  components,
}: {
  packageName: string
  components: string[] | string
}) {
  const [installTab, setInstallTab] = useState<InstallKey>("pnpm")
  const [importTab, setImportTab] = useState<ImportKey>("individual")

  const content = useMemo(() => {
    switch (installTab) {
      case "pnpm":
        return `pnpm add ${packageName}`
      case "npm":
        return `npm install ${packageName}`
      case "yarn":
        return `yarn add ${packageName}`
      case "bun":
        return `bun add ${packageName}`
      default:
        return null
    }
  }, [installTab, packageName])

  const importContent = useMemo(() => {
    const componentsArray = Array.isArray(components) ? components : [components]
    switch (importTab) {
      case "individual":
        return `import { ${componentsArray.join(", ")} } from "${packageName}"`
      case "global":
        return `import { ${componentsArray.join(", ")} } from "@choice-ui/react"`
      default:
        return null
    }
  }, [importTab, packageName, components])

  return (
    <>
      <div>
        <h1 className="md-h2">Installation</h1>
        <Tabs
          value={installTab}
          onChange={(value) => setInstallTab(value as InstallKey)}
        >
          <Tabs.Item value="pnpm">pnpm</Tabs.Item>
          <Tabs.Item value="npm">npm</Tabs.Item>
          <Tabs.Item value="yarn">yarn</Tabs.Item>
          <Tabs.Item value="bun">bun</Tabs.Item>
        </Tabs>

        {content ? (
          <CodeBlock
            language="bash"
            className="mt-2"
            filename="Terminal"
            expandable={false}
          >
            <CodeBlock.Header
              className="border-b"
              showLineCount={false}
            />
            <CodeBlock.Content>{content}</CodeBlock.Content>
          </CodeBlock>
        ) : null}
      </div>

      <div>
        <h1 className="md-h2">Import</h1>
        <Tabs
          value={importTab}
          onChange={(value) => setImportTab(value as ImportKey)}
        >
          <Tabs.Item value="individual">Individual</Tabs.Item>
          <Tabs.Item value="global">Global</Tabs.Item>
        </Tabs>

        {importContent ? (
          <CodeBlock
            language="typescript"
            className="mt-2"
            filename="Component.tsx"
            expandable={false}
          >
            <CodeBlock.Header
              className="border-b"
              showLineCount={false}
            />
            <CodeBlock.Content>{importContent}</CodeBlock.Content>
          </CodeBlock>
        ) : null}
      </div>
    </>
  )
}

export const Installation = memo(InstallationComponent)
