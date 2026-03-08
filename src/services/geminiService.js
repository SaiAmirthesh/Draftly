import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Cache configuration
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
const cache = new Map(); // Stores: { key: { data, timestamp } }
const inFlightRequests = new Map(); // Stores pending promises to prevent duplicate requests

// Generate a cache key from the prompt
const generateCacheKey = (prompt) => {
  return `email_${prompt.substring(0, 100)}`;
};

// Check if cached entry is still valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_TTL;
};

// Clear expired cache entries
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

      // Clean expired entries
      cleanExpiredCache();

      // Check if result is in cache and valid
      if (cache.has(cacheKey)) {
        const cachedEntry = cache.get(cacheKey);
        if (isCacheValid(cachedEntry.timestamp)) {
          console.log('Returning cached result for this prompt');
          return cachedEntry.data;
        } else {
          cache.delete(cacheKey);
        }
      }

      // Check if same request is already in flight
      if (inFlightRequests.has(cacheKey)) {
        console.log('Request already in progress, awaiting same prompt...');
        return inFlightRequests.get(cacheKey);
      }

      // Create the actual API request promise
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
            // Clean up text in case it's wrapped in code blocks
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

          // Log token usage for transparency
          if (response.usageMetadata) {
            console.log(`Tokens used: ${response.usageMetadata.totalTokenCount}`);
          }

          // Store in cache
          cache.set(cacheKey, {
            data: jsonResponse,
            timestamp: Date.now()
          });

          return jsonResponse;
        } finally {
          // Remove from in-flight requests
          inFlightRequests.delete(cacheKey);
        }
      })();

      // Store promise in in-flight requests
      inFlightRequests.set(cacheKey, requestPromise);

      return requestPromise;
    } catch (error) {
      console.error('Error in geminiService.generateEmail:', error);
      throw error;
    }
  }
};
