"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { ImagePlus, Loader2, RotateCcw, ScanSearch, X } from "lucide-react";
import ThreatDossier, { AnalysisResult } from "@/components/ThreatDossier";

const SCAN_STEPS = [
  "Message padh rahe hain...",
  "Links aur numbers check ho rahe hain...",
  "Scam patterns match ho rahe hain...",
  "Verdict taiyaar ho raha hai...",
];

export default function ScannerUI() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) return;
    setStepIndex(0);
    const id = setInterval(
      () => setStepIndex((i) => Math.min(i + 1, SCAN_STEPS.length - 1)),
      1600
    );
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const attachImage = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const handleFile = useCallback(
    async (f: File) => {
      if (f.type.startsWith("image/")) {
        attachImage(f);
      } else if (f.type === "text/plain" || f.name.endsWith(".txt")) {
        const content = await f.text();
        setText(content.slice(0, 4000));
        setResult(null);
      } else {
        toast.error("Sirf image (PNG/JPG) ya .txt file upload karein.");
      }
    },
    [attachImage]
  );

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) return handleFile(f);
    const dropped = e.dataTransfer.getData("text");
    if (dropped) {
      setText(dropped.slice(0, 4000));
      setResult(null);
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/")
    );
    const f = item?.getAsFile();
    if (f) {
      e.preventDefault();
      attachImage(f);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const reset = () => {
    setText("");
    clearImage();
    setResult(null);
  };

  const analyze = async () => {
    if (!text.trim() && !file) {
      toast.error("Pehle koi message paste karein ya screenshot upload karein.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload: { text?: string; image?: string } = {};
      if (text.trim()) payload.text = text.trim();

      if (file) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.9, // keep safely under 1MB
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          initialQuality: 0.8,
        });
        payload.image = await imageCompression.getDataUrlFromFile(compressed);
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!data?.threat_level) {
        throw new Error("Invalid server response");
      }

      setResult({ threat_level: data.threat_level, reasoning: data.reasoning });
    } catch (err) {
      console.error(err);
      toast.error("Scan fail ho gaya. Internet check karke dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed bg-card p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
          dragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        {loading && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-background/60 backdrop-blur-[1px]">
            <div className="absolute inset-x-0 top-0 h-1/2 animate-scan bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="font-mono text-sm font-semibold text-accent">
                {SCAN_STEPS[stepIndex]}
              </p>
            </div>
          </div>
        )}

        <label
          htmlFor="scan-text"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted"
        >
          Message paste karein ya screenshot drop karein
        </label>

        <textarea
          id="scan-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={onPaste}
          disabled={loading}
          rows={6}
          maxLength={4000}
          placeholder="Yahan suspicious SMS / WhatsApp message paste karein... (Ctrl+V se screenshot bhi paste kar sakte hain)"
          className="w-full resize-none rounded-2xl border border-border bg-background p-4 font-mono text-sm outline-none transition-all duration-300 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
        />

        {preview && (
          <div className="relative mt-4 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Uploaded screenshot preview"
              className="max-h-48 rounded-2xl border border-border object-contain"
            />
            <button
              type="button"
              onClick={clearImage}
              disabled={loading}
              aria-label="Remove image"
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-foreground/5"
          >
            <ImagePlus className="h-4 w-4" />
            Screenshot upload
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.txt,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          <div className="flex items-center gap-2">
            {(text || file || result) && (
              <button
                type="button"
                onClick={reset}
                disabled={loading}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted transition-all duration-300 hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
            >
              <ScanSearch className="h-4 w-4" />
              {loading ? "Scanning..." : "Scan Message"}
            </button>
          </div>
        </div>
      </div>

      {result && <ThreatDossier result={result} />}
    </div>
  );
}
