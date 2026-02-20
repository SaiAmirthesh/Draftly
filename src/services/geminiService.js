import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const geminiService = {
  async generateEmail(prompt) {
    try {
      const systemInstruction = `
        You are an expert cold email writer. Your goal is to write high-converting, professional, and personalized cold emails.
        Keep the tone as requested. Be concise and compelling.
      `;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
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

      return jsonResponse;
    } catch (error) {
      console.error('Error in geminiService.generateEmail:', error);
      throw error;
    }
  }
};
