// ============================================================
// components/Navbar.tsx — TOP NAVIGATION BAR
// ============================================================
// Sticky navbar with: logo (left), nav links (centre), user chip (right)
// Active page link is highlighted in purple.
// ============================================================

"use client" // Needed for usePathname() hook

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname() // Current URL path — "/" or "/statistics"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* ── LOGO ────────────────────────────────────────────
            Pulsing purple dot + "MACRO PULSE" text
            To change the app name, edit the text below */}
        <div className="flex items-center gap-2.5">
          {/* Pulsing dot — animation defined in globals.css */}
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot shadow-[0_0_8px_var(--color-primary)]" />
          <span className="text-xl font-bold tracking-widest text-foreground uppercase">
            Macro Pulse
          </span>
        </div>

        {/* ── NAV LINKS ───────────────────────────────────────
            Add more pages by adding objects to this array.
            e.g. { href: "/alerts", label: "Alerts" } */}
        <div className="flex items-center gap-1">
          {[
            { href: "/",           label: "Overview"   },
            { href: "/statistics", label: "Statistics" },
          ].map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 rounded-md text-base font-medium tracking-wide transition-all ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/30" // Purple highlight when active
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* ── USER CHIP ───────────────────────────────────────
            To change user info, edit the values below */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-card">
          {/* Avatar with initials — gradient background */}
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-[10px] font-bold text-white">
            AM  {/* ← Change initials here */}
          </div>
          <div className="leading-tight">
            <div className="text-xs font-medium text-foreground">Asset Manager</div>  {/* ← Change role */}
            <div className="text-[10px] text-muted-foreground">Schroders</div>         {/* ← Change company */}
          </div>
        </div>

      </div>
    </nav>
  )
}
