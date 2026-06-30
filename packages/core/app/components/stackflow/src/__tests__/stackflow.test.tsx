import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { useStackflowContext } from "../context"
import { Stackflow } from "../stackflow"

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({ initial, animate, exit, variants, transition, custom, ...rest }: any) => (
      <div {...rest}>{rest.children}</div>
    ),
  },
}))

describe("Stackflow", () => {
  it("renders the item matching defaultId", async () => {
    render(
      <Stackflow defaultId="first">
        <Stackflow.Item id="first">
          <div>First Content</div>
        </Stackflow.Item>
        <Stackflow.Item id="second">
          <div>Second Content</div>
        </Stackflow.Item>
      </Stackflow>,
    )

    await waitFor(() => {
      expect(screen.getByText("First Content")).toBeInTheDocument()
    })
    expect(screen.queryByText("Second Content")).not.toBeInTheDocument()
  })

  it("pushes and pops stack history when navigating", async () => {
    const user = userEvent.setup()

    function Controls() {
      const ctx = useStackflowContext()

      return (
        <div>
          <button
            data-testid="push-b"
            onClick={() => ctx.push("b")}
          >
            Push B
          </button>
          <button
            data-testid="push-c"
            onClick={() => ctx.push("c")}
          >
            Push C
          </button>
          <button
            data-testid="back"
            onClick={() => ctx.back()}
          >
            Back
          </button>
          <span data-testid="current">{ctx.current?.id}</span>
          <span data-testid="history">{ctx.history.join(",")}</span>
          <span data-testid="can-go-back">{String(ctx.canGoBack)}</span>
        </div>
      )
    }

    render(
      <Stackflow defaultId="a">
        <Stackflow.Item id="a">
          <div>A</div>
        </Stackflow.Item>
        <Stackflow.Item id="b">
          <div>B</div>
        </Stackflow.Item>
        <Stackflow.Item id="c">
          <div>C</div>
        </Stackflow.Item>
        <Stackflow.Suffix>
          <Controls />
        </Stackflow.Suffix>
      </Stackflow>,
    )

    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument())
    expect(screen.getByTestId("history")).toHaveTextContent(/^a$/)
    expect(screen.getByTestId("can-go-back")).toHaveTextContent(/^false$/)

    await user.click(screen.getByTestId("push-b"))
    await waitFor(() => expect(screen.getByText("B")).toBeInTheDocument())
    expect(screen.queryByText("A")).not.toBeInTheDocument()
    expect(screen.getByTestId("current")).toHaveTextContent(/^b$/)
    expect(screen.getByTestId("history")).toHaveTextContent(/^a,b$/)
    expect(screen.getByTestId("can-go-back")).toHaveTextContent(/^true$/)

    await user.click(screen.getByTestId("push-c"))
    await waitFor(() => expect(screen.getByText("C")).toBeInTheDocument())
    expect(screen.queryByText("B")).not.toBeInTheDocument()
    expect(screen.getByTestId("current")).toHaveTextContent(/^c$/)
    expect(screen.getByTestId("history")).toHaveTextContent(/^a,b,c$/)

    await user.click(screen.getByTestId("back"))
    await waitFor(() => expect(screen.getByText("B")).toBeInTheDocument())
    expect(screen.queryByText("C")).not.toBeInTheDocument()
    expect(screen.getByTestId("current")).toHaveTextContent(/^b$/)
    expect(screen.getByTestId("history")).toHaveTextContent(/^a,b$/)

    await user.click(screen.getByTestId("back"))
    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument())
    expect(screen.queryByText("B")).not.toBeInTheDocument()
    expect(screen.getByTestId("current")).toHaveTextContent(/^a$/)
    expect(screen.getByTestId("history")).toHaveTextContent(/^a$/)
    expect(screen.getByTestId("can-go-back")).toHaveTextContent(/^false$/)
  })

  it("does not add duplicate entries when pushing the current id", async () => {
    const user = userEvent.setup()

    function Controls() {
      const ctx = useStackflowContext()
      return (
        <div>
          <button
            data-testid="push-a"
            onClick={() => ctx.push("a")}
          >
            Push A
          </button>
          <span data-testid="history">{ctx.history.join(",")}</span>
        </div>
      )
    }

    render(
      <Stackflow defaultId="a">
        <Stackflow.Item id="a">
          <div>A</div>
        </Stackflow.Item>
        <Stackflow.Item id="b">
          <div>B</div>
        </Stackflow.Item>
        <Stackflow.Suffix>
          <Controls />
        </Stackflow.Suffix>
      </Stackflow>,
    )

    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument())
    expect(screen.getByTestId("history")).toHaveTextContent(/^a$/)

    await user.click(screen.getByTestId("push-a"))

    expect(screen.getByTestId("history")).toHaveTextContent(/^a$/)
  })

  it("resets history to the first registered item", async () => {
    const user = userEvent.setup()

    function Controls() {
      const ctx = useStackflowContext()
      return (
        <div>
          <button
            data-testid="push-b"
            onClick={() => ctx.push("b")}
          >
            Push B
          </button>
          <button
            data-testid="clear"
            onClick={ctx.clearHistory}
          >
            Clear
          </button>
          <span data-testid="current">{ctx.current?.id}</span>
          <span data-testid="history">{ctx.history.join(",")}</span>
        </div>
      )
    }

    render(
      <Stackflow defaultId="a">
        <Stackflow.Item id="a">
          <div>A</div>
        </Stackflow.Item>
        <Stackflow.Item id="b">
          <div>B</div>
        </Stackflow.Item>
        <Stackflow.Suffix>
          <Controls />
        </Stackflow.Suffix>
      </Stackflow>,
    )

    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument())
    await user.click(screen.getByTestId("push-b"))
    await waitFor(() => expect(screen.getByText("B")).toBeInTheDocument())

    await user.click(screen.getByTestId("clear"))

    await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument())
    expect(screen.getByTestId("current")).toHaveTextContent(/^a$/)
    expect(screen.getByTestId("history")).toHaveTextContent(/^a$/)
  })
})
