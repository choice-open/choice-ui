import type { Meta, StoryObj } from "@storybook/react"

// const meta = {
//   title: "Pickers/EmojiPicker",
//   // component: EmojiPicker,
//   tags: ["beta"],
// } satisfies Meta<typeof EmojiPicker>

// export default meta
// type Story = StoryObj<typeof meta>

/**
 * `EmojiPicker` is a component for selecting emojis from a categorized and searchable interface.
 *
 * Features:
 * - Categorized emoji display with tabs
 * - Search functionality for finding specific emojis
 * - Recently used emojis section
 * - Skin tone selector for applicable emojis
 * - Keyboard navigation support
 * - Native emoji rendering
 *
 * Usage Guidelines:
 * - Use within popover/dropdown components for inline emoji selection
 * - Integrate with text inputs for emoji insertion
 * - Provide adequate space as the picker has a fixed minimum size
 * - Handle emoji selection through the onEmojiSelect callback
 *
 * Accessibility:
 * - Supports keyboard navigation
 * - Provides ARIA attributes for screen readers
 * - Includes emoji descriptions for assistive technologies
 */

/**
 * Basic: Demonstrates the EmojiPicker component in its simplest form.
 *
 * This example shows the emoji picker directly rendered on the page,
 * displaying all its features including categories, search, and skin tone selection.
 */
// export const Basic: Story = {
//   render: function BasicStory() {
//     return (
//       <div className="p-4">
//         <EmojiPicker />
//       </div>
//     )
//   },
// }

/**
 * WithPopover: Demonstrates integrating the EmojiPicker with a Popover component.
 *
 * Features:
 * - Emoji picker shown on demand in a popover
 * - Selected emoji displayed in the trigger button
 * - Popover automatically closes when an emoji is selected
 * - Maintains selected emoji state
 *
 * This pattern is useful for:
 * - Adding emoji reactions to messages or comments
 * - Selecting emoji statuses or indicators
 * - Implementing emoji pickers within text editors
 */
// export const WithPopover: Story = {
//   render: function PopoverStory() {
//     const [selectedEmoji, setSelectedEmoji] = useState<string>("")
//     const [open, setOpen] = useState(false)

//     const handleEmojiSelect = (emoji: EmojiData) => {
//       setSelectedEmoji(emoji.native)
//     }

//     return (
//       <>
//         <Popover
//           open={open}
//           onOpenChange={setOpen}
//         >
//           <Popover.Trigger>
//             <IconButton className="text-lg">{selectedEmoji || <RatingSmileRegular />}</IconButton>
//           </Popover.Trigger>
//           <Popover.Content>
//             <EmojiPicker
//               onEmojiSelect={(emoji) => {
//                 handleEmojiSelect(emoji)
//                 setOpen(false)
//               }}
//             />
//           </Popover.Content>
//         </Popover>
//       </>
//     )
//   },
// }
