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
        ? "You are an AI assistant for Al Yalayis Government Services. Provide accurate, helpful information about UAE government services and answer general questions about the UAE. Be concise, professional, and follow the response structure guidelines. For service information, include service name, description, eligibility criteria, required documents, fees, processing time, and application steps. Always include source attribution and last updated timestamp. You can also respond to general greetings and casual conversation in a friendly manner."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قدم معلومات دقيقة ومفيدة حول الخدمات الحكومية في الإمارات العربية المتحدة وأجب على الأسئلة العامة حول الإمارات. كن موجزًا ومهنيًا واتبع إرشادات هيكل الاستجابة. بالنسبة لمعلومات الخدمة، قم بتضمين اسم الخدمة والوصف ومعايير الأهلية والمستندات المطلوبة والرسوم ووقت المعالجة وخطوات التقديم. قم دائمًا بتضمين مصدر المعلومات وتاريخ آخر تحديث. يمكنك أيضًا الرد على التحيات العامة والمحادثات العادية بطريقة ودية.";

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
        ? "You are an AI assistant for Al Yalayis Government Services. Analyze the following document text and provide insights about what type of document it is and how you can help with related government services. For security reasons, advise users not to share sensitive personal documents in unsecured channels. Provide specific information about related government services including eligibility requirements, necessary documents, fees, and application steps. Always include source attribution."
        : "أنت مساعد ذكاء اصطناعي لخدمات حكومة اليلايس. قم بتحليل نص المستند التالي وتقديم رؤى حول نوع المستند وكيف يمكنك المساعدة في الخدمات الحكومية ذات الصلة. لأسباب أمنية، انصح المستخدمين بعدم مشاركة المستندات الشخصية الحساسة في قنوات غير آمنة. قدم معلومات محددة حول الخدمات الحكومية ذات الصلة بما في ذلك متطلبات الأهلية والمستندات اللازمة والرسوم وخطوات التقديم. قم دائمًا بتضمين مصدر المعلومات.";

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
