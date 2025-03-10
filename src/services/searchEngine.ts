/**
 * Search Engine Service for UAE Government Services
 * Implements advanced search capabilities with NLP integration
 */

import { GovernmentService } from "../types/services";

// Search result interface
export interface SearchResult {
  service: GovernmentService;
  relevanceScore: number;
  matchedFields: string[];
}

// Search options interface
export interface SearchOptions {
  language?: "en" | "ar";
  category?: string;
  maxResults?: number;
  includeExpired?: boolean;
  sortBy?: "relevance" | "date" | "authority";
}

/**
 * Main search engine class for UAE government services
 */
export class UAEGovSearchEngine {
  private services: GovernmentService[] = [];
  private indexedData: Map<string, Set<string>> = new Map();
  private invertedIndex: Map<string, Set<string>> = new Map();
  private entityIndex: Map<string, Set<string>> = new Map();

  /**
   * Initialize the search engine with government services
   * @param services Array of government services to index
   */
  constructor(services: GovernmentService[] = []) {
    this.services = services;
    this.buildIndices();
  }

  /**
   * Add a service to the search engine
   * @param service The government service to add
   */
  addService(service: GovernmentService): void {
    this.services.push(service);
    this.indexService(service);
  }

  /**
   * Update a service in the search engine
   * @param service The government service to update
   */
  updateService(service: GovernmentService): void {
    const index = this.services.findIndex((s) => s.id === service.id);
    if (index !== -1) {
      this.services[index] = service;
      this.buildIndices(); // Rebuild indices for simplicity
    }
  }

  /**
   * Remove a service from the search engine
   * @param serviceId The ID of the service to remove
   */
  removeService(serviceId: string): void {
    this.services = this.services.filter((s) => s.id !== serviceId);
    this.buildIndices(); // Rebuild indices for simplicity
  }

  /**
   * Search for government services
   * @param query The search query
   * @param options Search options
   * @returns Array of search results
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const {
      language = "en",
      category,
      maxResults = 10,
      includeExpired = false,
      sortBy = "relevance",
    } = options;

    // Normalize and tokenize the query
    const normalizedQuery = this.normalizeText(query);
    const queryTokens = this.tokenizeText(normalizedQuery);

    // Expand query with synonyms and related terms
    const expandedTokens = this.expandQuery(queryTokens, language);

    // Get service IDs that match the query tokens
    const matchedServiceIds = new Set<string>();
    expandedTokens.forEach((token) => {
      const serviceIds = this.invertedIndex.get(token);
      if (serviceIds) {
        serviceIds.forEach((id) => matchedServiceIds.add(id));
      }
    });

    // Filter services by category if specified
    let filteredServices = this.services.filter(
      (service) =>
        matchedServiceIds.has(service.id) &&
        service.language === language &&
        (includeExpired || service.status !== "expired") &&
        (!category || service.category === category),
    );

    // Calculate relevance scores
    const results: SearchResult[] = filteredServices.map((service) => {
      const relevanceScore = this.calculateRelevanceScore(
        service,
        expandedTokens,
      );
      const matchedFields = this.getMatchedFields(service, expandedTokens);

      return {
        service,
        relevanceScore,
        matchedFields,
      };
    });

    // Sort results based on the specified criteria
    this.sortResults(results, sortBy);

    // Return limited results
    return results.slice(0, maxResults);
  }

  /**
   * Build search indices for all services
   */
  private buildIndices(): void {
    // Clear existing indices
    this.indexedData.clear();
    this.invertedIndex.clear();
    this.entityIndex.clear();

    // Index each service
    this.services.forEach((service) => this.indexService(service));
  }

  /**
   * Index a single service
   * @param service The service to index
   */
  private indexService(service: GovernmentService): void {
    // Create a document with all searchable text from the service
    const document = this.createSearchableDocument(service);

    // Store the document in the indexed data
    this.indexedData.set(service.id, new Set(document));

    // Update the inverted index
    document.forEach((token) => {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Set());
      }
      this.invertedIndex.get(token)?.add(service.id);
    });

    // Index entities (authorities, categories, etc.)
    this.indexEntities(service);
  }

  /**
   * Create a searchable document from a service
   * @param service The service to create a document from
   * @returns Array of tokens representing the document
   */
  private createSearchableDocument(service: GovernmentService): string[] {
    // Combine all searchable fields
    const searchableText = [
      service.title,
      service.description,
      service.authority,
      service.category,
      service.subcategory,
      ...(service.eligibility || []),
      ...(service.requiredDocuments || []),
      ...(service.steps || []),
    ]
      .filter(Boolean)
      .join(" ");

    // Normalize and tokenize the text
    const normalizedText = this.normalizeText(searchableText);
    return this.tokenizeText(normalizedText);
  }

  /**
   * Index entities from a service
   * @param service The service to index entities from
   */
  private indexEntities(service: GovernmentService): void {
    // Index authority
    this.addToEntityIndex("authority", service.authority, service.id);

    // Index category
    this.addToEntityIndex("category", service.category, service.id);

    // Index subcategory
    if (service.subcategory) {
      this.addToEntityIndex("subcategory", service.subcategory, service.id);
    }

    // Index document types
    if (service.requiredDocuments) {
      service.requiredDocuments.forEach((doc) => {
        this.addToEntityIndex("document", doc, service.id);
      });
    }
  }

  /**
   * Add an entity to the entity index
   * @param entityType The type of entity
   * @param entityValue The value of the entity
   * @param serviceId The ID of the service
   */
  private addToEntityIndex(
    entityType: string,
    entityValue: string,
    serviceId: string,
  ): void {
    const key = `${entityType}:${this.normalizeText(entityValue)}`;

    if (!this.entityIndex.has(key)) {
      this.entityIndex.set(key, new Set());
    }

    this.entityIndex.get(key)?.add(serviceId);
  }

  /**
   * Normalize text for indexing and searching
   * @param text The text to normalize
   * @returns Normalized text
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[\u0621-\u064A\u0660-\u0669 a-zA-Z0-9]+/g, (match) => match) // Keep Arabic and English alphanumeric
      .replace(/[^\u0621-\u064A\u0660-\u0669 a-zA-Z0-9]/g, " ") // Replace other characters with space
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  }

  /**
   * Tokenize text into words
   * @param text The text to tokenize
   * @returns Array of tokens
   */
  private tokenizeText(text: string): string[] {
    return text.split(" ").filter((token) => token.length > 1);
  }

  /**
   * Expand query with synonyms and related terms
   * @param tokens The query tokens to expand
   * @param language The language of the query
   * @returns Expanded array of tokens
   */
  private expandQuery(tokens: string[], language: "en" | "ar"): string[] {
    const expandedTokens = new Set<string>(tokens);

    // Add synonyms and related terms based on the UAE government domain
    tokens.forEach((token) => {
      const synonyms = this.getSynonyms(token, language);
      synonyms.forEach((synonym) => expandedTokens.add(synonym));
    });

    return Array.from(expandedTokens);
  }

  /**
   * Get synonyms for a token
   * @param token The token to get synonyms for
   * @param language The language of the token
   * @returns Array of synonyms
   */
  private getSynonyms(token: string, language: "en" | "ar"): string[] {
    // In a real implementation, this would use a synonym dictionary or API
    // For demonstration purposes, we'll return some common UAE government service synonyms

    const synonymMap: Record<string, string[]> = {
      // English synonyms
      visa: ["permit", "entry", "residence"],
      id: ["identity", "emirates id", "identification"],
      license: ["permit", "authorization", "certificate"],
      business: ["company", "trade", "commercial"],
      traffic: ["vehicle", "car", "driving"],

      // Arabic synonyms (transliterated for simplicity)
      تأشيرة: ["إقامة", "دخول", "زيارة"],
      هوية: ["بطاقة", "إماراتية", "شخصية"],
      رخصة: ["تصريح", "إذن", "شهادة"],
      أعمال: ["شركة", "تجارة", "مؤسسة"],
      مرور: ["مركبة", "سيارة", "قيادة"],
    };

    return synonymMap[token] || [];
  }

  /**
   * Calculate relevance score for a service based on query tokens
   * @param service The service to calculate score for
   * @param queryTokens The query tokens
   * @returns Relevance score
   */
  private calculateRelevanceScore(
    service: GovernmentService,
    queryTokens: string[],
  ): number {
    let score = 0;
    const serviceTokens = this.indexedData.get(service.id) || new Set<string>();

    // Calculate token overlap
    queryTokens.forEach((token) => {
      if (serviceTokens.has(token)) {
        // Base score for token match
        score += 1;

        // Boost score for matches in important fields
        if (this.normalizeText(service.title).includes(token)) score += 3;
        if (this.normalizeText(service.description).includes(token)) score += 2;
        if (this.normalizeText(service.category).includes(token)) score += 2;
      }
    });

    // Boost score based on authority level (federal > emirate > municipality)
    if (service.authorityCode) {
      if (service.authorityCode.startsWith("UAE_")) score += 3;
      else if (
        service.authorityCode.startsWith("DXB_") ||
        service.authorityCode.startsWith("AD_")
      )
        score += 2;
      else score += 1;
    }

    // Boost score based on recency
    if (service.lastUpdated) {
      const lastUpdated = new Date(service.lastUpdated);
      const now = new Date();
      const daysSinceUpdate = Math.floor(
        (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceUpdate < 30)
        score += 2; // Updated in the last month
      else if (daysSinceUpdate < 90) score += 1; // Updated in the last 3 months
    }

    return score;
  }

  /**
   * Get fields that matched the query tokens
   * @param service The service to check
   * @param queryTokens The query tokens
   * @returns Array of field names that matched
   */
  private getMatchedFields(
    service: GovernmentService,
    queryTokens: string[],
  ): string[] {
    const matchedFields = new Set<string>();

    queryTokens.forEach((token) => {
      if (this.normalizeText(service.title).includes(token))
        matchedFields.add("title");
      if (this.normalizeText(service.description).includes(token))
        matchedFields.add("description");
      if (this.normalizeText(service.category).includes(token))
        matchedFields.add("category");
      if (
        service.subcategory &&
        this.normalizeText(service.subcategory).includes(token)
      )
        matchedFields.add("subcategory");
      if (this.normalizeText(service.authority).includes(token))
        matchedFields.add("authority");

      // Check eligibility
      if (service.eligibility) {
        for (const item of service.eligibility) {
          if (this.normalizeText(item).includes(token)) {
            matchedFields.add("eligibility");
            break;
          }
        }
      }

      // Check required documents
      if (service.requiredDocuments) {
        for (const item of service.requiredDocuments) {
          if (this.normalizeText(item).includes(token)) {
            matchedFields.add("requiredDocuments");
            break;
          }
        }
      }

      // Check steps
      if (service.steps) {
        for (const item of service.steps) {
          if (this.normalizeText(item).includes(token)) {
            matchedFields.add("steps");
            break;
          }
        }
      }
    });

    return Array.from(matchedFields);
  }

  /**
   * Sort search results based on criteria
   * @param results The results to sort
   * @param sortBy The sorting criteria
   */
  private sortResults(
    results: SearchResult[],
    sortBy: "relevance" | "date" | "authority",
  ): void {
    switch (sortBy) {
      case "relevance":
        // Already sorted by relevance score
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;

      case "date":
        // Sort by last updated date (newest first)
        results.sort((a, b) => {
          const dateA = a.service.lastUpdated
            ? new Date(a.service.lastUpdated).getTime()
            : 0;
          const dateB = b.service.lastUpdated
            ? new Date(b.service.lastUpdated).getTime()
            : 0;
          return dateB - dateA;
        });
        break;

      case "authority":
        // Sort by authority (federal > emirate > municipality)
        results.sort((a, b) => {
          const authorityA = a.service.authorityCode || "";
          const authorityB = b.service.authorityCode || "";

          // Federal authorities first
          if (authorityA.startsWith("UAE_") && !authorityB.startsWith("UAE_"))
            return -1;
          if (!authorityA.startsWith("UAE_") && authorityB.startsWith("UAE_"))
            return 1;

          // Then emirate authorities
          const emirateA =
            authorityA.startsWith("DXB_") || authorityA.startsWith("AD_");
          const emirateB =
            authorityB.startsWith("DXB_") || authorityB.startsWith("AD_");
          if (emirateA && !emirateB) return -1;
          if (!emirateA && emirateB) return 1;

          // Then by relevance score
          return b.relevanceScore - a.relevanceScore;
        });
        break;
    }
  }
}

/**
 * Factory function to create a UAE government search engine
 */
export function createUAEGovSearchEngine(
  services: GovernmentService[] = [],
): UAEGovSearchEngine {
  return new UAEGovSearchEngine(services);
}
