import type { Metadata } from "next";
import Link from "next/link";
import { DM_Sans, Fira_Code, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vernacular Scam Analyzer",
  description:
    "AI-powered forensic tool that detects and explains Hinglish, Hindi and English SMS & WhatsApp scams in simple terms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${dmSans.variable} ${firaCode.variable}`}
    >
      <body className="min-h-screen font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-28">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center text-xs text-muted">
            <p>
              © {new Date().getFullYear()} Vernacular Scam Analyzer ·{" "}
              <Link href="/legal" className="underline hover:text-primary">
                Privacy &amp; Terms
              </Link>{" "}
              · Cyber Crime Helpline: 1930
            </p>
          </footer>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
