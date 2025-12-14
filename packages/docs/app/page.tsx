"use client"

import { SiteHeader } from "@/components/site-header"
import { Button, LinkButton } from "@choice-ui/react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center space-y-8 px-4 text-center md:px-6">
          <LinkButton href="/docs/guide/installation">v1.0.0 is now available</LinkButton>

          <h1 className="text-heading-display">@choice-ui/react</h1>

          <p className="text-body-large">
            A desktop-first UI component library built for professional desktop applications.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/docs/guide/installation">
              <Button size="large">Get Started</Button>
            </Link>
            <Link href="/docs/components">
              <Button
                variant="secondary"
                size="large"
              >
                View Components
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
