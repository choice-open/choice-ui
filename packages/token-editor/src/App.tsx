import { Button } from "@choice-ui/react"

const SECTIONS = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "shadows", label: "Shadows" },
  { id: "radius", label: "Radius" },
  { id: "breakpoints", label: "Breakpoints" },
  { id: "zindex", label: "Z-Index" },
] as const

export function App() {
  return (
    <div className="grid h-dvh grid-cols-[220px_1fr] bg-background-default text-text-default">
      <aside className="flex flex-col gap-1 border-r border-border-default p-4">
        <h1 className="mb-4 text-sm font-semibold tracking-wide text-text-secondary">
          Token Editor
        </h1>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="rounded px-3 py-2 text-left text-sm hover:bg-background-component"
          >
            {s.label}
          </button>
        ))}
      </aside>
      <main className="flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-lg font-semibold">Choice UI Token Editor</h2>
        <p className="max-w-md text-center text-sm text-text-secondary">
          Scaffold is alive. Pick a section on the left — panels are landing next.
        </p>
        <Button>Hello from @choice-ui/react</Button>
      </main>
    </div>
  )
}
