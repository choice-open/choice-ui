export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Hero UI Documentation</h1>
        <p>Built with Next.js and Tailwind CSS</p>
      </div>

      <div className="mt-8 flex gap-4">
        <a
          href="/docs"
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-200"
        >
          Get Started
        </a>
      </div>
    </main>
  )
}
