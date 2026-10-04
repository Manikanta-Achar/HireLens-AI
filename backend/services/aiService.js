import dotenv from "dotenv";

dotenv.config();

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

console.log("AI Service API Key:", apiKey ? "LOADED" : "NOT LOADED");

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
Analyze this resume and extract the candidate information.

Return ONLY valid JSON:

{
  "candidateName": "",
  "email": "",
  "skills": [],
  "education": "",
  "experience": 0
}

Rules:
- Do not invent information.
- skills must be an array.
- experience must be a number in years.
- If experience is not mentioned, use 0.
- Return only JSON.

Resume:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();

    console.log("Gemini response:", text);

    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI resume analysis error:", error.message);
    throw error;
  }
};

export default analyzeResume;
