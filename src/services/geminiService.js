import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const CACHE_TTL = 30 * 60 * 1000; 
const cache = new Map(); 
const inFlightRequests = new Map(); 

const generateCacheKey = (prompt) => {
  return `email_${prompt.substring(0, 100)}`;
};

const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_TTL;
};

const cleanExpiredCache = () => {
  for (const [key, value] of cache.entries()) {
    if (!isCacheValid(value.timestamp)) {
      cache.delete(key);
    }
  }
};

export const geminiService = {
  async generateEmail(prompt) {
    try {
      const cacheKey = generateCacheKey(prompt);

      cleanExpiredCache();

      if (cache.has(cacheKey)) {
        const cachedEntry = cache.get(cacheKey);
        if (isCacheValid(cachedEntry.timestamp)) {
          console.log('Returning cached result for this prompt');
          return cachedEntry.data;
        } else {
          cache.delete(cacheKey);
        }
      }

      if (inFlightRequests.has(cacheKey)) {
        console.log('Request already in progress, awaiting same prompt...');
        return inFlightRequests.get(cacheKey);
      }

      const requestPromise = (async () => {
        try {
          const systemInstruction = `
            You are an expert cold email writer. Your goal is to write high-converting, professional, and personalized cold emails.
            Keep the tone as requested. Be concise and compelling.
          `;

          const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: systemInstruction,
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  subject: { type: "string" },
                  content: { type: "string" }
                },
                required: ["subject", "content"]
              },
              temperature: 0.7,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 1024,
            }
          });

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          let jsonResponse;
          try {
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            jsonResponse = JSON.parse(cleanedText);
          } catch (parseError) {
            console.warn('Standard JSON parse failed, trying regex fallback:', parseError);
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                jsonResponse = JSON.parse(jsonMatch[0]);
              } catch (innerError) {
                throw new Error('Failed to parse Gemini response as JSON');
              }
            } else {
              throw new Error('No JSON found in Gemini response');
            }
          }

          if (response.usageMetadata) {
            console.log(`Tokens used: ${response.usageMetadata.totalTokenCount}`);
          }

          cache.set(cacheKey, {
            data: jsonResponse,
            timestamp: Date.now()
          });

          return jsonResponse;
        } finally {
          inFlightRequests.delete(cacheKey);
        }
      })();

      inFlightRequests.set(cacheKey, requestPromise);

      return requestPromise;
    } catch (error) {
      console.error('Error in geminiService.generateEmail:', error);
      throw error;
    }
  }
};
