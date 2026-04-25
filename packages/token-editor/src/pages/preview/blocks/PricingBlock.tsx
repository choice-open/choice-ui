import { Badge, Button } from "@choice-ui/react"
import { Check } from "@choiceform/icons-react"

type Tier = {
  id: string
  name: string
  price: string
  period?: string
  tagline: string
  highlight?: boolean
  current?: boolean
}

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    tagline: "Solo designers exploring the system.",
    current: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: "$24",
    period: "/mo · per editor",
    tagline: "Small product teams shipping designs together.",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    tagline: "Organizations with bespoke design system needs.",
  },
]

const STUDIO_FEATURES = [
  "Team sync via GitHub",
  "Diff preview & review",
  "30-day version history",
  "Slack integration",
]

export function PricingBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Plans
        </span>
        <h3 className="text-heading-small">Pick what fits your team</h3>
        <p className="text-body-medium text-text-secondary">
          Every plan includes the full editor.
        </p>
      </header>

      <ul className="divide-y divide-border-default">
        {TIERS.map((tier) => (
          <li
            key={tier.id}
            className={
              "flex flex-col gap-1 px-5 py-3.5 " +
              (tier.highlight ? "bg-background-accent-secondary/8" : "")
            }
          >
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-body-large">{tier.name}</span>
                {tier.highlight ? (
                  <Badge variant="brand" strong>
                    Popular
                  </Badge>
                ) : null}
                {tier.current ? <Badge variant="default">Current</Badge> : null}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-heading-medium tracking-tight">
                  {tier.price}
                </span>
                {tier.period ? (
                  <span className="text-body-small text-text-tertiary">
                    {tier.period}
                  </span>
                ) : null}
              </div>
            </div>
            <p className="text-body-medium text-text-secondary">{tier.tagline}</p>
            {tier.highlight ? (
              <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
                {STUDIO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-1.5 text-body-medium text-text-default"
                  >
                    <Check className="h-3 w-3 flex-shrink-0 text-text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>

      <footer className="flex gap-2 border-t border-border-default px-5 py-3">
        <Button variant="primary" className="flex-1">
          Upgrade to Studio
        </Button>
        <Button variant="secondary">Compare plans</Button>
      </footer>
    </section>
  )
}
