
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSummary = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) {
    return "";
  }
  
  try {
    const fullPrompt = `Based on the following keywords and job description, write a professional and compelling CV summary of about 3-4 sentences. Tone: professional and confident. Keywords: "${prompt}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    throw new Error("Failed to generate summary. Please check your API key and try again.");
  }
};
