// ============================================================
// app/layout.tsx — ROOT LAYOUT
// ============================================================
// Wraps every page. Loads fonts, global CSS, and renders the Navbar.
// "dark" class on <html> activates dark mode for the whole app.
// ============================================================

import type { Metadata } from "next"
import "../styles/globals.css"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Macro Pulse - Macroeconomics Tracker",
  description: "Monitor macroeconomic developments and market-moving news",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // "dark" class enables dark mode globally via Tailwind's dark variant
    <html lang="en" className="dark">
      <head>
        {/* Google Fonts — Inter for body, JetBrains Mono for code/data */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Navbar />
        {/* Page content — centred with max width and padding */}
        <main className="max-w-screen-xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
