import { Badge, Button } from "@choice-ui/react"
import { Check } from "@choiceform/icons-react"

type Tier = {
  id: string
  name: string
  price: string
  period?: string
  tagline: string
  features: string[]
  cta: string
  highlighted?: boolean
  ctaVariant: "primary" | "secondary" | "ghost"
  ctaDisabled?: boolean
}

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    tagline: "Solo designers exploring the system.",
    features: [
      "All atomic tokens",
      "Unlimited local edits",
      "CSS / W3C / diff export",
      "Single workspace",
    ],
    cta: "Current plan",
    ctaVariant: "secondary",
    ctaDisabled: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: "$24",
    period: "/ month per editor",
    tagline: "Small product teams shipping designs together.",
    features: [
      "Everything in Starter",
      "Team sync via GitHub",
      "Diff preview & review",
      "30-day version history",
    ],
    cta: "Upgrade to Studio",
    highlighted: true,
    ctaVariant: "primary",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    tagline: "Organizations with bespoke design system needs.",
    features: [
      "Everything in Studio",
      "SSO & audit logs",
      "Private theme registry",
      "Dedicated support",
    ],
    cta: "Contact sales",
    ctaVariant: "secondary",
  },
]

export function PricingBlock() {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <span className="text-body-medium-strong uppercase tracking-wide text-text-tertiary">
          Plans
        </span>
        <h3 className="text-body-large-strong">Pick what fits your team</h3>
        <p className="text-body-medium text-text-secondary">
          Every plan includes the full token editor — pick a tier for the
          collaboration features you need.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {TIERS.map((tier) => (
          <article
            key={tier.id}
            className={
              "relative flex flex-col gap-4 rounded-lg border p-5 transition " +
              (tier.highlighted
                ? "border-border-accent bg-background-accent-secondary/10 shadow-md"
                : "border-border-default bg-background-default shadow-sm")
            }
          >
            {tier.highlighted ? (
              <Badge
                variant="brand"
                strong
                className="absolute right-4 top-4"
              >
                Popular
              </Badge>
            ) : null}
            <div className="flex flex-col gap-1">
              <h4 className="text-body-large-strong">{tier.name}</h4>
              <p className="text-body-medium leading-snug text-text-secondary">
                {tier.tagline}
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-heading-large tracking-tight">
                {tier.price}
              </span>
              {tier.period ? (
                <span className="text-body-medium text-text-tertiary">{tier.period}</span>
              ) : null}
            </div>
            <ul className="flex flex-col gap-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-body-medium">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-text-success" />
                  <span className="text-text-default">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant={tier.ctaVariant}
              disabled={tier.ctaDisabled}
              className="mt-auto w-full"
            >
              {tier.cta}
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}
