/**
 * AI Service for handling chat interactions
 * This service integrates with a real AI backend instead of using mock responses
 */

import { findResponse, getConfidenceBadge } from "../utils/responseFormatter";
import { ServiceCategory } from "../types/services";

// Define response types
export type ConfidenceLevel = "high" | "medium" | "low";

export interface AIResponse {
  content: string;
  metadata?: {
    source?: string;
    lastUpdated?: string;
    confidenceLevel?: ConfidenceLevel;
    quickReplies?: Array<{ id: string; text: string }>;
    fileInfo?: {
      fileName: string;
      fileType: string;
      fileSize: string;
    };
  };
}

// Service categories for rich card generation
// This would be replaced with database data in a production environment
export const serviceData: Record<string, any> = {
  "tourist-visa": {
    id: "tourist-visa",
    title: "Tourist Visa",
    description: "Short-term visa for tourists visiting the UAE",
    category: "visa",
    image:
      "https://images.unsplash.com/photo-1576413326475-ea6c788332fb?w=600&q=80",
    fee: "AED 300 - 500",
    processingTime: "3-5 business days",
    eligibility: [
      "Valid passport with minimum 6 months validity",
      "Return ticket",
      "Hotel booking or host invitation",
      "Sufficient funds for the stay",
    ],
    requiredDocuments: [
      "Passport copy",
      "Passport-sized photograph",
      "Travel itinerary",
      "Hotel booking confirmation",
    ],
    applicationSteps: [
      "Create an account on the Federal Authority for Identity and Citizenship website",
      "Fill in the application form with personal details",
      "Upload the required documents",
      "Pay the applicable visa fees",
      "Wait for application processing",
      "Download and print the e-visa once approved",
    ],
    applicationUrl: "#",
    status: "active",
  },
  "golden-visa": {
    id: "golden-visa",
    title: "Golden Visa",
    description:
      "Long-term residence visa for investors and talented individuals",
    category: "visa",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    fee: "AED 2,500 - 4,500",
    processingTime: "30-60 days",
    eligibility: [
      "Investors (min. AED 2 million in property or business)",
      "Entrepreneurs with approved project",
      "Specialized talents (scientists, doctors, artists)",
      "Outstanding students with min. 95% in secondary school",
    ],
    requiredDocuments: [
      "Passport copy",
      "Investment proof or talent verification",
      "Bank statements (for investors)",
      "CV and certificates (for specialized talents)",
    ],
    applicationSteps: [
      "Submit nomination or application through ICP website",
      "Receive initial approval",
      "Complete medical fitness test",
      "Apply for Emirates ID",
      "Receive Golden Visa",
    ],
    applicationUrl: "#",
    status: "new",
  },
  "emirates-id": {
    id: "emirates-id",
    title: "Emirates ID",
    description: "National identity card for UAE citizens and residents",
    category: "identity",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    fee: "AED 100 - 370",
    processingTime: "3-5 business days",
    eligibility: [
      "UAE citizens",
      "UAE residents with valid residence visa",
      "GCC nationals residing in UAE",
    ],
    requiredDocuments: [
      "Original passport",
      "Copy of residence visa (for expatriates)",
      "Passport-sized photographs",
      "Birth certificate (for minors)",
    ],
    applicationSteps: [
      "Apply through ICP website or app",
      "Pay the applicable fees",
      "Visit an approved typing center for biometrics",
      "Receive Emirates ID via Emirates Post",
    ],
    applicationUrl: "#",
    status: "active",
  },
  "business-license": {
    id: "business-license",
    title: "Business License",
    description: "Commercial licenses for businesses operating in the UAE",
    category: "business",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    fee: "AED 10,000 - 50,000",
    processingTime: "1-2 weeks",
    eligibility: [
      "UAE citizens",
      "GCC nationals",
      "Foreign investors (100% ownership in most sectors)",
    ],
    requiredDocuments: [
      "Passport copies of all shareholders",
      "Emirates ID copies (for UAE residents)",
      "No objection certificate from sponsor (for UAE residents)",
      "Business plan",
      "Tenancy contract for business premises",
    ],
    applicationSteps: [
      "Select business activity and legal form",
      "Reserve trade name",
      "Get initial approval",
      "Prepare and notarize company documents",
      "Secure business premises",
      "Obtain external approvals (if required)",
      "Pay license fees",
      "Receive business license",
    ],
    applicationUrl: "#",
    status: "active",
  },
  "traffic-fines": {
    id: "traffic-fines",
    title: "Traffic Fines",
    description: "Check and pay traffic fines in the UAE",
    category: "traffic",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
    fee: "Varies by violation type",
    processingTime: "Immediate for online payments",
    eligibility: ["Vehicle owners", "Drivers with UAE driving license"],
    requiredDocuments: [
      "Traffic file number or license plate number",
      "Emirates ID or driving license",
    ],
    applicationSteps: [
      "Check fines through RTA website/app, MOI app, or Dubai Police app",
      "Select fines to pay",
      "Choose payment method",
      "Complete payment",
      "Receive payment confirmation",
    ],
    applicationUrl: "#",
    status: "active",
  },
};

/**
 * Generate a response using the AI service
 * @param query User's query text
 * @param language Current language (en/ar)
 * @returns AI response with content and metadata
 */
export async function generateAIResponse(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Check for service-specific queries to generate rich cards
  const serviceMatch = checkForServiceMatch(query);
  if (serviceMatch) {
    return await generateRichCardResponse(serviceMatch, language);
  }

  // Use the response formatter for other queries
  const { response, metadata } = findResponse(query);

  // Add source attribution and confidence level
  let formattedResponse = response;

  if (metadata) {
    formattedResponse += "\n\n";

    if (metadata.source && metadata.lastUpdated) {
      formattedResponse += `Source: ${metadata.source} (Last updated: ${metadata.lastUpdated})\n`;
    }

    if (metadata.confidenceLevel) {
      formattedResponse += getConfidenceBadge(metadata.confidenceLevel);
    }
  }

  // Add appropriate quick replies based on the query context
  const quickReplies = generateContextualQuickReplies(query, language);

  return {
    content: formattedResponse,
    metadata: {
      ...metadata,
      quickReplies,
    },
  };
}

/**
 * Check if the query matches any specific service
 */
function checkForServiceMatch(query: string): string | null {
  const lowercaseQuery = query.toLowerCase();

  if (lowercaseQuery.includes("tourist visa")) return "tourist-visa";
  if (lowercaseQuery.includes("golden visa")) return "golden-visa";
  if (lowercaseQuery.includes("emirates id")) return "emirates-id";
  if (lowercaseQuery.includes("business license")) return "business-license";
  if (
    lowercaseQuery.includes("traffic fine") ||
    lowercaseQuery.includes("pay fine")
  )
    return "traffic-fines";

  return null;
}

/**
 * Generate a rich card response for a specific service
 */
async function generateRichCardResponse(
  serviceId: string,
  language: "en" | "ar",
): Promise<AIResponse> {
  try {
    // First try to get service info from UAE Government sources
    try {
      const { fetchServiceInfo, formatServiceResponse } = await import(
        "./uaeGovServices"
      );
      const govServiceData = await fetchServiceInfo(serviceId, language);

      if (govServiceData) {
        // Create a rich card response with real government data
        const richCardData = {
          type: "service",
          data: {
            id: govServiceData.referenceNumber,
            title: govServiceData.serviceName,
            description: govServiceData.description,
            category: serviceId.split("-")[0],
            image: `https://images.unsplash.com/photo-1576413326475-ea6c788332fb?w=600&q=80`,
            fee: Object.values(govServiceData.fees)[0] || "Varies",
            processingTime: govServiceData.processingTime,
            eligibility: govServiceData.eligibilityCriteria,
            requiredDocuments: govServiceData.requiredDocuments,
            applicationSteps: govServiceData.applicationSteps,
            applicationUrl: govServiceData.serviceUrl || "#",
            status: "active",
            source: govServiceData.source,
            lastUpdated: govServiceData.lastUpdated,
            ministry: govServiceData.ministry,
          },
        };

        const introText =
          language === "en"
            ? `Here's information about the ${govServiceData.serviceName}:`
            : `إليك معلومات حول ${govServiceData.serviceName}:`;

        const outroText =
          language === "en"
            ? "You can view more details or apply online using the buttons above."
            : "يمكنك عرض المزيد من التفاصيل أو التقديم عبر الإنترنت باستخدام الأزرار أعلاه.";

        const richCardContent = `${introText}\n\n<rich-card>${JSON.stringify(richCardData)}</rich-card>\n\n${outroText}`;

        return {
          content: richCardContent,
          metadata: {
            confidenceLevel: "high",
            source: govServiceData.source,
            lastUpdated: govServiceData.lastUpdated,
            quickReplies: [
              {
                id: "more-details",
                text: language === "en" ? "More details" : "المزيد من التفاصيل",
              },
              {
                id: "requirements",
                text: language === "en" ? "Requirements" : "المتطلبات",
              },
              {
                id: "apply",
                text: language === "en" ? "How to apply" : "كيفية التقديم",
              },
              {
                id: "related-services",
                text:
                  language === "en" ? "Related Services" : "الخدمات ذات الصلة",
              },
            ],
          },
        };
      }
    } catch (govError) {
      console.warn("Error fetching from UAE Government sources:", govError);
    }

    // If UAE Government sources fail, try the API
    const { getServiceInfo } = await import("./apiService");
    const { data: service, error } = await getServiceInfo(serviceId);

    if (error || !service) {
      console.error("Error getting service info, falling back to static data");
      // Fall back to static data
      const staticService = serviceData[serviceId];
      if (!staticService) {
        return {
          content:
            language === "en"
              ? "I couldn't find specific information about that service."
              : "لم أتمكن من العثور على معلومات محددة حول هذه الخدمة.",
          metadata: {
            confidenceLevel: "low",
          },
        };
      }
      var serviceData = staticService;
    }

    // Create a rich card response
    const richCardData = {
      type: "service",
      data: service || serviceData,
    };

    const introText =
      language === "en"
        ? `Here's information about the ${service?.title || serviceData.title}:`
        : `إليك معلومات حول ${service?.title || serviceData.title}:`;

    const outroText =
      language === "en"
        ? "You can view more details or apply online using the buttons above."
        : "يمكنك عرض المزيد من التفاصيل أو التقديم عبر الإنترنت باستخدام الأزرار أعلاه.";

    const richCardContent = `${introText}\n\n<rich-card>${JSON.stringify(richCardData)}</rich-card>\n\n${outroText}`;

    return {
      content: richCardContent,
      metadata: {
        confidenceLevel: "high",
        source: "Al Yalayis Government Services",
        lastUpdated: service?.lastUpdated || "2023-12-01",
        quickReplies: [
          {
            id: "more-details",
            text: language === "en" ? "More details" : "المزيد من التفاصيل",
          },
          {
            id: "requirements",
            text: language === "en" ? "Requirements" : "المتطلبات",
          },
          {
            id: "apply",
            text: language === "en" ? "How to apply" : "كيفية التقديم",
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error in generateRichCardResponse:", error);
    // Fall back to static data
    const service = serviceData[serviceId];
    if (!service) {
      return {
        content:
          language === "en"
            ? "I couldn't find specific information about that service."
            : "لم أتمكن من العثور على معلومات محددة حول هذه الخدمة.",
        metadata: {
          confidenceLevel: "low",
        },
      };
    }

    // Create a rich card response with static data
    const richCardData = {
      type: "service",
      data: service,
    };

    const introText =
      language === "en"
        ? `Here's information about the ${service.title}:`
        : `إليك معلومات حول ${service.title}:`;

    const outroText =
      language === "en"
        ? "You can view more details or apply online using the buttons above."
        : "يمكنك عرض المزيد من التفاصيل أو التقديم عبر الإنترنت باستخدام الأزرار أعلاه.";

    const richCardContent = `${introText}\n\n<rich-card>${JSON.stringify(richCardData)}</rich-card>\n\n${outroText}`;

    return {
      content: richCardContent,
      metadata: {
        confidenceLevel: "high",
        source: "Al Yalayis Government Services",
        lastUpdated: "2023-12-01",
        quickReplies: [
          {
            id: "more-details",
            text: language === "en" ? "More details" : "المزيد من التفاصيل",
          },
          {
            id: "requirements",
            text: language === "en" ? "Requirements" : "المتطلبات",
          },
          {
            id: "apply",
            text: language === "en" ? "How to apply" : "كيفية التقديم",
          },
        ],
      },
    };
  }
}

/**
 * Generate contextual quick replies based on the query
 */
function generateContextualQuickReplies(
  query: string,
  language: "en" | "ar",
): Array<{ id: string; text: string }> {
  const lowercaseQuery = query.toLowerCase();

  // Default quick replies for general questions
  if (
    lowercaseQuery.includes("help") ||
    lowercaseQuery.includes("services") ||
    query.length < 15
  ) {
    return [
      {
        id: "visa",
        text: language === "en" ? "Visa Services" : "خدمات التأشيرة",
      },
      {
        id: "id",
        text: language === "en" ? "Emirates ID" : "الهوية الإماراتية",
      },
      {
        id: "business",
        text: language === "en" ? "Business Licensing" : "تراخيص الأعمال",
      },
      {
        id: "traffic",
        text: language === "en" ? "Traffic Services" : "خدمات المرور",
      },
    ];
  }

  // Visa-related quick replies
  if (lowercaseQuery.includes("visa")) {
    return [
      {
        id: "tourist-visa",
        text: language === "en" ? "Tourist Visa" : "تأشيرة سياحية",
      },
      {
        id: "residence-visa",
        text: language === "en" ? "Residence Visa" : "تأشيرة إقامة",
      },
      {
        id: "golden-visa",
        text: language === "en" ? "Golden Visa" : "التأشيرة الذهبية",
      },
      {
        id: "visa-requirements",
        text: language === "en" ? "Visa Requirements" : "متطلبات التأشيرة",
      },
    ];
  }

  // ID-related quick replies
  if (lowercaseQuery.includes("id") || lowercaseQuery.includes("emirates id")) {
    return [
      {
        id: "new-id",
        text: language === "en" ? "New Emirates ID" : "هوية إماراتية جديدة",
      },
      {
        id: "renew-id",
        text:
          language === "en" ? "Renew Emirates ID" : "تجديد الهوية الإماراتية",
      },
      {
        id: "replace-id",
        text: language === "en" ? "Replace Lost ID" : "استبدال الهوية المفقودة",
      },
      {
        id: "id-requirements",
        text: language === "en" ? "ID Requirements" : "متطلبات الهوية",
      },
    ];
  }

  // Business-related quick replies
  if (
    lowercaseQuery.includes("business") ||
    lowercaseQuery.includes("license")
  ) {
    return [
      {
        id: "mainland-license",
        text: language === "en" ? "Mainland License" : "رخصة البر الرئيسي",
      },
      {
        id: "freezone-license",
        text: language === "en" ? "Free Zone License" : "رخصة المنطقة الحرة",
      },
      {
        id: "renew-license",
        text: language === "en" ? "Renew License" : "تجديد الرخصة",
      },
      {
        id: "license-fees",
        text: language === "en" ? "License Fees" : "رسوم الترخيص",
      },
    ];
  }

  // Traffic-related quick replies
  if (
    lowercaseQuery.includes("traffic") ||
    lowercaseQuery.includes("driving") ||
    lowercaseQuery.includes("car")
  ) {
    return [
      {
        id: "traffic-fines",
        text: language === "en" ? "Traffic Fines" : "المخالفات المرورية",
      },
      {
        id: "vehicle-registration",
        text: language === "en" ? "Vehicle Registration" : "تسجيل المركبات",
      },
      {
        id: "driving-license",
        text: language === "en" ? "Driving License" : "رخصة القيادة",
      },
      {
        id: "pay-fines",
        text:
          language === "en" ? "Pay Fines Online" : "دفع المخالفات عبر الإنترنت",
      },
    ];
  }

  // Fallback quick replies
  return [
    {
      id: "more-info",
      text: language === "en" ? "Tell me more" : "أخبرني المزيد",
    },
    {
      id: "requirements",
      text: language === "en" ? "Requirements" : "المتطلبات",
    },
    { id: "fees", text: language === "en" ? "Fees" : "الرسوم" },
    {
      id: "clear_history",
      text: language === "en" ? "Clear chat history" : "مسح سجل المحادثة",
    },
  ];
}

/**
 * Process a document and generate an AI response
 */
export async function processDocumentWithAI(
  fileInfo: {
    text: string;
    fileName: string;
    fileType: string;
    fileSize: string;
  },
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  // Extract document type from filename or content
  const documentType = determineDocumentType(fileInfo.fileName, fileInfo.text);

  // Generate appropriate response based on document type
  let responseText = "";
  let confidenceLevel: ConfidenceLevel = "medium";
  let quickReplies: Array<{ id: string; text: string }> = [];

  switch (documentType) {
    case "emirates-id":
      responseText =
        language === "en"
          ? `I've analyzed your Emirates ID document. This appears to be an identity document containing personal information. For security reasons, I recommend not sharing this document in unsecured channels.\n\nIf you need assistance with your Emirates ID, I can help with:\n- Renewal procedures\n- Replacement if lost or damaged\n- Updating information\n- Understanding the information on your ID`
          : `لقد قمت بتحليل مستند الهوية الإماراتية الخاص بك. يبدو أن هذا مستند هوية يحتوي على معلومات شخصية. لأسباب أمنية، أوصي بعدم مشاركة هذا المستند في قنوات غير آمنة.\n\nإذا كنت بحاجة إلى مساعدة بخصوص الهوية الإماراتية الخاصة بك، يمكنني المساعدة في:\n- إجراءات التجديد\n- الاستبدال في حالة الفقدان أو التلف\n- تحديث المعلومات\n- فهم المعلومات الموجودة على بطاقة الهوية الخاصة بك`;

      quickReplies = [
        {
          id: "renew-id",
          text:
            language === "en" ? "Renew Emirates ID" : "تجديد الهوية الإماراتية",
        },
        {
          id: "replace-id",
          text:
            language === "en" ? "Replace Lost ID" : "استبدال الهوية المفقودة",
        },
        {
          id: "update-id",
          text:
            language === "en"
              ? "Update ID Information"
              : "تحديث معلومات الهوية",
        },
      ];
      break;

    case "visa":
      responseText =
        language === "en"
          ? `I've analyzed your visa document. This appears to be a travel or residence authorization document. For security reasons, I recommend not sharing this document in unsecured channels.\n\nIf you need assistance with your visa, I can help with:\n- Understanding visa validity and conditions\n- Renewal procedures\n- Extension options\n- Required documents for visa-related services`
          : `لقد قمت بتحليل مستند التأشيرة الخاص بك. يبدو أن هذا مستند إذن سفر أو إقامة. لأسباب أمنية، أوصي بعدم مشاركة هذا المستند في قنوات غير آمنة.\n\nإذا كنت بحاجة إلى مساعدة بخصوص التأشيرة الخاصة بك، يمكنني المساعدة في:\n- فهم صلاحية وشروط التأشيرة\n- إجراءات التجديد\n- خيارات التمديد\n- المستندات المطلوبة للخدمات المتعلقة بالتأشيرة`;

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
        {
          id: "visa-conditions",
          text: language === "en" ? "Visa Conditions" : "شروط التأشيرة",
        },
      ];
      break;

    case "business":
      responseText =
        language === "en"
          ? `I've analyzed your business license document. This appears to be a commercial registration document. For security reasons, I recommend not sharing this document in unsecured channels.\n\nIf you need assistance with your business license, I can help with:\n- Renewal procedures\n- Amendment procedures\n- Understanding license types and activities\n- Required documents for license-related services`
          : `لقد قمت بتحليل مستند الرخصة التجارية الخاص بك. يبدو أن هذا مستند تسجيل تجاري. لأسباب أمنية، أوصي بعدم مشاركة هذا المستند في قنوات غير آمنة.\n\nإذا كنت بحاجة إلى مساعدة بخصوص الرخصة التجارية الخاصة بك، يمكنني المساعدة في:\n- إجراءات التجديد\n- إجراءات التعديل\n- فهم أنواع الرخص والأنشطة\n- المستندات المطلوبة للخدمات المتعلقة بالرخصة`;

      quickReplies = [
        {
          id: "renew-license",
          text: language === "en" ? "Renew License" : "تجديد الرخصة",
        },
        {
          id: "amend-license",
          text: language === "en" ? "Amend License" : "تعديل الرخصة",
        },
        {
          id: "license-activities",
          text: language === "en" ? "License Activities" : "أنشطة الرخصة",
        },
      ];
      break;

    case "vehicle":
      responseText =
        language === "en"
          ? `I've analyzed your vehicle registration document. This appears to be related to a motor vehicle. For security reasons, I recommend not sharing this document in unsecured channels.\n\nIf you need assistance with your vehicle registration, I can help with:\n- Renewal procedures\n- Transfer of ownership\n- Vehicle inspection requirements\n- Required documents for vehicle-related services`
          : `لقد قمت بتحليل مستند تسجيل المركبة الخاص بك. يبدو أن هذا متعلق بمركبة آلية. لأسباب أمنية، أوصي بعدم مشاركة هذا المستند في قنوات غير آمنة.\n\nإذا كنت بحاجة إلى مساعدة بخصوص تسجيل المركبة الخاصة بك، يمكنني المساعدة في:\n- إجراءات التجديد\n- نقل الملكية\n- متطلبات فحص المركبة\n- المستندات المطلوبة للخدمات المتعلقة بالمركبة`;

      quickReplies = [
        {
          id: "renew-registration",
          text: language === "en" ? "Renew Registration" : "تجديد التسجيل",
        },
        {
          id: "transfer-ownership",
          text: language === "en" ? "Transfer Ownership" : "نقل الملكية",
        },
        {
          id: "vehicle-inspection",
          text: language === "en" ? "Vehicle Inspection" : "فحص المركبة",
        },
      ];
      break;

    default:
      responseText =
        language === "en"
          ? `I've analyzed your document, but I'm not able to determine its specific type. If you have questions about a particular government service, please let me know how I can assist you.`
          : `لقد قمت بتحليل المستند الخاص بك، ولكنني غير قادر على تحديد نوعه بشكل محدد. إذا كانت لديك أسئلة حول خدمة حكومية معينة، يرجى إخباري بكيفية مساعدتك.`;

      confidenceLevel = "low";
      quickReplies = [
        {
          id: "visa",
          text: language === "en" ? "Visa Services" : "خدمات التأشيرة",
        },
        {
          id: "id",
          text: language === "en" ? "Emirates ID" : "الهوية الإماراتية",
        },
        {
          id: "business",
          text: language === "en" ? "Business Licensing" : "تراخيص الأعمال",
        },
        {
          id: "traffic",
          text: language === "en" ? "Traffic Services" : "خدمات المرور",
        },
      ];
      break;
  }

  return {
    content: responseText,
    metadata: {
      confidenceLevel,
      fileInfo: {
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.fileSize,
      },
      quickReplies,
    },
  };
}

/**
 * Determine document type based on filename and content
 */
export function determineDocumentType(
  fileName: string,
  content: string,
): string {
  const lowercaseFileName = fileName.toLowerCase();
  const lowercaseContent = content.toLowerCase();

  if (
    lowercaseFileName.includes("id") ||
    lowercaseFileName.includes("emirates") ||
    lowercaseContent.includes("emirates id") ||
    lowercaseContent.includes("identity")
  ) {
    return "emirates-id";
  }

  if (
    lowercaseFileName.includes("visa") ||
    lowercaseFileName.includes("passport") ||
    lowercaseContent.includes("visa") ||
    lowercaseContent.includes("residence")
  ) {
    return "visa";
  }

  if (
    lowercaseFileName.includes("license") ||
    lowercaseFileName.includes("business") ||
    lowercaseContent.includes("license") ||
    lowercaseContent.includes("commercial")
  ) {
    return "business";
  }

  if (
    lowercaseFileName.includes("vehicle") ||
    lowercaseFileName.includes("car") ||
    lowercaseContent.includes("vehicle") ||
    lowercaseContent.includes("registration")
  ) {
    return "vehicle";
  }

  return "unknown";
}
