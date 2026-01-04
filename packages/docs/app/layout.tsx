import { ThemeProvider } from "@/components/providers"
import { ChoiceUiProvider } from "@/components/ui"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Choice UI Documentation",
  description: "Documentation for Choice UI Design System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="us"
      suppressHydrationWarning
      className={inter.variable}
    >
      <body className="flex min-h-dvh flex-col bg-gray-50 dark:bg-gray-900">
        <ChoiceUiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ChoiceUiProvider>
        <Footer />
      </body>
    </html>
  )
}
