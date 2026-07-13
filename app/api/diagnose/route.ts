import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==========================================
// IMAGE & PRICING UTILITY FUNCTIONS
// ==========================================

function isSideProfileFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.startsWith("left.") || 
         name.startsWith("right.") || 
         name.includes("left_side") || 
         name.includes("right_side") || 
         name.includes("left-side") || 
         name.includes("right-side") ||
         (name.includes("side") && (name.includes("left") || name.includes("right")));
}

async function searchDDG(query: string): Promise<string[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) throw new Error(`DDG status ${res.status}`);
    const html = await res.text();
    const matches = html.matchAll(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g);
    const snippets: string[] = [];
    for (const match of matches) {
      const cleanText = match[1]
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      snippets.push(cleanText);
      if (snippets.length >= 6) break;
    }
    return snippets;
  } catch (err) {
    console.error("DDG Search failed:", err);
    return [];
  }
}

async function validateImagesWithGemini(files: File[], apiKey: string): Promise<{ valid: boolean; message?: string }> {
  // 1. Dev-Mock Fallback Check: inspect filenames for common non-phone keywords
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size === 0 || file.name.startsWith("dummy_")) continue;
    
    if (isSideProfileFile(file)) {
      console.log(`[Dev Mock Guardrail] Bypassing keyword check for side profile image: ${file.name}`);
      continue;
    }
    
    const filenameLower = file.name.toLowerCase();
    const nonPhoneKeywords = [
      "person", "human", "man", "woman", "guy", "girl", "boy", "selfie", 
      "face", "profile", "avatar", "not_a_phone", "not-a-phone", "not-phone", 
      "scenery", "car", "cat", "dog", "food", "flower", "document", "room",
      "tablet", "ipad", "laptop", "macbook", "computer", "keyboard", "watch", 
      "smartwatch", "tv", "monitor", "box", "charger", "cable", "accessory",
      "headphone", "earphone", "mouse", "desk", "house", "building"
    ];
    
    const matchedKeyword = nonPhoneKeywords.find(keyword => filenameLower.includes(keyword));
    if (matchedKeyword) {
      console.log(`[Dev Mock Guardrail] Blocked image: ${file.name} due to keyword '${matchedKeyword}'`);
      return {
        valid: false,
        message: `Image validation blocked: "${file.name}" was identified as a non-phone photo. Please upload only valid photos of your mobile device.`
      };
    }
  }

  // 2. Query Gemini API
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size === 0 || file.name.startsWith("dummy_")) continue;

      if (isSideProfileFile(file)) {
        console.log(`[Validation] Auto-approving side profile image: ${file.name}`);
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: file.type || "image/jpeg"
        }
      };

      const prompt = `Analyze this image. Is it a photo of a mobile phone (specifically a smart phone or cell phone) or a physical body part of one (such as the screen, back plate, side chassis, buttons, bezel, or a close-up of a scratch/dent/crack on the phone)?
Important: Narrow side-profile views showing the thin side edges of a mobile phone (such as the left or right side profiles displaying volume keys, power buttons, SIM card tray slots, side bezels, or metallic chassis frames) are FULLY VALID photos of a mobile phone.
The phone can be in any cosmetic or physical condition. Photos of phones that are scratched, dented, cracked, shattered, oily, dirty, smudged, or showing zoomed-in close-ups of scratches, scuff marks, dents, or cracks on the phone glass or metal body are also FULLY VALID.
Other devices like tablets, iPads, laptops, computers, smartwatches, watch bands, chargers, boxes, documents, people, scenery, or any completely unrelated objects are NOT valid.
If yes (it is a mobile phone body, side profile, part of one, or close-up of phone damage), return JSON: {"is_mobile_phone": true, "reason": "Valid mobile phone body, side, or damage picture"}.
If no (including tablets, laptops, smartwatches, documents, people, or other non-phone objects), return JSON: {"is_mobile_phone": false, "reason": "This image does not appear to be a mobile phone body, side profile, or phone part."}.
Do not include any markdown backticks or extra text, just raw JSON.`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text().trim();
      
      const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.is_mobile_phone === false) {
          return {
            valid: false,
            message: parsed.reason || `Image ${i + 1} does not look like a mobile phone.`
          };
        }
      } catch (e) {
        console.error("Failed to parse Gemini response for image check:", text, e);
        if (text.toLowerCase().includes('"is_mobile_phone": false') || text.toLowerCase().includes('"is_mobile_phone":false')) {
          return {
            valid: false,
            message: "One or more uploaded images do not appear to be a mobile phone."
          };
        }
      }
    }
  } catch (err: any) {
    console.error("Error running image validation with Gemini:", err);
    console.warn("[Graceful Fallback] Gemini API error (quota/auth/network). Bypassing image validation guardrail to keep application functional.");
    return { valid: true };
  }
  return { valid: true };
}

async function validateImagesWithOpenAI(files: File[], apiKey: string): Promise<{ valid: boolean; message?: string }> {
  // 1. Dev-Mock Fallback Check: inspect filenames for common non-phone keywords
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size === 0 || file.name.startsWith("dummy_")) continue;
    
    if (isSideProfileFile(file)) {
      console.log(`[Dev Mock Guardrail] Bypassing keyword check for side profile image: ${file.name}`);
      continue;
    }
    
    const filenameLower = file.name.toLowerCase();
    const nonPhoneKeywords = [
      "person", "human", "man", "woman", "guy", "girl", "boy", "selfie", 
      "face", "profile", "avatar", "not_a_phone", "not-a-phone", "not-phone", 
      "scenery", "car", "cat", "dog", "food", "flower", "document", "room",
      "tablet", "ipad", "laptop", "macbook", "computer", "keyboard", "watch", 
      "smartwatch", "tv", "monitor", "box", "charger", "cable", "accessory",
      "headphone", "earphone", "mouse", "desk", "house", "building"
    ];
    
    const matchedKeyword = nonPhoneKeywords.find(keyword => filenameLower.includes(keyword));
    if (matchedKeyword) {
      console.log(`[Dev Mock Guardrail] Blocked image: ${file.name} due to keyword '${matchedKeyword}'`);
      return {
        valid: false,
        message: `Image validation blocked: "${file.name}" was identified as a non-phone photo. Please upload only valid photos of your mobile device.`
      };
    }
  }

  // 2. Query OpenAI API (gpt-4o-mini)
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size === 0 || file.name.startsWith("dummy_")) continue;

      if (isSideProfileFile(file)) {
        console.log(`[Validation] Auto-approving side profile image: ${file.name}`);
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");
      
      const prompt = `Analyze this image. Is it a photo of a mobile phone (specifically a smart phone or cell phone) or a physical body part of one (such as the screen, back plate, side chassis, buttons, bezel, or a close-up of a scratch/dent/crack on the phone)?
Important: Narrow side-profile views showing the thin side edges of a mobile phone (such as the left or right side profiles displaying volume keys, power buttons, SIM card tray slots, side bezels, or metallic chassis frames) are FULLY VALID photos of a mobile phone.
The phone can be in any cosmetic or physical condition. Photos of phones that are scratched, dented, cracked, shattered, oily, dirty, smudged, or showing zoomed-in close-ups of scratches, scuff marks, dents, or cracks on the phone glass or metal body are also FULLY VALID.
Other devices like tablets, iPads, laptops, computers, smartwatches, watch bands, chargers, boxes, documents, people, scenery, or any completely unrelated objects are NOT valid.
If yes (it is a mobile phone body, side profile, part of one, or close-up of phone damage), return JSON: {"is_mobile_phone": true, "reason": "Valid mobile phone body, side, or damage picture"}.
If no (including tablets, laptops, smartwatches, documents, people, or other non-phone objects), return JSON: {"is_mobile_phone": false, "reason": "This image does not appear to be a mobile phone body, side profile, or phone part."}.
Do not include any markdown backticks or extra text, just raw JSON.`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${file.type || "image/jpeg"};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`OpenAI API error: Status ${res.status} | Details: ${errorText}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim() || "";
      const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      if (parsed.is_mobile_phone === false) {
        return {
          valid: false,
          message: parsed.reason || `Image ${i + 1} does not look like a mobile phone.`
        };
      }
    }
  } catch (err: any) {
    console.error("Error running image validation with OpenAI:", err);
    return {
      valid: false,
      message: `OpenAI Image validation error: ${err.message || "Service unavailable"}`
    };
  }
  return { valid: true };
}

async function validateImagesWithGroq(files: File[], apiKey: string): Promise<{ valid: boolean; message?: string }> {
  // 1. Dev-Mock Fallback Check: inspect filenames for common non-phone keywords
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size === 0 || file.name.startsWith("dummy_")) continue;
    
    if (isSideProfileFile(file)) {
      console.log(`[Dev Mock Guardrail] Bypassing keyword check for side profile image: ${file.name}`);
      continue;
    }
    
    const filenameLower = file.name.toLowerCase();
    const nonPhoneKeywords = [
      "person", "human", "man", "woman", "guy", "girl", "boy", "selfie", 
      "face", "profile", "avatar", "not_a_phone", "not-a-phone", "not-phone", 
      "scenery", "car", "cat", "dog", "food", "flower", "document", "room",
      "tablet", "ipad", "laptop", "macbook", "computer", "keyboard", "watch", 
      "smartwatch", "tv", "monitor", "box", "charger", "cable", "accessory",
      "headphone", "earphone", "mouse", "desk", "house", "building"
    ];
    
    const matchedKeyword = nonPhoneKeywords.find(keyword => filenameLower.includes(keyword));
    if (matchedKeyword) {
      console.log(`[Dev Mock Guardrail] Blocked image: ${file.name} due to keyword '${matchedKeyword}'`);
      return {
        valid: false,
        message: `Image validation blocked: "${file.name}" was identified as a non-phone photo. Please upload only valid photos of your mobile device.`
      };
    }
  }

  // 2. Query Groq API (llama-3.2-11b-vision-preview)
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size === 0 || file.name.startsWith("dummy_")) continue;

      if (isSideProfileFile(file)) {
        console.log(`[Validation] Auto-approving side profile image: ${file.name}`);
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");
      
      const prompt = `Analyze this image. Is it a photo of a mobile phone (specifically a smart phone or cell phone) or a physical body part of one (such as the screen, back plate, side chassis, buttons, bezel, or a close-up of a scratch/dent/crack on the phone)?
Important: Narrow side-profile views showing the thin side edges of a mobile phone (such as the left or right side profiles displaying volume keys, power buttons, SIM card tray slots, side bezels, or metallic chassis frames) are FULLY VALID photos of a mobile phone.
The phone can be in any cosmetic or physical condition. Photos of phones that are scratched, dented, cracked, shattered, oily, dirty, smudged, or showing zoomed-in close-ups of scratches, scuff marks, dents, or cracks on the phone glass or metal body are also FULLY VALID.
Other devices like tablets, iPads, laptops, computers, smartwatches, watch bands, chargers, boxes, documents, people, scenery, or any completely unrelated objects are NOT valid.
If yes (it is a mobile phone body, side profile, part of one, or close-up of phone damage), return JSON: {"is_mobile_phone": true, "reason": "Valid mobile phone body, side, or damage picture"}.
If no (including tablets, laptops, smartwatches, documents, people, or other non-phone objects), return JSON: {"is_mobile_phone": false, "reason": "This image does not appear to be a mobile phone body, side profile, or phone part."}.
Do not include any markdown backticks or extra text, just raw JSON.`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.2-11b-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${file.type || "image/jpeg"};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`Groq API error: Status ${res.status} | Details: ${errorText}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim() || "";
      const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      if (parsed.is_mobile_phone === false) {
        return {
          valid: false,
          message: parsed.reason || `Image ${i + 1} does not look like a mobile phone.`
        };
      }
    }
  } catch (err: any) {
    console.error("Error running image validation with Groq:", err);
    return {
      valid: false,
      message: `Groq Vision Image validation error: ${err.message || "Service unavailable"}`
    };
  }
  return { valid: true };
}

async function queryPricingAndClassification(
  details: {
    brand: string;
    modelName: string;
    purchaseYear: string;
    storage: string;
    batteryHealth: number;
    screenCondition: string;
    bodyCondition: string;
    functionalIssues: string[];
    waterDamage: boolean;
  },
  outcome: string,
  geminiApiKey?: string
) {
  const isApple = details.brand.toLowerCase().includes("apple") || details.brand.toLowerCase().includes("iphone");
  const os = isApple ? "iOS" : "Android";
  
  let screen_size = 6.1;
  if (details.modelName.toLowerCase().includes("plus") || details.modelName.toLowerCase().includes("max") || details.modelName.toLowerCase().includes("ultra")) {
    screen_size = 6.7;
  } else if (details.modelName.toLowerCase().includes("mini") || details.modelName.toLowerCase().includes("se")) {
    screen_size = 5.4;
  }

  let ram = 4.0;
  let battery = 3000.0;
  if (details.modelName.toLowerCase().includes("pro") || details.modelName.toLowerCase().includes("ultra")) {
    ram = 8.0;
    battery = 4500.0;
  }

  const currentYear = new Date().getFullYear();
  const releaseYear = Number(details.purchaseYear) || 2021;
  const days_used = Math.max(0, (currentYear - releaseYear) * 365);
  const internal_memory = parseFloat(details.storage.replace(/[^0-9]/g, "")) || 128.0;

  let normalized_new_price = 5.8; // default exp(5.8) = ~330 USD
  if (isApple) {
    normalized_new_price = 6.8; // exp(6.8) = ~897 USD
  } else if (details.modelName.toLowerCase().includes("ultra") || details.modelName.toLowerCase().includes("fold")) {
    normalized_new_price = 7.1; // exp(7.1) = ~1211 USD
  }

  const pricePayload = {
    features: {
      device_brand: details.brand,
      os: os,
      screen_size: screen_size,
      "4g": "yes",
      "5g": "yes",
      rear_camera_mp: 12.0,
      front_camera_mp: 8.0,
      internal_memory: internal_memory,
      ram: ram,
      battery: battery,
      weight: 180.0,
      release_year: releaseYear,
      days_used: days_used,
      normalized_new_price: normalized_new_price
    },
    agent_info: {
      brand: details.brand,
      model: details.modelName,
      storage: details.storage,
      condition: `${details.screenCondition} screen, ${details.bodyCondition} body`
    }
  };

  const classifierPayload = {
    features: {
      battery_power: battery,
      blue: 1,
      clock_speed: 2.0,
      dual_sim: 1,
      fc: 8.0,
      four_g: 1,
      int_memory: internal_memory,
      m_dep: 0.7,
      mobile_wt: 180.0,
      n_cores: 8.0,
      pc: 12.0,
      px_height: 1080.0,
      px_width: 2400.0,
      ram: ram * 1024.0,
      sc_h: 15.0,
      sc_w: 7.0,
      talk_time: 15.0,
      three_g: 1,
      touch_screen: 1,
      wifi: 1
    },
    agent_info: {
      ram_gb: ram,
      storage_gb: internal_memory,
      cores: 8,
      screen_size_inches: screen_size,
      brand: details.brand,
      model: details.modelName
    }
  };

  let predictedPriceINR = 0;
  let predictedPriceUSD = 0;
  let priceClassLabel = "medium";
  let priceClassCode = 1;
  let logStr = "";

  try {
    const priceServiceUrl = process.env.NEXT_PUBLIC_PRICE_SERVICE_URL || "http://localhost:8010";
    const res = await fetch(`${priceServiceUrl}/combined`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pricePayload)
    });
    if (res.ok) {
      const data = await res.json();
      const xgboostLogPrice = data.xgboost_prediction?.predicted_used_price || 4.3;
      const agentPriceUSD = data.groq_agent_estimation?.estimated_price_usd || 200.0;
      const xgboostUSD = Math.exp(xgboostLogPrice);
      predictedPriceUSD = 0.4 * xgboostUSD + 0.6 * agentPriceUSD;
      predictedPriceINR = predictedPriceUSD * 83;
      logStr += `[Pricing] XGBoost: $${xgboostUSD.toFixed(2)}, Groq Agent: $${agentPriceUSD.toFixed(2)}. `;
    }
  } catch (err) {
    console.error("Failed to connect to mobile_price_service:", err);
  }

  try {
    const classifierServiceUrl = process.env.NEXT_PUBLIC_CLASSIFIER_SERVICE_URL || "http://localhost:8020";
    const res = await fetch(`${classifierServiceUrl}/combined`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classifierPayload)
    });
    if (res.ok) {
      const data = await res.json();
      priceClassCode = data.xgboost_classification?.price_range ?? 1;
      priceClassLabel = data.xgboost_classification?.label || "medium";
      logStr += `[Classification] Price range category: ${priceClassCode} (${priceClassLabel}).`;
    }
  } catch (err) {
    console.error("Failed to connect to mobile_classifier_service:", err);
  }

  const lowerOutcome = outcome.trim().toLowerCase();

  // Fallback to defaults if calls failed
  if (predictedPriceINR === 0) {
    if (lowerOutcome === "recycle") predictedPriceINR = 1500;
    else if (lowerOutcome === "repair") predictedPriceINR = 6000;
    else if (lowerOutcome === "refurbish") predictedPriceINR = 11500;
    else predictedPriceINR = 18500;
  }

  // DuckDuckGo Web Search + Gemini 3.5 Flash for live market price query
  let marketPriceFromSearch: number | null = null;
  if (geminiApiKey) {
    const query = `${details.brand} ${details.modelName} ${details.storage} resale price India Cashify Flipkart`;
    console.log(`[Pricing] Querying DuckDuckGo search for: ${query}...`);
    let searchContext = "";
    try {
      const snippets = await searchDDG(query);
      if (snippets.length > 0) {
        searchContext = snippets.map((s, idx) => `[Source ${idx+1}]: ${s}`).join("\n");
      }
    } catch (err) {
      console.warn("[Pricing] DuckDuckGo search failed:", err);
    }

    console.log(`[Pricing] Querying Gemini 3.5 Flash for competitive market price of ${details.brand} ${details.modelName}...`);
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash"
      });

      let prompt = "";
      if (searchContext) {
        prompt = `You are a real-time mobile pricing engine. We searched the web for: "${query}".
Here are the live search snippets:
${searchContext}

Based on the live search snippets above and your own knowledge, estimate the current used / second-hand resale market value in India (INR) for a used mobile phone: ${details.brand} ${details.modelName} (${details.storage} storage).
Consider the cosmetic condition: Screen is ${details.screenCondition}, Body condition is ${details.bodyCondition}.
Provide:
1. The estimated current used market price range (in INR).
2. The single best estimate of the average resale price (in INR).
You must output a raw JSON block matching this interface (no markdown or backticks, just raw JSON):
{
  "market_price_inr": number,
  "price_range": "string",
  "source_summary": "string"
}`;
      } else {
        prompt = `You are a real-time mobile pricing engine. Based on your knowledge, estimate the current used / second-hand resale market value in India (INR) for a used mobile phone: ${details.brand} ${details.modelName} (${details.storage} storage).
Consider the cosmetic condition: Screen is ${details.screenCondition}, Body condition is ${details.bodyCondition}.
Provide:
1. The estimated current used market price range (in INR).
2. The single best estimate of the average resale price (in INR).
You must output a raw JSON block matching this interface (no markdown or backticks, just raw JSON):
{
  "market_price_inr": number,
  "price_range": "string",
  "source_summary": "string"
}`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed.market_price_inr === 'number' && parsed.market_price_inr > 0) {
        const foundPrice = parsed.market_price_inr;
        marketPriceFromSearch = foundPrice;
        logStr += `[Gemini Web Search] Fetched competitive market price: ₹${foundPrice.toLocaleString("en-IN")} (Range: ${parsed.price_range}). Source: ${parsed.source_summary}. `;
        console.log(`[Pricing] Gemini search price: ₹${foundPrice}`);
      }
    } catch (err: any) {
      console.warn("[Pricing] Gemini pricing estimation failed:", err.message || err);
    }
  }

  // Deductions / Guardrails based on outcome to match Cashify/Flipkart resellers
  let finalPrice = predictedPriceINR;

  // Blend model prediction with real-time market price if successfully fetched
  if (marketPriceFromSearch !== null) {
    finalPrice = 0.5 * finalPrice + 0.5 * marketPriceFromSearch;
    console.log(`[Pricing] Blended model price (₹${predictedPriceINR}) with market price (₹${marketPriceFromSearch}) -> Final Base: ₹${finalPrice}`);
  }

  if (lowerOutcome === "recycle") {
    finalPrice = Math.min(2500, Math.max(800, finalPrice * 0.15));
  } else if (lowerOutcome === "repair") {
    finalPrice = Math.min(8000, Math.max(3000, finalPrice * 0.5));
  } else if (lowerOutcome === "refurbish") {
    finalPrice = Math.min(16000, Math.max(7000, finalPrice * 0.8));
  } else if (lowerOutcome === "reuse") {
    finalPrice = Math.min(45000, Math.max(12000, finalPrice));
  }

  return {
    priceINR: Math.round(finalPrice),
    priceUSD: Math.round(predictedPriceUSD),
    classLabel: priceClassLabel,
    classCode: priceClassCode,
    log: logStr
  };
}


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
  let brand = "Unknown";
  let modelName = "Device";
  let purchaseYear = "2022";
  let storage = "128GB";
  let batteryHealth = 85;
  let screenCondition = "no_damage";
  let bodyCondition = "excellent";
  let functionalIssues: string[] = [];
  let waterDamage = false;
  let accessories: string[] = [];
  let files: File[] = [];

  const contentType = req.headers.get("content-type") || "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      brand = (formData.get("brand") as string) || "Unknown";
      modelName = (formData.get("modelName") as string) || "Device";
      purchaseYear = (formData.get("purchaseYear") as string) || "2022";
      storage = (formData.get("storage") as string) || "128GB";
      batteryHealth = Number(formData.get("batteryHealth")) || 85;
      screenCondition = (formData.get("screenCondition") as string) || "no_damage";
      bodyCondition = (formData.get("bodyCondition") as string) || "excellent";
      functionalIssues = formData.getAll("functionalIssues") as string[];
      waterDamage = formData.get("waterDamage") === "true";
      accessories = formData.getAll("accessories") as string[];
      
      const uploadedFiles = formData.getAll("images");
      for (const f of uploadedFiles) {
        if (f instanceof File) {
          files.push(f);
        }
      }
    } else {
      const details = await req.json().catch(() => ({}));
      
      if (details.device === "phone") {
        brand = "Apple";
        modelName = "iPhone 13 Pro";
        purchaseYear = "2022";
        storage = "128GB";
        batteryHealth = 82;
        screenCondition = "minor_scratches";
        bodyCondition = "good";
        functionalIssues = [];
        waterDamage = false;
      } else if (details.device === "laptop") {
        brand = "Apple";
        modelName = "MacBook Air M1";
        purchaseYear = "2020";
        storage = "256GB";
        batteryHealth = 76;
        screenCondition = "shattered";
        bodyCondition = "fair";
        functionalIssues = ["battery_drain"];
        waterDamage = false;
      } else if (details.device === "tablet") {
        brand = "Apple";
        modelName = "iPad Pro 11-inch";
        purchaseYear = "2021";
        storage = "128GB";
        batteryHealth = 48;
        screenCondition = "shattered";
        bodyCondition = "poor";
        functionalIssues = ["battery_drain"];
        waterDamage = true;
      } else {
        brand = details.brand || "Unknown";
        modelName = details.modelName || "Device";
        purchaseYear = details.purchaseYear || "2022";
        storage = details.storage || "128GB";
        batteryHealth = Number(details.batteryHealth) || 85;
        screenCondition = details.screenCondition || "no_damage";
        bodyCondition = details.bodyCondition || "excellent";
        functionalIssues = details.functionalIssues || [];
        waterDamage = !!details.waterDamage;
        accessories = details.accessories || [];
      }
    }
  } catch (error) {
    console.error("Error parsing request details:", error);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;

  // Image Validation Guardrail
  if (files.length > 0) {
    let validationResult: { valid: boolean; message?: string } = { valid: true };
    if (geminiApiKey) {
      console.log(`Validating ${files.length} uploaded images with Gemini...`);
      validationResult = await validateImagesWithGemini(files, geminiApiKey);
    } else if (openaiApiKey) {
      console.log(`Validating ${files.length} uploaded images with OpenAI...`);
      validationResult = await validateImagesWithOpenAI(files, openaiApiKey);
    } else if (groqApiKey) {
      console.log(`Validating ${files.length} uploaded images with Groq Vision...`);
      validationResult = await validateImagesWithGroq(files, groqApiKey);
    } else {
      console.warn("No Vision API key configured (Gemini, OpenAI, or Groq). Bypassing visual check.");
    }

    if (!validationResult.valid) {
      console.warn("Image validation failed:", validationResult.message);
      return NextResponse.json(
        {
          success: false,
          error: "invalid_images",
          message: validationResult.message || "One or more uploaded images do not appear to be a mobile phone. Please upload only valid photos of your device."
        },
        { status: 400 }
      );
    }
    console.log("All uploaded images validated successfully.");
  }

  // Parameter Mapping for Python ML Service
  const currentYear = new Date().getFullYear();
  const purchaseYr = Number(purchaseYear) || 2022;
  const modelAgeMonths = Math.max(0, (currentYear - purchaseYr) * 12);
  const batteryHealthPct = Number(batteryHealth) || 85.0;
  const screenCracked = (screenCondition === "cracked" || screenCondition === "shattered");
  const functionalIssuesBool = (functionalIssues.length > 0 || waterDamage);

  let cosmeticScratches = 0;
  if (screenCondition === "minor_scratches") cosmeticScratches += 1;
  if (screenCondition === "cracked") cosmeticScratches += 3;
  if (screenCondition === "shattered") cosmeticScratches += 5;
  if (bodyCondition === "good") cosmeticScratches += 1;
  if (bodyCondition === "fair") cosmeticScratches += 3;
  if (bodyCondition === "poor") cosmeticScratches += 5;

  // Guarantee 4-5 images (pad with in-memory tiny 1x1 PNGs if needed)
  const TINY_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const TINY_PNG_BUFFER = Buffer.from(TINY_PNG_BASE64, "base64");
  
  const finalFiles: File[] = [...files];
  while (finalFiles.length < 4) {
    const dummyFile = new File([TINY_PNG_BUFFER], `dummy_${finalFiles.length}.png`, { type: "image/png" });
    finalFiles.push(dummyFile);
  }
  if (finalFiles.length > 5) {
    finalFiles.splice(5);
  }

  // 1. Query Echoloop-AI-service Backend (FastAPI on Port 8000)
  try {
    const apiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";
    const formDataToSend = new FormData();
    
    finalFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });
    formDataToSend.append("model_age_months", String(modelAgeMonths));
    formDataToSend.append("battery_health_pct", String(batteryHealthPct));
    formDataToSend.append("screen_cracked", String(screenCracked));
    formDataToSend.append("functional_issues", String(functionalIssuesBool));
    formDataToSend.append("cosmetic_scratches", String(cosmeticScratches));

    console.log(`Querying Echoloop-AI-service at ${apiServiceUrl}/predict...`);
    const response = await fetch(`${apiServiceUrl}/predict`, {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      const resultData = await response.json();
      console.log("Successfully retrieved prediction from Echoloop-AI-service:", resultData.prediction);
      
      const rawOutcome = resultData.prediction || "Reuse";
      let outcome = "Reuse";
      const lower = rawOutcome.trim().toLowerCase();
      if (lower === "recycle") outcome = "Recycle";
      else if (lower === "repair") outcome = "Repair";
      else if (lower === "refurbish") outcome = "Refurbish";

      const confidence = Math.round(resultData.confidence_pct);
      
      let value = "₹11,500";
      let pricingLog = "";
      const isPhone = !modelName.toLowerCase().includes("macbook") && 
                      !modelName.toLowerCase().includes("ipad") && 
                      !modelName.toLowerCase().includes("laptop") && 
                      !modelName.toLowerCase().includes("tablet") &&
                      !brand.toLowerCase().includes("apple ipad") &&
                      !brand.toLowerCase().includes("macbook");

      if (isPhone) {
        try {
          const pricing = await queryPricingAndClassification({
            brand,
            modelName,
            purchaseYear,
            storage,
            batteryHealth,
            screenCondition,
            bodyCondition,
            functionalIssues,
            waterDamage
          }, outcome, geminiApiKey);
          value = `₹${pricing.priceINR.toLocaleString("en-IN")}`;
          pricingLog = pricing.log;
        } catch (e) {
          console.error("Pricing integration failed in main route:", e);
          if (outcome === "Recycle") value = "₹1,500";
          else if (outcome === "Repair") value = "₹6,000";
          else if (outcome === "Refurbish") value = "₹11,500";
          else if (outcome === "Reuse") value = "₹18,500";
        }
      } else {
        if (outcome === "Recycle") value = "₹1,500";
        else if (outcome === "Repair") value = "₹6,000";
        else if (outcome === "Refurbish") value = "₹11,500";
        else if (outcome === "Reuse") value = "₹18,500";
      }
      
      const refurbishPct = Math.round((resultData.fused_probability_breakdown?.Refurbish || 0) * 100);
      const partsPct = Math.round((resultData.fused_probability_breakdown?.Repair || 0) * 100);
      const reusePct = Math.round((resultData.fused_probability_breakdown?.Reuse || 0) * 100);
      const recyclePct = Math.round((resultData.fused_probability_breakdown?.Recycle || 0) * 100);
      
      const decisionPath = resultData.decision_path || "weighted_soft_voting";
      const modelVer = resultData.model_version || "v2";
      const imgVote = resultData.individual_votes?.image_model_prediction || "Unknown";
      const imgConf = resultData.individual_votes?.image_model_confidence_pct || 0;
      const tabVote = resultData.individual_votes?.tabular_model_prediction || "Unknown";
      const tabConf = resultData.individual_votes?.tabular_model_confidence_pct || 0;
      
      const reason = `Appraisal certified by Echoloop-AI-service model (${modelVer}) via ${decisionPath}. Multi-modal fusion details: Image classification backbone predicted [${imgVote}] with ${imgConf.toFixed(1)}% confidence. Tabular features model predicted [${tabVote}] with ${tabConf.toFixed(1)}% confidence. Result: ${outcome}.`;
      const secondary = `Model version: ${modelVer} | Decision path: ${decisionPath}.${pricingLog ? ` ${pricingLog}` : ""}`;

      // Diagnostics strings for Showcase Page compatibility
      let screenDiagText = "Grade A - Flawless glass";
      if (screenCondition === "minor_scratches") screenDiagText = "Grade B - Minor scratches detected";
      if (screenCondition === "cracked") screenDiagText = "Grade C - Single hairline fracture";
      if (screenCondition === "shattered") screenDiagText = "Grade D - Broken glass & bleeding pixels";

      let batteryDiagText = `${batteryHealth}% Capacity - Healthy state`;
      if (batteryHealth < 80) batteryDiagText = `${batteryHealth}% Capacity - Service recommended`;
      if (batteryHealth < 50) batteryDiagText = `${batteryHealth}% Capacity - Swollen cell risk alert`;

      let cameraDiagText = "Grade A - Fully functional lens array";
      if (functionalIssues.includes("camera_fault")) cameraDiagText = "Grade C - Focus issues or lens scratch";

      let chassisDiagText = "Grade A - Mint structural frame";
      if (bodyCondition === "good") chassisDiagText = "Grade B - Minor scuffs";
      if (bodyCondition === "fair") chassisDiagText = "Grade C - Visible paint wear & scuffs";
      if (bodyCondition === "poor") chassisDiagText = "Grade D - Bent chassis or deep cracks";

      return NextResponse.json({
        device: `${brand} ${modelName}`,
        outcome,
        confidence,
        value,
        reason,
        secondary,
        refurbish: refurbishPct,
        parts: partsPct,
        reuse: reusePct,
        recycle: recyclePct,
        
        // Showcase compatibility fields
        name: `${brand} ${modelName}`,
        diagnostics: {
          screen: screenDiagText,
          battery: batteryDiagText,
          camera: cameraDiagText,
          chassis: chassisDiagText
        },
        confidences: {
          refurbish: refurbishPct,
          resale: reusePct,
          salvage: partsPct,
          recycle: recyclePct
        }
      });
    } else if (response.status === 400) {
      const errData = await response.json().catch(() => ({}));
      console.warn(`Local Python AI service returned validation error 400:`, errData.detail);
      return NextResponse.json(
        {
          success: false,
          error: "invalid_images",
          message: errData.detail || "One or more uploaded images do not appear to be a mobile phone. Please upload only valid photos of your mobile device."
        },
        { status: 400 }
      );
    } else {
      console.warn(`Local Python AI service returned status ${response.status}. Falling back to Gemini...`);
    }

  } catch (err) {
    console.error("Failed to connect to local Python AI service. Falling back to Gemini...", err);
  }

  // 2. Fallback 1: Cloud AI API (Gemini, OpenAI, or Groq)
  if (geminiApiKey || openaiApiKey || groqApiKey) {
    try {
      let parsedData: any = null;
      const detailsObj = {
        brand,
        modelName,
        purchaseYear,
        storage,
        batteryHealth,
        screenCondition,
        bodyCondition,
        functionalIssues,
        waterDamage,
        accessories
      };
      const prompt = getPrompt(detailsObj);

      if (geminiApiKey) {
        console.log("Querying Gemini AI API for backup classification...");
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(jsonStr);
      } else if (openaiApiKey) {
        console.log("Querying OpenAI API (gpt-4o-mini) for backup classification...");
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content?.trim() || "";
          const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
          parsedData = JSON.parse(jsonStr);
        } else {
          throw new Error(`OpenAI API error: Status ${res.status}`);
        }
      } else if (groqApiKey) {
        console.log("Querying Groq API (llama-3.3-70b-versatile) for backup classification...");
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content?.trim() || "";
          const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
          parsedData = JSON.parse(jsonStr);
        } else {
          throw new Error(`Groq API error: Status ${res.status}`);
        }
      }

      if (parsedData) {
        console.log("Successfully retrieved backup prediction from Cloud AI");
        const rawOutcome = parsedData.outcome || "Reuse";
        let outcome = "Reuse";
        const lower = rawOutcome.trim().toLowerCase();
        if (lower === "recycle") outcome = "Recycle";
        else if (lower === "repair") outcome = "Repair";
        else if (lower === "refurbish") outcome = "Refurbish";

        let finalValue = parsedData.value;
        let pricingLog = "";
        const isPhone = !modelName.toLowerCase().includes("macbook") && 
                        !modelName.toLowerCase().includes("ipad") && 
                        !modelName.toLowerCase().includes("laptop") && 
                        !modelName.toLowerCase().includes("tablet") &&
                        !brand.toLowerCase().includes("apple ipad") &&
                        !brand.toLowerCase().includes("macbook");

        if (isPhone) {
          try {
            const pricing = await queryPricingAndClassification({
              brand,
              modelName,
              purchaseYear,
              storage,
              batteryHealth,
              screenCondition,
              bodyCondition,
              functionalIssues,
              waterDamage
            }, outcome, geminiApiKey);
            finalValue = `₹${pricing.priceINR.toLocaleString("en-IN")}`;
            pricingLog = pricing.log;
          } catch (e) {
            console.error("Pricing integration failed in Cloud AI path:", e);
          }
        }

        const refurbishPct = Number(parsedData.refurbish) || 0;
        const partsPct = Number(parsedData.parts) || 0;
        const reusePct = Number(parsedData.reuse) || 0;
        const recyclePct = Number(parsedData.recycle) || 0;

        let screenDiagText = "Grade A - Flawless glass";
        if (screenCondition === "minor_scratches") screenDiagText = "Grade B - Minor scratches detected";
        if (screenCondition === "cracked") screenDiagText = "Grade C - Single hairline fracture";
        if (screenCondition === "shattered") screenDiagText = "Grade D - Broken glass & bleeding pixels";

        let batteryDiagText = `${batteryHealth}% Capacity - Healthy state`;
        if (batteryHealth < 80) batteryDiagText = `${batteryHealth}% Capacity - Service recommended`;
        if (batteryHealth < 50) batteryDiagText = `${batteryHealth}% Capacity - Swollen cell risk alert`;

        let cameraDiagText = "Grade A - Fully functional lens array";
        if (functionalIssues.includes("camera_fault")) cameraDiagText = "Grade C - Focus issues or lens scratch";

        let chassisDiagText = "Grade A - Mint structural frame";
        if (bodyCondition === "good") chassisDiagText = "Grade B - Minor scuffs";
        if (bodyCondition === "fair") chassisDiagText = "Grade C - Visible paint wear & scuffs";
        if (bodyCondition === "poor") chassisDiagText = "Grade D - Bent chassis or deep cracks";

        return NextResponse.json({
          ...parsedData,
          value: finalValue,
          secondary: (parsedData.secondary || "") + (pricingLog ? ` ${pricingLog}` : ""),
          name: `${brand} ${modelName}`,
          diagnostics: {
            screen: screenDiagText,
            battery: batteryDiagText,
            camera: cameraDiagText,
            chassis: chassisDiagText
          },
          confidences: {
            refurbish: refurbishPct,
            resale: reusePct,
            salvage: partsPct,
            recycle: recyclePct
          }
        });
      }
    } catch (err) {
      console.error("Cloud AI API backup classification failure. Running resilient fallback:", err);
    }
  }

  // 3. Fallback 2: Static Mock Diagnostics
  console.log("Running resilient static mock diagnostics...");
  const detailsObj = {
    brand,
    modelName,
    purchaseYear,
    storage,
    batteryHealth,
    screenCondition,
    bodyCondition,
    functionalIssues,
    waterDamage,
    accessories
  };
  const mockData = getMockDiagnostics(detailsObj);
  const outcome = mockData.outcome;
  let finalValue = mockData.value;
  let pricingLog = "";
  const isPhone = !modelName.toLowerCase().includes("macbook") && 
                  !modelName.toLowerCase().includes("ipad") && 
                  !modelName.toLowerCase().includes("laptop") && 
                  !modelName.toLowerCase().includes("tablet") &&
                  !brand.toLowerCase().includes("apple ipad") &&
                  !brand.toLowerCase().includes("macbook");

  if (isPhone) {
    try {
      const pricing = await queryPricingAndClassification({
        brand,
        modelName,
        purchaseYear,
        storage,
        batteryHealth,
        screenCondition,
        bodyCondition,
        functionalIssues,
        waterDamage
      }, outcome, geminiApiKey);
      finalValue = `₹${pricing.priceINR.toLocaleString("en-IN")}`;
      pricingLog = pricing.log;
    } catch (e) {
      console.error("Pricing integration failed in mock path:", e);
    }
  }

  const refurbishPct = Number(mockData.refurbish) || 0;
  const partsPct = Number(mockData.parts) || 0;
  const reusePct = Number(mockData.reuse) || 0;
  const recyclePct = Number(mockData.recycle) || 0;

  // Diagnostics strings for Showcase Page compatibility
  let screenDiagText = "Grade A - Flawless glass";
  if (screenCondition === "minor_scratches") screenDiagText = "Grade B - Minor scratches detected";
  if (screenCondition === "cracked") screenDiagText = "Grade C - Single hairline fracture";
  if (screenCondition === "shattered") screenDiagText = "Grade D - Broken glass & bleeding pixels";

  let batteryDiagText = `${batteryHealth}% Capacity - Healthy state`;
  if (batteryHealth < 80) batteryDiagText = `${batteryHealth}% Capacity - Service recommended`;
  if (batteryHealth < 50) batteryDiagText = `${batteryHealth}% Capacity - Swollen cell risk alert`;

  let cameraDiagText = "Grade A - Fully functional lens array";
  if (functionalIssues.includes("camera_fault")) cameraDiagText = "Grade C - Focus issues or lens scratch";

  let chassisDiagText = "Grade A - Mint structural frame";
  if (bodyCondition === "good") chassisDiagText = "Grade B - Minor scuffs";
  if (bodyCondition === "fair") chassisDiagText = "Grade C - Visible paint wear & scuffs";
  if (bodyCondition === "poor") chassisDiagText = "Grade D - Bent chassis or deep cracks";

  return NextResponse.json({
    ...mockData,
    value: finalValue,
    secondary: mockData.secondary + (pricingLog ? ` ${pricingLog}` : ""),
    name: `${brand} ${modelName}`,
    diagnostics: {
      screen: screenDiagText,
      battery: batteryDiagText,
      camera: cameraDiagText,
      chassis: chassisDiagText
    },
    confidences: {
      refurbish: refurbishPct,
      resale: reusePct,
      salvage: partsPct,
      recycle: recyclePct
    }
  });
}

