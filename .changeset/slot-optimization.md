---
"@choice-ui/react": patch
---

perf: optimize Slot component and consumers to reduce unnecessary re-renders

- Simplify Slot component to be lightweight like Radix UI implementation
- Add useMemo caching for Slot props in Dropdown, Select, MultiSelect, Tooltip, Popover, and Menus components
- Add useEventCallback for stable event handler references
- Fix getReferenceProps causing unnecessary re-renders by caching the returned object
