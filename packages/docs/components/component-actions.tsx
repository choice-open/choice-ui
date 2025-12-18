"use client"

import { Button } from "@/components/ui"
import { Github } from "@choiceform/icons-react"
import Link from "next/link"

type ComponentActionsProps = {
  slugKey: string
  packageName: string
}

export function ComponentActions({ slugKey, packageName }: ComponentActionsProps) {
  const githubPath = packageName.replace("@choice-ui/", "")
  // Convert slug format to Storybook path format
  // e.g., "date-and-time/time-calendar" -> "dateandtime-timecalendar"
  const storybookPath = slugKey
    .split("/")
    .map((segment) => segment.replace(/-/g, ""))
    .join("-")

  return (
    <div className="mt-4 flex gap-4">
      <Button
        asChild
        variant="solid"
        size="large"
      >
        <Link
          href={`http://storybook.choice-ui.com/?path=/story/${storybookPath}--basic`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            viewBox="0 0 512 512"
            width="1em"
            className="text-lg text-[#ff4785]"
          >
            <g>
              <path
                d="M356.5,5.2L353.9,63c-0.1,3.2,3.7,5.2,6.3,3.2l22.6-17.1L401.9,64c2.5,1.7,5.8,0,6-3l-2.2-58.8l28.4-2.2   c14.7-1,27.3,10.8,27.3,25.6v460.8c0,14.7-12.3,26.3-26.9,25.6L91.1,496.6c-13.3-0.6-24.1-11.3-24.5-24.7l-16-422.3   c-0.8-14.2,9.9-26.3,24.1-27.1L356.2,4.7L356.5,5.2z M291,198.4c0,10,67.4,5.1,76.6-1.7c0-68.2-36.7-104.3-103.6-104.3   c-67.2,0-104.5,36.8-104.5,91.6c0,94.9,128,96.6,128,148.4c0,15-6.8,23.5-22.4,23.5c-20.5,0-28.8-10.4-27.7-46.1   c0-7.7-77.8-10.3-80.4,0c-5.7,86,47.6,110.9,108.7,110.9c59.6,0,106.1-31.7,106.1-89.1c0-101.7-130.1-99-130.1-149.3   c0-20.7,15.4-23.4,24.1-23.4c9.7,0,26.7,1.5,25.4,39.8L291,198.4z"
                fill="currentColor"
              />
            </g>
          </svg>
          Storybook
        </Link>
      </Button>
      <Button
        asChild
        variant="solid"
        size="large"
      >
        <Link
          href={`https://www.npmjs.com/package/${packageName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            aria-hidden="true"
            fill="currentColor"
            focusable="false"
            height="1em"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 576 512"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            className="text-xl text-[#E53E3E]"
          >
            <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"></path>
          </svg>
          {packageName}
        </Link>
      </Button>
      <Button
        asChild
        variant="solid"
        size="large"
      >
        <Link
          href={`https://github.com/choice-open/choice-ui/tree/main/packages/core/app/components/${githubPath}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          View Source
        </Link>
      </Button>
    </div>
  )
}
