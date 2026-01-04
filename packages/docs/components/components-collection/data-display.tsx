import { memo } from "react"
import { Badge, CodeBlock, Kbd, MdRender, PicturePreview, Table } from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const DataDisplayCollection = memo(function DataDisplayCollection() {
  return (
    <CollectionSection
      title="Data Display"
      description="Components for presenting information, including tables, code blocks, and rich text rendering."
    >
      <ComponentCard
        title="Code Block"
        collection="data-display"
      >
        <CodeBlock
          language="tsx"
          className="absolute w-[180%] scale-55"
        >
          <CodeBlock.Content>
            {`
import React from 'react';

function TodoItem({ todo, onToggle }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
    </li>
  );
}`}
          </CodeBlock.Content>
        </CodeBlock>
      </ComponentCard>

      <ComponentCard
        title="Md Render"
        collection="data-display"
      >
        <MdRender className="absolute w-[200%] scale-50">
          {`
# Hello, world!

## Lorem ipsum
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus quasi dolorem, cum ratione accusantium vitae commodi minima dolorum beatae, adipisci odio!

- List item 1
- List item 2
- List item 3

1. List item 1
2. List item 2
3. List item 3
`}
        </MdRender>
      </ComponentCard>

      <ComponentCard
        title="Kbd"
        collection="data-display"
      >
        <div className="flex gap-2">
          <Kbd keys="command">K</Kbd>
          <Kbd keys="shift">S</Kbd>
          <Kbd keys="option">O</Kbd>
          <Kbd keys="ctrl">C</Kbd>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Table"
        collection="data-display"
      >
        <Table
          data={Array.from({ length: 11 }).map((_, index) => ({
            id: index,
            name: `User ${index}`,
            email: `user${index}@example.com`,
            role: "Admin",
            status: "active" as "active" | "inactive" | "pending",
          }))}
          getRowKey={(user) => user.id}
          selectable
          height={400}
          className="absolute w-[200%] scale-55"
        >
          <Table.Header>
            <Table.Column
              id="name"
              width={64}
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column id="email">
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="role"
              width={64}
            >
              <Table.Value>Role</Table.Value>
            </Table.Column>
            <Table.Column
              id="status"
              width={100}
            >
              <Table.Value>Status</Table.Value>
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {(
              user: {
                id: number
                name: string
                email: string
                role: string
                status: "active" | "inactive" | "pending"
              },
              index: number,
            ) => (
              <Table.Row
                rowKey={user.id}
                index={index}
              >
                <Table.Cell columnId="name">
                  <Table.Value>{user.name}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="email">
                  <Table.Value>{user.email}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="role">
                  <Table.Value>{user.role}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="status">
                  <Badge
                    variant={
                      user.status === "active"
                        ? "success"
                        : user.status === "inactive"
                          ? "error"
                          : "warning"
                    }
                  >
                    {user.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </ComponentCard>

      <ComponentCard
        title="Picture Preview"
        collection="data-display"
      >
        <PicturePreview
          className="rounded-lg"
          control={{
            show: "always",
          }}
          src="https://images.unsplash.com/photo-1745750747234-5df61f67a7bc?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Picture Preview"
        />
      </ComponentCard>
    </CollectionSection>
  )
})
