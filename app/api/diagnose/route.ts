import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==========================================
// 1. GENERATIVE AI PROMPT GENERATOR
// ==========================================

function getPrompt(deviceType: string) {
  return `
You are an expert AI hardware diagnostics classifier for circular electronics at EcoLoop.
Perform a high-fidelity hardware scan simulation for a device of type: "${deviceType}".
Return a highly professional, detailed assessment in JSON format.

Assess the physical states of:
1. screen (Screen glass, touch indicators, pixels).
2. battery (Battery health percentage capacity, swollen signs).
3. camera (Lenses, sensors, zoom focus).
4. chassis (External frame condition, dents, scratches).

Determine the optimal circular routing outcome (Choose exactly one from: "Refurbished", "Harvested", "Recycled", "Resale").
Provide a specific letter Grade (Grade A, Grade B, Grade C, or Grade D) reflecting the hardware condition.
Compute realistic confidence percentages for each routing option (refurbish, resale, salvage, recycle) that total roughly 100%.
Write a technical circular explanation explaining why this routing outcome is optimal based on the components' states.

You MUST respond ONLY with a raw JSON block in the following format. Do NOT wrap it in markdown code fences or backticks, just output a clean JSON string:
{
  "name": "Sleek Electronics Model (e.g. iPhone 14 Pro Max)",
  "grade": "Grade A (e.g. Grade B - Minor wear)",
  "diagnostics": {
    "screen": "Screen condition assessment...",
    "battery": "Battery health details...",
    "camera": "Camera status...",
    "chassis": "Frame structure status..."
  },
  "outcome": "Refurbished",
  "confidences": { "refurbish": 85, "resale": 10, "salvage": 5, "recycle": 0 },
  "explanation": "Full technical justification here..."
}
`;
}

// ==========================================
// 2. RESILIENT FAULT-TOLERANT MOCK ENGINE
// ==========================================

function getMockDiagnostics(deviceType: string) {
  if (deviceType === "laptop") {
    return {
      name: "MacBook Air M2 (AI Mock)",
      grade: "Grade C - Heavy Wear",
      diagnostics: {
        screen: "Grade C - Heavy delamination and anti-reflective coating wear",
        battery: "74% Capacity - Replace recommended soon",
        camera: "Grade A - Optical sensor fully clean",
        chassis: "Grade B - Minor scratches on lower deck"
      },
      outcome: "Harvested",
      confidences: { refurbish: 25, resale: 10, salvage: 92, recycle: 40 },
      explanation: "Heavy display delamination warrants complete screen replacement. Since replacement display modules exceed threshold salvage margins, harvesting intact core logic boards, OEM cameras, and clean keyboard layouts yields optimal circular recovery indexes."
    };
  } else if (deviceType === "tablet") {
    return {
      name: "iPad Pro 11-inch (AI Mock)",
      grade: "Grade D - Broken Frame",
      diagnostics: {
        screen: "Grade D - Shattered glass overlay and dead touch zones",
        battery: "42% Capacity - Swollen lithium pack detected",
        camera: "Grade C - Optical glass cracked",
        chassis: "Grade D - Frame bent more than 15 degrees"
      },
      outcome: "Recycled",
      confidences: { refurbish: 5, resale: 0, salvage: 18, recycle: 95 },
      explanation: "A swollen battery pack combined with deep frame warping and fractured display elements presents structural safety risks. Clean thermal dismantling and chemical extraction of precious raw materials (Gold, Lithium, Cobalt) is routed for maximum circular yield."
    };
  } else {
    return {
      name: "iPhone 14 Pro (AI Mock)",
      grade: "Grade B - Moderate Wear",
      diagnostics: {
        screen: "Grade B - Light hairline surface scratches, panel fully active",
        battery: "83% Capacity - Original lithium cell healthy",
        camera: "Grade A - Multi-lens system fully calibrated",
        chassis: "Grade B - Scuffs along camera frame rings"
      },
      outcome: "Refurbished",
      confidences: { refurbish: 88, resale: 65, salvage: 30, recycle: 5 },
      explanation: "Surface hairline scuffs are non-structural. The battery cell retains 83% capacity, allowing for direct refurbished repackaging or battery swap to yield high-value second-life retail trade."
    };
  }
}

// ==========================================
// 3. API ROUTE HANDLER
// ==========================================

export async function POST(req: Request) {
  let device = "phone";
  try {
    try {
      const body = await req.json();
      if (body && body.device) {
        device = body.device;
      }
    } catch {
      // Fall back to default
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Safe mock fallback if GEMINI_API_KEY is missing in env
      const mockData = getMockDiagnostics(device);
      return NextResponse.json(mockData);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for lightning-fast latency
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = getPrompt(device);
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
    const mockData = getMockDiagnostics(device);
    return NextResponse.json(mockData);
  }
}
