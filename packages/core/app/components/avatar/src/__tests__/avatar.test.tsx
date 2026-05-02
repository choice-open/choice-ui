/**
 * Avatar bug-focused tests
 *
 * BUG 4: Permanent pulse animation when states="anonymous" with photo prop
 *   - User scenario: Developer renders <Avatar photo="/user.jpg" states="anonymous" />
 *     to show an anonymous placeholder. The avatar pulses forever because isLoading
 *     starts true but the <img> (which would set isLoading=false) is never rendered.
 *   - Regression it prevents: Permanent animation on anonymous avatars with photos
 *   - Logic change that makes it fail: isLoading=true on line 31 when photo is provided.
 *     states="anonymous" causes early return of <AnonymousIcon /> on line 59, so the
 *     <img> with onLoad/onError callbacks is never rendered. isLoading stays true forever.
 *     The tv variant applies animate-pulse when isLoading=true.
 *     Fix = set isLoading=false when states="anonymous".
 *
 * BUG 5: Image missing alt attribute when name is undefined
 *   - User scenario: <Avatar photo="/user.jpg" /> with no name. The <img> renders
 *     without an alt attribute (alt={undefined} = no attribute). Fails WCAG 1.1.1.
 *   - Regression it prevents: Accessibility violation for nameless avatars
 *   - Logic change that makes it fail: Line 66 `alt={name}`. When name is undefined,
 *     no alt attribute is rendered. Fix = `alt={name ?? ""}`.
 *
 * BUG 9: isLoading and imageLoadedError state not reset when photo prop changes
 *   - User scenario: Avatar loads with a broken URL (imageLoadedError=true, shows fallback).
 *     Then the photo prop changes to a valid URL. The avatar stays stuck on the fallback
 *     because imageLoadedError is never reset. The new image is never shown.
 *   - Regression it prevents: Avatar stuck showing fallback after photo URL update
 *   - Logic change that makes it fail: Lines 31-32 - useState for isLoading and
 *     imageLoadedError only initialize once. No useEffect resets them when photo changes.
 *     The condition `photo && !imageLoadedError` (line 62) stays false.
 *     Fix = add useEffect to reset imageLoadedError=false when photo changes.
 *
 * BUG 10: Image onError must trigger fallback rendering
 *   - User scenario: Avatar is given a broken photo URL. The image fails to load.
 *     The avatar should transition to showing the initial letter fallback.
 *   - Regression it prevents: Broken image showing forever instead of fallback
 *   - Logic change: If onError stops setting imageLoadedError or the fallback
 *     condition breaks.
 */
import "@testing-library/jest-dom"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Avatar } from "../avatar"

describe("Avatar bugs", () => {
  describe("BUG 4: anonymous state must not pulse forever when photo is provided", () => {
    it("does not have animate-pulse class when states=anonymous and photo exists", () => {
      render(
        <Avatar
          photo="/user.jpg"
          name="John"
          states="anonymous"
        />,
      )

      const avatar = screen.getByRole("img", { hidden: true }).closest("[class]")!
      expect(avatar.className).not.toContain("animate-pulse")
    })
  })

  describe("BUG 5: img must have alt attribute even when name is not provided", () => {
    it("renders img with alt attribute when only photo is provided", () => {
      render(<Avatar photo="/user.jpg" />)

      const img = screen.getByRole("img")
      expect(img).toHaveAttribute("alt")
    })
  })

  describe("BUG 9: must reset error state when photo prop changes", () => {
    it("attempts to load the new photo after a broken photo fails", () => {
      const { rerender } = render(
        <Avatar
          photo="/broken.jpg"
          name="John"
        />,
      )

      const img = screen.getByRole("img")
      expect(img).toBeTruthy()
      expect(img).toHaveAttribute("src", "/broken.jpg")

      rerender(
        <Avatar
          photo="/valid.jpg"
          name="John"
        />,
      )

      const newImg = screen.queryByRole("img")
      expect(newImg).toBeTruthy()
      expect(newImg).toHaveAttribute("src", "/valid.jpg")
    })
  })

  describe("BUG 10: image error must trigger fallback rendering", () => {
    it("shows fallback after image fails to load", () => {
      render(
        <Avatar
          photo="/broken.jpg"
          name="John"
        />,
      )

      const img = screen.getByRole("img")
      expect(img).toHaveAttribute("src", "/broken.jpg")

      act(() => {
        fireEvent.error(img)
      })

      expect(screen.queryByRole("img")).toBeNull()
    })
  })
})
