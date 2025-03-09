/**
 * OpenAI Service for handling real AI interactions
 * This would replace the mock AI responses with actual OpenAI API calls
 */

import { AIResponse } from "./aiService";

// OpenAI API configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Generate a response using the OpenAI API
 * @param query User's query text
 * @param language Current language (en/ar)
 * @returns AI response with content and metadata
 */
export async function generateOpenAIResponse(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OpenAI API key not found, falling back to mock responses");
    // Fall back to mock responses
    const { generateAIResponse } = await import("./aiService");
    return generateAIResponse(query, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Provide accurate, helpful information about UAE government services. Be concise and professional."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قدم معلومات دقيقة ومفيدة حول الخدمات الحكومية في الإمارات العربية المتحدة. كن موجزًا ومهنيًا.";

    // Prepare the API request
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Generate appropriate quick replies based on the query context
    const { generateContextualQuickReplies } = await import("./aiService");
    const quickReplies = generateContextualQuickReplies(query, language);

    return {
      content,
      metadata: {
        confidenceLevel: "high",
        source: "OpenAI GPT-4",
        lastUpdated: new Date().toISOString().split("T")[0],
        quickReplies,
      },
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);

    // Fall back to mock responses
    const { generateAIResponse } = await import("./aiService");
    return generateAIResponse(query, language);
  }
}

/**
 * Process a document using the OpenAI API
 */
export async function processDocumentWithOpenAI(
  fileInfo: {
    text: string;
    fileName: string;
    fileType: string;
    fileSize: string;
  },
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OpenAI API key not found, falling back to mock responses");
    // Fall back to mock document processing
    const { processDocumentWithAI } = await import("./aiService");
    return processDocumentWithAI(fileInfo, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Analyze the following document text and provide insights about what type of document it is and how you can help with related government services."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قم بتحليل نص المستند التالي وتقديم رؤى حول نوع المستند وكيف يمكنك المساعدة في الخدمات الحكومية ذات الصلة.";

    // Prepare the API request
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Document filename: ${fileInfo.fileName}\nDocument content: ${fileInfo.text}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Generate appropriate quick replies based on document type
    const { determineDocumentType } = await import("./aiService");
    const documentType = determineDocumentType(
      fileInfo.fileName,
      fileInfo.text,
    );

    // Get quick replies based on document type
    let quickReplies: Array<{ id: string; text: string }> = [];
    switch (documentType) {
      case "emirates-id":
        quickReplies = [
          {
            id: "renew-id",
            text:
              language === "en"
                ? "Renew Emirates ID"
                : "تجديد الهوية الإماراتية",
          },
          {
            id: "replace-id",
            text:
              language === "en" ? "Replace Lost ID" : "استبدال الهوية المفقودة",
          },
        ];
        break;
      case "visa":
        quickReplies = [
          {
            id: "visa-validity",
            text:
              language === "en"
                ? "Check Visa Validity"
                : "التحقق من صلاحية التأشيرة",
          },
          {
            id: "extend-visa",
            text: language === "en" ? "Extend Visa" : "تمديد التأشيرة",
          },
        ];
        break;
      default:
        quickReplies = [
          {
            id: "more-info",
            text: language === "en" ? "Tell me more" : "أخبرني المزيد",
          },
          {
            id: "help",
            text: language === "en" ? "I need help" : "أحتاج للمساعدة",
          },
        ];
    }

    return {
      content,
      metadata: {
        confidenceLevel: "high",
        source: "OpenAI GPT-4",
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
    console.error("Error calling OpenAI API for document processing:", error);

    // Fall back to mock document processing
    const { processDocumentWithAI } = await import("./aiService");
    return processDocumentWithAI(fileInfo, language);
  }
}
