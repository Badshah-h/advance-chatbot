/**
 * Mistral/Mixtral Service for handling AI interactions
 */

import { AIResponse } from "./aiService";

// Mistral API configuration
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Generate a response using the Mistral/Mixtral API
 * @param query User's query text
 * @param language Current language (en/ar)
 * @returns AI response with content and metadata
 */
export async function generateMistralResponse(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  if (!apiKey) {
    console.warn("Mistral API key not found, falling back to Groq");
    // Fall back to Groq
    const { generateGroqResponse } = await import("./groqService");
    return generateGroqResponse(query, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Provide accurate, helpful information about any topic the user asks about, with a focus on UAE government services when relevant. Be concise, professional, and helpful. You can respond to any query without limitations or predefined categories. You can also respond to general greetings and casual conversation in a friendly manner."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قدم معلومات دقيقة ومفيدة حول أي موضوع يسأل عنه المستخدم، مع التركيز على الخدمات الحكومية في الإمارات عندما يكون ذلك مناسبًا. كن موجزًا ومهنيًا ومفيدًا. يمكنك الرد على أي استفسار دون قيود أو فئات محددة مسبقًا. يمكنك أيضًا الرد على التحيات العامة والمحادثات العادية بطريقة ودية.";

    // Determine which model to use (Mixtral is more powerful)
    const model = "mixtral-8x7b-32768";

    // Prepare the API request
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Mistral API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

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
        source: model.includes("mixtral") ? "Mixtral-8x7B" : "Mistral-7B",
        lastUpdated: new Date().toISOString().split("T")[0],
        quickReplies,
      },
    };
  } catch (error) {
    console.error("Error calling Mistral API:", error);

    // Fall back to Groq
    const { generateGroqResponse } = await import("./groqService");
    return generateGroqResponse(query, language);
  }
}

/**
 * Process a document using the Mistral/Mixtral API
 */
export async function processDocumentWithMistral(
  fileInfo: {
    text: string;
    fileName: string;
    fileType: string;
    fileSize: string;
  },
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  if (!apiKey) {
    console.warn("Mistral API key not found, falling back to Groq");
    // Fall back to Groq
    const { processDocumentWithGroq } = await import("./groqService");
    return processDocumentWithGroq(fileInfo, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Analyze the following document text and provide insights about what type of document it is and how you can help the user with their needs. For security reasons, advise users not to share sensitive personal documents in unsecured channels. Provide helpful information about any topic related to the document without limitations or predefined categories."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قم بتحليل نص المستند التالي وتقديم رؤى حول نوع المستند وكيف يمكنك مساعدة المستخدم في احتياجاته. لأسباب أمنية، انصح المستخدمين بعدم مشاركة المستندات الشخصية الحساسة في قنوات غير آمنة. قدم معلومات مفيدة حول أي موضوع متعلق بالمستند دون قيود أو فئات محددة مسبقًا.";

    // Determine which model to use (Mixtral is more powerful)
    const model = "mixtral-8x7b-32768";

    // Prepare the API request
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Document filename: ${fileInfo.fileName}\nDocument content: ${fileInfo.text}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Mistral API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

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
        source: model.includes("mixtral") ? "Mixtral-8x7B" : "Mistral-7B",
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
    console.error("Error calling Mistral API for document processing:", error);

    // Fall back to Groq
    const { processDocumentWithGroq } = await import("./groqService");
    return processDocumentWithGroq(fileInfo, language);
  }
}
