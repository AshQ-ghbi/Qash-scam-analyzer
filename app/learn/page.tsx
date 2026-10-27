"use client";

import { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Landmark,
  Package,
  Smartphone,
  Trophy,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Tactic = {
  id: string;
  title: string;
  Icon: LucideIcon;
  tagline: string;
  how: string;
  redFlags: string[];
  doThis: string[];
  example: string;
};

const TACTICS: Tactic[] = [
  {
    id: "kbc",
    title: "KBC Lottery",
    Icon: Trophy,
    tagline: "\"Aapne 25 lakh jeete hain!\"",
    how: "Scammer WhatsApp par KBC ya kisi badi company ke naam se jhoota inaam bhejta hai, fir 'processing fee' ya 'tax' ke naam par paise maangta hai.",
    redFlags: [
      "Aapne kabhi koi contest enter nahi kiya",
      "Inaam lene ke liye pehle paise bhejne ko kaha jata hai",
      "Foreign (+92, +44) ya unknown WhatsApp number",
    ],
    doThis: [
      "Number ko turant block aur report karein",
      "Kabhi bhi 'fee' ya 'tax' na bhejein",
      "Family ko bhi is scam ke baare me bataiye",
    ],
    example:
      "Congratulations! Aapka number KBC Lucky Draw me select hua hai. Rs 25,00,000 claim karne ke liye Rs 5,000 fee bhejein.",
  },
  {
    id: "electricity",
    title: "Electricity Disconnection",
    Icon: Zap,
    tagline: "\"Aaj raat aapki bijli kat jayegi\"",
    how: "SMS me kaha jata hai ki bill pending hai aur connection kat jayega. Fir ek number par call ya link par 'update' karne ko kaha jata hai, jisse phone me remote-access app install ho jati hai.",
    redFlags: [
      "Personal mobile number par call karne ko kehna",
      "Shortened ya ajeeb link (bit.ly, .in-login)",
      "Raat ka deadline aur dar ka mahaul",
    ],
    doThis: [
      "Apne bijli vibhag ke official app ya website se bill check karein",
      "Koi AnyDesk / TeamViewer / QuickSupport app install na karein",
      "Paise kat gaye ho to turant 1930 par call karein",
    ],
    example:
      "Dear Customer, aaj raat 9:30 baje aapka bijli connection kat jayega. Turant 98XXXXXX21 par sampark karein.",
  },
  {
    id: "kyc",
    title: "KYC & Bank Block",
    Icon: Landmark,
    tagline: "\"Aapka account band ho jayega\"",
    how: "Bank ke naam se SMS aata hai ki KYC expire ho gayi. Fake link par PAN, Aadhaar, card details aur OTP daalne par account khali ho jata hai.",
    redFlags: [
      "SMS me link ke zariye KYC update maangna",
      "OTP, PIN ya CVV poochna",
      "Bank ke naam jaisa lekin alag domain",
    ],
    doThis: [
      "Bank kabhi OTP ya PIN nahi maangta — kisi ko na batayein",
      "KYC ke liye seedha bank branch ya official app use karein",
      "Card turant block karwayein agar details share ho gayi",
    ],
    example:
      "SBI Alert: Aapka KYC expire ho gaya hai. Account block hone se bachne ke liye click karein: sbi-kyc-update.in",
  },
  {
    id: "jobs",
    title: "Job Frauds",
    Icon: Briefcase,
    tagline: "\"Ghar baithe roz 3000 kamayein\"",
    how: "Easy kaam (like karna, rating dena) ke naam par pehle chhota paisa dekar bharosa jeeta jata hai, fir badi 'registration' ya 'task deposit' maangi jati hai.",
    redFlags: [
      "Interview ke bina job offer",
      "Registration fee ya security deposit",
      "Telegram / WhatsApp group me task dena",
    ],
    doThis: [
      "Asli company kabhi job ke liye paise nahi maangti",
      "Company ki official website par vacancy verify karein",
      "Telegram groups ko report karke leave karein",
    ],
    example:
      "Work from home! Sirf YouTube videos like karke roz Rs 3,000 kamayein. Registration fee Rs 500.",
  },
  {
    id: "parcel",
    title: "Parcel & Digital Arrest",
    Icon: Package,
    tagline: "\"Aapke naam se parcel me drugs mila\"",
    how: "Courier, customs ya police ke naam par call aata hai. Video call par 'digital arrest' ka dar dikhakar paise transfer karwaye jate hain.",
    redFlags: [
      "Police ya CBI 'video call par arrest' nahi karti",
      "Case 'band' karne ke liye paise maangna",
      "Kisi ko na batane ki dhamki",
    ],
    doThis: [
      "Call kaatein aur kisi se batayein — ghabrayein nahi",
      "Koi bhi sarkari agency paise transfer nahi karwati",
      "Turant 1930 par report karein",
    ],
    example:
      "Aapke naam ka parcel customs me pakda gaya hai. Case band karwane ke liye abhi hamare officer se video call par judiye.",
  },
  {
    id: "upi",
    title: "UPI Refund Trick",
    Icon: Smartphone,
    tagline: "\"Galti se paise bhej diye, wapas kar do\"",
    how: "Scammer 'collect request' bhejta hai ya refund ke bahane PIN daalne ko kehta hai. UPI PIN sirf paise bhejne ke liye hota hai, paise lene ke liye nahi.",
    redFlags: [
      "Paise 'receive' karne ke liye PIN maangna",
      "Unknown QR code scan karwana",
      "Refund ke liye screen share ya app install",
    ],
    doThis: [
      "Unknown 'collect request' hamesha decline karein",
      "UPI PIN kisi ko na batayein",
      "QR sirf paise bhejne ke liye scan karein",
    ],
    example:
      "Bhai galti se aapke account me Rs 5,000 chale gaye, please wapas bhej do. Ye QR scan kar lijiye.",
  },
];

export default function LearnPage() {
  const [active, setActive] = useState(TACTICS[0].id);
  const t = TACTICS.find((x) => x.id === active) ?? TACTICS[0];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <p className="mb-3 font-mono text-sm font-bold tracking-widest text-primary">
          03. SCAM LIBRARY
        </p>
       <h1 className="text-4xl leading-tight tracking-normal [word-spacing:12px] sm:text-6xl py-2">
          KNOW THE TACTICS
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Bharat me sabse zyada hone wale scams, simple bhasha me — pehchaniye aur bachiye.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2" role="tablist">
        {TACTICS.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={active === x.id}
            onClick={() => setActive(x.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              active === x.id
                ? "border-primary bg-primary text-white shadow-md"
                : "border-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <x.Icon className="h-4 w-4" />
            {x.title}
          </button>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <t.Icon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl">{t.title}</h2>
            <p className="mt-1 font-mono text-sm text-primary">{t.tagline}</p>
          </div>
        </div>

        <p className="mt-5 leading-relaxed text-muted">{t.how}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-threat-red/30 bg-threat-red/5 p-4">
            <h3 className="mb-3 text-sm uppercase tracking-widest text-threat-red">Red Flags</h3>
            <ul className="space-y-2 text-sm">
              {t.redFlags.map((f) => (
                <li key={f} className="flex gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-threat-red" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-threat-green/30 bg-threat-green/5 p-4">
            <h3 className="mb-3 text-sm uppercase tracking-widest text-threat-green">Kya Karein</h3>
            <ul className="space-y-2 text-sm">
              {t.doThis.map((f) => (
                <li key={f} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-threat-green" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background p-4">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted">
            Example message
          </p>
          <p className="font-mono text-sm leading-relaxed">{t.example}</p>
        </div>
      </section>
    </div>
  );
}
