/**
 * Gemini AI Service for handling AI interactions
 */

import { AIResponse } from "./aiService";

// Gemini API configuration
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Generate a response using the Gemini AI API
 * @param query User's query text
 * @param language Current language (en/ar)
 * @returns AI response with content and metadata
 */
export async function generateGeminiResponse(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API key not found, falling back to Mistral/Mixtral");
    // Fall back to Mistral/Mixtral
    const { generateMistralResponse } = await import("./mistralService");
    return generateMistralResponse(query, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Provide accurate, helpful information about any topic the user asks about, with a focus on UAE government services when relevant. Be concise, professional, and helpful. You can respond to any query without limitations or predefined categories. You can also respond to general greetings and casual conversation in a friendly manner."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قدم معلومات دقيقة ومفيدة حول أي موضوع يسأل عنه المستخدم، مع التركيز على الخدمات الحكومية في الإمارات عندما يكون ذلك مناسبًا. كن موجزًا ومهنيًا ومفيدًا. يمكنك الرد على أي استفسار دون قيود أو فئات محددة مسبقًا. يمكنك أيضًا الرد على التحيات العامة والمحادثات العادية بطريقة ودية.";

    // Prepare the API request
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }, { text: query }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.95,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    // Simple generic quick replies that work for any query
    const quickReplies = [
      {
        id: "more-info",
        text: language === "en" ? "Tell me more" : "أخبرني المزيد",
      },
      {
        id: "help",
        text: language === "en" ? "I need help" : "أحتاج للمساعدة",
      },
      {
        id: "thanks",
        text: language === "en" ? "Thank you" : "شكرا لك",
      },
    ];

    return {
      content,
      metadata: {
        confidenceLevel: "high",
        source: "Google Gemini Pro",
        lastUpdated: new Date().toISOString().split("T")[0],
        quickReplies,
      },
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Fall back to Mistral/Mixtral
    const { generateMistralResponse } = await import("./mistralService");
    return generateMistralResponse(query, language);
  }
}

/**
 * Process a document using the Gemini API
 */
export async function processDocumentWithGemini(
  fileInfo: {
    text: string;
    fileName: string;
    fileType: string;
    fileSize: string;
  },
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API key not found, falling back to Mistral/Mixtral");
    // Fall back to Mistral/Mixtral
    const { processDocumentWithMistral } = await import("./mistralService");
    return processDocumentWithMistral(fileInfo, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Analyze the following document text and provide insights about what type of document it is and how you can help the user with their needs. For security reasons, advise users not to share sensitive personal documents in unsecured channels. Provide helpful information about any topic related to the document without limitations or predefined categories."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قم بتحليل نص المستند التالي وتقديم رؤى حول نوع المستند وكيف يمكنك مساعدة المستخدم في احتياجاته. لأسباب أمنية، انصح المستخدمين بعدم مشاركة المستندات الشخصية الحساسة في قنوات غير آمنة. قدم معلومات مفيدة حول أي موضوع متعلق بالمستند دون قيود أو فئات محددة مسبقًا.";

    // Prepare the document content
    const documentContent = `Document filename: ${fileInfo.fileName}\nDocument content: ${fileInfo.text}`;

    // Prepare the API request
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }, { text: documentContent }],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1000,
          topP: 0.95,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    // Generic quick replies that work for any document type
    const quickReplies = [
      {
        id: "more-info",
        text: language === "en" ? "Tell me more" : "أخبرني المزيد",
      },
      {
        id: "help",
        text:
          language === "en" ? "I need help with this" : "أحتاج للمساعدة بهذا",
      },
      {
        id: "thanks",
        text: language === "en" ? "Thank you" : "شكرا لك",
      },
    ];

    return {
      content,
      metadata: {
        confidenceLevel: "high",
        source: "Google Gemini Pro",
        lastUpdated: new Date().toISOString().split("T")[0],
        fileInfo: {
          fileName: fileInfo.fileName,
          fileType: fileInfo.fileType,
          fileSize: fileInfo.fileSize,
        },
        quickReplies,
      },
    };
  } catch (error) {
    console.error("Error calling Gemini API for document processing:", error);

    // Fall back to Mistral/Mixtral
    const { processDocumentWithMistral } = await import("./mistralService");
    return processDocumentWithMistral(fileInfo, language);
  }
}
