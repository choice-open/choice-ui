import { parsePattern, formatResult } from "../../utils/pattern-parser"

describe("pattern-parser", () => {
  describe("parsePattern", () => {
    it("parses simple pattern with single value", () => {
      const result = parsePattern("{value}px")
      expect(result).toEqual({
        keys: ["value"],
        regexPattern: "(.+)px",
        regex: expect.any(RegExp),
      })
    })

    it("parses pattern with multiple variables", () => {
      const result = parsePattern("{width},{height}")
      expect(result).toEqual({
        keys: ["width", "height"],
        regexPattern: "(.+),(.+)",
        regex: expect.any(RegExp),
      })
    })

    it("handles pattern with text before, between, and after variables", () => {
      const result = parsePattern("Width: {width}px, Height: {height}px")
      expect(result).toEqual({
        keys: ["width", "height"],
        regexPattern: "Width: (.+)px, Height: (.+)px",
        regex: expect.any(RegExp),
      })
    })

    it("handles empty pattern", () => {
      const result = parsePattern("")
      expect(result).toEqual({
        keys: [],
        regexPattern: "",
        regex: expect.any(RegExp),
      })
    })

    it("handles pattern with no variables", () => {
      const result = parsePattern("Just text")
      expect(result).toEqual({
        keys: [],
        regexPattern: "Just text",
        regex: expect.any(RegExp),
      })
    })
  })

  describe("formatResult", () => {
    it("formats simple value with pattern", () => {
      const result = formatResult("{value}px", { value: 100 })
      expect(result).toBe("100px")
    })

    it("formats object with multiple variables", () => {
      const result = formatResult("{width}×{height}", { width: 100, height: 200 })
      expect(result).toBe("100×200")
    })

    it("handles hidden option", () => {
      const result = formatResult("{value1}{value2,hidden}", { value1: 10, value2: 20 })
      expect(result).toBe("10")
    })

    it("handles complex textual formats", () => {
      const result = formatResult("rgb({r}, {g}, {b})", { r: 255, g: 128, b: 0 })
      expect(result).toBe("rgb(255, 128, 0)")
    })
  })
})
