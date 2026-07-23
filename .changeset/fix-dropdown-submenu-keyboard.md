---
"@choice-ui/dropdown": patch
"@choice-ui/menus": patch
---

Fix nested Dropdown keyboard interaction and accessibility.

- Open non-selectable submenus with Enter without dropping injected handlers.
- Keep nested portal content visible to assistive technology.
- Return focus to the parent SubTrigger when closing with ArrowLeft or Escape.
- Match horizontal open and close keys to the submenu's actual collision-adjusted side.
- Inherit disabled keyboard navigation across the menu tree.
- Add opt-in arrow-navigation submenu pre-opening without moving focus into the submenu.
