declare module "is-hotkey" {
  export default function isHotkey(
    hotkey: string | string[],
    event: KeyboardEvent | React.KeyboardEvent,
  ): boolean

  export function isCodeHotkey(
    hotkey: string | string[],
    event: KeyboardEvent | React.KeyboardEvent,
  ): boolean

  export function isKeyHotkey(
    hotkey: string | string[],
    event: KeyboardEvent | React.KeyboardEvent,
  ): boolean

  export function isModHotkey(
    hotkey: string | string[],
    event: KeyboardEvent | React.KeyboardEvent,
  ): boolean
}
