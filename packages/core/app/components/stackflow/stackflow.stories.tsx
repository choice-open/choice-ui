import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Stackflow, useStackflowContext } from "."
import { Button } from "../button"

const meta: Meta<typeof Stackflow> = {
  title: "Navigation/Stackflow",
  component: Stackflow,
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof Stackflow>

// 导航控制组件
const NavigationControls = () => {
  const { push, back, clearHistory, canGoBack, history, current } = useStackflowContext()

  return (
    <div className="flex flex-col gap-4 border-b p-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Navigate to:</span>
        <Button
          variant="secondary"
          onClick={() => push("home")}
        >
          Home
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("about")}
        >
          About
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("contact")}
        >
          Contact
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("settings")}
        >
          Settings
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={!canGoBack}
          onClick={back}
        >
          Back
        </Button>
        <Button
          variant="link-danger"
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </div>
      <span className="text-secondary-foreground">
        Current: {current?.id || "None"} | History: [{history.join(" → ")}]
      </span>
    </div>
  )
}

// 页面内容组件
const PageContent = ({
  title,
  description,
  color = "blue",
}: {
  color?: string
  description: string
  title: string
}) => {
  const { push } = useStackflowContext()

  return (
    <div className="p-8">
      <h2 className={`text-2xl font-bold text-${color}-800 mb-4`}>{title}</h2>
      <p className={`text-${color}-600 mb-6`}>{description}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => push("home")}
        >
          Go to Home
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("about")}
        >
          Go to About
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("contact")}
        >
          Go to Contact
        </Button>
        <Button
          variant="secondary"
          onClick={() => push("settings")}
        >
          Go to Settings
        </Button>
      </div>
    </div>
  )
}

export const Basic: Story = {
  render: () => (
    <Stackflow
      className="w-96 overflow-hidden rounded-lg border shadow-lg"
      defaultId="about"
    >
      <Stackflow.Prefix>
        <NavigationControls />
      </Stackflow.Prefix>

      <Stackflow.Item id="home">
        <PageContent
          title="Home"
          description="Welcome to the home page! This is a non-linear navigation demo. You can click any button to go to other pages."
          color="blue"
        />
      </Stackflow.Item>

      <Stackflow.Item id="about">
        <PageContent
          title="About"
          description="This is the about page. From here you can jump to any other page, and the system will record your visit history."
          color="green"
        />
      </Stackflow.Item>

      <Stackflow.Item id="contact">
        <PageContent
          title="Contact"
          description="This is the contact page. Observe the top history record, you can see the complete access path."
          color="yellow"
        />
      </Stackflow.Item>

      <Stackflow.Item id="settings">
        <PageContent
          title="Settings"
          description="This is the settings page. Try clicking the 'Back' button, and you will return step by step according to the access history."
          color="purple"
        />
      </Stackflow.Item>

      <Stackflow.Suffix>
        <div className="text-secondary-foreground bg-secondary-background border-t p-4">
          Tip: This is a non-linear navigation - you can jump from any page to any page
        </div>
      </Stackflow.Suffix>
    </Stackflow>
  ),
}
