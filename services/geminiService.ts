
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeBookmark(url: string, title: string): Promise<AIAnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this bookmark and categorize it into one of these: Development, Design, News, Productivity, Learning, Entertainment, Shopping, Finance, Social, or Reference.
    URL: ${url}
    Title: ${title}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "The primary category name.",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A few relevant keywords.",
          },
          summary: {
            type: Type.STRING,
            description: "A short one-sentence summary of what the site is for.",
          },
        },
        required: ["category", "tags", "summary"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text);
    return data as AIAnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return {
      category: "Uncategorized",
      tags: [],
      summary: "Failed to generate summary."
    };
  }
}

export async function bulkCategorize(bookmarks: { url: string; title: string; id: string }[]) {
  const prompt = `Categorize the following list of bookmarks into groups. Return a JSON array where each object has "id" and "category".
  List: ${JSON.stringify(bookmarks)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["id", "category"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}
