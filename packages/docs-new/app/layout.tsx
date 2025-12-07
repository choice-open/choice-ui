import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Hero UI Documentation",
  description: "Documentation for Choiceform Design System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </ThemeProvider>
      </body>
    </html>
  );
}
