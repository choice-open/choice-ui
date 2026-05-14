import { Pagination } from "@choice-ui/react"
import { useState } from "react"

const TOKENS = [
  { id: "color.blue.500", type: "color", value: "#0077ff" },
  { id: "color.blue.600", type: "color", value: "#005ce0" },
  { id: "color.green.500", type: "color", value: "#19b86c" },
  { id: "color.red.500", type: "color", value: "#e64646" },
  { id: "spacing.default", type: "dimension", value: "0.25rem" },
  { id: "spacing.px", type: "dimension", value: "1px" },
  { id: "radius.md", type: "dimension", value: "0.3125rem" },
  { id: "radius.lg", type: "dimension", value: "0.4375rem" },
  { id: "shadow.lg", type: "shadow", value: "0 10px 16px / 0.12" },
  { id: "shadow.xl", type: "shadow", value: "0 10px 24px / 0.18" },
  { id: "font.weights.semibold", type: "fontWeight", value: "500" },
  { id: "font.weights.heavy", type: "fontWeight", value: "550" },
]

export function AllTokensBlock() {
  const [page, setPage] = useState(1)
  const itemsPerPage = 6
  const total = 243
  const start = (page - 1) * itemsPerPage
  const slice = TOKENS.slice(start, start + itemsPerPage)

  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Tokens
        </span>
        <h3 className="text-heading-small">All tokens · {total} total</h3>
      </header>
      <ul className="flex flex-col divide-y divide-border-default">
        {slice.map((token) => (
          <li key={token.id} className="flex items-center justify-between px-5 py-2.5">
            <div className="flex flex-col">
              <span className="font-mono text-body-medium text-text-default">{token.id}</span>
              <span className="text-body-small uppercase text-text-tertiary">{token.type}</span>
            </div>
            <span className="font-mono text-body-medium text-text-secondary">{token.value}</span>
          </li>
        ))}
      </ul>
      <footer className="border-t border-border-default px-3 py-2">
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        >
          <Pagination.Spinner />
          <Pagination.Navigation />
        </Pagination>
      </footer>
    </section>
  )
}
