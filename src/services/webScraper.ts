/**
 * Web Scraper Service for UAE Government Services
 * Implements a dual-approach system for static and dynamic content
 */

import { GovernmentService } from "../types/services";

// Configuration for web scraping
interface ScraperConfig {
  userAgents: string[];
  proxyServers: string[];
  requestDelay: number;
  maxRetries: number;
  timeout: number;
}

// Default configuration
const defaultConfig: ScraperConfig = {
  userAgents: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  ],
  proxyServers: [
    // In a real implementation, these would be actual proxy servers
    "proxy1.uae-region.example.com:8080",
    "proxy2.uae-region.example.com:8080",
    "proxy3.uae-region.example.com:8080",
  ],
  requestDelay: 2000, // 2 seconds initial delay
  maxRetries: 3,
  timeout: 30000, // 30 seconds
};

/**
 * Main web scraper class for UAE government services
 */
export class UAEGovScraper {
  private config: ScraperConfig;
  private currentUserAgentIndex = 0;
  private currentProxyIndex = 0;
  private lastRequestTime = 0;

  constructor(config: Partial<ScraperConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Scrape a UAE government service website
   * @param url The URL to scrape
   * @param isDynamic Whether the content is dynamically rendered
   * @returns Promise with the scraped content
   */
  async scrapeWebsite(url: string, isDynamic = false): Promise<string> {
    // Implement rate limiting
    await this.applyRateLimit();

    // Get the next user agent and proxy
    const userAgent = this.getNextUserAgent();
    const proxy = this.getNextProxy();

    try {
      if (isDynamic) {
        return await this.scrapeDynamicContent(url, userAgent, proxy);
      } else {
        return await this.scrapeStaticContent(url, userAgent, proxy);
      }
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);

      // Implement retry logic
      if ((error as any).status === 429) {
        // Too many requests, increase delay and retry
        this.config.requestDelay *= 2;
        console.log(
          `Rate limit hit, increasing delay to ${this.config.requestDelay}ms`,
        );
      }

      throw error;
    }
  }

  /**
   * Scrape static HTML content
   * @param url The URL to scrape
   * @param userAgent The user agent to use
   * @param proxy The proxy server to use
   * @returns Promise with the scraped content
   */
  private async scrapeStaticContent(
    url: string,
    userAgent: string,
    proxy: string,
  ): Promise<string> {
    // In a real implementation, this would use fetch or axios with the provided user agent and proxy
    // For demonstration purposes, we'll simulate a successful response
    console.log(
      `Scraping static content from ${url} with user agent ${userAgent} and proxy ${proxy}`,
    );

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock HTML content
    return `<html><body><h1>UAE Government Service</h1><div class="service-info">Service information would be here</div></body></html>`;
  }

  /**
   * Scrape dynamic JavaScript-rendered content
   * @param url The URL to scrape
   * @param userAgent The user agent to use
   * @param proxy The proxy server to use
   * @returns Promise with the scraped content
   */
  private async scrapeDynamicContent(
    url: string,
    userAgent: string,
    proxy: string,
  ): Promise<string> {
    // In a real implementation, this would use Playwright or Puppeteer
    // For demonstration purposes, we'll simulate a successful response
    console.log(
      `Scraping dynamic content from ${url} with user agent ${userAgent} and proxy ${proxy}`,
    );

    // Simulate browser automation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return mock HTML content that would be rendered by JavaScript
    return `<html><body><h1>UAE Government Service</h1><div id="dynamic-content" class="service-info">Dynamically loaded service information would be here</div></body></html>`;
  }

  /**
   * Apply rate limiting between requests
   */
  private async applyRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.config.requestDelay) {
      const delayNeeded = this.config.requestDelay - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delayNeeded));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Get the next user agent in rotation
   */
  private getNextUserAgent(): string {
    const userAgent = this.config.userAgents[this.currentUserAgentIndex];
    this.currentUserAgentIndex =
      (this.currentUserAgentIndex + 1) % this.config.userAgents.length;
    return userAgent;
  }

  /**
   * Get the next proxy server in rotation
   */
  private getNextProxy(): string {
    const proxy = this.config.proxyServers[this.currentProxyIndex];
    this.currentProxyIndex =
      (this.currentProxyIndex + 1) % this.config.proxyServers.length;
    return proxy;
  }

  /**
   * Extract service information from HTML content
   * @param html The HTML content to parse
   * @param source The source website
   * @returns Extracted government service information
   */
  extractServiceInfo(html: string, source: string): Partial<GovernmentService> {
    // In a real implementation, this would use cheerio or similar to parse the HTML
    // For demonstration purposes, we'll return mock data
    return {
      id: `service-${Date.now()}`,
      title: "Sample UAE Government Service",
      description: "This is a sample service extracted from the website.",
      authority: "Federal Authority for Identity and Citizenship",
      authorityCode: "ICP",
      category: "visa",
      subcategory: "tourist",
      eligibility: ["UAE residents", "Visitors with valid visa"],
      requiredDocuments: ["Emirates ID", "Passport"],
      fees: [
        {
          amount: 100,
          currency: "AED",
          description: "Application fee",
        },
      ],
      processingTime: "3-5 working days",
      steps: ["Submit application online", "Pay fees", "Receive service"],
      url: source,
      lastUpdated: new Date().toISOString().split("T")[0],
      language: "en",
    };
  }

  /**
   * Check if a website respects robots.txt
   * @param url The URL to check
   * @returns Whether the URL can be scraped according to robots.txt
   */
  async canScrape(url: string): Promise<boolean> {
    // In a real implementation, this would fetch and parse robots.txt
    // For demonstration purposes, we'll assume all URLs are allowed
    return true;
  }
}

/**
 * Factory function to create a UAE government scraper
 */
export function createUAEGovScraper(
  config?: Partial<ScraperConfig>,
): UAEGovScraper {
  return new UAEGovScraper(config);
}
