"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ClipboardCopy, ExternalLink, Globe, Phone, Siren } from "lucide-react";

type Helpline = {
  name: string;
  detail: string;
  kind: "call" | "web" | "emergency";
  href: string;
};

type Country = {
  regions: string[];
  national: Helpline[];
  overrides?: Record<string, Helpline[]>;
  note?: string;
};

const INDIA_REGIONS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const ALL = ["All regions"];

const COUNTRIES: Record<string, Country> = {
  India: {
    regions: INDIA_REGIONS,
    national: [
      { name: "National Cyber Crime Helpline", detail: "1930", kind: "call", href: "tel:1930" },
      { name: "National Cyber Crime Reporting Portal", detail: "cybercrime.gov.in", kind: "web", href: "https://cybercrime.gov.in" },
      { name: "Police / Emergency", detail: "112", kind: "emergency", href: "tel:112" },
    ],
    note: "1930 connects you to the cyber cell of your own state or UT. Call within the first hour of a financial fraud for the best chance of freezing the money.",
  },
  "United States": {
    regions: ALL,
    national: [
      { name: "FTC Fraud Reporting", detail: "reportfraud.ftc.gov", kind: "web", href: "https://reportfraud.ftc.gov" },
      { name: "FBI Internet Crime Complaint Center", detail: "ic3.gov", kind: "web", href: "https://www.ic3.gov" },
      { name: "FTC Helpline", detail: "1-877-382-4357", kind: "call", href: "tel:+18773824357" },
      { name: "Emergency", detail: "911", kind: "emergency", href: "tel:911" },
    ],
  },
  "United Kingdom": {
    regions: ["England", "Wales", "Northern Ireland", "Scotland"],
    national: [
      { name: "Action Fraud (National Fraud Reporting)", detail: "0300 123 2040", kind: "call", href: "tel:03001232040" },
      { name: "Action Fraud Online", detail: "actionfraud.police.uk", kind: "web", href: "https://www.actionfraud.police.uk" },
      { name: "Forward scam texts (free)", detail: "7726", kind: "call", href: "sms:7726" },
      { name: "Emergency", detail: "999", kind: "emergency", href: "tel:999" },
    ],
    overrides: {
      Scotland: [
        { name: "Police Scotland (non-emergency)", detail: "101", kind: "call", href: "tel:101" },
        { name: "Forward scam texts (free)", detail: "7726", kind: "call", href: "sms:7726" },
        { name: "Emergency", detail: "999", kind: "emergency", href: "tel:999" },
      ],
    },
  },
  Canada: {
    regions: ALL,
    national: [
      { name: "Canadian Anti-Fraud Centre", detail: "1-888-495-8501", kind: "call", href: "tel:+18884958501" },
      { name: "CAFC Online Reporting", detail: "antifraudcentre-centreantifraude.ca", kind: "web", href: "https://www.antifraudcentre-centreantifraude.ca" },
      { name: "Emergency", detail: "911", kind: "emergency", href: "tel:911" },
    ],
  },
  Australia: {
    regions: ALL,
    national: [
      { name: "Scamwatch", detail: "scamwatch.gov.au", kind: "web", href: "https://www.scamwatch.gov.au" },
      { name: "ReportCyber", detail: "cyber.gov.au", kind: "web", href: "https://www.cyber.gov.au/report-and-recover/report" },
      { name: "Australian Cyber Security Hotline", detail: "1300 292 371", kind: "call", href: "tel:1300292371" },
      { name: "Emergency", detail: "000", kind: "emergency", href: "tel:000" },
    ],
  },
  Singapore: {
    regions: ALL,
    national: [
      { name: "ScamShield Helpline", detail: "1799", kind: "call", href: "tel:1799" },
      { name: "ScamShield", detail: "scamshield.gov.sg", kind: "web", href: "https://www.scamshield.gov.sg" },
      { name: "Police Emergency", detail: "999", kind: "emergency", href: "tel:999" },
    ],
  },
};

const ICONS = { call: Phone, web: Globe, emergency: Siren } as const;

export default function ReportPage() {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [scammer, setScammer] = useState("");
  const [country, setCountry] = useState("India");
  const [region, setRegion] = useState(COUNTRIES.India.regions[0]);

  const data = COUNTRIES[country];

  const helplines = useMemo(
    () => data.overrides?.[region] ?? data.national,
    [data, region]
  );

  const onCountry = (c: string) => {
    setCountry(c);
    setRegion(COUNTRIES[c].regions[0]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      toast.error("Scam ki details likhna zaroori hai.");
      return;
    }

    const report = [
      "SCAM REPORT",
      `Name: ${name.trim() || "Not provided"}`,
      `Location: ${region === "All regions" ? country : `${region}, ${country}`}`,
      `Scammer number / link: ${scammer.trim() || "Not provided"}`,
      "",
      "Details:",
      details.trim(),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      toast.success("Report copy ho gayi. Ab ise official helpline / portal par paste karein.");
    } catch {
      toast.error("Copy nahi ho paya. Details manually select karke copy karein.");
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <p className="mb-3 font-mono text-sm font-bold tracking-widest text-primary">
          06. EMERGENCY HELP - Report the Scam
        </p>
        <h1 className="text-4xl leading-tight tracking-normal [word-spacing:12px] sm:text-6xl py-2">REPORT A SCAM</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Report taiyaar karein aur seedha official cybercrime helpline par bhejein.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT — Report form */}
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
        >
          <h2 className="text-2xl">Report Form</h2>

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Aapka Naam (optional)
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label htmlFor="scammer" className="mb-1 block text-sm font-medium">
              Scammer ka number / link (optional)
            </label>
            <input
              id="scammer"
              value={scammer}
              onChange={(e) => setScammer(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label htmlFor="details" className="mb-1 block text-sm font-medium">
              Scam Details
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={7}
              required
              placeholder="Kya hua? Kab hua? Kitne paise gaye? Message ya call ki details..."
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <ClipboardCopy className="h-4 w-4" />
            Report taiyaar karke copy karein
          </button>
          <p className="text-xs text-muted">
            Ye form aapki details hamare server par save nahi karta — report sirf aapke device par copy hoti hai.
          </p>
        </form>

        {/* RIGHT — Helplines */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
          <h2 className="text-2xl">Official Helplines</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="country" className="mb-1 block text-sm font-medium">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => onCountry(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {Object.keys(COUNTRIES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="region" className="mb-1 block text-sm font-medium">
                State / Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {data.regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ul className="mt-5 space-y-3">
            {helplines.map((h) => {
              const Icon = ICONS[h.kind];
              const external = h.kind === "web";
              return (
                <li key={h.name}>
                  <a
                    href={h.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        h.kind === "emergency"
                          ? "bg-threat-red/15 text-threat-red"
                          : "bg-primary/15 text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-muted">{h.name}</span>
                      <span className="block break-words font-mono text-lg font-semibold">
                        {h.detail}
                      </span>
                    </span>
                    {external && <ExternalLink className="h-4 w-4 shrink-0 text-muted" />}
                  </a>
                </li>
              );
            })}
          </ul>

          {data.note && <p className="mt-4 text-xs leading-relaxed text-muted">{data.note}</p>}
        </section>
      </div>
    </div>
  );
}
