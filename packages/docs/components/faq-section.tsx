import { Badge } from "./ui"

export default function FaqSection() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Badge className="mb-4">FAQ</Badge>
        <h2 className="text-heading-large">Frequently asked questions</h2>
        <p className="text-secondary-foreground text-body-large mx-auto mt-2 max-w-xl">
          Everything you need to know about Choice UI.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="bg-secondary-background rounded-xl p-6">
          <h3 className="text-heading-medium mb-2">Why no animations by default?</h3>
          <p className="text-secondary-foreground text-body-large">
            For desktop productivity tools, animations are friction. When you click a dropdown, you
            want to see options instantly—not watch them slide in over 200ms. We optimized for
            perceived speed and professional workflows.
          </p>
        </div>

        <div className="bg-secondary-background rounded-xl p-6">
          <h3 className="text-heading-medium mb-2">Can I add animations if I want them?</h3>
          <p className="text-secondary-foreground text-body-large">
            Yes! Animations are opt-in through CSS or className props. You have full control. We
            just don&apos;t force them on you—because we believe default should mean fast.
          </p>
        </div>

        <div className="bg-secondary-background rounded-xl p-6">
          <h3 className="text-heading-medium mb-2">What frameworks does Choice UI support?</h3>
          <p className="text-secondary-foreground text-body-large">
            Choice UI is built for React 18+ and works seamlessly with Next.js, Vite, and other
            React-based frameworks. Components are fully compatible with Server Components and
            support SSR out of the box.
          </p>
        </div>

        <div className="bg-secondary-background rounded-xl p-6">
          <h3 className="text-heading-medium mb-2">Which version of Tailwind CSS is required?</h3>
          <p className="text-secondary-foreground text-body-large">
            Choice UI is built for Tailwind CSS v4 and takes full advantage of its CSS variables and
            native theming capabilities. Tailwind v3 is not supported.
          </p>
        </div>

        <div className="bg-secondary-background rounded-xl p-6">
          <h3 className="text-heading-medium mb-2">Is Choice UI accessible?</h3>
          <p className="text-secondary-foreground text-body-large">
            Yes! All components follow WAI-ARIA guidelines and support keyboard navigation, screen
            readers, and proper focus management. We continuously test with assistive technologies.
          </p>
        </div>

        <div className="bg-secondary-background rounded-xl p-6">
          <h3 className="text-heading-medium mb-2">Can I customize the design tokens?</h3>
          <p className="text-secondary-foreground text-body-large">
            Absolutely. Choice UI uses a comprehensive design token system that you can override in
            your CSS. Change colors, spacing, typography, shadows, and more to match your brand.
          </p>
        </div>

        <div className="bg-secondary-background rounded-xl p-6">
          <h3 className="text-heading-medium mb-2">Is Choice UI free to use?</h3>
          <p className="text-secondary-foreground text-body-large">
            Yes, Choice UI is completely free and open source under the MIT license. You can use it
            in personal and commercial projects without any restrictions.
          </p>
        </div>
      </div>
    </div>
  )
}
