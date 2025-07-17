import { Search } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Badge } from "../badge"
import { TextField } from "./text-field"

const meta = {
  title: "Forms/TextField",
  component: TextField,
  tags: ["new"],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: function BasicStory() {
    return <TextField placeholder="Enter text" />
  },
}

export const WithPrefix: Story = {
  render: function WithPrefixStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Prefix className="text-secondary-foreground group-hover/text-field:text-default-foreground group-focus-within/text-field:text-default-foreground">
          <Search />
        </TextField.Prefix>
      </TextField>
    )
  },
}

export const WithSuffix: Story = {
  render: function WithSuffixStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Suffix className="px-1">
          <Badge>Suffix</Badge>
        </TextField.Suffix>
      </TextField>
    )
  },
}

export const WithPrefixAndSuffix: Story = {
  render: function WithPrefixAndSuffixStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Prefix className="text-secondary-foreground group-hover/text-field:text-default-foreground group-focus-within/text-field:text-default-foreground">
          <Search />
        </TextField.Prefix>
        <TextField.Suffix className="px-1">
          <Badge>Suffix</Badge>
        </TextField.Suffix>
      </TextField>
    )
  },
}

export const WithLabel: Story = {
  render: function WithLabelStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Label>Label</TextField.Label>
      </TextField>
    )
  },
}

export const WithDescription: Story = {
  render: function WithDescriptionStory() {
    return (
      <TextField placeholder="Enter text">
        <TextField.Description>{faker.lorem.words()}</TextField.Description>
      </TextField>
    )
  },
}

export const Size: Story = {
  render: function SizeStory() {
    return (
      <TextField
        placeholder="Enter text"
        size="large"
      />
    )
  },
}

export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <TextField
        placeholder="Enter text"
        disabled
      >
        <TextField.Label>Label</TextField.Label>
        <TextField.Description>Description</TextField.Description>
      </TextField>
    )
  },
}

export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    return (
      <TextField
        readOnly
        value="Read Only"
      />
    )
  },
}

export const Dark: Story = {
  render: function DarkStory() {
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
        <TextField
          variant="dark"
          placeholder="Enter text"
        >
          <TextField.Label description="This is a description">Label</TextField.Label>
          <TextField.Description>Description</TextField.Description>
        </TextField>
      </div>
    )
  },
}

export const DarkWithDisabled: Story = {
  render: function DarkWithDisabledStory() {
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
        <TextField
          variant="dark"
          placeholder="Enter text"
          disabled
        >
          <TextField.Label>Label</TextField.Label>
          <TextField.Description>Description</TextField.Description>
        </TextField>
      </div>
    )
  },
}

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("")
    return (
      <div className="flex flex-col gap-2">
        <TextField
          value={value}
          onChange={setValue}
        />
        <p className="text-secondary-foreground h-6">{value}</p>
      </div>
    )
  },
}
