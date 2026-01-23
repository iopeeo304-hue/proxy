import { GoogleGenAI } from "@google/genai";

export async function identifyPlant(imageBase64: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("API Key is missing!");
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `Identify this plant from the image. Tell me its common name, scientific name, and a short interesting fact. Return the data in a clear JSON structure.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    // --- 修正重點在這裡 ---
    // 你的 SDK 版本中，response.text 是屬性，不能加括號 ()
    // 我們同時加上 ?. 檢查，防止它如果是 undefined 導致程式崩潰
    const text = response.text; 

    if (!text) {
      throw new Error("No identification text received.");
    }

    // 有時候回傳的是字串，有時候是物件，這裡做個防呆處理
    const cleanText = typeof text === 'string' ? text.trim() : JSON.stringify(text);

    return JSON.parse(cleanText);

  } catch (e) {
    console.error("AI Error:", e);
    throw e;
  }
}