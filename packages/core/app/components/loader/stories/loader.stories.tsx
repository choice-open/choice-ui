import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Loader } from "../src/loader"
import { Button } from "@choiceform/button"
import {
  WorkspaceSettings as Settings,
  WorkspaceDownload as Download,
  WorkflowFile as File,
  CircleSuccessSolid as CheckCircle,
  CirclePlaySolid as PlayIcon,
  CirclePauseSolid as PauseIcon,
  CloudUpload,
  CloudDownload,
  CloudCheck,
  RefreshAll,
  Wifi,
  WifiOff,
  Lock,
  Packaged,
  PackagedAdd,
  ActionCodeBlock,
  Bolt,
  BoltSolid,
  FitScreen,
  Publish,
} from "@choiceform/icons-react"

const meta = {
  title: "Layouts/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stages: [
      { label: "Initializing", icon: <Settings /> },
      { label: "Loading data", icon: <Download /> },
      { label: "Processing", icon: <RefreshAll /> },
      { label: "Almost done", icon: <CheckCircle /> },
    ],
  },
}

export const WithMultipleIcons: Story = {
  args: {
    stages: [
      {
        label: "Connecting",
        icon: [<Wifi key="1" />, <WifiOff key="2" />, <Wifi key="3" />],
      },
      {
        label: "Authenticating",
        icon: [<Lock key="1" />, <Lock key="2" />, <Lock key="3" />],
      },
      {
        label: "Fetching data",
        icon: [<CloudDownload key="1" />, <CloudUpload key="2" />, <CloudCheck key="3" />],
      },
      {
        label: "Complete",
        icon: <CheckCircle />,
      },
    ],
    duration: 4000,
  },
}

export const Controlled: Story = {
  args: {
    stages: [],
  },
  render: function Controlled() {
    const [stage, setStage] = useState(0)

    const stages = [
      { label: "Step 1", icon: <Packaged /> },
      { label: "Step 2", icon: <PackagedAdd /> },
      { label: "Step 3", icon: <Publish /> },
      { label: "Delivered", icon: <CheckCircle /> },
    ]

    return (
      <div className="flex flex-col items-center gap-8">
        <Loader
          stages={stages}
          currentStage={stage}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setStage(0)}
            variant={stage === 0 ? "primary" : "secondary"}
          >
            Step 1
          </Button>
          <Button
            onClick={() => setStage(1)}
            variant={stage === 1 ? "primary" : "secondary"}
          >
            Step 2
          </Button>
          <Button
            onClick={() => setStage(2)}
            variant={stage === 2 ? "primary" : "secondary"}
          >
            Step 3
          </Button>
          <Button
            onClick={() => setStage(3)}
            variant={stage === 3 ? "primary" : "secondary"}
          >
            Complete
          </Button>
        </div>
      </div>
    )
  },
}

export const FastAnimation: Story = {
  args: {
    stages: [
      { label: "Loading", icon: <RefreshAll /> },
      { label: "Processing", icon: <BoltSolid /> },
      { label: "Done", icon: <CheckCircle /> },
    ],
    duration: 1000,
  },
}

export const BuildProcess: Story = {
  args: {
    stages: [
      {
        label: "Installing dependencies",
        icon: [<Packaged key="1" />, <PackagedAdd key="2" />, <CheckCircle key="3" />],
      },
      {
        label: "Compiling",
        icon: [
          <ActionCodeBlock key="1" />,
          <ActionCodeBlock key="2" />,
          <ActionCodeBlock key="3" />,
        ],
      },
      {
        label: "Building",
        icon: [<Bolt key="1" />, <BoltSolid key="2" />, <Settings key="3" />],
      },
      {
        label: "Optimizing",
        icon: <BoltSolid />,
      },
      {
        label: "Build complete",
        icon: <Publish />,
      },
    ],
    duration: 5000,
  },
}

export const FileUpload: Story = {
  args: {
    stages: [
      {
        label: "Preparing upload",
        icon: <File />,
      },
      {
        label: "Uploading",
        icon: [<CloudUpload key="1" />, <CloudUpload key="2" />, <CloudCheck key="3" />],
      },
      {
        label: "Processing",
        icon: [<BoltSolid key="1" />, <RefreshAll key="2" />],
      },
      {
        label: "Upload complete",
        icon: <CheckCircle />,
      },
    ],
    duration: 3000,
  },
}

export const WithCallback: Story = {
  args: {
    stages: [],
  },
  render: function WithCallback() {
    const [log, setLog] = useState<string[]>([])

    const stages = [
      { label: "Start", icon: <PlayIcon /> },
      { label: "Middle", icon: <PauseIcon /> },
      { label: "End", icon: <FitScreen /> },
    ]

    const handleStageChange = (stage: number) => {
      setLog((prev) => [...prev, `Changed to stage ${stage}: ${stages[stage].label}`])
    }

    return (
      <div className="flex flex-col items-center gap-8">
        <Loader
          stages={stages}
          onStageChange={handleStageChange}
        />
        <div className="bg-secondary/20 mt-4 max-h-32 w-80 overflow-auto rounded-lg p-4">
          <div className="font-mono text-xs">
            {log.length === 0 ? (
              <span className="text-muted-foreground">Stage changes will appear here...</span>
            ) : (
              log.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
      </div>
    )
  },
}
