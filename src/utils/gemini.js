import { GoogleGenerativeAI } from "@google/generative-ai";

// Pulls from local .env during dev, and pulls from EAS Secrets during cloud build
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

// Gemini 2.5 Flash is highly optimized for rapid data parsing required for macro tracking
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function extractMacros(userInput) {
  const prompt = `
    You are a clinical nutritional analyst for a professional athlete on a strict weight-cut.
    Input: "${userInput}"
    
    ESTIMATION RULES:
    1. Use conservative, standard home-cooked Indian portion sizes (e.g., 1 Puri = 25g/125kcal).
    2. Do NOT overestimate fat/oil unless "restaurant" or "deep fried" is specified. 
    3. If quantities are vague, use the lower-bound average.
    4. Current Reference Target: 10 small-moderate Puris + 1 cup Chhole should approximate ~1300-1400 kcal.
    
    Calculate: Calories, Protein (g), Carbs (g), Fats (g), and Water (ml).
    
    Respond ONLY with a raw JSON object:
    {"calories": 0, "protein": 0, "carbs": 0, "fats": 0, "water": 0}
  `;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
    
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanJson);
    
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return null;
  }
}