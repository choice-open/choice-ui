import { Editor } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor } from "slate-react"

export type ContextEditor = Editor & ReactEditor & HistoryEditor
