import responses from "../data/responses.json";

type ServiceCategory = "visa" | "emirates-id" | "business" | "traffic";
type ServiceSubcategory = string;
type ConfidenceLevel = "high" | "medium" | "low";

interface ServiceResponse {
  title: string;
  description: string;
  eligibility: string[];
  documents: string[];
  fees: Record<string, string>;
  processingTime: string | { [key: string]: string };
  steps: string[] | { [key: string]: string[] };
  source: string;
  lastUpdated: string;
  confidenceLevel: ConfidenceLevel;
}

export function findResponse(query: string): {
  response: string;
  metadata?: {
    source?: string;
    lastUpdated?: string;
    confidenceLevel?: ConfidenceLevel;
  };
} {
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase();

  // Check for service categories and subcategories
  let category: ServiceCategory | null = null;
  let subcategory: ServiceSubcategory | null = null;

  // Check for visa-related queries
  if (
    lowercaseQuery.includes("visa") ||
    lowercaseQuery.includes("residence") ||
    lowercaseQuery.includes("tourist") ||
    lowercaseQuery.includes("golden")
  ) {
    category = "visa";
    if (lowercaseQuery.includes("tourist")) subcategory = "tourist";
    else if (lowercaseQuery.includes("residence")) subcategory = "residence";
    else if (lowercaseQuery.includes("golden")) subcategory = "golden";
  }

  // Check for Emirates ID-related queries
  else if (
    lowercaseQuery.includes("id") ||
    lowercaseQuery.includes("emirates id") ||
    lowercaseQuery.includes("identity")
  ) {
    category = "emirates-id";
    if (lowercaseQuery.includes("new") || lowercaseQuery.includes("apply"))
      subcategory = "new";
    else if (lowercaseQuery.includes("renew")) subcategory = "renewal";
    else if (
      lowercaseQuery.includes("replace") ||
      lowercaseQuery.includes("lost") ||
      lowercaseQuery.includes("damage")
    )
      subcategory = "replacement";
  }

  // Check for business-related queries
  else if (
    lowercaseQuery.includes("business") ||
    lowercaseQuery.includes("license") ||
    lowercaseQuery.includes("company") ||
    lowercaseQuery.includes("trade")
  ) {
    category = "business";
    if (lowercaseQuery.includes("mainland")) subcategory = "mainland";
    else if (
      lowercaseQuery.includes("free zone") ||
      lowercaseQuery.includes("freezone")
    )
      subcategory = "freezone";
    else if (lowercaseQuery.includes("renew")) subcategory = "renewal";
  }

  // Check for traffic-related queries
  else if (
    lowercaseQuery.includes("traffic") ||
    lowercaseQuery.includes("driving") ||
    lowercaseQuery.includes("license") ||
    lowercaseQuery.includes("vehicle") ||
    lowercaseQuery.includes("fine") ||
    lowercaseQuery.includes("car")
  ) {
    category = "traffic";
    if (
      lowercaseQuery.includes("fine") ||
      lowercaseQuery.includes("penalty") ||
      lowercaseQuery.includes("violation")
    )
      subcategory = "fines";
    else if (
      lowercaseQuery.includes("register") ||
      lowercaseQuery.includes("vehicle")
    )
      subcategory = "registration";
    else if (
      lowercaseQuery.includes("driving") ||
      lowercaseQuery.includes("license")
    )
      subcategory = "license";
  }

  // If we found a category and subcategory, return the formatted response
  if (category && subcategory && responses[category]?.[subcategory]) {
    const serviceData = responses[category][subcategory] as ServiceResponse;
    return {
      response: formatServiceResponse(serviceData),
      metadata: {
        source: serviceData.source,
        lastUpdated: serviceData.lastUpdated,
        confidenceLevel: serviceData.confidenceLevel,
      },
    };
  }

  // If we found a category but no specific subcategory, provide a general response
  if (category && responses[category]) {
    const subcategories = Object.keys(responses[category]);
    const generalResponse =
      `I can provide information about the following ${category.replace("-", " ")} services:\n\n` +
      subcategories
        .map((sub) => {
          const data = responses[category][sub] as ServiceResponse;
          return `- ${data.title}: ${data.description}`;
        })
        .join("\n");

    return {
      response: generalResponse,
      metadata: {
        confidenceLevel: "medium",
      },
    };
  }

  // Default response if no specific information is found
  return {
    response:
      "I'm here to help with any questions about UAE government services. What specific information are you looking for regarding visas, Emirates ID, business licensing, or traffic services?",
    metadata: {
      confidenceLevel: "low",
    },
  };
}

function formatServiceResponse(data: ServiceResponse): string {
  // Format the response in a structured way
  let response = `**${data.title}**\n\n${data.description}\n\n`;

  // Add eligibility criteria
  response += "**Eligibility Criteria:**\n";
  data.eligibility.forEach((item) => {
    response += `• ${item}\n`;
  });
  response += "\n";

  // Add required documents
  response += "**Required Documents:**\n";
  data.documents.forEach((item) => {
    response += `• ${item}\n`;
  });
  response += "\n";

  // Add fees
  response += "**Fees:**\n";
  Object.entries(data.fees).forEach(([key, value]) => {
    response += `• ${key}: ${value}\n`;
  });
  response += "\n";

  // Add processing time
  response += "**Processing Time:**\n";
  if (typeof data.processingTime === "string") {
    response += `• ${data.processingTime}\n`;
  } else {
    Object.entries(data.processingTime).forEach(([key, value]) => {
      response += `• ${key}: ${value}\n`;
    });
  }
  response += "\n";

  // Add application steps
  response += "**Application Steps:**\n";
  if (Array.isArray(data.steps)) {
    data.steps.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });
  } else {
    Object.entries(data.steps).forEach(([key, steps]) => {
      response += `**${key}:**\n`;
      steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      response += "\n";
    });
  }

  return response;
}

export function getConfidenceBadge(level: ConfidenceLevel): string {
  switch (level) {
    case "high":
      return "🟢 High Confidence";
    case "medium":
      return "🟡 Medium Confidence";
    case "low":
      return "🟠 Low Confidence";
    default:
      return "";
  }
}
