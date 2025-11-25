import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { NutritionAnalysis, ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Define the schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    totalCalories: {
      type: Type.NUMBER,
      description: "The estimated total calories of the entire meal visible in the image.",
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the food item in Simplified Chinese" },
          calories: { type: Type.NUMBER, description: "Estimated calories for this specific item" },
          confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
        },
        required: ["name", "calories", "confidence"],
      },
      description: "List of identified food items and their calorie counts.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, encouraging summary of the meal's nutritional value in Simplified Chinese.",
    },
    macroEstimate: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.STRING, description: "Estimated protein (e.g., '20g')" },
        carbs: { type: Type.STRING, description: "Estimated carbs (e.g., '50g')" },
        fat: { type: Type.STRING, description: "Estimated fat (e.g., '15g')" },
      },
      required: ["protein", "carbs", "fat"],
    },
  },
  required: ["totalCalories", "items", "summary", "macroEstimate"],
};

/**
 * Analyzes the food image to get a structured calorie breakdown.
 */
export const analyzeImageConfig = async (base64Image: string): Promise<NutritionAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "请高效分析这张图片。识别所有食物项，估算它们的卡路里，并提供总热量。请根据实际份量进行估算。所有文本内容请使用简体中文返回。",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "你是一位专业的营养师和饮食专家。你的目标是根据图片提供准确的卡路里估算。请使用简体中文回答。",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as NutritionAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

/**
 * Creates a chat session initialized with the food image.
 */
export const createFoodChatSession = (base64Image: string): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    history: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            }
          },
          {
            text: "这是我的餐点图片。我可能会问一些关于具体部分的营养问题。"
          }
        ]
      },
      {
        role: 'model',
        parts: [{ text: "看起来很美味！我已经分析了卡路里。你可以随时问我关于具体配料、健康益处或份量的问题。" }]
      }
    ],
    config: {
      systemInstruction: "你是一位友好、乐于助人的 AI 营养助手。你可以查看用户上传的图片。请用简体中文回答用户关于图片中食物的问题，包括健康益处、潜在过敏原或替代食谱。回答要简洁有用。",
    }
  });
};