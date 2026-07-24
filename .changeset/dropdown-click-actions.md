---
"@choice-ui/calendar": patch
"@choice-ui/colors": patch
"@choice-ui/comments": patch
"@choice-ui/conditions": patch
"@choice-ui/menus": patch
"@choice-ui/menubar": patch
"@choice-ui/picture-preview": patch
---

Restore submenu arrow-navigation forwarding in the published React bundle, allow Menubar to pass
the same option through, and make click the canonical Dropdown action event. Preserve keyboard
activation for consumers that still use the legacy `onMouseUp` item callback without duplicating
pointer activation. Explicitly route Enter and Space keydown events through the click action path,
including moving focus into a submenu that arrow navigation already opened.
