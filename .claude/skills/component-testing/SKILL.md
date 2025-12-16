---
name: component-testing
description: Write and run tests for Choice UI components using Vitest and Testing Library. Use when writing component tests, debugging test failures, or adding test coverage.
---

# Choice UI Component Testing

## Test Setup

- **Framework**: Vitest 4.x
- **Testing Library**: @testing-library/react 16.x
- **Location**: `packages/core/app/components/{name}/src/__tests__/`

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Vitest UI
pnpm test:ui

# Core package only
pnpm test:core

# Single component
pnpm --filter @choice-ui/{component} test
```

## Test File Template

```typescript
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { {Component} } from "../{component-name}"

describe("{Component}", () => {
  // Rendering tests
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<{Component}>Content</{Component}>)
      expect(screen.getByText("Content")).toBeInTheDocument()
    })

    it("renders with custom className", () => {
      render(<{Component} className="custom">Content</{Component}>)
      expect(screen.getByText("Content")).toHaveClass("custom")
    })

    it("forwards ref correctly", () => {
      const ref = vi.fn()
      render(<{Component} ref={ref}>Content</{Component}>)
      expect(ref).toHaveBeenCalled()
    })
  })

  // Variant tests
  describe("variants", () => {
    it("applies variant classes correctly", () => {
      const { rerender } = render(<{Component} variant="primary">Content</{Component}>)
      // Assert primary variant styles

      rerender(<{Component} variant="default">Content</{Component}>)
      // Assert default variant styles
    })

    it("applies size classes correctly", () => {
      render(<{Component} size="lg">Content</{Component}>)
      // Assert large size styles
    })
  })

  // Interaction tests
  describe("interactions", () => {
    it("handles click events", () => {
      const onClick = vi.fn()
      render(<{Component} onClick={onClick}>Click me</{Component}>)

      fireEvent.click(screen.getByText("Click me"))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("handles keyboard events", () => {
      const onKeyDown = vi.fn()
      render(<{Component} onKeyDown={onKeyDown}>Content</{Component}>)

      fireEvent.keyDown(screen.getByText("Content"), { key: "Enter" })
      expect(onKeyDown).toHaveBeenCalled()
    })
  })

  // Accessibility tests
  describe("accessibility", () => {
    it("has correct ARIA attributes", () => {
      render(<{Component} aria-label="Test label">Content</{Component}>)
      expect(screen.getByLabelText("Test label")).toBeInTheDocument()
    })

    it("supports keyboard focus", () => {
      render(<{Component} tabIndex={0}>Content</{Component}>)
      const element = screen.getByText("Content")
      element.focus()
      expect(element).toHaveFocus()
    })
  })

  // State tests
  describe("state", () => {
    it("handles disabled state", () => {
      render(<{Component} disabled>Content</{Component}>)
      expect(screen.getByText("Content")).toBeDisabled()
    })

    it("handles loading state", () => {
      render(<{Component} loading>Content</{Component}>)
      // Assert loading indicator
    })
  })
})
```

## Testing Patterns

### Testing Compound Components

```typescript
describe("Tabs", () => {
  it("renders compound structure", () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs>
    )

    expect(screen.getByText("Tab 1")).toBeInTheDocument()
    expect(screen.getByText("Content 1")).toBeVisible()
    expect(screen.queryByText("Content 2")).not.toBeVisible()
  })

  it("switches tabs on click", async () => {
    render(/* ... */)

    fireEvent.click(screen.getByText("Tab 2"))
    expect(screen.getByText("Content 2")).toBeVisible()
  })
})
```

### Testing Controlled Components

```typescript
describe("Input controlled", () => {
  it("works as controlled component", () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Input value="initial" onChange={onChange} />
    )

    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("initial")

    fireEvent.change(input, { target: { value: "new value" } })
    expect(onChange).toHaveBeenCalled()

    rerender(<Input value="new value" onChange={onChange} />)
    expect(input).toHaveValue("new value")
  })
})
```

### Testing Async Behavior

```typescript
import { waitFor } from "@testing-library/react"

it("shows loading then content", async () => {
  render(<AsyncComponent />)

  expect(screen.getByText("Loading...")).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText("Loaded content")).toBeInTheDocument()
  })
})
```

## Instructions

1. **Check existing tests** in similar components for patterns
2. **Cover all variants** and props combinations
3. **Test accessibility** - ARIA, keyboard, focus
4. **Test interactions** - click, keyboard, hover
5. **Run tests** before committing: `pnpm test`

## Best Practices

- Use `screen` queries over container queries
- Prefer `getByRole` over `getByTestId`
- Test behavior, not implementation
- Mock external dependencies
- Keep tests focused and readable
- Add tests for bug fixes to prevent regression
