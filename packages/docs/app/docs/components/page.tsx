"use client"

import {
  AddTiny,
  CircleCheckLargeSolid,
  DeleteTiny,
  EllipsisVerticalSmall,
  File,
  FilePicture,
  FileSound,
  FileVideo,
  RatingHeartSolid,
  RemoveSmall,
} from "@choiceform/icons-react"
import Link from "next/link"
import { memo, useId } from "react"
import {
  Table,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Chip,
  ChipsInput,
  CodeBlock,
  Combobox,
  Command,
  ContextInput,
  createTimeToday,
  DateInput,
  DateRangeInput,
  Description,
  Dropdown,
  EmojiPicker,
  ErrorMessage,
  Hint,
  IconButton,
  Input,
  Kbd,
  Label,
  LinkButton,
  List,
  MdInput,
  MdRender,
  Menubar,
  Menus,
  Modal,
  MonthCalendar,
  MultiSelect,
  NumericInput,
  OtpInput,
  Pagination,
  Panel,
  ProgressBar,
  ProgressCircle,
  QuarterCalendar,
  RadioGroup,
  Range,
  ScrollArea,
  SearchInput,
  Segmented,
  Select,
  Separator,
  Skeleton,
  Stackflow,
  Switch,
  Tabs,
  Textarea,
  TextField,
  TimeInput,
  TimeRangeInput,
  ToggleButton,
  useForm,
  YearCalendar,
  PicturePreview,
} from "~/components"

const ComponentCard = memo(function ComponentCard({
  children,
  title,
  collection,
}: {
  children: React.ReactNode
  title: string
  collection?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={`/docs/components/${collection}/${title.toLowerCase().replaceAll(" ", "-")}`}
        className="cursor-pointer"
      >
        <div className="hover:border-disabled-background flex aspect-square flex-col rounded-xl border p-4">
          <div className="pointer-events-none relative flex aspect-square flex-1 flex-col items-center justify-center [&_*]:pointer-events-none">
            {children}
          </div>
        </div>
      </Link>
      <p className="text-body-medium px-1">{title}</p>
    </div>
  )
})

export default function ComponentsPage() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  })

  const uuid = useId()

  return (
    <div className="col-span-2 min-w-0 space-y-16">
      <div className="space-y-2">
        <h1 className="md-h1">All Components</h1>
        <p className="md-h3">
          Explore the full list of components available in the library. More are on the way.
        </p>
      </div>

      <div className="flex flex-col gap-y-8">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Buttons</h2>

          <ComponentCard
            title="Button"
            collection="buttons"
          >
            <Button>Button</Button>
          </ComponentCard>
          <ComponentCard
            title="Icon Button"
            collection="buttons"
          >
            <IconButton aria-label="Icon button">
              <RemoveSmall />
            </IconButton>
          </ComponentCard>
          <ComponentCard
            title="Link Button"
            collection="buttons"
          >
            <LinkButton>Link Button</LinkButton>
          </ComponentCard>

          <ComponentCard
            title="Toggle Button"
            collection="buttons"
          >
            <ToggleButton
              value={true}
              onChange={() => {}}
              aria-label="Toggle button"
              variant="highlight"
            >
              <RatingHeartSolid />
            </ToggleButton>
          </ComponentCard>

          <ComponentCard
            title="Segmented"
            collection="buttons"
          >
            <Segmented
              value={"photo"}
              onChange={() => {}}
            >
              <Segmented.Item
                value="photo"
                className="px-2"
              >
                Photo
              </Segmented.Item>
              <Segmented.Item
                value="video"
                className="px-2"
              >
                Video
              </Segmented.Item>
              <Segmented.Item
                value="audio"
                className="px-2"
              >
                Audio
              </Segmented.Item>
            </Segmented>
          </ComponentCard>

          <ComponentCard
            title="Chip"
            collection="buttons"
          >
            <Chip>Chip</Chip>
          </ComponentCard>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Collections</h2>
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
            title="Menuar"
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
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Forms</h2>

          <ComponentCard
            title="Checkbox"
            collection="forms"
          >
            <div className="flex flex-col gap-2">
              <Checkbox
                value={false}
                onChange={() => {}}
              >
                <Checkbox.Label>False</Checkbox.Label>
              </Checkbox>
              <Checkbox
                value={true}
                variant="accent"
                onChange={() => {}}
              >
                <Checkbox.Label>True</Checkbox.Label>
              </Checkbox>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Radio"
            collection="forms"
          >
            <RadioGroup
              value="option-1"
              onChange={() => {}}
              variant="accent"
            >
              <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
              <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
              <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
            </RadioGroup>
          </ComponentCard>

          <ComponentCard
            title="Input"
            collection="forms"
          >
            <Input
              className="w-full"
              placeholder="Enter your email"
            />
          </ComponentCard>

          <ComponentCard
            title="Textarea"
            collection="forms"
          >
            <Textarea
              className="w-full"
              placeholder="Enter your message"
            />
          </ComponentCard>

          <ComponentCard
            title="Chips Input"
            collection="forms"
          >
            <ChipsInput
              placeholder="Enter your message"
              className="w-full"
              value={["option-1", "option-2"]}
              onChange={() => {}}
            />
          </ComponentCard>

          <ComponentCard
            title="Numeric Input"
            collection="forms"
          >
            <NumericInput
              className="w-full"
              value={10}
              onChange={() => {}}
              classNames={{
                input: "px-2",
              }}
            >
              <NumericInput.Prefix
                type="action"
                className="mr-px"
              >
                <IconButton className="rounded-r-none">
                  <DeleteTiny />
                </IconButton>
              </NumericInput.Prefix>
              <NumericInput.Suffix
                type="action"
                className="ml-px"
              >
                <IconButton className="rounded-l-none">
                  <AddTiny />
                </IconButton>
              </NumericInput.Suffix>
            </NumericInput>
          </ComponentCard>

          <ComponentCard
            title="Search Input"
            collection="forms"
          >
            <SearchInput
              className="w-full"
              placeholder="Enter your search"
              value="Search"
              onChange={() => {}}
            />
          </ComponentCard>

          <ComponentCard
            title="Range"
            collection="forms"
          >
            <Range
              className="w-full"
              value={50}
              min={0}
              max={100}
              step={1}
              onChange={() => {}}
              trackSize={{
                width: "auto",
              }}
            />
          </ComponentCard>

          <ComponentCard
            title="Switch"
            collection="forms"
          >
            <div className="flex gap-2">
              <Switch
                variant="accent"
                value={false}
                onChange={() => {}}
              />
              <Switch
                variant="accent"
                value={true}
                onChange={() => {}}
              />
            </div>
          </ComponentCard>

          <ComponentCard
            title="Otp Input"
            collection="forms"
          >
            <OtpInput
              maxLength={4}
              value="1"
            >
              <OtpInput.Group>
                <OtpInput.Slot index={0} />
                <OtpInput.Slot index={1} />
              </OtpInput.Group>
              <OtpInput.Separator />
              <OtpInput.Group>
                <OtpInput.Slot index={2} />
                <OtpInput.Slot index={4} />
              </OtpInput.Group>
            </OtpInput>
          </ComponentCard>

          <ComponentCard
            title="Label"
            collection="forms"
          >
            <div className="flex w-full flex-col gap-2">
              <Label
                htmlFor="label"
                required
              >
                Email
              </Label>
              <Input
                id="label"
                placeholder="Enter your email"
              />
            </div>
          </ComponentCard>

          <ComponentCard
            title="Description"
            collection="forms"
          >
            <div className="flex w-full flex-col gap-2">
              <Input
                id="description"
                placeholder="Enter your email"
              />
              <Description id="description">
                We&apos;ll never share your email with anyone else.
              </Description>
            </div>
          </ComponentCard>

          <ComponentCard
            title="ErrorMessage"
            collection="forms"
          >
            <div className="flex w-full flex-col gap-2">
              <Input
                id="error-message"
                placeholder="Enter your email"
              />
              <ErrorMessage id="error-message">Please enter a valid email address.</ErrorMessage>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Text Field"
            collection="forms"
          >
            <TextField
              value="John Doe"
              onChange={() => {}}
              className="w-full"
            >
              <TextField.Label required>Your Name</TextField.Label>
              <TextField.Description>
                We&apos;ll never share with anyone else.
              </TextField.Description>
            </TextField>
          </ComponentCard>

          <ComponentCard
            title="Context Input"
            collection="forms"
          >
            <ContextInput
              value={{
                text: "Hello, @John Doe!",
                mentions: [
                  {
                    startIndex: 7,
                    endIndex: 16,
                    text: "@John Doe",
                    item: {
                      id: "1",
                      type: "user",
                      label: "John Doe",
                    },
                  },
                ],
              }}
              onChange={() => {}}
              placeholder="Type @ to mention someone..."
              className="w-full"
            />
          </ComponentCard>
          <ComponentCard
            title="Md Input"
            collection="forms"
          >
            <MdInput
              className="w-full"
              value="### Hello, world!\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2"
              onChange={() => {}}
            >
              <MdInput.Header>
                <MdInput.Tabs />
              </MdInput.Header>
              <MdInput.Container>
                <MdInput.Editor placeholder="Enter markdown..." />
                <MdInput.Render />
              </MdInput.Container>
            </MdInput>
          </ComponentCard>

          <ComponentCard
            title="Form"
            collection="forms"
          >
            <form
              className="w-full space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <form.Field
                name={`username-${uuid}`}
                validators={{
                  onChange: ({ value }) => {
                    if (!value || (value as string).length < 3) {
                      return "Username must be at least 3 characters"
                    }
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    name={field.name}
                    label="Username"
                    value={field.state.value as string}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Enter username"
                    error={field.state.meta.errors.join(", ")}
                  />
                )}
              </form.Field>

              <form.Field
                name={`email-${uuid}`}
                validators={{
                  onBlur: ({ value }) => {
                    if (!value || (value as string).length < 3) {
                      return "Email must be at least 3 characters"
                    }
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    name={field.name}
                    label="onBlur validation"
                    value={field.state.value as string}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Enter email"
                    error={field.state.meta.errors.join(", ")}
                  />
                )}
              </form.Field>

              <form.Button type="submit">Submit</form.Button>
            </form>
          </ComponentCard>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Date & Time</h2>
          <ComponentCard
            title="Date Input"
            collection="date-and-time"
          >
            <DateInput
              value={new Date("2026-01-01")}
              onChange={() => {}}
            />
          </ComponentCard>
          <ComponentCard
            title="Date Range Input"
            collection="date-and-time"
          >
            <Panel.Row
              type="two-input-two-icon"
              className="w-[120%] scale-90 px-0"
            >
              <DateRangeInput
                startValue={new Date("2026-01-01")}
                endValue={new Date("2026-01-02")}
              />
            </Panel.Row>
          </ComponentCard>

          <ComponentCard
            title="Month Calendar"
            collection="date-and-time"
          >
            <MonthCalendar
              className="absolute top-0 w-full bg-transparent"
              value={new Date("2026-01-01")}
              onChange={() => {}}
              showOutsideDays={false}
            />
          </ComponentCard>

          <ComponentCard
            title="Time Input"
            collection="date-and-time"
          >
            <TimeInput
              value={createTimeToday(12, 0)}
              onChange={() => {}}
            />
          </ComponentCard>

          <ComponentCard
            title="Time Range Input"
            collection="date-and-time"
          >
            <Panel.Row
              type="two-input-two-icon"
              className="w-[120%] scale-90 px-0"
            >
              <TimeRangeInput
                startValue={createTimeToday(12, 0)}
                endValue={createTimeToday(14, 0)}
                onStartChange={() => {}}
                onEndChange={() => {}}
              />
            </Panel.Row>
          </ComponentCard>

          <ComponentCard
            title="Time Calendar"
            collection="date-and-time"
          >
            <Menus className="!z-2 scale-75">
              <Menus.Item>
                <Menus.Value>12:00</Menus.Value>
              </Menus.Item>
              <Menus.Item>
                <Menus.Value>13:00</Menus.Value>
              </Menus.Item>
              <Menus.Item>
                <Menus.Value>14:00</Menus.Value>
              </Menus.Item>
              <Menus.Item>
                <Menus.Value>15:00</Menus.Value>
              </Menus.Item>
              <Menus.Item>
                <Menus.Value>16:00</Menus.Value>
              </Menus.Item>
              <Menus.Item>
                <Menus.Value>17:00</Menus.Value>
              </Menus.Item>
              <Menus.Item>
                <Menus.Value>18:00</Menus.Value>
              </Menus.Item>
            </Menus>
          </ComponentCard>

          <ComponentCard
            title="Quarter Calendar"
            collection="date-and-time"
          >
            <QuarterCalendar
              className="w-full bg-transparent"
              value={{
                quarter: 1,
                year: 2026,
                label: "Q1 2026",
                months: ["January", "February", "March"],
              }}
              onChange={() => {}}
            />
          </ComponentCard>

          <ComponentCard
            title="Year Calendar"
            collection="date-and-time"
          >
            <YearCalendar
              className="w-full bg-transparent"
              value={new Date(2026, 0, 1)}
              onChange={() => {}}
            />
          </ComponentCard>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Navigation</h2>
          <ComponentCard
            title="Tabs"
            collection="navigation"
          >
            <Tabs
              value="home"
              onChange={() => {}}
            >
              <Tabs.Item value="home">Home</Tabs.Item>
              <Tabs.Item value="settings">Settings</Tabs.Item>
              <Tabs.Item value="analytics">Analytics</Tabs.Item>
            </Tabs>
          </ComponentCard>

          <ComponentCard
            title="Pagination"
            collection="navigation"
          >
            <Pagination
              currentPage={1}
              totalItems={100}
              itemsPerPage={10}
              onPageChange={() => {}}
              onItemsPerPageChange={() => {}}
            >
              <Pagination.Navigation />
            </Pagination>
          </ComponentCard>

          <ComponentCard
            title="Stackflow"
            collection="navigation"
          >
            <Stackflow
              className="w-full rounded-xl border"
              defaultId="page1"
            >
              {/* Fixed header - does not scroll with page content */}
              <Stackflow.Prefix>
                <div className="flex items-center justify-between border-b p-3">
                  <Button variant="secondary">←</Button>
                  <span className="font-strong">Page 1</span>
                  <Button variant="primary">→</Button>
                </div>
              </Stackflow.Prefix>

              {/* Page 1 */}
              <Stackflow.Item id="page1">
                <div className="p-4">
                  <h3 className="font-strong mb-2">Page 1</h3>
                  <p className="text-secondary-foreground">
                    Click &quot;Next&quot; to navigate to Page 2.
                  </p>
                </div>
              </Stackflow.Item>

              {/* Page 2 */}
              <Stackflow.Item id="page2">
                <div className="p-4">
                  <h3 className="font-strong mb-2">Page 2</h3>
                  <p className="text-secondary-foreground">
                    Click &quot;Back&quot; to return, or &quot;Next&quot; to continue.
                  </p>
                </div>
              </Stackflow.Item>

              {/* Page 3 */}
              <Stackflow.Item id="page3">
                <div className="p-4">
                  <h3 className="font-strong mb-2">Page 3</h3>
                  <p className="text-secondary-foreground">
                    This is the last page. Click &quot;Back&quot; to return.
                  </p>
                </div>
              </Stackflow.Item>
            </Stackflow>
          </ComponentCard>

          <h2 className="md-h3 col-span-full mb-0">Feedback</h2>
          <ComponentCard
            title="Avatar"
            collection="feedback"
          >
            <div className="flex gap-2">
              <Avatar
                photo="https://github.com/shadcn.png"
                name="John Doe"
              />
              <Avatar name="John Doe" />
            </div>
          </ComponentCard>

          <ComponentCard
            title="Badge"
            collection="feedback"
          >
            <div className="flex gap-2">
              <Badge>Badge</Badge>
              <Badge variant="brand">Badge</Badge>
              <Badge variant="success">Badge</Badge>
              <Badge variant="warning">Badge</Badge>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Hint"
            collection="feedback"
          >
            <Hint>
              <Hint.Content>Hint</Hint.Content>
            </Hint>
          </ComponentCard>

          <ComponentCard
            title="Progress Bar"
            collection="feedback"
          >
            <ProgressBar
              value={50}
              showValue
            >
              <ProgressBar.Label>Progress</ProgressBar.Label>
              <ProgressBar.Track>
                <ProgressBar.Connects />
              </ProgressBar.Track>
            </ProgressBar>
          </ComponentCard>

          <ComponentCard
            title="Progress Circle"
            collection="feedback"
          >
            <ProgressCircle value={50}>
              <ProgressCircle.Value />
            </ProgressCircle>
          </ComponentCard>

          <ComponentCard
            title="Skeleton"
            collection="feedback"
          >
            <div className="flex w-full flex-col items-start gap-2">
              <Skeleton loading>
                <p>Quisquam, quos.</p>
              </Skeleton>

              <Skeleton loading>
                <Input
                  placeholder="Enter text..."
                  className="w-full"
                />
              </Skeleton>
              <Skeleton loading>
                <Button variant="primary">Click me</Button>
              </Skeleton>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Toast"
            collection="feedback"
          >
            <div className="bg-menu-background grid grid-cols-[1fr_auto] rounded-lg text-white">
              <div className="grid min-h-14 grid-cols-[1.5rem_1fr] gap-x-2 px-2 py-3">
                <div className="row-span-2 flex h-6 w-6 shrink-0 items-center justify-center self-center">
                  <CircleCheckLargeSolid className="text-success-foreground" />
                </div>
                <p className="text-body-medium-strong">Success</p>
                <p className="text-body-medium opacity-70">The operation was successful.</p>
              </div>
              <div className="border-menu-boundary flex items-center justify-center self-stretch border-l px-2">
                Close
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Overlays</h2>

          <ComponentCard
            title="Alert Dialog"
            collection="overlays"
          >
            <Modal className="absolute w-[180%] max-w-none scale-55">
              <Modal.Header
                title="Delete User"
                onClose={() => {}}
                className="border-none"
              />
              <Modal.Content className="flex flex-col gap-4 p-4">
                This action cannot be undone. Are you sure you want to delete this item?
              </Modal.Content>
              <Modal.Footer className="justify-end border-none">
                <Button variant="secondary">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </Modal.Footer>
            </Modal>
          </ComponentCard>

          <ComponentCard
            title="Dialog"
            collection="overlays"
          >
            <Modal className="absolute w-[180%] max-w-none scale-55">
              <Modal.Header
                title="Create a new user"
                onClose={() => {}}
              />
              <Modal.Content className="flex flex-col gap-4 p-4">
                <Modal.Input
                  label="Username"
                  placeholder="Enter username"
                />
                <Modal.Textarea
                  label="Description"
                  placeholder="Enter description"
                />
              </Modal.Content>
              <Modal.Footer className="justify-end">
                <Button variant="secondary">Cancel</Button>
                <Button>Save</Button>
              </Modal.Footer>
            </Modal>
          </ComponentCard>

          <ComponentCard
            title="Popover"
            collection="overlays"
          >
            <div className="relative mt-12 mb-auto scale-75">
              <Button>Click me</Button>
              <Modal className="absolute top-8 left-1/2 -translate-x-1/2">
                <Modal.Header
                  title="Popover Title"
                  onClose={() => {}}
                />
                <Modal.Content className="flex w-64 flex-col gap-4 p-4">
                  This is a popover content. It will be displayed when the button is clicked.
                </Modal.Content>
              </Modal>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Tooltip"
            collection="overlays"
          >
            <div className="relative">
              <Button>Hover me</Button>
              <div className="bg-menu-background absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-white shadow-md">
                <div className="bg-menu-background absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
                Tooltip
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Layouts</h2>
          <ComponentCard
            title="Scroll Area"
            collection="layouts"
          >
            <ScrollArea
              className="bg-secondary-background absolute h-full w-full overflow-hidden rounded-lg"
              type="always"
            >
              <ScrollArea.Viewport>
                <ScrollArea.Content>
                  <div className="flex flex-col gap-4 p-4">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                      non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed
                      porttitor quam. Morbi accumsan cursus enim, sed ultricies sapien.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                      non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed
                      porttitor quam. Morbi accumsan cursus enim, sed ultricies sapien.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                      non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed
                      porttitor quam. Morbi accumsan cursus enim, sed ultricies sapien.
                    </p>
                  </div>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
          </ComponentCard>

          <ComponentCard
            title="Separator"
            collection="layouts"
          >
            <Separator className="w-full">OR</Separator>
          </ComponentCard>

          <ComponentCard
            title="Splitter"
            collection="layouts"
          >
            <div className="bg-secondary-background grid size-full grid-cols-2 grid-rows-2 rounded-lg">
              <div className="bg-primary-background text-body-large-strong text-secondary-foreground border-default-background col-span-1 row-span-1 flex items-center justify-center border-b-2 p-4">
                1
              </div>
              <div className="bg-primary-background text-body-large-strong text-secondary-foreground border-default-background col-span-1 row-span-2 flex items-center justify-center border-l-2 p-4">
                2
              </div>
              <div className="bg-primary-background text-body-large-strong text-secondary-foreground col-span-1 row-span-1 flex items-center justify-center p-4">
                3
              </div>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Virtualized Grid"
            collection="layouts"
          >
            <div className="bg-secondary-background grid size-full grid-cols-4 grid-rows-4 rounded-lg p-1">
              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  key={index}
                  className="text-body-large-strong text-secondary-foreground col-span-1 row-span-1 flex items-center justify-center p-1"
                >
                  <div className="bg-default-background flex h-full w-full items-center justify-center rounded-md">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Data Display</h2>

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
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
          <h2 className="md-h3 col-span-full mb-0">Pickers</h2>
          <ComponentCard
            title="Emoji Picker"
            collection="pickers"
          >
            <EmojiPicker
              showSearch={false}
              showCategories={false}
              className="absolute scale-50 rounded-lg"
              height={360}
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  )
}
