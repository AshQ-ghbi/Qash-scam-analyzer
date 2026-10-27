import RadarFeed from "@/components/RadarFeed";
import { supabase, type ScamLog } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function RadarPage() {
  const { data, error } = await supabase
    .from("scam_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);

  const logs = (data ?? []) as ScamLog[];

  return (
    <div>
      <div className="mb-8 text-center">
        <p className="mb-3 font-mono text-sm font-bold tracking-widest text-primary">
          02. THREAT RADAR
        </p>
        <h1 className="text-4xl leading-tight tracking-normal [word-spacing:12px] sm:text-6xl py-2">
          LIVE INTERCEPTED SCAMS
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Haal hi me scan kiye gaye messages — taaki aap dusron ke saath hui thagi se bach sakein.
        </p>
      </div>

      {error ? (
        <p className="rounded-3xl border border-threat-red/40 bg-threat-red/5 p-6 text-center text-sm">
          Radar load nahi ho paya: {error.message}
        </p>
      ) : (
        <RadarFeed logs={logs} />
      )}
    </div>
  );
}
