import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Descendant } from "slate"
import { Avatar } from "../../avatar"
import { CommentInput } from "./comment-input"
import type { User } from "../types"

const meta = {
  title: "Pickers/Comments/CommentInput",
  component: CommentInput,
} satisfies Meta<typeof CommentInput>

export default meta
type Story = StoryObj<typeof meta>

const mockUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: `user-${i}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  photo_url: `https://i.pravatar.cc/150?img=${i + 1}`,
  color: null,
}))

// 基本的评论输入组件
const BasicCommentInput = ({
  users,
  placeholder,
  variant,
}: {
  placeholder?: string
  users?: User[]
  variant?: "default" | "solid"
}) => {
  const [value, setValue] = useState<Descendant[]>([])

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue)
  }

  const handleSubmit = (data: Descendant[]) => {
    console.log("Submitted:", data)
    // Clear editor content after submission
    setValue([])
  }

  return (
    <div className="flex w-96 flex-col gap-4">
      <div className="grid grid-cols-[30px_1fr] items-start gap-2">
        <div>
          <Avatar
            photo="https://github.com/shadcn.png"
            name="You"
            size="small"
          />
        </div>
        <div className="flex flex-col">
          <CommentInput
            className="w-full"
            variant={variant}
            placeholder={placeholder}
            users={users}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <BasicCommentInput
      users={mockUsers}
      placeholder="Add a comment, use @ to mention users..."
    />
  ),
}

export const Solid: Story = {
  render: () => (
    <BasicCommentInput
      users={mockUsers}
      placeholder="Add a comment, use @ to mention users..."
      variant="solid"
    />
  ),
}

export const NoUsers: Story = {
  render: () => <BasicCommentInput placeholder="This example has no users to @mention" />,
}
