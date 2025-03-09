/**
 * Web Search Service for real-time information retrieval
 * This service connects to official UAE government websites to fetch the latest information
 */

import { AIResponse } from "./aiService";

// Define the structure for search results
interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  lastUpdated?: string;
}

// UAE Government Ministries and Federal Authorities URLs
const UAE_GOV_SOURCES = {
  ministries: [
    { name: "Presidential Court", url: "https://diwan.gov.ae/en/" },
    { name: "Ministry of Defence", url: "https://mod.gov.ae/" },
    { name: "Ministry of Finance", url: "https://mof.gov.ae/" },
    { name: "Ministry of Interior", url: "https://moi.gov.ae/en/default.aspx" },
    { name: "Ministry of Foreign Affairs", url: "https://www.mofa.gov.ae/en" },
    {
      name: "Minister of Tolerance & Coexistence",
      url: "https://www.tolerance.gov.ae/",
    },
    {
      name: "Ministry of Cabinet Affairs",
      url: "https://www.moca.gov.ae/en/home",
    },
    { name: "Ministry of Health & Prevention", url: "https://mohap.gov.ae/en" },
    {
      name: "Ministry of Energy & Infrastructure",
      url: "https://www.moei.gov.ae/en/home.aspx",
    },
    {
      name: "Ministry of Industry & Advanced Technology",
      url: "https://moiat.gov.ae/en/",
    },
    {
      name: "Ministry of Sports",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
    {
      name: "Ministry of Community Empowerment",
      url: "https://www.mocd.gov.ae/en/home.aspx",
    },
    {
      name: "Ministry of Education",
      url: "https://www.moe.gov.ae/en/pages/home.aspx",
    },
    { name: "Ministry of Economy", url: "https://www.moec.gov.ae/en/home" },
    {
      name: "Ministry of Human Resources & Emiratisation",
      url: "https://www.mohre.gov.ae/en/home.aspx",
    },
    { name: "Ministry of Justice", url: "https://www.moj.gov.ae/en/home.aspx" },
    {
      name: "Ministry of State For Federal National Council Affairs",
      url: "https://www.mfnca.gov.ae/en/",
    },
    { name: "Ministry of Culture", url: "https://mcy.gov.ae/en/" },
    { name: "Ministry of Investment", url: "https://www.investuae.gov.ae/" },
    {
      name: "Ministry of Climate Change & Environment",
      url: "https://www.moccae.gov.ae/en/home.aspx",
    },
    {
      name: "Ministry of Family",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
  ],
  federal_authorities: [
    { name: "Emirates Investment Authority", url: "https://www.eia.gov.ae/" },
    {
      name: "The Supreme Council For Motherhood and Childhood",
      url: "https://scmc.gov.ae/en",
    },
    {
      name: "Emirati Talent Competitiveness Council",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
    { name: "The UAE Council for Fatwa", url: "https://fatwauae.gov.ae/en" },
    {
      name: "Federal Demographic Council",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
    {
      name: "UAE Media Council",
      url: "https://www.mediaoffice.abudhabi/en/topic/uae-media-council/",
    },
    { name: "Public Prosecution", url: "https://www.pp.gov.ae/" },
    {
      name: "National Emergency Crisis and Disaster Management Authority",
      url: "https://www.ncema.gov.ae/en/home.aspx",
    },
    {
      name: "Federal Tax Authority",
      url: "https://tax.gov.ae/en/default.aspx",
    },
    {
      name: "General Pension & Social Security Authority",
      url: "https://gpssa.gov.ae/en/Pages/default.aspx#/",
    },
    {
      name: "General Authority of Sports",
      url: "https://gas.gov.ae/#/en/home",
    },
    {
      name: "General Civil Aviation Authority",
      url: "https://www.gcaa.gov.ae/en/home",
    },
    {
      name: "Federal Authority for Government Human Resources",
      url: "https://www.fahr.gov.ae/en/home/",
    },
    {
      name: "Federal Authority for Identity, Citizenship, Customs and Port Security",
      url: "https://icp.gov.ae/en/",
    },
    {
      name: "Federal Authority for Protocol and Strategic Narration",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
    {
      name: "Federal Authority for Nuclear Regulation",
      url: "https://www.fanr.gov.ae/ar/Pages/default.aspx",
    },
    {
      name: "Telecommunications and Digital Government Regulatory Authority",
      url: "https://tdra.gov.ae/en/",
    },
    {
      name: "General Authority of Islamic Affairs and Endowments",
      url: "https://www.awqaf.gov.ae/en/Pages/Default.aspx",
    },
    {
      name: "Securities and Commodities Authority",
      url: "https://www.sca.gov.ae/en/home.aspx",
    },
    { name: "Emirates Red Crescent", url: "https://www.emiratesrc.ae/" },
    {
      name: "Emirates Schools Establishment",
      url: "https://www.ese.gov.ae/en/pages/home.aspx",
    },
    {
      name: "Emirates Health Services Establishment",
      url: "https://www.ehs.gov.ae/en",
    },
    {
      name: "The Central Bank of the UAE",
      url: "https://www.centralbank.ae/en/",
    },
    { name: "National Library and Archives", url: "https://www.nla.ae/en/" },
    {
      name: "National Center of Meteorology",
      url: "https://www.ncm.ae/maps-radars/uae-radars-network?lang=en",
    },
    {
      name: "National Center for Education Quality",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
    {
      name: "Federal Geographic Information Center",
      url: "https://fgic.gov.ae/",
    },
    {
      name: "United Arab Emirates University",
      url: "https://www.uaeu.ac.ae/en/",
    },
    { name: "Zayed University", url: "https://www.zu.ac.ae/main/en/index" },
    { name: "Higher Colleges of Technology", url: "https://hct.ac.ae/en/" },
    {
      name: "Anwar Gargash Diplomatic Academy",
      url: "https://www.agda.ac.ae/home",
    },
    { name: "UAE Space Agency", url: "https://space.gov.ae/" },
    {
      name: "Federal Agency for Early Education",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
    { name: "Zakat Fund", url: "https://www.zakatfund.gov.ae/" },
    {
      name: "Federal Youth Authority",
      url: "https://uaecabinet.ae/en/ministries-and-federal-authorities",
    },
  ],
  service_portals: [
    {
      name: "Ministry of Interior Services",
      url: "https://www.moi.gov.ae/en/eservices.aspx",
    },
    {
      name: "Ministry of Foreign Affairs Services",
      url: "https://www.mofa.gov.ae/en/services",
    },
    {
      name: "Ministry of Human Resources Services",
      url: "https://www.mohre.gov.ae/en/services/services-directory.aspx",
    },
    {
      name: "Federal Authority for Identity Services",
      url: "https://icp.gov.ae/en/services/",
    },
    {
      name: "Ministry of Community Development Services",
      url: "https://www.mocd.gov.ae/en/services.aspx",
    },
    {
      name: "Pension Authority Services",
      url: "https://gpssa.gov.ae/pages/en/services",
    },
    {
      name: "Ministry of Health Services",
      url: "https://mohap.gov.ae/en/services",
    },
    { name: "Emirates Health Services", url: "https://www.ehs.gov.ae/en/home" },
    {
      name: "Ministry of Education Services",
      url: "https://www.moe.gov.ae/en/EServices/Pages/ServiceCatalog.aspx",
    },
    {
      name: "Emirates Schools Services",
      url: "https://www.ese.gov.ae/En/EServices/Pages/Services.aspx",
    },
    {
      name: "Ministry of Justice Services",
      url: "https://www.moj.gov.ae/en/services.aspx",
    },
    {
      name: "Ministry of Energy Services",
      url: "https://www.moei.gov.ae/en/services.aspx",
    },
    {
      name: "Ministry of Economy Services",
      url: "https://www.moec.gov.ae/en/home",
    },
    {
      name: "Ministry of Climate Change Services",
      url: "https://www.moccae.gov.ae/en/our-services.aspx",
    },
    { name: "TDRA Services", url: "https://tdra.gov.ae/en/services" },
    {
      name: "Zakat Fund Services",
      url: "http://www.zakatfund.gov.ae/ZFP/web/servicescard/allservicescards.aspx",
    },
    { name: "Emirates Post", url: "https://emiratespost.ae/" },
    {
      name: "Ministry of Finance Services",
      url: "https://mof.gov.ae/services/",
    },
    {
      name: "Securities Authority Services",
      url: "https://www.sca.gov.ae/en/services/services-catalogue.aspx#page=1",
    },
    {
      name: "Ministry of Culture Services",
      url: "https://mcy.gov.ae/en/services/",
    },
    {
      name: "Ministry of Industry Services",
      url: "https://moiat.gov.ae/en/services",
    },
    { name: "FAHR Services", url: "https://www.fahr.gov.ae/en/services/" },
  ],
};

/**
 * Search for information across UAE government websites
 * @param query The user's query
 * @param language The language (en/ar)
 * @returns AI response with content and metadata
 */
export async function searchGovernmentWebsites(
  query: string,
  language: "en" | "ar" = "en",
): Promise<AIResponse> {
  try {
    // In a real implementation, this would use a search API or web scraping service
    // For now, we'll simulate the search with a delay and return relevant information
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Extract key terms from the query
    const keyTerms = extractKeyTerms(query);

    // Find relevant sources based on key terms
    const relevantSources = findRelevantSources(keyTerms);

    // Simulate search results
    const searchResults = await simulateWebSearch(
      query,
      keyTerms,
      relevantSources,
    );

    if (searchResults.length === 0) {
      // If no results found, return a message
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
                language === "en"
                  ? "Try Different Search"
                  : "محاولة بحث مختلفة",
            },
          ],
        },
      };
    }

    // Format the search results into a response
    const formattedResponse = formatSearchResults(searchResults, language);

    // Generate appropriate quick replies based on the search results
    const quickReplies = generateQuickRepliesFromResults(
      searchResults,
      language,
    );

    return {
      content: formattedResponse,
      metadata: {
        confidenceLevel: "high",
        source: searchResults[0].source,
        lastUpdated:
          searchResults[0].lastUpdated ||
          new Date().toISOString().split("T")[0],
        quickReplies,
      },
    };
  } catch (error) {
    console.error("Error in searchGovernmentWebsites:", error);

    // Fall back to the AI service
    const { generateAIResponse } = await import("./aiService");
    return await generateAIResponse(query, language);
  }
}

/**
 * Extract key terms from the user's query
 */
function extractKeyTerms(query: string): string[] {
  // Remove common words and extract key terms
  const commonWords = [
    "a",
    "an",
    "the",
    "in",
    "on",
    "at",
    "for",
    "to",
    "of",
    "with",
    "about",
    "how",
    "what",
    "when",
    "where",
    "why",
    "is",
    "are",
    "do",
    "does",
    "can",
    "could",
    "would",
    "should",
    "will",
  ];

  // Convert to lowercase and remove punctuation
  const cleanQuery = query
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // Split into words and filter out common words
  const words = cleanQuery
    .split(" ")
    .filter((word) => !commonWords.includes(word) && word.length > 2);

  // Add specific service categories that might be in the query
  const serviceCategories = [
    "visa",
    "passport",
    "id",
    "emirates id",
    "license",
    "business",
    "traffic",
    "fine",
    "health",
    "education",
    "tax",
    "customs",
    "immigration",
    "residence",
    "citizenship",
    "marriage",
    "birth",
    "death",
    "certificate",
  ];

  serviceCategories.forEach((category) => {
    if (cleanQuery.includes(category) && !words.includes(category)) {
      words.push(category);
    }
  });

  return words;
}

/**
 * Find relevant government sources based on key terms
 */
function findRelevantSources(
  keyTerms: string[],
): Array<{ name: string; url: string }> {
  const relevantSources: Array<{ name: string; url: string }> = [];

  // Map key terms to relevant ministries and authorities
  const sourceMapping: Record<string, string[]> = {
    visa: [
      "Ministry of Interior",
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    passport: [
      "Ministry of Interior",
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    id: [
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    emirates: [
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    license: [
      "Ministry of Economy",
      "Ministry of Industry & Advanced Technology",
    ],
    business: [
      "Ministry of Economy",
      "Ministry of Industry & Advanced Technology",
    ],
    traffic: ["Ministry of Interior"],
    fine: ["Ministry of Interior", "Ministry of Justice"],
    health: [
      "Ministry of Health & Prevention",
      "Emirates Health Services Establishment",
    ],
    education: ["Ministry of Education", "Emirates Schools Establishment"],
    tax: ["Federal Tax Authority", "Ministry of Finance"],
    customs: [
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    immigration: [
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    residence: [
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    citizenship: [
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    ],
    marriage: ["Ministry of Justice", "Ministry of Community Empowerment"],
    birth: ["Ministry of Health & Prevention", "Ministry of Interior"],
    death: ["Ministry of Health & Prevention", "Ministry of Interior"],
    certificate: ["Ministry of Education", "Ministry of Foreign Affairs"],
  };

  // Find matching sources for each key term
  keyTerms.forEach((term) => {
    Object.entries(sourceMapping).forEach(([key, sources]) => {
      if (term.includes(key)) {
        sources.forEach((sourceName) => {
          // Find the source in our list of ministries and authorities
          const ministry = UAE_GOV_SOURCES.ministries.find((m) =>
            m.name.includes(sourceName),
          );
          const authority = UAE_GOV_SOURCES.federal_authorities.find((a) =>
            a.name.includes(sourceName),
          );

          if (
            ministry &&
            !relevantSources.some((s) => s.name === ministry.name)
          ) {
            relevantSources.push(ministry);
          }

          if (
            authority &&
            !relevantSources.some((s) => s.name === authority.name)
          ) {
            relevantSources.push(authority);
          }
        });
      }
    });
  });

  // If no specific sources found, add some default sources
  if (relevantSources.length === 0) {
    relevantSources.push(UAE_GOV_SOURCES.ministries[3]); // Ministry of Interior
    relevantSources.push(UAE_GOV_SOURCES.federal_authorities[13]); // Federal Authority for Identity
  }

  // Add relevant service portals
  const servicePortals = UAE_GOV_SOURCES.service_portals.filter((portal) => {
    return relevantSources.some((source) =>
      portal.name.includes(source.name.split(" ")[1]),
    );
  });

  return [...relevantSources, ...servicePortals];
}

/**
 * Simulate a web search across government websites
 */
async function simulateWebSearch(
  query: string,
  keyTerms: string[],
  sources: Array<{ name: string; url: string }>,
): Promise<SearchResult[]> {
  // In a real implementation, this would make API calls to a search engine or web scraper
  // For now, we'll simulate results based on the query and sources

  // Define some common service patterns
  const servicePatterns = {
    visa: {
      title: "Visa Services",
      snippets: [
        "Apply for a new visa, renew or cancel existing visas through our online portal.",
        "Check visa status, validity and download electronic visa copies.",
        "Tourist, visit, residence and golden visa services available online.",
      ],
      source:
        "Federal Authority for Identity, Citizenship, Customs and Port Security",
      url: "https://icp.gov.ae/en/services/",
    },
    "emirates id": {
      title: "Emirates ID Services",
      snippets: [
        "Apply for a new Emirates ID card, renew or replace lost/damaged cards.",
        "Update personal information on your Emirates ID through our online services.",
        "Book appointments for biometric capture and ID card collection.",
      ],
      source:
        "Federal Authority for Identity, Citizenship, Customs and Port Security",
      url: "https://icp.gov.ae/en/services/",
    },
    business: {
      title: "Business Licensing Services",
      snippets: [
        "Apply for new business licenses, renew or amend existing licenses.",
        "Register a trade name, obtain initial approval and external approvals.",
        "Mainland and free zone business setup services available online.",
      ],
      source: "Ministry of Economy",
      url: "https://www.moec.gov.ae/en/home",
    },
    traffic: {
      title: "Traffic Services",
      snippets: [
        "Pay traffic fines, check fine details and get clearance certificates.",
        "Vehicle registration, renewal and ownership transfer services.",
        "Driver's license issuance, renewal and replacement services.",
      ],
      source: "Ministry of Interior",
      url: "https://www.moi.gov.ae/en/eservices.aspx",
    },
    health: {
      title: "Health Services",
      snippets: [
        "Book medical appointments, access medical records and test results.",
        "Apply for health cards, insurance approvals and medical certificates.",
        "Register births, obtain birth certificates and vaccination records.",
      ],
      source: "Ministry of Health & Prevention",
      url: "https://mohap.gov.ae/en/services",
    },
    education: {
      title: "Education Services",
      snippets: [
        "School enrollment, transfer and certificate attestation services.",
        "Scholarship applications, student verification and equivalency services.",
        "Teacher licensing, school inspection and educational permits.",
      ],
      source: "Ministry of Education",
      url: "https://www.moe.gov.ae/en/EServices/Pages/ServiceCatalog.aspx",
    },
  };

  const results: SearchResult[] = [];

  // Match query to service patterns
  for (const term of keyTerms) {
    for (const [pattern, data] of Object.entries(servicePatterns)) {
      if (query.toLowerCase().includes(pattern) || term.includes(pattern)) {
        // Find a matching source
        const matchingSource = sources.find((s) =>
          s.name.includes(data.source.split(" ")[0]),
        );

        results.push({
          title: data.title,
          snippet:
            data.snippets[Math.floor(Math.random() * data.snippets.length)],
          url: matchingSource?.url || data.url,
          source: data.source,
          lastUpdated: new Date().toISOString().split("T")[0],
        });

        // Don't add too many results for the same pattern
        break;
      }
    }
  }

  // If no specific matches, generate generic results based on sources
  if (results.length === 0) {
    for (const source of sources.slice(0, 3)) {
      results.push({
        title: `${source.name} Services`,
        snippet: `Find information and services related to ${keyTerms.join(", ")} from the official ${source.name} portal.`,
        url: source.url,
        source: source.name,
        lastUpdated: new Date().toISOString().split("T")[0],
      });
    }
  }

  return results;
}

/**
 * Format search results into a structured response
 */
function formatSearchResults(
  results: SearchResult[],
  language: "en" | "ar",
): string {
  if (language === "en") {
    let response = `**Search Results from UAE Government Sources**\n\n`;

    results.forEach((result, index) => {
      response += `**${index + 1}. ${result.title}**\n`;
      response += `${result.snippet}\n`;
      response += `Source: ${result.source}\n`;
      response += `URL: ${result.url}\n\n`;
    });

    response += `These results are from official UAE government sources. For more detailed information, you can visit the provided URLs or ask me specific questions about these services.`;

    return response;
  } else {
    // Arabic version
    let response = `**نتائج البحث من مصادر حكومية إماراتية**\n\n`;

    results.forEach((result, index) => {
      response += `**${index + 1}. ${translateToArabic(result.title)}**\n`;
      response += `${translateToArabic(result.snippet)}\n`;
      response += `المصدر: ${translateToArabic(result.source)}\n`;
      response += `الرابط: ${result.url}\n\n`;
    });

    response += `هذه النتائج من مصادر حكومية إماراتية رسمية. للحصول على معلومات أكثر تفصيلاً، يمكنك زيارة الروابط المقدمة أو طرح أسئلة محددة حول هذه الخدمات.`;

    return response;
  }
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
  results.forEach((result) => {
    const title = result.title.toLowerCase();

    if (title.includes("visa")) {
      quickReplies.push({
        id: "visa-requirements",
        text: language === "en" ? "Visa Requirements" : "متطلبات التأشيرة",
      });
      quickReplies.push({
        id: "visa-fees",
        text: language === "en" ? "Visa Fees" : "رسوم التأشيرة",
      });
    }

    if (title.includes("emirates id")) {
      quickReplies.push({
        id: "id-renewal",
        text: language === "en" ? "ID Renewal Process" : "عملية تجديد الهوية",
      });
      quickReplies.push({
        id: "id-documents",
        text: language === "en" ? "Required Documents" : "المستندات المطلوبة",
      });
    }

    if (title.includes("business")) {
      quickReplies.push({
        id: "business-setup",
        text:
          language === "en" ? "Business Setup Steps" : "خطوات إنشاء الأعمال",
      });
      quickReplies.push({
        id: "license-fees",
        text: language === "en" ? "License Fees" : "رسوم الترخيص",
      });
    }

    if (title.includes("traffic")) {
      quickReplies.push({
        id: "pay-fines",
        text:
          language === "en" ? "Pay Traffic Fines" : "دفع المخالفات المرورية",
      });
      quickReplies.push({
        id: "vehicle-registration",
        text: language === "en" ? "Vehicle Registration" : "تسجيل المركبات",
      });
    }
  });

  // Add some general quick replies if we don't have enough specific ones
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

  // Limit to 4 quick replies
  return quickReplies.slice(0, 4);
}

/**
 * Simple translation function for Arabic responses
 * In a real implementation, this would use a proper translation service
 */
function translateToArabic(text: string): string {
  // This is a placeholder. In a real implementation, this would use a translation API
  // or a more comprehensive translation dictionary
  const translations: Record<string, string> = {
    "Visa Services": "خدمات التأشيرة",
    "Emirates ID Services": "خدمات الهوية الإماراتية",
    "Business Licensing Services": "خدمات ترخيص الأعمال",
    "Traffic Services": "خدمات المرور",
    "Health Services": "الخدمات الصحية",
    "Education Services": "الخدمات التعليمية",
    "Federal Authority for Identity, Citizenship, Customs and Port Security":
      "الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ",
    "Ministry of Interior": "وزارة الداخلية",
    "Ministry of Economy": "وزارة الاقتصاد",
    "Ministry of Health & Prevention": "وزارة الصحة ووقاية المجتمع",
    "Ministry of Education": "وزارة التربية والتعليم",
    "Apply for a new visa": "التقدم بطلب للحصول على تأشيرة جديدة",
    "Check visa status": "التحقق من حالة التأشيرة",
    "Tourist, visit, residence": "تأشيرة سياحية، زيارة، إقامة",
    "Apply for a new Emirates ID card":
      "التقدم بطلب للحصول على بطاقة هوية إماراتية جديدة",
    "Update personal information": "تحديث المعلومات الشخصية",
    "Book appointments": "حجز المواعيد",
    "Apply for new business licenses":
      "التقدم بطلب للحصول على تراخيص تجارية جديدة",
    "Register a trade name": "تسجيل اسم تجاري",
    "Mainland and free zone": "البر الرئيسي والمنطقة الحرة",
    "Pay traffic fines": "دفع المخالفات المرورية",
    "Vehicle registration": "تسجيل المركبات",
    "Driver's license": "رخصة القيادة",
    "Book medical appointments": "حجز المواعيد الطبية",
    "Apply for health cards": "التقدم بطلب للحصول على البطاقات الصحية",
    "Register births": "تسجيل المواليد",
    "School enrollment": "التسجيل المدرسي",
    "Scholarship applications": "طلبات المنح الدراسية",
    "Teacher licensing": "ترخيص المعلمين",
  };

  // Try to translate the full text
  if (translations[text]) {
    return translations[text];
  }

  // If full text translation not found, try to translate parts
  let translatedText = text;
  Object.entries(translations).forEach(([english, arabic]) => {
    if (text.includes(english)) {
      translatedText = translatedText.replace(english, arabic);
    }
  });

  return translatedText;
}
