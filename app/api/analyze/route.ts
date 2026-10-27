import { NextResponse } from "next/server";
import { GEMINI_API_KEY, GEMINI_MODEL, SYSTEM_PROMPT } from "@/lib/geminiClient";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "nodejs";
export const maxDuration = 30;

type ThreatLevel = "Red" | "Yellow" | "Green" | "Invalid";

type AIResult = {
  threat_level: ThreatLevel;
  reasoning: string;
  extracted_text?: string;
};

const MAX_TEXT_CHARS = 4000;
const MAX_IMAGE_B64_CHARS = 3_000_000;

const FALLBACK: AIResult = {
  threat_level: "Yellow",
  reasoning: "Network congestion. Please verify manually.",
};

const VALID_LEVELS: ThreatLevel[] = ["Red", "Yellow", "Green", "Invalid"];

function parseImage(image: string): { mimeType: string; data: string } {
  const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]*)$/);
  if (match) return { mimeType: match[1], data: match[2] };
  return { mimeType: "image/jpeg", data: image };
}

function normalize(raw: string): AIResult {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned);

  const level = VALID_LEVELS.find(
    (l) => l.toLowerCase() === String(parsed.threat_level ?? "").toLowerCase()
  );
  if (!level || typeof parsed.reasoning !== "string") {
    throw new Error("Malformed AI response");
  }

  return {
    threat_level: level,
    reasoning: parsed.reasoning.trim(),
    extracted_text:
      typeof parsed.extracted_text === "string" ? parsed.extracted_text : undefined,
  };
}

export async function POST(req: Request) {
  let body: { text?: string; image?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { threat_level: "Invalid", reasoning: "Request galat hai. Dobara try karein." },
      { status: 400 }
    );
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const image = typeof body.image === "string" ? body.image : "";

  if (!text && !image) {
    return NextResponse.json(
      {
        threat_level: "Invalid",
        reasoning: "Koi message ya screenshot nahi mila. Kuch upload ya paste karein.",
      },
      { status: 400 }
    );
  }

  if (image.length > MAX_IMAGE_B64_CHARS) {
    return NextResponse.json(
      { threat_level: "Invalid", reasoning: "Image bahut badi hai. Chhoti image upload karein." },
      { status: 413 }
    );
  }

  const trimmedText = text.slice(0, MAX_TEXT_CHARS);

  let result: AIResult;

  try {
    const parts: any[] = [];

    if (image) {
      const { mimeType, data } = parseImage(image);
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: data,
        },
      });
    }

    parts.push({
      text: trimmedText
        ? `Analyze this message for scams:\n\n${trimmedText}`
        : "Analyze the message shown in this screenshot for scams.",
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.1,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[/api/analyze] Gemini HTTP Error:", response.status, errBody);
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    result = normalize(generatedText);
  } catch (err) {
    console.error("[/api/analyze] Gemini failure:", err);
    return NextResponse.json(FALLBACK);
  }

  // Privacy (zero-retention): only Red / Yellow results are logged. Green and Invalid are never stored.
  if (result.threat_level === "Red" || result.threat_level === "Yellow") {
    const inputContent = (
      trimmedText ||
      (result.extracted_text ? `[Image scan] ${result.extracted_text}` : "[Image uploaded for scanning]")
    ).slice(0, 2000);

    try {
      const { error } = await supabase.from("scam_logs").insert({
        input_content: inputContent,
        threat_level: result.threat_level,
        reasoning: result.reasoning,
      });
      if (error) console.error("[/api/analyze] Supabase insert error:", error.message);
    } catch (err) {
      console.error("[/api/analyze] Supabase exception:", err);
    }
  }

  return NextResponse.json({
    threat_level: result.threat_level,
    reasoning: result.reasoning,
    extracted_text: result.extracted_text,
  });
}