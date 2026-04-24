import { GoogleGenAI, Type } from "@google/genai";
import { TripPlan } from "../types";

const GENAI_API_KEY = process.env.GEMINI_API_KEY || "";

if (!GENAI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });

const tripPlanSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    duration: { type: Type.NUMBER },
    budget: { type: Type.STRING },
    travelStyle: { type: Type.STRING },
    groupType: { type: Type.STRING },
    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          title: { type: Type.STRING },
          morning: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                icon: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["time", "activity", "description"]
            }
          },
          afternoon: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                icon: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["time", "activity", "description"]
            }
          },
          evening: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                description: { type: Type.STRING },
                icon: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["time", "activity", "description"]
            }
          }
        },
        required: ["day", "title", "morning", "afternoon", "evening"]
      }
    },
    totalEstimatedCost: { type: Type.STRING },
    vibeSummary: { type: Type.STRING },
    routeLogic: { type: Type.STRING }
  },
  required: ["destination", "duration", "itinerary", "totalEstimatedCost", "vibeSummary", "routeLogic"]
};

export const generateTripPlan = async (prompt: string): Promise<TripPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: tripPlanSchema as any,
      systemInstruction: "You are an expert travel planner. Generate a detailed and realistic trip plan based on user criteria. Always return valid JSON matching the schema."
    }
  });

  try {
    return JSON.parse(response.text || "{}") as TripPlan;
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error);
    throw new Error("Invalid AI response");
  }
};

export const chatWithAI = async (messages: { role: string; content: string }[], currentPlan?: TripPlan) => {
  const systemPrompt = `You are a helpful AI travel assistant. You are helping the user refine their trip plan.
  Current Plan: ${currentPlan ? JSON.stringify(currentPlan) : "No plan generated yet"}.
  If the user asks for updates, explain what you are changing conversationally.
  If the user's request results in a new or updated complete itinerary, include the full NEW itinerary in your response as a JSON block wrapped in \`\`\`json ... \`\`\`.
  Otherwise, just chat.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messages.map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
    config: {
      systemInstruction: systemPrompt
    }
  });

  return response.text || "";
};
