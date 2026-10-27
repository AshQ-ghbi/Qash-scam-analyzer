import Link from "next/link";
import { AlertTriangle, HelpCircle, ShieldAlert, ShieldCheck } from "lucide-react";

export type ThreatLevel = "Red" | "Yellow" | "Green" | "Invalid";

export type AnalysisResult = {
  threat_level: ThreatLevel;
  reasoning: string;
};

const CONFIG = {
  Red: {
    label: "HIGH RISK — SCAM DETECTED",
    advice: "Is message par bharosa na karein. Koi link na kholein, OTP na batayein.",
    Icon: ShieldAlert,
    card: "border-threat-red/40 bg-threat-red/5",
    badge: "bg-threat-red text-white",
    text: "text-threat-red",
    dot: "bg-threat-red",
  },
  Yellow: {
    label: "SUSPICIOUS — VERIFY FIRST",
    advice: "Pakka nahi hai. Official number ya app se khud check karein.",
    Icon: AlertTriangle,
    card: "border-threat-yellow/40 bg-threat-yellow/5",
    badge: "bg-threat-yellow text-black",
    text: "text-threat-yellow",
    dot: "bg-threat-yellow",
  },
  Green: {
    label: "LIKELY SAFE",
    advice: "Abhi koi khatra nahi dikha, phir bhi sensitive details share na karein.",
    Icon: ShieldCheck,
    card: "border-threat-green/40 bg-threat-green/5",
    badge: "bg-threat-green text-white",
    text: "text-threat-green",
    dot: "bg-threat-green",
  },
  Invalid: {
    label: "NOTHING TO ANALYZE",
    advice: "Koi asli suspicious message ya screenshot upload karein.",
    Icon: HelpCircle,
    card: "border-border bg-card",
    badge: "bg-muted text-white",
    text: "text-muted",
    dot: "bg-muted",
  },
} as const;

export default function ThreatDossier({ result }: { result: AnalysisResult }) {
  const c = CONFIG[result.threat_level] ?? CONFIG.Invalid;
  const { Icon } = c;

  return (
    <section
      className={`rounded-3xl border p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${c.card}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
          Threat Dossier
        </p>
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${c.badge}`}
        >
          <span className={`h-2 w-2 animate-pulse-dot rounded-full bg-current`} />
          {result.threat_level.toUpperCase()}
        </span>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <div className={`rounded-2xl bg-background p-3 ${c.text}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <h3 className={`text-2xl sm:text-3xl ${c.text}`}>{c.label}</h3>
          <p className="mt-1 text-sm text-muted">{c.advice}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted">
          AI Analysis
        </p>
        <p className="font-mono text-sm leading-relaxed">{result.reasoning}</p>
      </div>

      {result.threat_level === "Red" && (
        <Link
          href="/report"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600"
        >
          Report this scam · Helpline 1930
        </Link>
      )}
    </section>
  );
}
