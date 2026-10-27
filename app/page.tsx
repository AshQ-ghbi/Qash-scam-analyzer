import { Languages, Lock, Zap } from "lucide-react";
import ScannerUI from "@/components/ScannerUI";

const FEATURES = [
  {
    Icon: Languages,
    title: "Hinglish • Hindi • English",
    body: "Local bhasha me likhe scams bhi pakad leta hai.",
  },
  {
    Icon: Zap,
    title: "Seconds me verdict",
    body: "Red, Yellow ya Green — saaf aur simple jawab.",
  },
  {
    Icon: Lock,
    title: "Privacy first",
    body: "Aapki personal details kabhi store nahi hoti.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 text-center">
        <p className="mb-3 font-mono text-sm font-bold tracking-widest text-primary">
          01. LIVE SCANNER
        </p>
        <h1 className="text-4xl leading-tight tracking-normal [word-spacing:12px] sm:text-6xl py-2">
  VERIFY ANY SUSPICIOUS MESSAGE
</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
          SMS ya WhatsApp pe aaya fake bijli bill, KBC lottery ya KYC message?
          Paste karein — hamara AI forensic scanner turant bata dega.
        </p>
      </div>

      <ScannerUI />

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Icon className="mb-3 h-6 w-6 text-primary" />
            <h3 className="text-base">{title}</h3>
            <p className="mt-1 text-sm text-muted">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
