export { Command as CommandRoot, defaultFilter } from "./command"
export { useCommandState } from "./hooks"

import { Command as CommandRoot } from "./command"
import { TabItem } from "@choiceform/tabs"
import {
  CommandDivider,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandTabs,
  CommandValue,
} from "./components"

export const Command = Object.assign(CommandRoot, {
  Empty: CommandEmpty,
  Footer: CommandFooter,
  Group: CommandGroup,
  Input: CommandInput,
  Item: CommandItem,
  List: CommandList,
  Loading: CommandLoading,
  Divider: CommandDivider,
  Value: CommandValue,
  Tabs: CommandTabs,
  TabItem: TabItem,
})
