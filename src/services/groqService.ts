/**
 * Groq AI Service for handling AI interactions
 */

import { AIResponse } from "./aiService";
import { performWebSearch } from "./webSearchHelper";

// Groq API configuration
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Generate a response using the Groq API
 * @param query User's query text
 * @param language Current language (en/ar)
 * @returns AI response with content and metadata
 */
export async function generateGroqResponse(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.warn("Groq API key not found, falling back to mock AI");
    // Fall back to mock AI service as final fallback
    const { generateAIResponse } = await import("./aiService");
    return generateAIResponse(query, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Provide accurate, helpful information about any topic the user asks about, with a focus on UAE government services when relevant. Be concise, professional, and helpful. You can respond to any query without limitations or predefined categories. You can also respond to general greetings and casual conversation in a friendly manner."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قدم معلومات دقيقة ومفيدة حول أي موضوع يسأل عنه المستخدم، مع التركيز على الخدمات الحكومية في الإمارات عندما يكون ذلك مناسبًا. كن موجزًا ومهنيًا ومفيدًا. يمكنك الرد على أي استفسار دون قيود أو فئات محددة مسبقًا. يمكنك أيضًا الرد على التحيات العامة والمحادثات العادية بطريقة ودية.";

    // Perform web search to get relevant information
    const searchResults = await performWebSearch(query);

    // Combine search results with the user query
    const enhancedQuery = searchResults + query;

    // Prepare the API request
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Groq offers Mixtral model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: enhancedQuery },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`,
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
      metadata: null,
    };
  } catch (error) {
    console.error("Error calling Groq API:", error);

    // Fall back to mock AI service as final fallback
    const { generateAIResponse } = await import("./aiService");
    return generateAIResponse(query, language);
  }
}

/**
 * Process a document using the Groq API
 */
export async function processDocumentWithGroq(
  fileInfo: {
    text: string;
    fileName: string;
    fileType: string;
    fileSize: string;
  },
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.warn("Groq API key not found, falling back to mock AI");
    // Fall back to mock document processing as final fallback
    const { processDocumentWithAI } = await import("./aiService");
    return processDocumentWithAI(fileInfo, language);
  }

  try {
    // Prepare the system prompt based on language
    const systemPrompt =
      language === "en"
        ? "You are an AI assistant for Al Yalayis Government Services. Analyze the following document text and provide insights about what type of document it is and how you can help the user with their needs. For security reasons, advise users not to share sensitive personal documents in unsecured channels. Provide helpful information about any topic related to the document without limitations or predefined categories."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قم بتحليل نص المستند التالي وتقديم رؤى حول نوع المستند وكيف يمكنك مساعدة المستخدم في احتياجاته. لأسباب أمنية، انصح المستخدمين بعدم مشاركة المستندات الشخصية الحساسة في قنوات غير آمنة. قدم معلومات مفيدة حول أي موضوع متعلق بالمستند دون قيود أو فئات محددة مسبقًا.";

    // Perform web search based on document content to get relevant information
    const searchQuery = `${fileInfo.fileName} ${fileInfo.text.substring(0, 100)}`;
    const searchResults = await performWebSearch(searchQuery);

    // Combine search results with the document content
    const documentContent = `Document filename: ${fileInfo.fileName}\nDocument content: ${fileInfo.text}`;
    const enhancedQuery = searchResults + documentContent;

    // Prepare the API request
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Groq offers Mixtral model
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: enhancedQuery,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`,
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
      metadata: null,
    };
  } catch (error) {
    console.error("Error calling Groq API for document processing:", error);

    // Fall back to mock document processing as final fallback
    const { processDocumentWithAI } = await import("./aiService");
    return processDocumentWithAI(fileInfo, language);
  }
}
