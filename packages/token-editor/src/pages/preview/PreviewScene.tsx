/**
 * Right-pane live preview. Commit 1 ships only the placeholder shell so the
 * architecture pivot can land without design risk; the 12-block dashboard
 * fills this in in commits 2 and 3.
 */
export function PreviewScene() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-background-component/40 p-12">
      <div className="text-xs uppercase tracking-wide text-text-tertiary">Preview</div>
      <div className="max-w-md text-center text-sm text-text-secondary">
        The dashboard preview will live here. Edit any category from the sidebar
        and watch the right pane react in real time.
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 opacity-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-32 rounded border border-dashed border-border-default"
          />
        ))}
      </div>
    </div>
  )
}
