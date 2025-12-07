export type KbdKey =
  | "command"
  | "windows"
  | "shift"
  | "ctrl"
  | "option"
  | "alt"
  | "enter"
  | "delete"
  | "backspace"
  | "escape"
  | "tab"
  | "capslock"
  | "up"
  | "right"
  | "down"
  | "left"
  | "pageup"
  | "pagedown"
  | "home"
  | "end"
  | "help"
  | "space"

export const kbdKeysMap: Record<KbdKey, string> = {
  command: "⌘",
  windows: "⊞",
  shift: "⇧",
  ctrl: "⌃",
  option: "⌥",
  alt: "⌥",
  enter: "↵",
  delete: "⌫",
  backspace: "⌫",
  escape: "⎋",
  tab: "⇥",
  capslock: "⇪",
  up: "↑",
  right: "→",
  down: "↓",
  left: "←",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘",
  help: "?",
  space: "␣",
}

export const kbdKeysLabelMap: Record<KbdKey, string> = {
  command: "Command",
  windows: "Windows",
  shift: "Shift",
  ctrl: "Control",
  option: "Option",
  alt: "Alt",
  enter: "Enter",
  delete: "Delete",
  backspace: "Backspace",
  escape: "Escape",
  tab: "Tab",
  capslock: "Caps Lock",
  up: "Up",
  right: "Right",
  down: "Down",
  left: "Left",
  pageup: "Page Up",
  pagedown: "Page Down",
  home: "Home",
  end: "End",
  help: "Help",
  space: "Space",
}

export type KbdKeysLabelType = typeof kbdKeysLabelMap
