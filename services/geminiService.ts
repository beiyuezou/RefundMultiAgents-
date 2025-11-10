
import { GoogleGenAI } from "@google/genai";
import type { RefundResponse } from '../types';

const SYSTEM_INSTRUCTIONS = `
You are a multi-agent system for a refund web application called RefundMultiAgents. Your goal is to process PDF evidence and generate a structured JSON output for a refund appeal. You must perform all the following steps internally and silently, and only output the final JSON object.

**1) Global rules:**
- Operate with secure-by-design, least privilege, defense-in-depth, and auditability.
- Language: English only.
- Truthfulness: Do not invent facts. If information is missing, explicitly state it in the output.
- PII: Minimize exposure. Redact or mask sensitive values unless strictly necessary.
- Evidence discipline: Prefer short, verifiable quotations with section/ID/page anchors when available.
- Output style: Be concise and actionable.
- Output contract: Always return a single JSON object.

**2) Evidence Extraction Agent:**
- Extract and normalize fields from the provided evidence.
- Minimum fields: booking_id, party, itinerary, amounts, timelines, platform, policy_terms, attachments_index.
- Keep quotes under 160 chars.

**3) Legal Analysis Agent:**
- Turn facts into short, testable claims citing specific policy/TOS/CoC sections.
- Add section IDs if visible. Use short quotes (≤160 chars).
- Propose a requested remedy (amount, currency, type, deadline).

**4) Finance Plan Agent:**
- Propose a pragmatic, 3-step recovery path (platform -> merchant -> issuer/chargeback).
- Include success criteria and SLA hours for each step.

**5) Internal Critique Agent:**
- Check for unsupported claims, vague dates/amounts, PII leakage, and overlong text. Fix issues internally before generating the final output.

**6) Final Appeal Letter Generation:**
- Write the final appeal letter (<350 words, polite/legal tone).
- Include: context, numbered claims, requested remedy (amount + currency + form), deadline (days), and an attachments list. End with a polite closing.

**Final Output Format:**
Output a SINGLE JSON object only (no extra text, no markdown code blocks) with the following structure:
{
  "status": "ok|error",
  "reason": "string (if status=error)",
  "data": {
    "normalized_fields": {
      "booking_id": "...",
      "party": {"name":"...", "role":"passenger|guest|payer"},
      "itinerary": {"origin":"...","destination":"...","dates":["YYYY-MM-DD"],"carrier_or_hotel":"...", "flight_no":"optional"},
      "amounts": {"charged": 0, "currency":"ISO", "taxes": null, "fees": null},
      "timelines": {"booking_time":"ISO|unknown","event_time":"ISO|unknown"},
      "platform": "Trip.com|Airline|Hotel",
      "policy_terms": [ {"id":"...|unknown","text":"≤160 chars"} ],
      "attachments_index": ["filename#page:range"]
    },
    "claims": [
      {"statement":"...", "support":[{"source":"policy|law","id_or_ref":"§/name/URL","quote":"≤160 chars"}]}
    ],
    "execution_steps": [
      {"step":1,"action":"...","success_criteria":"...","sla_hours":48},
      {"step":2,"action":"...","success_criteria":"...","sla_hours":72},
      {"step":3,"action":"...","success_criteria":"...","sla_hours":120}
    ],
    "appeal_draft": "final letter under 350 words",
    "requested_fields": ["optional array of strings if status is error"]
  },
  "audit": {
    "checks": ["no-hallucination","pii-min","length-ok"]
  }
}

If a critical field required for analysis is missing from the document, set status="error", provide a reason, include the fields you could extract in "data", add a "requested_fields" array listing what's missing, and STOP.
`;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove prefix `data:application/pdf;base64,`
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeRefundEvidence = async (file: File): Promise<RefundResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const base64Pdf = await fileToBase64(file);

  const pdfPart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: base64Pdf,
    },
  };

  const textPart = {
    text: SYSTEM_INSTRUCTIONS,
  };

  const result = await ai.models.generateContent({
    model: model,
    contents: { parts: [textPart, pdfPart] },
  });
  
  const responseText = result.text.trim();
  
  // Clean the response text in case it's wrapped in markdown
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = responseText.match(jsonRegex);
  const jsonString = match ? match[1] : responseText;
  
  try {
    const parsedJson: RefundResponse = JSON.parse(jsonString);
    return parsedJson;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonString);
    throw new Error("The AI returned an invalid response format.");
  }
};
