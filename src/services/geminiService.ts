/**
 * Gemini AI Service for handling AI interactions with real-time web search
 */

import { AIResponse } from "./aiService";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * Generate a response using the Gemini AI API with web search capability
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
    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Create a model instance with web search enabled
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction:
        language === "en"
          ? "You are an AI assistant for Al Yalayis Government Services. Provide accurate, helpful information about any topic the user asks about, with a focus on UAE government services when relevant. Use real-time web search to get the most up-to-date information, especially for UAE government services, regulations, and procedures. Be concise, professional, and helpful. You can respond to any query without limitations or predefined categories. You can also respond to general greetings and casual conversation in a friendly manner. When providing information from web searches, prioritize official UAE government sources."
          : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قدم معلومات دقيقة ومفيدة حول أي موضوع يسأل عنه المستخدم، مع التركيز على الخدمات الحكومية في الإمارات عندما يكون ذلك مناسبًا. استخدم البحث على الويب في الوقت الفعلي للحصول على أحدث المعلومات، خاصة للخدمات الحكومية الإماراتية واللوائح والإجراءات. كن موجزًا ومهنيًا ومفيدًا. يمكنك الرد على أي استفسار دون قيود أو فئات محددة مسبقًا. يمكنك أيضًا الرد على التحيات العامة والمحادثات العادية بطريقة ودية. عند تقديم معلومات من عمليات البحث على الويب، أعط الأولوية للمصادر الحكومية الرسمية في الإمارات.",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.95,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
      tools: [
        {
          // Enable web search for real-time information
          googleSearchRetrieval: {},
        },
      ],
    });

    // Start a chat session
    const chat = model.startChat();

    // Send the user query and get a response
    const result = await chat.sendMessage(query);
    const response = await result.response;
    const content = response.text();

    // Return the exact original response without any formatting
    return {
      content,
      metadata: null,
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
    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Create a model instance with web search enabled for document analysis
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction:
        language === "en"
          ? "You are an AI assistant for Al Yalayis Government Services. Analyze the following document text and provide insights about what type of document it is and how you can help the user with their needs. Use web search to find the most up-to-date information related to the document content, especially for UAE government services, regulations, and procedures. For security reasons, advise users not to share sensitive personal documents in unsecured channels. Provide helpful information about any topic related to the document without limitations or predefined categories. When providing information from web searches, prioritize official UAE government sources."
          : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قم بتحليل نص المستند التالي وتقديم رؤى حول نوع المستند وكيف يمكنك مساعدة المستخدم في احتياجاته. استخدم البحث على الويب للعثور على أحدث المعلومات المتعلقة بمحتوى المستند، خاصة للخدمات الحكومية الإماراتية واللوائح والإجراءات. لأسباب أمنية، انصح المستخدمين بعدم مشاركة المستندات الشخصية الحساسة في قنوات غير آمنة. قدم معلومات مفيدة حول أي موضوع متعلق بالمستند دون قيود أو فئات محددة مسبقًا. عند تقديم معلومات من عمليات البحث على الويب، أعط الأولوية للمصادر الحكومية الرسمية في الإمارات.",
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1024,
        topP: 0.95,
        topK: 40,
      },
      tools: [
        {
          // Enable web search for real-time information
          googleSearchRetrieval: {},
        },
      ],
    });

    // Start a chat session
    const chat = model.startChat();

    // Prepare the document content
    const documentContent = `Document filename: ${fileInfo.fileName}\nDocument content: ${fileInfo.text}`;

    // Send the document content and get a response
    const result = await chat.sendMessage(documentContent);
    const response = await result.response;
    const content = response.text();

    // Return the exact original response without any formatting
    return {
      content,
      metadata: null,
    };
  } catch (error) {
    console.error("Error calling Gemini API for document processing:", error);

    // Fall back to Mistral/Mixtral
    const { processDocumentWithMistral } = await import("./mistralService");
    return processDocumentWithMistral(fileInfo, language);
  }
}
