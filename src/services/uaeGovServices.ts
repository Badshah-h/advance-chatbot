/**
 * UAE Government Services API Integration
 * Connects to official UAE government data sources and APIs in real-time
 */

import { AIResponse } from "./aiService";
import { extractEntities } from "./entityRecognitionService";

// Define service data structure
export interface GovernmentService {
  id: string;
  title: string;
  description: string;
  authority: string;
  authorityCode: string;
  category: string;
  subcategory?: string;
  eligibility?: string[];
  requiredDocuments?: string[];
  fees?: {
    amount: number;
    currency: string;
    description: string;
  }[];
  processingTime?: string;
  steps?: string[];
  url: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  lastUpdated: string;
  language: "en" | "ar";
}

// API endpoints for UAE government services
const API_ENDPOINTS = {
  UAE_GOV_PORTAL:
    process.env.UAE_GOV_PORTAL_API || "https://api.u.ae/api/services",
  ICP: process.env.ICP_API || "https://api.icp.gov.ae/api/services",
  MOI: process.env.MOI_API || "https://api.moi.gov.ae/api/services",
  MOFA: process.env.MOFA_API || "https://api.mofa.gov.ae/api/services",
  MOEC: process.env.MOEC_API || "https://api.moec.gov.ae/api/services",
  MOHAP: process.env.MOHAP_API || "https://api.mohap.gov.ae/api/services",
  MOE: process.env.MOE_API || "https://api.moe.gov.ae/api/services",
  FTA: process.env.FTA_API || "https://api.tax.gov.ae/api/services",
  TDRA: process.env.TDRA_API || "https://api.tdra.gov.ae/api/services",
};

// API keys from environment variables
const API_KEYS = {
  UAE_GOV_PORTAL: process.env.UAE_GOV_API_KEY || "",
  ICP: process.env.ICP_API_KEY || "",
  MOI: process.env.MOI_API_KEY || "",
  MOFA: process.env.MOFA_API_KEY || "",
  MOEC: process.env.MOEC_API_KEY || "",
  MOHAP: process.env.MOHAP_API_KEY || "",
  MOE: process.env.MOE_API_KEY || "",
  FTA: process.env.FTA_API_KEY || "",
  TDRA: process.env.TDRA_API_KEY || "",
};

/**
 * Fetch service information from UAE government APIs
 * @param query The user's query
 * @param language The language (en/ar)
 * @returns Promise with service data
 */
export async function fetchGovernmentServices(
  query: string,
  language: "en" | "ar" = "en",
): Promise<GovernmentService[]> {
  try {
    // Use entity recognition to extract relevant entities from the query
    const entityResult = extractEntities(query);

    // Determine which APIs to query based on the entities
    const apisToQuery = determineRelevantAPIs(entityResult.entities);

    // Fetch data from all relevant APIs in parallel
    const servicePromises = apisToQuery.map((api) =>
      fetchFromAPI(api, entityResult.expandedQuery, language),
    );
    const servicesArrays = await Promise.all(servicePromises);

    // Flatten the array of arrays and remove duplicates
    const allServices = servicesArrays.flat();
    const uniqueServices = removeDuplicateServices(allServices);

    // Sort services by relevance to the query
    const sortedServices = rankServicesByRelevance(
      uniqueServices,
      entityResult,
    );

    return sortedServices;
  } catch (error) {
    console.error("Error fetching government services:", error);
    return [];
  }
}

/**
 * Determine which APIs to query based on extracted entities
 */
function determineRelevantAPIs(entities: any[]): string[] {
  const apis = new Set<string>();

  // Always include the main UAE government portal
  apis.add("UAE_GOV_PORTAL");

  // Map entity types to relevant APIs
  entities.forEach((entity) => {
    const normalizedValue =
      entity.normalizedValue?.toLowerCase() || entity.text.toLowerCase();

    // Check for service types
    if (entity.type === "SERVICE_TYPE") {
      if (
        normalizedValue.includes("visa") ||
        normalizedValue.includes("passport") ||
        normalizedValue.includes("residence") ||
        normalizedValue.includes("identity") ||
        normalizedValue.includes("emirates id")
      ) {
        apis.add("ICP");
      }

      if (
        normalizedValue.includes("traffic") ||
        normalizedValue.includes("police") ||
        normalizedValue.includes("security") ||
        normalizedValue.includes("civil defense")
      ) {
        apis.add("MOI");
      }

      if (
        normalizedValue.includes("business") ||
        normalizedValue.includes("company") ||
        normalizedValue.includes("trade") ||
        normalizedValue.includes("license") ||
        normalizedValue.includes("economy")
      ) {
        apis.add("MOEC");
      }

      if (
        normalizedValue.includes("health") ||
        normalizedValue.includes("medical") ||
        normalizedValue.includes("hospital") ||
        normalizedValue.includes("clinic")
      ) {
        apis.add("MOHAP");
      }

      if (
        normalizedValue.includes("education") ||
        normalizedValue.includes("school") ||
        normalizedValue.includes("university") ||
        normalizedValue.includes("certificate")
      ) {
        apis.add("MOE");
      }

      if (
        normalizedValue.includes("tax") ||
        normalizedValue.includes("vat") ||
        normalizedValue.includes("excise")
      ) {
        apis.add("FTA");
      }

      if (
        normalizedValue.includes("foreign") ||
        normalizedValue.includes("embassy") ||
        normalizedValue.includes("consulate") ||
        normalizedValue.includes("attestation")
      ) {
        apis.add("MOFA");
      }

      if (
        normalizedValue.includes("telecom") ||
        normalizedValue.includes("digital") ||
        normalizedValue.includes("internet") ||
        normalizedValue.includes("communication")
      ) {
        apis.add("TDRA");
      }
    }

    // Check for ministry or authority entities
    if (entity.type === "MINISTRY" || entity.type === "AUTHORITY") {
      if (normalizedValue.includes("interior")) apis.add("MOI");
      if (normalizedValue.includes("foreign affairs")) apis.add("MOFA");
      if (normalizedValue.includes("economy")) apis.add("MOEC");
      if (normalizedValue.includes("health")) apis.add("MOHAP");
      if (normalizedValue.includes("education")) apis.add("MOE");
      if (normalizedValue.includes("tax")) apis.add("FTA");
      if (
        normalizedValue.includes("identity") ||
        normalizedValue.includes("citizenship")
      )
        apis.add("ICP");
      if (
        normalizedValue.includes("telecom") ||
        normalizedValue.includes("digital")
      )
        apis.add("TDRA");
    }
  });

  // If no specific APIs were determined, query all major ones
  if (apis.size <= 1) {
    apis.add("ICP");
    apis.add("MOI");
    apis.add("MOEC");
  }

  return Array.from(apis);
}

/**
 * Fetch data from a specific API
 */
async function fetchFromAPI(
  apiKey: string,
  query: string,
  language: "en" | "ar",
): Promise<GovernmentService[]> {
  try {
    const endpoint = API_ENDPOINTS[apiKey as keyof typeof API_ENDPOINTS];
    const apiKeyValue = API_KEYS[apiKey as keyof typeof API_KEYS];

    if (!endpoint) {
      console.error(`Unknown API endpoint: ${apiKey}`);
      return [];
    }

    // Make the actual API call to the government service
    try {
      const response = await fetch(
        `${endpoint}?query=${encodeURIComponent(query)}&lang=${language}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKeyValue}`,
            "Accept-Language": language,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return mapAPIResponseToServices(apiKey, data, language);
    } catch (apiError) {
      console.error(`Error calling ${apiKey} API:`, apiError);

      // If API call fails, try to use web scraping as fallback
      return await scrapeGovernmentWebsite(apiKey, query, language);
    }
  } catch (error) {
    console.error(`Error in fetchFromAPI for ${apiKey}:`, error);
    return [];
  }
}

/**
 * Map API response to standardized service format
 */
function mapAPIResponseToServices(
  apiKey: string,
  data: any,
  language: "en" | "ar",
): GovernmentService[] {
  try {
    // Each API might have a different response structure
    // This function transforms the API-specific response format to our standardized format

    const services: GovernmentService[] = [];

    // Handle UAE Government Portal API response
    if (apiKey === "UAE_GOV_PORTAL" && data.services) {
      data.services.forEach((service: any) => {
        services.push({
          id:
            service.id ||
            `uae-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: service.title || service.name || "",
          description: service.description || "",
          authority:
            service.authority || service.provider || "UAE Government Portal",
          authorityCode: service.authorityCode || "UAE_GOV",
          category: service.category || service.serviceCategory || "",
          subcategory: service.subcategory || service.serviceSubCategory || "",
          eligibility: service.eligibility || service.eligibilityCriteria || [],
          requiredDocuments:
            service.requiredDocuments || service.documents || [],
          fees: service.fees
            ? service.fees.map((fee: any) => ({
                amount: fee.amount || 0,
                currency: fee.currency || "AED",
                description: fee.description || fee.name || "",
              }))
            : [],
          processingTime: service.processingTime || service.estimatedTime || "",
          steps: service.steps || service.procedure || [],
          url: service.url || service.serviceUrl || "",
          contactInfo: {
            phone: service.contactInfo?.phone || service.phone || "",
            email: service.contactInfo?.email || service.email || "",
            website: service.contactInfo?.website || service.website || "",
          },
          lastUpdated:
            service.lastUpdated ||
            service.updatedAt ||
            new Date().toISOString().split("T")[0],
          language: language,
        });
      });
    }
    // Handle ICP API response
    else if (apiKey === "ICP" && data.data) {
      data.data.forEach((service: any) => {
        services.push({
          id:
            service.id ||
            `icp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: service.title || service.serviceName || "",
          description: service.description || "",
          authority:
            "Federal Authority for Identity, Citizenship, Customs and Port Security",
          authorityCode: "ICP",
          category: service.category || service.serviceType || "",
          subcategory: service.subcategory || "",
          eligibility: service.eligibility || service.eligibilityCriteria || [],
          requiredDocuments:
            service.requiredDocuments || service.documents || [],
          fees: service.fees
            ? service.fees.map((fee: any) => ({
                amount: fee.amount || 0,
                currency: fee.currency || "AED",
                description: fee.description || "",
              }))
            : [],
          processingTime:
            service.processingTime || service.estimatedCompletionTime || "",
          steps: service.steps || service.applicationSteps || [],
          url:
            service.url ||
            service.serviceUrl ||
            "https://icp.gov.ae/en/services/",
          contactInfo: {
            phone:
              service.contactInfo?.phone ||
              service.contactNumber ||
              "600 522222",
            email:
              service.contactInfo?.email ||
              service.email ||
              "contactus@icp.gov.ae",
            website: service.contactInfo?.website || "https://icp.gov.ae",
          },
          lastUpdated:
            service.lastUpdated ||
            service.updatedAt ||
            new Date().toISOString().split("T")[0],
          language: language,
        });
      });
    }
    // Handle MOI API response
    else if (apiKey === "MOI" && data.services) {
      data.services.forEach((service: any) => {
        services.push({
          id:
            service.id ||
            `moi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: service.title || service.serviceName || "",
          description: service.description || "",
          authority: "Ministry of Interior",
          authorityCode: "MOI",
          category: service.category || service.serviceCategory || "",
          subcategory: service.subcategory || "",
          eligibility: service.eligibility || service.eligibilityCriteria || [],
          requiredDocuments:
            service.requiredDocuments || service.documents || [],
          fees: service.fees
            ? service.fees.map((fee: any) => ({
                amount: fee.amount || 0,
                currency: fee.currency || "AED",
                description: fee.description || "",
              }))
            : [],
          processingTime: service.processingTime || service.estimatedTime || "",
          steps: service.steps || service.procedure || [],
          url:
            service.url ||
            service.serviceUrl ||
            "https://www.moi.gov.ae/en/eservices.aspx",
          contactInfo: {
            phone:
              service.contactInfo?.phone || service.contactNumber || "800 3333",
            email:
              service.contactInfo?.email || service.email || "info@moi.gov.ae",
            website: service.contactInfo?.website || "https://www.moi.gov.ae",
          },
          lastUpdated:
            service.lastUpdated ||
            service.updatedAt ||
            new Date().toISOString().split("T")[0],
          language: language,
        });
      });
    }
    // Add more API response handlers as needed

    return services;
  } catch (error) {
    console.error(`Error mapping API response for ${apiKey}:`, error);
    return [];
  }
}

/**
 * Fallback method: Scrape government websites for information
 */
async function scrapeGovernmentWebsite(
  apiKey: string,
  query: string,
  language: "en" | "ar",
): Promise<GovernmentService[]> {
  try {
    // In a production environment, this would use a web scraping service
    // For now, we'll use a search API to get relevant information

    // Determine the website URL based on the API key
    let websiteUrl = "";
    let authorityName = "";

    switch (apiKey) {
      case "UAE_GOV_PORTAL":
        websiteUrl = "https://u.ae/en";
        authorityName = "UAE Government Portal";
        break;
      case "ICP":
        websiteUrl = "https://icp.gov.ae/en";
        authorityName =
          "Federal Authority for Identity, Citizenship, Customs and Port Security";
        break;
      case "MOI":
        websiteUrl = "https://www.moi.gov.ae/en";
        authorityName = "Ministry of Interior";
        break;
      case "MOFA":
        websiteUrl = "https://www.mofaic.gov.ae/en";
        authorityName = "Ministry of Foreign Affairs";
        break;
      case "MOEC":
        websiteUrl = "https://www.moec.gov.ae/en";
        authorityName = "Ministry of Economy";
        break;
      case "MOHAP":
        websiteUrl = "https://mohap.gov.ae/en";
        authorityName = "Ministry of Health & Prevention";
        break;
      case "MOE":
        websiteUrl = "https://www.moe.gov.ae/en";
        authorityName = "Ministry of Education";
        break;
      case "FTA":
        websiteUrl = "https://tax.gov.ae/en";
        authorityName = "Federal Tax Authority";
        break;
      case "TDRA":
        websiteUrl = "https://tdra.gov.ae/en";
        authorityName =
          "Telecommunications and Digital Government Regulatory Authority";
        break;
      default:
        websiteUrl = "https://u.ae/en";
        authorityName = "UAE Government Portal";
    }

    // Use a search API to search the website
    // This is a placeholder for a real web scraping or search API call
    try {
      // In a real implementation, this would call a search API or web scraping service
      // For example, using Google Custom Search API or a web scraping service

      // For now, we'll return an empty array
      // In a production environment, this would return actual scraped data
      return [];
    } catch (searchError) {
      console.error(`Error searching ${websiteUrl}:`, searchError);
      return [];
    }
  } catch (error) {
    console.error(`Error in scrapeGovernmentWebsite for ${apiKey}:`, error);
    return [];
  }
}

/**
 * Remove duplicate services from the combined results
 */
function removeDuplicateServices(
  services: GovernmentService[],
): GovernmentService[] {
  const uniqueMap = new Map<string, GovernmentService>();

  services.forEach((service) => {
    // Use title and authority as a unique key
    const key = `${service.title}-${service.authority}`;

    // If this service doesn't exist yet, or this one is more recently updated
    if (
      !uniqueMap.has(key) ||
      new Date(service.lastUpdated) > new Date(uniqueMap.get(key)!.lastUpdated)
    ) {
      uniqueMap.set(key, service);
    }
  });

  return Array.from(uniqueMap.values());
}

/**
 * Rank services by relevance to the query
 */
function rankServicesByRelevance(
  services: GovernmentService[],
  entityResult: any,
): GovernmentService[] {
  return services.sort((a, b) => {
    // Calculate relevance score for each service
    const scoreA = calculateRelevanceScore(a, entityResult);
    const scoreB = calculateRelevanceScore(b, entityResult);

    // Sort by descending score (higher score = more relevant)
    return scoreB - scoreA;
  });
}

/**
 * Calculate a relevance score for a service based on the query entities
 */
function calculateRelevanceScore(
  service: GovernmentService,
  entityResult: any,
): number {
  let score = 0;

  // Check if service title contains any of the entity texts
  entityResult.entities.forEach((entity: any) => {
    const normalizedValue =
      entity.normalizedValue?.toLowerCase() || entity.text.toLowerCase();
    const serviceTitle = service.title.toLowerCase();
    const serviceDesc = service.description.toLowerCase();

    // Title matches are most important
    if (serviceTitle.includes(normalizedValue)) {
      score += 10 * entity.confidence;
    }

    // Description matches are also valuable
    if (serviceDesc.includes(normalizedValue)) {
      score += 5 * entity.confidence;
    }

    // Category matches
    if (service.category.toLowerCase().includes(normalizedValue)) {
      score += 3 * entity.confidence;
    }

    // Subcategory matches
    if (service.subcategory?.toLowerCase().includes(normalizedValue)) {
      score += 2 * entity.confidence;
    }
  });

  // Check for intent matches
  entityResult.intents.forEach((intent: any) => {
    // Application intent matches services with "apply" in the title or description
    if (
      intent.intent === "APPLICATION" &&
      (service.title.toLowerCase().includes("apply") ||
        service.description.toLowerCase().includes("apply") ||
        service.description.toLowerCase().includes("application"))
    ) {
      score += 5 * intent.confidence;
    }

    // Renewal intent matches services with "renew" in the title or description
    if (
      intent.intent === "RENEWAL" &&
      (service.title.toLowerCase().includes("renew") ||
        service.description.toLowerCase().includes("renew") ||
        service.description.toLowerCase().includes("renewal"))
    ) {
      score += 5 * intent.confidence;
    }

    // Similar matching for other intents
    if (
      intent.intent === "PAYMENT" &&
      (service.title.toLowerCase().includes("pay") ||
        service.description.toLowerCase().includes("payment") ||
        service.description.toLowerCase().includes("fee"))
    ) {
      score += 5 * intent.confidence;
    }
  });

  return score;
}

/**
 * Format service data into a user-friendly response
 */
export function formatServiceResponse(
  services: GovernmentService[],
  language: "en" | "ar",
): AIResponse {
  if (services.length === 0) {
    return {
      content:
        language === "en"
          ? "I couldn't find specific information about that from official UAE government sources. Would you like me to provide general information instead?"
          : "لم أتمكن من العثور على معلومات محددة حول ذلك من مصادر حكومية رسمية في الإمارات. هل ترغب في الحصول على معلومات عامة بدلاً من ذلك؟",
      metadata: {
        confidenceLevel: "low",
        source: "Al Yalayis Government Services",
        lastUpdated: new Date().toISOString().split("T")[0],
        quickReplies: [
          {
            id: "general-info",
            text: language === "en" ? "General Information" : "معلومات عامة",
          },
          {
            id: "contact-support",
            text: language === "en" ? "Contact Support" : "الاتصال بالدعم",
          },
          {
            id: "try-different",
            text:
              language === "en" ? "Try Different Search" : "محاولة بحث مختلفة",
          },
        ],
      },
    };
  }

  // Get the most relevant service
  const topService = services[0];

  // Format the response based on the language
  if (language === "en") {
    let response = `**${topService.title}**\n\n`;
    response += `${topService.description}\n\n`;

    if (topService.eligibility && topService.eligibility.length > 0) {
      response += "**Eligibility:**\n";
      topService.eligibility.forEach((item) => {
        response += `- ${item}\n`;
      });
      response += "\n";
    }

    if (
      topService.requiredDocuments &&
      topService.requiredDocuments.length > 0
    ) {
      response += "**Required Documents:**\n";
      topService.requiredDocuments.forEach((item) => {
        response += `- ${item}\n`;
      });
      response += "\n";
    }

    if (topService.fees && topService.fees.length > 0) {
      response += "**Fees:**\n";
      topService.fees.forEach((fee) => {
        response += `- ${fee.description}: ${fee.amount} ${fee.currency}\n`;
      });
      response += "\n";
    }

    if (topService.processingTime) {
      response += `**Processing Time:** ${topService.processingTime}\n\n`;
    }

    if (topService.steps && topService.steps.length > 0) {
      response += "**Application Steps:**\n";
      topService.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      response += "\n";
    }

    response += `**Authority:** ${topService.authority}\n`;
    response += `**Official Website:** ${topService.url}\n`;

    if (topService.contactInfo) {
      response += "\n**Contact Information:**\n";
      if (topService.contactInfo.phone)
        response += `Phone: ${topService.contactInfo.phone}\n`;
      if (topService.contactInfo.email)
        response += `Email: ${topService.contactInfo.email}\n`;
      if (topService.contactInfo.website)
        response += `Website: ${topService.contactInfo.website}\n`;
    }

    response += `\n*Last Updated: ${topService.lastUpdated}*`;

    // If there are more services, add a note
    if (services.length > 1) {
      response += `\n\nI found ${services.length} services related to your query. Would you like information about any of the other services?`;
    }

    return {
      content: response,
      metadata: {
        confidenceLevel: "high",
        source: topService.authority,
        lastUpdated: topService.lastUpdated,
        quickReplies: generateQuickReplies(services, language),
      },
    };
  } else {
    // Arabic version
    let response = `**${topService.title}**\n\n`;
    response += `${topService.description}\n\n`;

    if (topService.eligibility && topService.eligibility.length > 0) {
      response += "**الأهلية:**\n";
      topService.eligibility.forEach((item) => {
        response += `- ${item}\n`;
      });
      response += "\n";
    }

    if (
      topService.requiredDocuments &&
      topService.requiredDocuments.length > 0
    ) {
      response += "**المستندات المطلوبة:**\n";
      topService.requiredDocuments.forEach((item) => {
        response += `- ${item}\n`;
      });
      response += "\n";
    }

    if (topService.fees && topService.fees.length > 0) {
      response += "**الرسوم:**\n";
      topService.fees.forEach((fee) => {
        response += `- ${fee.description}: ${fee.amount} ${fee.currency}\n`;
      });
      response += "\n";
    }

    if (topService.processingTime) {
      response += `**وقت المعالجة:** ${topService.processingTime}\n\n`;
    }

    if (topService.steps && topService.steps.length > 0) {
      response += "**خطوات التقديم:**\n";
      topService.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      response += "\n";
    }

    response += `**الجهة:** ${topService.authority}\n`;
    response += `**الموقع الرسمي:** ${topService.url}\n`;

    if (topService.contactInfo) {
      response += "\n**معلومات الاتصال:**\n";
      if (topService.contactInfo.phone)
        response += `الهاتف: ${topService.contactInfo.phone}\n`;
      if (topService.contactInfo.email)
        response += `البريد الإلكتروني: ${topService.contactInfo.email}\n`;
      if (topService.contactInfo.website)
        response += `الموقع الإلكتروني: ${topService.contactInfo.website}\n`;
    }

    response += `\n*آخر تحديث: ${topService.lastUpdated}*`;

    // If there are more services, add a note
    if (services.length > 1) {
      response += `\n\nوجدت ${services.length} خدمة متعلقة باستفسارك. هل ترغب في الحصول على معلومات حول أي من الخدمات الأخرى؟`;
    }

    return {
      content: response,
      metadata: {
        confidenceLevel: "high",
        source: topService.authority,
        lastUpdated: topService.lastUpdated,
        quickReplies: generateQuickReplies(services, language),
      },
    };
  }
}

/**
 * Generate quick replies based on the services
 */
function generateQuickReplies(
  services: GovernmentService[],
  language: "en" | "ar",
): Array<{ id: string; text: string }> {
  const quickReplies: Array<{ id: string; text: string }> = [];

  // Add quick replies for the top services
  const topServices = services.slice(0, 3);

  topServices.forEach((service, index) => {
    if (index === 0) {
      // For the top service, add action-based quick replies
      const title = service.title.toLowerCase();
      const category = service.category.toLowerCase();

      // Add relevant quick replies based on the service type
      if (title.includes("visa") || category.includes("visa")) {
        quickReplies.push({
          id: `visa-requirements-${service.id}`,
          text: language === "en" ? "Visa Requirements" : "متطلبات التأشيرة",
        });
        quickReplies.push({
          id: `visa-fees-${service.id}`,
          text: language === "en" ? "Visa Fees" : "رسوم التأشيرة",
        });
      } else if (title.includes("id") || category.includes("emirates id")) {
        quickReplies.push({
          id: `id-renewal-${service.id}`,
          text: language === "en" ? "ID Renewal Process" : "عملية تجديد الهوية",
        });
        quickReplies.push({
          id: `id-documents-${service.id}`,
          text: language === "en" ? "Required Documents" : "المستندات المطلوبة",
        });
      } else if (title.includes("business") || category.includes("business")) {
        quickReplies.push({
          id: `business-setup-${service.id}`,
          text:
            language === "en" ? "Business Setup Steps" : "خطوات إنشاء الأعمال",
        });
        quickReplies.push({
          id: `license-fees-${service.id}`,
          text: language === "en" ? "License Fees" : "رسوم الترخيص",
        });
      } else if (title.includes("traffic") || category.includes("traffic")) {
        quickReplies.push({
          id: `pay-fines-${service.id}`,
          text:
            language === "en" ? "Pay Traffic Fines" : "دفع المخالفات المرورية",
        });
        quickReplies.push({
          id: `vehicle-registration-${service.id}`,
          text: language === "en" ? "Vehicle Registration" : "تسجيل المركبات",
        });
      } else {
        // Generic quick replies for other service types
        quickReplies.push({
          id: `requirements-${service.id}`,
          text: language === "en" ? "Requirements" : "المتطلبات",
        });
        quickReplies.push({
          id: `fees-${service.id}`,
          text: language === "en" ? "Fees" : "الرسوم",
        });
      }
    } else {
      // For other services, add quick replies to view those services
      quickReplies.push({
        id: `service-${service.id}`,
        text:
          language === "en" ? `About ${service.title}` : `حول ${service.title}`,
      });
    }
  });

  // If we don't have enough quick replies yet, add some general ones
  if (quickReplies.length < 2) {
    quickReplies.push({
      id: "more-info",
      text: language === "en" ? "More Information" : "مزيد من المعلومات",
    });
    quickReplies.push({
      id: "contact-authority",
      text: language === "en" ? "Contact Authority" : "الاتصال بالهيئة",
    });
  }

  // Always add a feedback option
  quickReplies.push({
    id: "feedback",
    text: language === "en" ? "Provide Feedback" : "تقديم ملاحظات",
  });

  // Limit to 4 quick replies
  return quickReplies.slice(0, 4);
}

/**
 * Search for government services based on a query
 * @param query The user's query
 * @param language The language (en/ar)
 * @returns Promise with AI response
 */
export async function searchGovernmentServices(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  try {
    // Fetch services from government APIs
    const services = await fetchGovernmentServices(query, language);

    // Format the services into a user-friendly response
    return formatServiceResponse(services, language);
  } catch (error) {
    console.error("Error in searchGovernmentServices:", error);

    // Return a fallback response
    return {
      content:
        language === "en"
          ? "I'm sorry, I encountered an error while searching for government services. Please try again later or contact customer support for assistance."
          : "آسف، واجهت خطأ أثناء البحث عن الخدمات الحكومية. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بدعم العملاء للحصول على المساعدة.",
      metadata: {
        confidenceLevel: "low",
        source: "Al Yalayis Government Services",
        lastUpdated: new Date().toISOString().split("T")[0],
        quickReplies: [
          {
            id: "try-again",
            text: language === "en" ? "Try Again" : "حاول مرة أخرى",
          },
          {
            id: "contact-support",
            text: language === "en" ? "Contact Support" : "الاتصال بالدعم",
          },
        ],
      },
    };
  }
}
