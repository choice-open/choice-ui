import {
  EllipsisVerticalSmall,
  File,
  FilePicture,
  FileSound,
  FileVideo,
} from "@choiceform/icons-react"
import { memo } from "react"
import { Combobox, Command, Dropdown, List, Menubar, Menus, MultiSelect, Select } from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const CollectionsCollection = memo(function CollectionsCollection() {
  return (
    <CollectionSection
      title="Collections"
      description="Components for displaying and selecting from lists of options, including dropdowns, menus, and searchable lists."
    >
      <ComponentCard
        title="Combobox"
        collection="collections"
      >
        <Combobox>
          <Combobox.Trigger placeholder="Search fruits..." />
          <Combobox.Content>
            <Combobox.Item>
              <Combobox.Value>Item 1</Combobox.Value>
            </Combobox.Item>
          </Combobox.Content>
        </Combobox>
      </ComponentCard>

      <ComponentCard
        title="Command"
        collection="collections"
      >
        <Command className="scale-75 overflow-hidden rounded-xl shadow-lg">
          <Command.Input placeholder="Type a command or search..." />
          <Command.List>
            <Command.Item prefixElement={<File />}>File</Command.Item>
            <Command.Item prefixElement={<FilePicture />}>Picture</Command.Item>
            <Command.Item prefixElement={<FileVideo />}>Video</Command.Item>
            <Command.Item prefixElement={<FileSound />}>Audio</Command.Item>
          </Command.List>
        </Command>
      </ComponentCard>

      <ComponentCard
        title="Context Menu"
        collection="collections"
      >
        <div className="bg-secondary-background text-secondary-foreground mt-6 mb-auto rounded-lg border border-dashed p-4">
          Right click me to open context menu
        </div>
        <Menus
          className="!z-2 scale-75"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        >
          <Menus.Item>
            <Menus.Value>Item 1</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>Item 2</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>Item 3</Menus.Value>
          </Menus.Item>
          <Menus.Divider />
          <Menus.Item>
            <Menus.Value>Item 4</Menus.Value>
          </Menus.Item>
          <Menus.Item>
            <Menus.Value>Item 5</Menus.Value>
          </Menus.Item>
        </Menus>
      </ComponentCard>

      <ComponentCard
        title="Dropdown"
        collection="collections"
      >
        <Dropdown>
          <Dropdown.Trigger>Open Dropdown</Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item>Item 1</Dropdown.Item>
            <Dropdown.Item>Item 2</Dropdown.Item>
            <Dropdown.Item>Item 3</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </ComponentCard>

      <ComponentCard
        title="List"
        collection="collections"
      >
        <List className="w-full">
          <List.Content>
            <List.Item>
              <List.Value>Home</List.Value>
            </List.Item>
            <List.SubTrigger
              id="docs"
              defaultOpen
            >
              <List.Value>Documents</List.Value>
            </List.SubTrigger>
            <List.Content parentId="docs">
              <List.Item>
                <List.Value>Getting Started</List.Value>
              </List.Item>
              <List.Item>
                <List.Value>Components</List.Value>
              </List.Item>
              <List.Item>
                <List.Value>API Reference</List.Value>
              </List.Item>
            </List.Content>
            <List.Item>
              <List.Value>Settings</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </ComponentCard>

      <ComponentCard
        title="Menubar"
        collection="collections"
      >
        <Menubar className="rounded-lg border p-1">
          <Menubar.Item>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>New</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>

          <Menubar.Item>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Cut</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>

          <Menubar.Item>
            <Menubar.Trigger>View</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Zoom In</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>

          <Menubar.Divider />

          <Menubar.Item>
            <Menubar.Trigger className="w-6 justify-center px-0">
              <EllipsisVerticalSmall />
            </Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Print</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>
        </Menubar>
      </ComponentCard>

      <ComponentCard
        title="Multi Select"
        collection="collections"
      >
        <MultiSelect
          values={["option-1", "option-2"]}
          onChange={() => {}}
        >
          <MultiSelect.Trigger
            placeholder="Select options..."
            getDisplayValue={(value) => value}
          />
          <MultiSelect.Content>
            <MultiSelect.Label>Available Options</MultiSelect.Label>
            <MultiSelect.Item value="option-1">Option 1</MultiSelect.Item>
            <MultiSelect.Item value="option-2">Option 2</MultiSelect.Item>
            <MultiSelect.Item value="option-3">Option 3</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>
      </ComponentCard>

      <ComponentCard
        title="Select"
        collection="collections"
      >
        <Select>
          <Select.Trigger>Select</Select.Trigger>
          <Select.Content>
            <Select.Item value="option-1">Option 1</Select.Item>
            <Select.Item value="option-2">Option 2</Select.Item>
            <Select.Item value="option-3">Option 3</Select.Item>
          </Select.Content>
        </Select>
      </ComponentCard>
    </CollectionSection>
  )
})
