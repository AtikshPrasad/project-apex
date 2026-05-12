import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace this with your actual API key from Google AI Studio
// (For a production app, this should be hidden in an .env file)
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// We use 2.5 Flash for maximum speed and reliable JSON extraction
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function extractMacros(userInput) {
  const prompt = `
    You are a strict nutritional calculator for a high-performance athlete.
    The user consumed the following: "${userInput}"
    
    Calculate the estimated calories, protein (g), carbs (g), fats (g), and water (ml).
    Respond ONLY with a raw JSON object matching this exact structure, with no markdown formatting, no backticks, and no extra text:
    {"calories": 450, "protein": 35, "carbs": 40, "fats": 15, "water": 0}
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