import { GoogleGenAI, Type } from "@google/genai";
import { ReviewItem, EditorType } from '../types';

// Initialize Gemini Client
// IMPORTANT: apiKey is injected via process.env.API_KEY automatically
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Ah Hu: Grammar and General Editing
export const checkGrammarWithAhHu = async (text: string): Promise<ReviewItem[]> => {
  const prompt = `
    你現在是中華民國青年日報的專業編輯「阿虎編」。
    請檢查以下文章的錯別字、語句是否通順。
    不要檢查軍事專有名詞或特定替換詞（那是由青報通負責）。
    重點放在：一般的錯別字、贅字、語句邏輯不通、標點符號誤用。
    
    文章內容：
    """
    ${text}
    """

    請以 JSON 格式回傳檢查結果。若無錯誤回傳空陣列。
    JSON 格式範例：
    [
      {
        "originalText": "錯誤的字詞片段",
        "suggestion": "建議的修正",
        "explanation": "為什麼要這樣改的簡短理由"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalText: { type: Type.STRING },
              suggestion: { type: Type.STRING },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const rawResults = JSON.parse(jsonText);
    
    // Map to ReviewItem and attempt to find indices
    // Note: Finding indices purely from LLM text matches can be tricky with duplicates.
    // We will find the first occurrence that hasn't been used, strictly speaking.
    // Ideally, we would ask the LLM for offsets, but they are often hallucinated.
    // A simple text search here is often robust enough for a prototype.
    
    const results: ReviewItem[] = [];
    let searchCursor = 0; // To avoid finding the same word in previous checked text, though naive.

    rawResults.forEach((item: any) => {
      const idx = text.indexOf(item.originalText, 0); 
      // We search from 0 to ensure we find it, handling duplicates is complex without fuzzy matching.
      // For this implementation, we map simply.
      
      if (idx !== -1) {
        results.push({
          id: `ah-hu-${idx}-${Date.now()}-${Math.random()}`,
          type: EditorType.AH_HU,
          originalText: item.originalText,
          suggestion: item.suggestion,
          explanation: item.explanation,
          startIndex: idx,
          endIndex: idx + item.originalText.length
        });
      }
    });

    return results;

  } catch (error) {
    console.error("Ah Hu Grammar Check Failed:", error);
    return [];
  }
};

// Gu Gou: Fact Checking with Google Search
export const checkFactsWithGuGou = async (text: string): Promise<ReviewItem[]> => {
  const prompt = `
    你現在是青年日報的專業編輯「菇狗編」。
    你的任務是檢查稿件內容與網路上已公布的最新資訊是否相符。
    
    重點檢查項目：
    1. 人名（尤其是活動主持人、將領、官員姓名）
    2. 數字與金額
    3. 日期與時間
    4. 地點
    5. 武器裝備型號的正確性
    
    如果發現稿件內容與搜尋結果不符（例如名字寫錯、日期錯誤、數據過舊），請列出錯誤。
    如果內容大致正確，則不需要列出。
    
    文章內容：
    """
    ${text}
    """
    
    請回傳 JSON 格式。
    JSON 格式範例：
    [
      {
        "originalText": "文中提到的錯誤資訊片段",
        "suggestion": "正確的資訊",
        "explanation": "根據搜尋結果...（說明錯誤原因）",
        "sourceUrl": "參考連結（如果有的話）"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType JSON is NOT supported when using googleSearch tool in some versions,
        // but let's try to prompt for it or parse the text. 
        // The standard instruction says "DO NOT set responseMimeType ... when using googleSearch".
        // So we will rely on the prompt to format it and parse manually.
      }
    });

    const outputText = response.text;
    if (!outputText) return [];

    // Extract JSON from the markdown response (Gemini usually wraps it in ```json ... ```)
    const jsonMatch = outputText.match(/```json([\s\S]*?)```/) || outputText.match(/\[[\s\S]*\]/);
    
    let rawResults = [];
    if (jsonMatch) {
        try {
            rawResults = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e) {
            console.warn("Failed to parse Gu Gou JSON", e);
        }
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const webSources = groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean) || [];
    const defaultSource = webSources.length > 0 ? webSources[0] : undefined;

    const results: ReviewItem[] = [];

    if (Array.isArray(rawResults)) {
        rawResults.forEach((item: any) => {
            const idx = text.indexOf(item.originalText);
            if (idx !== -1) {
                results.push({
                    id: `gu-gou-${idx}-${Date.now()}-${Math.random()}`,
                    type: EditorType.GU_GOU,
                    originalText: item.originalText,
                    suggestion: item.suggestion,
                    explanation: item.explanation,
                    startIndex: idx,
                    endIndex: idx + item.originalText.length,
                    sourceUrl: item.sourceUrl || defaultSource
                });
            }
        });
    }

    return results;

  } catch (error) {
    console.error("Gu Gou Fact Check Failed:", error);
    return [];
  }
};