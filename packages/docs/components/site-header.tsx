"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/global-search"
import { IconButton, Tabs } from "@/components/ui"
import { useState } from "react"
import { Github } from "@choiceform/icons-react"

export function SiteHeader() {
  const [selectedTab, setSelectedTab] = useState("docs")

  return (
    <header className="border-default-boundary/40 bg-default-background/80 supports-[backdrop-filter]:bg-default-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-8 flex items-center">
          <Link
            className="mr-6 flex items-center gap-2"
            href="/"
          >
            <div className="bg-selected-background h-6 w-6 rounded-full" />
            <span className="text-heading-medium">@choice-ui</span>
          </Link>
          <Tabs
            value={selectedTab}
            onChange={setSelectedTab}
            variant="accent"
          >
            <Tabs.Item
              as={Link}
              href="/docs/guide/introduction"
              value="docs"
            >
              Docs
            </Tabs.Item>
            <Tabs.Item
              as={Link}
              href="/docs/components"
              value="components"
            >
              Components
            </Tabs.Item>
            <Tabs.Item
              as={Link}
              href="/docs/tokens"
              value="tokens"
            >
              Tokens
            </Tabs.Item>
          </Tabs>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <GlobalSearch />
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <IconButton
              as={Link}
              href="https://github.com/choice-open/choice-ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
            </IconButton>
          </nav>
        </div>
      </div>
    </header>
  )
}
