"use client";

import { useMemo, useState } from "react";
import RadarCard from "@/components/RadarCard";
import type { ScamLog } from "@/lib/supabaseClient";

const TABS = ["All", "Critical", "Suspicious"] as const;
type Tab = (typeof TABS)[number];

export default function RadarFeed({ logs }: { logs: ScamLog[] }) {
  const [tab, setTab] = useState<Tab>("All");

  const counts = useMemo(
    () => ({
      All: logs.length,
      Critical: logs.filter((l) => l.threat_level === "Red").length,
      Suspicious: logs.filter((l) => l.threat_level === "Yellow").length,
    }),
    [logs]
  );

  const visible = useMemo(() => {
    if (tab === "Critical") return logs.filter((l) => l.threat_level === "Red");
    if (tab === "Suspicious") return logs.filter((l) => l.threat_level === "Yellow");
    return logs;
  }, [logs, tab]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-2" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              tab === t
                ? "border-primary bg-primary text-white shadow-md"
                : "border-border bg-card text-muted hover:text-foreground"
            }`}
          >
            {t} <span className="ml-1 font-mono text-xs opacity-80">{counts[t]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted">
          Is category me abhi koi scam intercept nahi hua.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((log) => (
            <RadarCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
