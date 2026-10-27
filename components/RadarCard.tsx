import type { ScamLog } from "@/lib/supabaseClient";

const STYLE = {
  Red: { label: "CRITICAL", dot: "bg-threat-red", text: "text-threat-red", border: "border-threat-red/30" },
  Yellow: { label: "SUSPICIOUS", dot: "bg-threat-yellow", text: "text-threat-yellow", border: "border-threat-yellow/30" },
  Green: { label: "SAFE", dot: "bg-threat-green", text: "text-threat-green", border: "border-threat-green/30" },
  Invalid: { label: "UNKNOWN", dot: "bg-muted", text: "text-muted", border: "border-border" },
} as const;

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export default function RadarCard({ log }: { log: ScamLog }) {
  const s = STYLE[log.threat_level] ?? STYLE.Invalid;

  return (
    <article
      className={`flex h-full flex-col rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${s.border}`}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${s.dot}`}
            />
            <span className={`relative inline-flex h-3 w-3 rounded-full ${s.dot}`} />
          </span>
          <span className={`font-mono text-xs font-bold tracking-widest ${s.text}`}>
            {s.label}
          </span>
        </div>
        <time className="font-mono text-[11px] text-muted" dateTime={log.created_at}>
          {formatTime(log.created_at)}
        </time>
      </header>

      <p className="mt-4 line-clamp-5 flex-1 break-words rounded-2xl bg-background p-3 font-mono text-xs leading-relaxed">
        {log.input_content ?? "—"}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted">{log.reasoning}</p>
    </article>
  );
}
