/**
 * Web Search Service
 * Provides a unified interface for searching the web and UAE government services
 */

import { searchUAEGovServices } from "./uaeGovSearchService";
import { performWebSearch } from "./webSearchHelper";
import { AIResponse } from "./aiService";

/**
 * Search for information using multiple sources
 * @param query The search query
 * @param language The language (en/ar)
 * @returns Promise with AI response containing search results
 */
export async function searchWeb(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  try {
    // Perform web search to get general information
    const webResults = await performWebSearch(query, 3);

    // Search UAE government services for specific information
    const govServices = await searchUAEGovServices(query, { language });

    // Combine the results
    let content = "";

    // Add web search results if available
    if (webResults) {
      content += webResults;
    }

    // Add government service results if available
    if (govServices && govServices.length > 0) {
      content +=
        "\n\nI found the following government services that might be relevant:\n\n";

      govServices.slice(0, 3).forEach((result, index) => {
        const service = result.service;
        content += `**${service.title}**\n`;
        content += `${service.description}\n`;
        content += `Authority: ${service.authority}\n`;
        content += `More info: ${service.url}\n\n`;
      });

      if (govServices.length > 3) {
        content += `There are ${govServices.length - 3} more services available. Would you like to see more?\n\n`;
      }
    }

    // If no results were found, provide a fallback response
    if (!content) {
      content =
        language === "en"
          ? "I couldn't find specific information about that. Could you please provide more details or try a different search term?"
          : "لم أتمكن من العثور على معلومات محددة حول ذلك. هل يمكنك تقديم المزيد من التفاصيل أو تجربة مصطلح بحث مختلف؟";
    }

    // Generate quick replies based on the query and results
    const quickReplies = generateQuickReplies(query, govServices, language);

    return {
      content,
      metadata: {
        source: "Web Search & UAE Government Services",
        lastUpdated: new Date().toISOString().split("T")[0],
        confidenceLevel:
          govServices && govServices.length > 0 ? "high" : "medium",
        quickReplies,
      },
    };
  } catch (error) {
    console.error("Error in web search:", error);

    // Return a fallback response in case of error
    return {
      content:
        language === "en"
          ? "I'm sorry, I encountered an error while searching for information. Please try again later."
          : "آسف، واجهت خطأ أثناء البحث عن المعلومات. يرجى المحاولة مرة أخرى لاحقًا.",
      metadata: {
        confidenceLevel: "low",
        quickReplies: [
          {
            id: "try-again",
            text: language === "en" ? "Try Again" : "حاول مرة أخرى",
          },
          { id: "help", text: language === "en" ? "Help" : "مساعدة" },
        ],
      },
    };
  }
}

/**
 * Generate quick replies based on the query and search results
 * @param query The original search query
 * @param results The search results
 * @param language The language (en/ar)
 * @returns Array of quick replies
 */
function generateQuickReplies(
  query: string,
  results: any[] = [],
  language: "en" | "ar" = "en",
): Array<{ id: string; text: string }> {
  const quickReplies: Array<{ id: string; text: string }> = [];

  // Add quick replies based on search results
  if (results && results.length > 0) {
    // Add service-specific quick replies
    const topService = results[0].service;

    if (topService.category === "visa") {
      quickReplies.push({
        id: `visa-requirements`,
        text: language === "en" ? "Visa Requirements" : "متطلبات التأشيرة",
      });
      quickReplies.push({
        id: `visa-fees`,
        text: language === "en" ? "Visa Fees" : "رسوم التأشيرة",
      });
    } else if (topService.category === "identity") {
      quickReplies.push({
        id: `id-renewal`,
        text: language === "en" ? "ID Renewal Process" : "عملية تجديد الهوية",
      });
      quickReplies.push({
        id: `id-documents`,
        text: language === "en" ? "Required Documents" : "المستندات المطلوبة",
      });
    } else if (topService.category === "business") {
      quickReplies.push({
        id: `business-setup`,
        text:
          language === "en" ? "Business Setup Steps" : "خطوات إنشاء الأعمال",
      });
      quickReplies.push({
        id: `license-fees`,
        text: language === "en" ? "License Fees" : "رسوم الترخيص",
      });
    }

    // Add a quick reply for more results if available
    if (results.length > 3) {
      quickReplies.push({
        id: "more-results",
        text: language === "en" ? "Show More Results" : "عرض المزيد من النتائج",
      });
    }
  }

  // Add generic quick replies if we don't have enough
  if (quickReplies.length < 3) {
    quickReplies.push({
      id: "more-info",
      text: language === "en" ? "More Information" : "مزيد من المعلومات",
    });

    // Add a refined search suggestion
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery.includes("visa") || lowercaseQuery.includes("تأشيرة")) {
      quickReplies.push({
        id: "tourist-visa",
        text: language === "en" ? "Tourist Visa" : "تأشيرة سياحية",
      });
    } else if (
      lowercaseQuery.includes("id") ||
      lowercaseQuery.includes("هوية")
    ) {
      quickReplies.push({
        id: "emirates-id",
        text: language === "en" ? "Emirates ID" : "الهوية الإماراتية",
      });
    } else if (
      lowercaseQuery.includes("business") ||
      lowercaseQuery.includes("أعمال")
    ) {
      quickReplies.push({
        id: "business-license",
        text: language === "en" ? "Business License" : "رخصة تجارية",
      });
    }
  }

  // Always add a feedback option
  quickReplies.push({
    id: "feedback",
    text: language === "en" ? "Provide Feedback" : "تقديم ملاحظات",
  });

  // Limit to 4 quick replies
  return quickReplies.slice(0, 4);
}
