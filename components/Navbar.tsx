"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, PhoneCall, ShieldCheck, Sun, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Scanner" },
  { href: "/radar", label: "Radar" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About Us" },     // 4th position
  { href: "/legal", label: "Privacy & Terms" },    // 5th position
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  const isDark = resolvedTheme === "dark";

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4">
      <nav className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-border bg-card/80 px-5 py-3 shadow-lg backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-2 font-heading text-base font-extrabold tracking-tight"
        >
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">SCAM ANALYZER</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* 6th position: Emergency Helpline */}
          <Link
            href="/report"
            className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg sm:text-sm"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Emergency Helpline</span>
          </Link>

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all duration-300 hover:bg-foreground/5"
          >
            {mounted && isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="mt-2 w-full max-w-5xl rounded-3xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur-md lg:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium ${
                  pathname === l.href
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-foreground/5"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/report"
              className="mt-1 flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
            >
              <PhoneCall className="h-4 w-4" />
              Emergency Helpline
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}