import { expect, vi } from "vitest"
import * as matchers from "@testing-library/jest-dom/matchers"

expect.extend(matchers)

// Polyfill InputEvent.getTargetRanges for Slate (jsdom doesn't implement it)
if (
  typeof globalThis.InputEvent !== "undefined" &&
  !(globalThis.InputEvent as any).prototype.getTargetRanges
) {
  ;(globalThis.InputEvent as any).prototype.getTargetRanges = function () {
    return []
  }
}

// Polyfill HTMLElement.isContentEditable for Slate (jsdom doesn't implement it)
if (typeof HTMLElement !== "undefined" && !("isContentEditable" in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, "isContentEditable", {
    get() {
      const attr = this.getAttribute("contenteditable")
      if (attr === "true" || attr === "") return true
      if (attr === "false") return false
      const parent = this.parentElement as HTMLElement | null
      return parent ? parent.isContentEditable : false
    },
    configurable: true,
  })
}

// Polyfill: fire 'input' event after 'beforeinput' on contenteditable elements.
// In a real browser, after beforeinput the browser performs text insertion natively
// and then fires the 'input' event. jsdom doesn't do native contenteditable insertion,
// so 'input' events never fire. Slate flushes deferred text insertions in its onInput
// handler, so without this polyfill only the first character gets inserted.
document.addEventListener("beforeinput", (e) => {
  const target = e.target as HTMLElement | null
  if (target && target.isContentEditable) {
    const ie = e as InputEvent
    const inputType = ie.inputType
    const data = ie.data
    setTimeout(() => {
      target.dispatchEvent(
        new InputEvent("input", {
          inputType,
          data,
          bubbles: true,
          composed: true,
        }),
      )
    }, 0)
  }
})

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

expect.extend({
  toBeRenderedWithOptions(element, options) {
    if (!element) {
      return {
        pass: false,
        message: () => `Expected element to exist, but it was not found`,
      }
    }

    const container = element.parentElement
    const menuItems = container?.querySelectorAll('[role="menuitem"]') || []
    const menuItemTexts: (string | null)[] = []
    menuItems.forEach((item) => menuItemTexts.push(item.textContent))

    const pass = options.every((option) => menuItemTexts.includes(option))

    return {
      pass,
      message: () =>
        pass
          ? `Expected dropdown not to have options: ${options.join(", ")}`
          : `Expected dropdown to have options: ${options.join(", ")}, but found: ${menuItemTexts.join(", ")}`,
    }
  },
})
