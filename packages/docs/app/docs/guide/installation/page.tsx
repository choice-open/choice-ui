"use client"

import { Installation } from "@/components/installation"
import { CodeBlock } from "~/components"

export default function InstallationPage() {
  return (
    <div className="min-w-0 space-y-16">
      <div className="space-y-2">
        <h1 className="md-h1">Installation</h1>
        <p className="md-h3">How to install Choice UI in your project.</p>
      </div>

      <Installation
        packageName="@choice-ui/react"
        components={["ChoiceUiProvider", "Button"]}
      />

      <section className="space-y-4">
        <h2 className="md-h2">Tailwind CSS Setup</h2>
        <p className="md-p">
          Choice UI is built on top of Tailwind CSS 4. Import styles in your main CSS file:
        </p>
        <CodeBlock
          language="css"
          variant="dark"
        >
          <CodeBlock.Content>{`@import "tailwindcss";
@import "@choice-ui/react/tailwind.css";`}</CodeBlock.Content>
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className="md-h2">Provider Setup</h2>
        <p className="md-p">
          Add <code className="md-code">ChoiceUiProvider</code> at the root of your application:
        </p>
        <CodeBlock
          language="tsx"
          variant="dark"
        >
          <CodeBlock.Content>{`import { ChoiceUiProvider } from "@choice-ui/react"

function App() {
  return (
    <ChoiceUiProvider>
      <YourApp />
    </ChoiceUiProvider>
  )
}`}</CodeBlock.Content>
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className="md-h2">Use Components</h2>
        <p className="md-p">Now you can use Choice UI components in your application:</p>
        <CodeBlock
          language="tsx"
          variant="dark"
        >
          <CodeBlock.Content>{`import { Button } from "@choice-ui/react"

function MyComponent() {
  return <Button>Click me</Button>
}`}</CodeBlock.Content>
        </CodeBlock>
      </section>
    </div>
  )
}
