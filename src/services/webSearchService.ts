/**
 * Web Search Service for UAE Government Information
 * This service searches across UAE government websites for information in real-time
 */

import { AIResponse } from "./aiService";
import { searchGovernmentServices } from "./uaeGovServices";

// Define the search result type
interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  lastUpdated?: string;
  relevance?: number;
}

// UAE Government sources for API calls
const UAE_GOV_SOURCES = {
  ministries:
    process.env.UAE_MINISTRIES_API || "https://api.u.ae/api/ministries",
  authorities:
    process.env.UAE_AUTHORITIES_API || "https://api.u.ae/api/authorities",
  services: process.env.UAE_SERVICES_API || "https://api.u.ae/api/services",
};

// This function is now deprecated in favor of searchGovernmentServices in uaeGovServices.ts
// Keeping it for backward compatibility
export async function searchGovernmentWebsites(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  try {
    // Forward the request to the new implementation
    return await searchGovernmentServices(query, language);
  } catch (error) {
    console.error("Error in searchGovernmentWebsites:", error);

    // Fall back to the AI service
    const { generateAIResponse } = await import("./aiService");
    return await generateAIResponse(query, language);
  }
}

/**
 * Search UAE government websites using a real search API
 * @param query The search query
 * @param language The language (en/ar)
 * @returns Promise with search results
 */
async function searchWebsites(
  query: string,
  language: "en" | "ar",
): Promise<SearchResult[]> {
  try {
    // In a real implementation, this would use a search API like Google Custom Search API
    // or a specialized UAE government search API

    // Example API call (commented out as it's just an example)
    /*
    const searchApiKey = process.env.SEARCH_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID;
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${searchApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&lr=lang_${language}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Search API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the search results to our format
    const results: SearchResult[] = data.items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
      source: item.displayLink,
      lastUpdated: new Date().toISOString().split('T')[0] // Most search APIs don't provide last updated date
    }));
    
    return results;
    */

    // For now, return an empty array
    // In a production environment, this would return actual search results
    return [];
  } catch (error) {
    console.error("Error in searchWebsites:", error);
    return [];
  }
}

/**
 * Format search results into a user-friendly response
 */
function formatSearchResults(
  results: SearchResult[],
  language: "en" | "ar",
): string {
  if (results.length === 0) {
    return language === "en"
      ? "I couldn't find specific information about that from official UAE government sources. Would you like me to provide general information instead?"
      : "لم أتمكن من العثور على معلومات محددة حول ذلك من مصادر حكومية رسمية في الإمارات. هل ترغب في الحصول على معلومات عامة بدلاً من ذلك؟";
  }

  let response = "";

  if (language === "en") {
    response = "**Information from UAE Government Sources:**\n\n";

    // Add the top 3 most relevant results
    const topResults = results.slice(0, 3);
    topResults.forEach((result, index) => {
      response += `**${index + 1}. ${result.title}**\n`;
      response += `${result.snippet}\n`;
      response += `*Source: ${result.source}*\n`;
      response += `[Official Link](${result.url})\n\n`;
    });

    // Add a note if there are more results
    if (results.length > 3) {
      response += `*Found ${results.length} relevant results. I've shown the most relevant ones.*\n\n`;
    }

    response +=
      "Would you like more specific information about any of these services?";
  } else {
    // Arabic version
    response = "**معلومات من مصادر حكومية في الإمارات:**\n\n";

    // Add the top 3 most relevant results
    const topResults = results.slice(0, 3);
    topResults.forEach((result, index) => {
      response += `**${index + 1}. ${result.title}**\n`;
      response += `${result.snippet}\n`;
      response += `*المصدر: ${result.source}*\n`;
      response += `[الرابط الرسمي](${result.url})\n\n`;
    });

    // Add a note if there are more results
    if (results.length > 3) {
      response += `*تم العثور على ${results.length} نتيجة ذات صلة. لقد عرضت النتائج الأكثر صلة.*\n\n`;
    }

    response +=
      "هل ترغب في الحصول على معلومات أكثر تحديدًا حول أي من هذه الخدمات؟";
  }

  return response;
}

/**
 * Generate quick replies based on search results
 */
function generateQuickRepliesFromResults(
  results: SearchResult[],
  language: "en" | "ar",
): Array<{ id: string; text: string }> {
  const quickReplies: Array<{ id: string; text: string }> = [];

  // Add quick replies based on the search results
  results.slice(0, 2).forEach((result, index) => {
    const title = result.title.toLowerCase();
    const id = `result-${index}`;

    quickReplies.push({
      id,
      text:
        language === "en"
          ? `More about ${result.title.substring(0, 20)}...`
          : `المزيد عن ${result.title.substring(0, 20)}...`,
    });
  });

  // Add some general quick replies
  quickReplies.push({
    id: "more-results",
    text: language === "en" ? "Show More Results" : "عرض المزيد من النتائج",
  });

  quickReplies.push({
    id: "feedback",
    text: language === "en" ? "Provide Feedback" : "تقديم ملاحظات",
  });

  // Limit to 4 quick replies
  return quickReplies.slice(0, 4);
}
