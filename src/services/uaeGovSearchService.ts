/**
 * UAE Government Search Service
 * Main entry point for the web scraping and search solution
 */

import { GovernmentService } from "../types/services";
import {
  createUAEGovSearchOrchestrator,
  UAEGovSearchOrchestrator,
} from "./searchOrchestrator";
import { SearchOptions, SearchResult } from "./searchEngine";

// Singleton instance of the search orchestrator
let orchestratorInstance: UAEGovSearchOrchestrator | null = null;

// Initialize the search service with sample data
const sampleServices: GovernmentService[] = [
  {
    id: "visa-001",
    title: "Tourist Visa Application",
    description:
      "Apply for a short-term tourist visa to visit the UAE for leisure, family visits, or business purposes.",
    authority:
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    authorityCode: "UAE_ICP",
    category: "visa",
    subcategory: "tourist",
    eligibility: [
      "Citizens of non-visa exempt countries",
      "Sponsored by UAE citizens, residents, or hotels",
      "Valid passport with at least 6 months validity",
      "Return ticket to home country",
    ],
    requiredDocuments: [
      "Passport copy (valid for at least 6 months)",
      "Colored photograph with white background",
      "Return ticket",
      "Hotel booking or host's details",
      "Proof of sufficient funds",
    ],
    fees: [
      {
        amount: 300,
        currency: "AED",
        description: "Tourist visa - 30 days single entry",
      },
      {
        amount: 650,
        currency: "AED",
        description: "Tourist visa - 90 days multiple entry",
      },
      { amount: 50, currency: "AED", description: "Service fee" },
    ],
    processingTime: "24-72 hours",
    steps: [
      "Create an account on the ICP website or smart application",
      "Select 'Visa Services' then 'New Tourist Visa'",
      "Fill in the required information and upload documents",
      "Pay the fees",
      "Receive the tourist visa via email",
    ],
    url: "https://icp.gov.ae/en/services/visa-services/",
    contactInfo: {
      phone: "600 522222",
      email: "contactus@icp.gov.ae",
      website: "https://icp.gov.ae",
    },
    lastUpdated: "2023-11-20",
    language: "en",
  },
  {
    id: "id-001",
    title: "Emirates ID Renewal",
    description:
      "Renew your Emirates ID card before expiration to maintain your legal status in the UAE.",
    authority:
      "Federal Authority for Identity, Citizenship, Customs and Port Security",
    authorityCode: "UAE_ICP",
    category: "identity",
    subcategory: "renewal",
    eligibility: ["UAE citizens", "UAE residents with valid residence visas"],
    requiredDocuments: [
      "Original passport",
      "Valid residence visa for expatriates",
      "Colored photograph with white background",
      "Existing Emirates ID card",
    ],
    fees: [
      { amount: 100, currency: "AED", description: "Application fee" },
      {
        amount: 100,
        currency: "AED",
        description: "Card issuance fee (5 years) for citizens",
      },
      {
        amount: 100,
        currency: "AED",
        description: "Card issuance fee (1 year) for residents",
      },
    ],
    processingTime: "3-5 working days",
    steps: [
      "Login to the ICP website or smart application",
      "Select 'Emirates ID Services' then 'Renewal'",
      "Fill in the required information and upload documents",
      "Pay the fees",
      "Visit an ICP service center for biometric capture if required",
      "Receive the Emirates ID card via Emirates Post",
    ],
    url: "https://icp.gov.ae/en/services/emirates-id-services/",
    contactInfo: {
      phone: "600 522222",
      email: "contactus@icp.gov.ae",
      website: "https://icp.gov.ae",
    },
    lastUpdated: "2023-12-01",
    language: "en",
  },
  {
    id: "business-001",
    title: "Business License Application",
    description:
      "Apply for a new business license to establish your company in the UAE mainland.",
    authority: "Ministry of Economy",
    authorityCode: "UAE_MOEC",
    category: "business",
    subcategory: "mainland",
    eligibility: [
      "UAE citizens and GCC nationals",
      "Foreign investors with UAE partners (51% UAE ownership required for most activities)",
      "Companies established in the UAE",
    ],
    requiredDocuments: [
      "Emirates ID of all partners",
      "Passport copies of all partners",
      "No objection certificate from sponsor (for residents)",
      "Tenancy contract (Ejari/Tawtheeq)",
      "Company memorandum of association",
      "Initial approval from relevant authorities",
    ],
    fees: [
      { amount: 600, currency: "AED", description: "Initial approval fee" },
      { amount: 2000, currency: "AED", description: "License issuance fee" },
      {
        amount: 1000,
        currency: "AED",
        description: "Chamber of Commerce membership fee",
      },
    ],
    processingTime: "2-5 working days",
    steps: [
      "Obtain initial approval for the trade name",
      "Prepare and submit the required documents",
      "Pay the initial approval fees",
      "Sign the memorandum of association",
      "Obtain external approvals (if required)",
      "Pay the license issuance fees",
      "Receive the business license",
    ],
    url: "https://www.moec.gov.ae/en/business-licensing",
    contactInfo: {
      phone: "800 665",
      email: "info@moec.gov.ae",
      website: "https://www.moec.gov.ae",
    },
    lastUpdated: "2023-12-10",
    language: "en",
  },
];

/**
 * Initialize the UAE Government Search Service
 */
export function initializeUAEGovSearchService(): void {
  if (!orchestratorInstance) {
    orchestratorInstance = createUAEGovSearchOrchestrator({
      cacheEnabled: true,
      cacheTTL: 900000, // 15 minutes
      maxConcurrentRequests: 5,
      defaultLanguage: "en",
      logLevel: "info",
    });

    // Initialize with sample data
    orchestratorInstance.initialize(sampleServices);

    console.info("UAE Government Search Service initialized");
  }
}

/**
 * Search for UAE government services
 * @param query The search query
 * @param options Search options
 * @returns Promise with search results
 */
export async function searchUAEGovServices(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult[]> {
  // Ensure the service is initialized
  if (!orchestratorInstance) {
    initializeUAEGovSearchService();
  }

  return orchestratorInstance!.search(query, options);
}

/**
 * Scrape and index a UAE government service website
 * @param url The URL to scrape
 * @param isDynamic Whether the content is dynamically rendered
 * @returns Promise with the extracted service
 */
export async function scrapeUAEGovWebsite(
  url: string,
  isDynamic = false,
): Promise<GovernmentService> {
  // Ensure the service is initialized
  if (!orchestratorInstance) {
    initializeUAEGovSearchService();
  }

  return orchestratorInstance!.scrapeAndIndexWebsite(url, isDynamic);
}

/**
 * Process a batch of URLs for scraping and indexing
 * @param urls Array of URLs to process
 * @param options Options for batch processing
 * @returns Promise with the processed services
 */
export async function processBatchOfURLs(
  urls: Array<{ url: string; isDynamic?: boolean }>,
  options: { concurrency?: number; timeout?: number } = {},
): Promise<GovernmentService[]> {
  // Ensure the service is initialized
  if (!orchestratorInstance) {
    initializeUAEGovSearchService();
  }

  return orchestratorInstance!.processBatch(urls, options);
}

/**
 * Clear the search service cache
 * @param prefix Optional prefix to clear only specific cache entries
 */
export function clearSearchCache(prefix?: string): void {
  if (orchestratorInstance) {
    orchestratorInstance.clearCache(prefix);
  }
}

/**
 * Get the search orchestrator instance
 * @returns The search orchestrator instance
 */
export function getSearchOrchestrator(): UAEGovSearchOrchestrator {
  // Ensure the service is initialized
  if (!orchestratorInstance) {
    initializeUAEGovSearchService();
  }

  return orchestratorInstance!;
}
