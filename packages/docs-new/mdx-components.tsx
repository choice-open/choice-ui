import type { MDXComponents } from "mdx/types";
// import { CodeBlock } from "@/components/code-block" // Placeholder

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-5xl">{children}</h1>,
    h2: ({ children }) => <h2 className="mt-12 scroll-m-20 border-b border-zinc-200 pb-2 text-2xl font-semibold tracking-tight first:mt-0 dark:border-zinc-800 dark:text-zinc-50">{children}</h2>,
    p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-zinc-700 dark:text-zinc-400">{children}</p>,
    ...components,
  };
}
