/**
 * Search Orchestrator Service for UAE Government Services
 * Coordinates web scraping, NLP processing, and search functionality
 */

import { GovernmentService } from "../types/services";
import { createUAEGovScraper, UAEGovScraper } from "./webScraper";
import { createUAEGovNLPProcessor, UAEGovNLPProcessor } from "./nlpProcessor";
import {
  createUAEGovSearchEngine,
  UAEGovSearchEngine,
  SearchResult,
  SearchOptions,
} from "./searchEngine";

// Search orchestrator configuration
interface OrchestratorConfig {
  cacheEnabled: boolean;
  cacheTTL: number; // in milliseconds
  maxConcurrentRequests: number;
  defaultLanguage: "en" | "ar";
  logLevel: "debug" | "info" | "warn" | "error";
}

// Default configuration
const defaultConfig: OrchestratorConfig = {
  cacheEnabled: true,
  cacheTTL: 900000, // 15 minutes
  maxConcurrentRequests: 5,
  defaultLanguage: "en",
  logLevel: "info",
};

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Main search orchestrator class for UAE government services
 */
export class UAEGovSearchOrchestrator {
  private config: OrchestratorConfig;
  private scraper: UAEGovScraper;
  private nlpProcessor: UAEGovNLPProcessor;
  private searchEngine: UAEGovSearchEngine;
  private cache: Map<string, CacheEntry<any>>;
  private activeRequests: number = 0;
  private requestQueue: Array<() => Promise<void>> = [];

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.scraper = createUAEGovScraper();
    this.nlpProcessor = createUAEGovNLPProcessor();
    this.searchEngine = createUAEGovSearchEngine();
    this.cache = new Map();
  }

  /**
   * Initialize the orchestrator with government services
   * @param services Array of government services to index
   */
  initialize(services: GovernmentService[] = []): void {
    this.log("info", "Initializing search orchestrator");

    // Add services to the search engine
    services.forEach((service) => {
      this.searchEngine.addService(service);
    });

    this.log(
      "info",
      `Search orchestrator initialized with ${services.length} services`,
    );
  }

  /**
   * Search for government services
   * @param query The search query
   * @param options Search options
   * @returns Promise with search results
   */
  async search(
    query: string,
    options: SearchOptions = {},
  ): Promise<SearchResult[]> {
    const language = options.language || this.config.defaultLanguage;
    const cacheKey = `search:${language}:${query}:${JSON.stringify(options)}`;

    // Check cache first if enabled
    if (this.config.cacheEnabled) {
      const cachedResults = this.getFromCache<SearchResult[]>(cacheKey);
      if (cachedResults) {
        this.log("debug", `Cache hit for query: ${query}`);
        return cachedResults;
      }
    }

    this.log("info", `Searching for: ${query} (${language})`);

    try {
      // Process the query with NLP
      const entityResult = this.nlpProcessor.extractEntities(query, language);

      // Classify the query
      const classification = this.nlpProcessor.classifyText(query, language);

      this.log(
        "debug",
        `Query classified as: ${classification.category} (${classification.confidence})`,
      );

      // Enhance search options with classification results
      const enhancedOptions: SearchOptions = {
        ...options,
        language,
        category:
          classification.confidence > 0.7 ? classification.category : undefined,
      };

      // Perform the search
      const results = this.searchEngine.search(
        entityResult.expandedQuery,
        enhancedOptions,
      );

      // Cache the results if enabled
      if (this.config.cacheEnabled) {
        this.addToCache(cacheKey, results);
      }

      this.log("info", `Found ${results.length} results for query: ${query}`);
      return results;
    } catch (error) {
      this.log("error", `Error searching for query: ${query}`, error);
      throw error;
    }
  }

  /**
   * Scrape and index a UAE government service website
   * @param url The URL to scrape
   * @param isDynamic Whether the content is dynamically rendered
   * @returns Promise with the extracted service
   */
  async scrapeAndIndexWebsite(
    url: string,
    isDynamic = false,
  ): Promise<GovernmentService> {
    const cacheKey = `scrape:${url}:${isDynamic}`;

    // Check cache first if enabled
    if (this.config.cacheEnabled) {
      const cachedService = this.getFromCache<GovernmentService>(cacheKey);
      if (cachedService) {
        this.log("debug", `Cache hit for URL: ${url}`);
        return cachedService;
      }
    }

    // Queue the request if we're at the concurrency limit
    if (this.activeRequests >= this.config.maxConcurrentRequests) {
      await new Promise<void>((resolve) => {
        this.requestQueue.push(async () => {
          resolve();
        });
      });
    }

    try {
      this.activeRequests++;
      this.log("info", `Scraping website: ${url} (dynamic: ${isDynamic})`);

      // Check if we can scrape this URL according to robots.txt
      const canScrape = await this.scraper.canScrape(url);
      if (!canScrape) {
        this.log(
          "warn",
          `Cannot scrape URL due to robots.txt restrictions: ${url}`,
        );
        throw new Error(
          `Cannot scrape URL due to robots.txt restrictions: ${url}`,
        );
      }

      // Scrape the website
      const html = await this.scraper.scrapeWebsite(url, isDynamic);

      // Extract service information
      const partialService = this.scraper.extractServiceInfo(html, url);

      // Create a complete service object
      const service: GovernmentService = {
        id: partialService.id || `service-${Date.now()}`,
        title: partialService.title || "Unknown Service",
        description: partialService.description || "",
        authority: partialService.authority || "Unknown Authority",
        authorityCode: partialService.authorityCode || "",
        category: partialService.category || "general",
        subcategory: partialService.subcategory,
        eligibility: partialService.eligibility,
        requiredDocuments: partialService.requiredDocuments,
        fees: partialService.fees,
        processingTime: partialService.processingTime,
        steps: partialService.steps,
        url: url,
        contactInfo: partialService.contactInfo,
        lastUpdated:
          partialService.lastUpdated || new Date().toISOString().split("T")[0],
        language: partialService.language || "en",
      };

      // Add the service to the search engine
      this.searchEngine.addService(service);

      // Cache the service if enabled
      if (this.config.cacheEnabled) {
        this.addToCache(cacheKey, service);
      }

      this.log(
        "info",
        `Successfully scraped and indexed service: ${service.title}`,
      );
      return service;
    } catch (error) {
      this.log("error", `Error scraping website: ${url}`, error);
      throw error;
    } finally {
      this.activeRequests--;

      // Process the next request in the queue
      if (this.requestQueue.length > 0) {
        const nextRequest = this.requestQueue.shift();
        if (nextRequest) nextRequest();
      }
    }
  }

  /**
   * Process a batch of URLs for scraping and indexing
   * @param urls Array of URLs to process
   * @param options Options for batch processing
   * @returns Promise with the processed services
   */
  async processBatch(
    urls: Array<{ url: string; isDynamic?: boolean }>,
    options: { concurrency?: number; timeout?: number } = {},
  ): Promise<GovernmentService[]> {
    const concurrency =
      options.concurrency || this.config.maxConcurrentRequests;
    const timeout = options.timeout || 60000; // 1 minute default timeout

    this.log(
      "info",
      `Processing batch of ${urls.length} URLs with concurrency ${concurrency}`,
    );

    // Process URLs in batches respecting the concurrency limit
    const results: GovernmentService[] = [];
    const batches = [];

    for (let i = 0; i < urls.length; i += concurrency) {
      batches.push(urls.slice(i, i + concurrency));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(({ url, isDynamic = false }) => {
        return Promise.race([
          this.scrapeAndIndexWebsite(url, isDynamic).catch((error) => {
            this.log("warn", `Error processing URL ${url}:`, error);
            return null;
          }),
          new Promise<null>((resolve) =>
            setTimeout(() => {
              this.log("warn", `Timeout processing URL: ${url}`);
              resolve(null);
            }, timeout),
          ),
        ]);
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...(batchResults.filter(Boolean) as GovernmentService[]));
    }

    this.log(
      "info",
      `Batch processing complete. Successfully processed ${results.length} out of ${urls.length} URLs`,
    );
    return results;
  }

  /**
   * Clear the cache
   * @param prefix Optional prefix to clear only specific cache entries
   */
  clearCache(prefix?: string): void {
    if (prefix) {
      // Clear only entries with the specified prefix
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(prefix)) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach((key) => this.cache.delete(key));
      this.log(
        "info",
        `Cleared ${keysToDelete.length} cache entries with prefix: ${prefix}`,
      );
    } else {
      // Clear all cache entries
      const count = this.cache.size;
      this.cache.clear();
      this.log("info", `Cleared all ${count} cache entries`);
    }
  }

  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or null if not found or expired
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.config.cacheTTL) {
      // Entry has expired
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Add a value to the cache
   * @param key The cache key
   * @param value The value to cache
   */
  private addToCache<T>(key: string, value: T): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  /**
   * Log a message with the specified level
   * @param level The log level
   * @param message The message to log
   * @param error Optional error object
   */
  private log(
    level: "debug" | "info" | "warn" | "error",
    message: string,
    error?: any,
  ): void {
    // Only log if the level is at or above the configured level
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level] >= levels[this.config.logLevel]) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

      switch (level) {
        case "debug":
          console.debug(logMessage);
          break;
        case "info":
          console.info(logMessage);
          break;
        case "warn":
          console.warn(logMessage);
          break;
        case "error":
          console.error(logMessage, error || "");
          break;
      }
    }
  }
}

/**
 * Factory function to create a UAE government search orchestrator
 */
export function createUAEGovSearchOrchestrator(
  config?: Partial<OrchestratorConfig>,
): UAEGovSearchOrchestrator {
  return new UAEGovSearchOrchestrator(config);
}
