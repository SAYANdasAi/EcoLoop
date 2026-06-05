import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==========================================
// 1. GENERATIVE AI PROMPT GENERATOR
// ==========================================

function getPrompt(details: any) {
  const brand = details.brand || "Unknown";
  const modelName = details.modelName || "Device";
  const purchaseYear = details.purchaseYear || "2022";
  const storage = details.storage || "128GB";
  const batteryHealth = details.batteryHealth || 85;
  const screenCondition = details.screenCondition || "no_damage";
  const bodyCondition = details.bodyCondition || "excellent";
  const functionalIssues = details.functionalIssues || [];
  const waterDamage = details.waterDamage || false;
  const accessories = details.accessories || [];

  return `
You are an expert AI hardware diagnostics classifier for circular electronics at EcoLoop.
Evaluate the circular recovery path, payout value, and breakdown probabilities for this device:
- Brand: ${brand}
- Model: ${modelName}
- Purchase Year: ${purchaseYear}
- Storage: ${storage}
- Battery Health: ${batteryHealth}%
- Screen Condition: ${screenCondition} (no_damage, minor_scratches, cracked, shattered)
- Body Condition: ${bodyCondition} (excellent, good, fair, poor)
- Functional Issues: ${functionalIssues.join(", ") || "None"}
- Water Damage: ${waterDamage ? "Yes" : "No"}
- Accessories: ${accessories.join(", ") || "None"}

Perform a high-fidelity hardware scan assessment.
You must return a raw JSON block and NOTHING else. Do NOT wrap it in markdown code fences or backticks, just output a clean JSON string matching this interface:
{
  "device": "${brand} ${modelName}",
  "outcome": "Reuse" | "Refurbish" | "Repair" | "Recycle",
  "confidence": number (1-100, representing prediction confidence),
  "value": string (estimated circular payout value in Indian Rupees, e.g. "₹18,500"),
  "reason": "Detailed technical circular explanation explaining why this outcome is optimal based on the components' states.",
  "secondary": "Alternative circular pathway description, e.g., 'Alternative: B2B bulk buyout at ₹16,000'",
  "refurbish": number (0-100 probability for refurbish),
  "parts": number (0-100 probability for parts/repair),
  "reuse": number (0-100 probability for direct reuse),
  "recycle": number (0-100 probability for scrap recycling)
}

Rules for values:
1. "outcome":
   - "Recycle" if waterDamage = true, batteryHealth < 35%, screenCondition = shattered, or bodyCondition = poor.
   - "Repair" if screenCondition = cracked or has multiple functional issues.
   - "Refurbish" if screenCondition = minor_scratches, bodyCondition = fair/good, or batteryHealth is 70-85%.
   - "Reuse" if condition is excellent/flawless and battery is healthy.
2. "value":
   - For Recycle: "₹1,000" - "₹2,000"
   - For Repair: "₹4,000" - "₹7,500"
   - For Refurbish: "₹9,000" - "₹13,500"
   - For Reuse: "₹15,000" - "₹22,000" (adjust based on age, brand and storage)
3. Probabilities (refurbish, parts, reuse, recycle) must total roughly 100%. The confidence must match the highest probability.
`;
}

// ==========================================
// 2. RESILIENT FAULT-TOLERANT MOCK ENGINE
// ==========================================

function getMockDiagnostics(details: any) {
  const brand = details.brand || "Unknown";
  const modelName = details.modelName || "Device";
  const deviceTitle = `${brand} ${modelName}`;
  const waterDamage = details.waterDamage || false;
  const screenCondition = details.screenCondition || "no_damage";
  const bodyCondition = details.bodyCondition || "excellent";
  const batteryHealth = details.batteryHealth || 85;
  const functionalIssues = details.functionalIssues || [];

  if (waterDamage || screenCondition === "shattered" || bodyCondition === "poor" || batteryHealth < 35) {
    return {
      device: deviceTitle,
      outcome: "Recycle",
      confidence: 94,
      value: "₹1,500",
      reason: "Device has critical hardware failure: either water ingress, a shattered display, or severely degraded battery chemistry. Safe extraction of raw minerals via certified e-waste recycling is the optimal circular outcome.",
      secondary: "Alternative: Precious metal extraction & mineral loop",
      refurbish: 10,
      parts: 40,
      reuse: 5,
      recycle: 94,
    };
  }
  if (screenCondition === "cracked" || (functionalIssues && functionalIssues.length > 2) || (batteryHealth >= 35 && batteryHealth < 70)) {
    return {
      device: deviceTitle,
      outcome: "Repair",
      confidence: 82,
      value: "₹6,000",
      reason: "Device is functional but has a cracked screen and a degraded battery. Screen replacement estimated at ₹2,000. After repair, resale value reaches ₹6,000 — yielding a net circular value of ₹4,000.",
      secondary: "Alternative: Parts recovery — screen glass & logic board",
      refurbish: 45,
      parts: 75,
      reuse: 20,
      recycle: 15,
    };
  }
  if (screenCondition === "minor_scratches" || bodyCondition === "fair" || bodyCondition === "good" || (batteryHealth >= 70 && batteryHealth < 85)) {
    return {
      device: deviceTitle,
      outcome: "Refurbish",
      confidence: 87,
      value: "₹11,500",
      reason: "Device has minor wear but is fully functional. Recommending professional sanitization, casing buff, and battery calibration before listing as Certified Refurbished. Expected resale value: ₹11,500.",
      secondary: "Alternative: Direct C2C marketplace listing",
      refurbish: 87,
      parts: 60,
      reuse: 30,
      recycle: 10,
    };
  }
  return {
    device: deviceTitle,
    outcome: "Reuse",
    confidence: 96,
    value: "₹18,500",
    reason: "Device is in excellent condition with premium battery health and zero structural damage. No repairs needed. Immediate route: direct peer-to-peer marketplace listing to maximise circular value at ₹18,500.",
    secondary: "Alternative: B2B bulk buyout at ₹16,000",
    refurbish: 20,
    parts: 25,
    reuse: 96,
    recycle: 5,
  };
}

// ==========================================
// 3. API ROUTE HANDLER
// ==========================================

export async function POST(req: Request) {
  let details: any = {};
  try {
    details = await req.json();
  } catch {
    // Fall back to empty object
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Safe mock fallback if GEMINI_API_KEY is missing in env
    const mockData = getMockDiagnostics(details);
    return NextResponse.json(mockData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for lightning-fast latency
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = getPrompt(details);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Clean markdown code blocks from model outputs
    const jsonStr = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(jsonStr);
    return NextResponse.json(parsedData);
  } catch (err) {
    console.error("Gemini AI API classification failure. Running resilient fallback:", err);
    // Safe mock fallback on any network/API errors
    const mockData = getMockDiagnostics(details);
    return NextResponse.json(mockData);
  }
}

