import { Button, Dialog } from "@choice-ui/react"
import { useMemo, useState } from "react"
import { buildDiffPatch, exportCss, exportDiffPatch, exportW3cZip } from "../lib/export"
import { useEditorStore } from "../state/store"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({ open, onOpenChange }: Props) {
  const files = useEditorStore((s) => s.files)
  const dirty = useEditorStore((s) => s.dirty)
  const [busy, setBusy] = useState<null | "css" | "zip" | "patch">(null)
  const [error, setError] = useState<string | null>(null)

  const editCount = useMemo(
    () => (dirty.size === 0 ? 0 : buildDiffPatch(files).edits.length),
    [files, dirty],
  )

  async function run(kind: "css" | "zip" | "patch") {
    setBusy(kind)
    setError(null)
    try {
      if (kind === "css") await exportCss(files)
      else if (kind === "zip") await exportW3cZip(files)
      else await exportDiffPatch(files)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Header title="Export tokens" />
      <Dialog.Content className="w-[420px] p-4">
        <p className="mb-4 text-body-large text-text-secondary">
          {dirty.size === 0
            ? "No edits yet — exports reflect the current bundled defaults."
            : `${editCount} token${editCount === 1 ? "" : "s"} edited.`}
        </p>
        <div className="flex flex-col gap-2">
          <ExportRow
            title="tokens.css"
            description="Compiled CSS variables (light + dark) via Terrazzo. Drop this into any project."
            disabled={busy !== null}
            loading={busy === "css"}
            onClick={() => run("css")}
          />
          <ExportRow
            title="W3C JSON (.zip)"
            description="The seven W3C source files. Pipe them through your own Terrazzo setup."
            disabled={busy !== null}
            loading={busy === "zip"}
            onClick={() => run("zip")}
          />
          <ExportRow
            title="Diff patch (.json)"
            description="Only the tokens you changed, indexed by file + path. Useful for PR review or replay."
            disabled={busy !== null || dirty.size === 0}
            loading={busy === "patch"}
            onClick={() => run("patch")}
          />
        </div>
        {error ? (
          <p className="mt-3 text-body-medium text-text-danger">Export failed: {error}</p>
        ) : null}
      </Dialog.Content>
    </Dialog>
  )
}

function ExportRow({
  title,
  description,
  disabled,
  loading,
  onClick,
}: {
  title: string
  description: string
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded border border-border-default p-3">
      <div className="flex flex-col">
        <div className="text-body-large-strong">{title}</div>
        <div className="text-body-medium text-text-secondary">{description}</div>
      </div>
      <Button onClick={onClick} disabled={disabled}>
        {loading ? "…" : "Download"}
      </Button>
    </div>
  )
}
