/**
 * NLP Processor Service for UAE Government Services
 * Implements text processing, entity extraction, and classification
 */

// Entity types for government services
export type EntityType =
  | "SERVICE_TYPE"
  | "DOCUMENT_TYPE"
  | "LOCATION"
  | "PERSON_TYPE"
  | "TIME_PERIOD"
  | "FEE_TYPE"
  | "MINISTRY"
  | "AUTHORITY"
  | "EMIRATE"
  | "NATIONALITY";

// Recognized entity interface
export interface RecognizedEntity {
  text: string;
  type: EntityType;
  confidence: number;
  normalizedValue?: string;
  startPosition?: number;
  endPosition?: number;
}

// Entity recognition result interface
export interface EntityRecognitionResult {
  entities: RecognizedEntity[];
  intents: Array<{ intent: string; confidence: number }>;
  expandedQuery: string;
  originalQuery: string;
}

// Classification result interface
export interface ClassificationResult {
  category: string;
  confidence: number;
  subcategories?: Array<{ name: string; confidence: number }>;
}

/**
 * Main NLP processor class for UAE government services
 */
export class UAEGovNLPProcessor {
  private stopwords: Set<string>;
  private arabicStopwords: Set<string>;

  constructor() {
    // Initialize English stopwords
    this.stopwords = new Set([
      "a",
      "an",
      "the",
      "and",
      "or",
      "but",
      "if",
      "because",
      "as",
      "what",
      "which",
      "this",
      "that",
      "these",
      "those",
      "then",
      "just",
      "so",
      "than",
      "such",
      "both",
      "through",
      "about",
      "for",
      "is",
      "of",
      "while",
      "during",
      "to",
      "from",
      "in",
      "out",
      "on",
      "off",
      "over",
      "under",
      "again",
      "further",
      "then",
      "once",
      "here",
      "there",
      "when",
      "where",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "s",
      "t",
      "can",
      "will",
      "just",
      "don",
      "should",
      "now",
    ]);

    // Initialize Arabic stopwords
    this.arabicStopwords = new Set([
      "من",
      "إلى",
      "في",
      "على",
      "و",
      "ثم",
      "أو",
      "أم",
      "إن",
      "لم",
      "لن",
      "هو",
      "هي",
      "هم",
      "هن",
      "أنت",
      "أنتم",
      "أنتن",
      "أنا",
      "نحن",
      "هذا",
      "هذه",
      "ذلك",
      "تلك",
      "هؤلاء",
      "هناك",
      "هنالك",
      "الذي",
      "التي",
      "الذين",
      "اللواتي",
      "ما",
      "ماذا",
      "متى",
      "أين",
      "كيف",
      "لماذا",
      "لا",
      "كل",
      "بعض",
      "غير",
      "عن",
      "مع",
      "قد",
      "كان",
      "كانت",
      "كانوا",
      "يكون",
      "تكون",
      "سوف",
      "سوى",
    ]);
  }

  /**
   * Process text for NLP tasks
   * @param text The text to process
   * @param language The language of the text
   * @returns Processed text tokens
   */
  processText(text: string, language: "en" | "ar" = "en"): string[] {
    // Normalize text
    const normalizedText = this.normalizeText(text, language);

    // Tokenize text
    const tokens = this.tokenizeText(normalizedText, language);

    // Remove stopwords
    const filteredTokens = this.removeStopwords(tokens, language);

    // Apply stemming/lemmatization
    const stemmedTokens = this.applyStemming(filteredTokens, language);

    return stemmedTokens;
  }

  /**
   * Normalize text for NLP processing
   * @param text The text to normalize
   * @param language The language of the text
   * @returns Normalized text
   */
  normalizeText(text: string, language: "en" | "ar" = "en"): string {
    let normalized = text.toLowerCase();

    if (language === "en") {
      // English normalization
      normalized = normalized
        .replace(/[^a-z0-9\s]/g, " ") // Replace non-alphanumeric with space
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim();
    } else {
      // Arabic normalization
      normalized = normalized
        .replace(/[^\u0621-\u064A\u0660-\u0669\s]/g, " ") // Replace non-Arabic with space
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim();

      // Normalize Arabic characters
      normalized = normalized
        .replace(/[ىيﻱﻲﻳﻴ]/g, "ي") // Normalize Ya
        .replace(/[ةﺓﺔ]/g, "ة") // Normalize Ta Marbuta
        .replace(/[أإآﺃﺄﺇﺈﺁﺂ]/g, "ا") // Normalize Alef
        .replace(/[ﻩﻫﻬ]/g, "ه") // Normalize Ha
        .replace(/[ﻙﻚﻛﻜ]/g, "ك") // Normalize Kaf
        .replace(/[ﻭﻮ]/g, "و"); // Normalize Waw
    }

    return normalized;
  }

  /**
   * Tokenize text into words
   * @param text The text to tokenize
   * @param language The language of the text
   * @returns Array of tokens
   */
  tokenizeText(text: string, language: "en" | "ar" = "en"): string[] {
    return text.split(" ").filter((token) => token.length > 0);
  }

  /**
   * Remove stopwords from tokens
   * @param tokens The tokens to filter
   * @param language The language of the tokens
   * @returns Filtered tokens
   */
  removeStopwords(tokens: string[], language: "en" | "ar" = "en"): string[] {
    const stopwordSet =
      language === "en" ? this.stopwords : this.arabicStopwords;
    return tokens.filter((token) => !stopwordSet.has(token));
  }

  /**
   * Apply stemming/lemmatization to tokens
   * @param tokens The tokens to stem
   * @param language The language of the tokens
   * @returns Stemmed tokens
   */
  applyStemming(tokens: string[], language: "en" | "ar" = "en"): string[] {
    // In a real implementation, this would use a proper stemming/lemmatization library
    // For demonstration purposes, we'll implement a simple stemming algorithm

    if (language === "en") {
      // Simple English stemming
      return tokens.map((token) => {
        // Remove common suffixes
        if (token.endsWith("ing")) return token.slice(0, -3);
        if (token.endsWith("ed")) return token.slice(0, -2);
        if (token.endsWith("s") && token.length > 3) return token.slice(0, -1);
        if (token.endsWith("es") && token.length > 4) return token.slice(0, -2);
        if (token.endsWith("ies") && token.length > 4)
          return token.slice(0, -3) + "y";
        return token;
      });
    } else {
      // Simple Arabic stemming (very basic)
      return tokens.map((token) => {
        // Remove common prefixes and suffixes
        if (token.startsWith("ال") && token.length > 3) return token.slice(2);
        if (token.endsWith("ون") && token.length > 4) return token.slice(0, -2);
        if (token.endsWith("ات") && token.length > 4) return token.slice(0, -2);
        if (token.endsWith("ين") && token.length > 4) return token.slice(0, -2);
        return token;
      });
    }
  }

  /**
   * Extract entities from text
   * @param text The text to extract entities from
   * @param language The language of the text
   * @returns Entity recognition result
   */
  extractEntities(
    text: string,
    language: "en" | "ar" = "en",
  ): EntityRecognitionResult {
    const normalizedText = this.normalizeText(text, language);
    const entities: RecognizedEntity[] = [];
    const intents: Array<{ intent: string; confidence: number }> = [];

    // Extract service types
    this.extractServiceTypes(normalizedText, entities, language);

    // Extract document types
    this.extractDocumentTypes(normalizedText, entities, language);

    // Extract locations
    this.extractLocations(normalizedText, entities, language);

    // Extract authorities
    this.extractAuthorities(normalizedText, entities, language);

    // Determine intents
    this.determineIntents(normalizedText, entities, intents, language);

    // Expand query with synonyms
    const expandedQuery = this.expandQuery(normalizedText, language);

    return {
      entities,
      intents,
      expandedQuery,
      originalQuery: text,
    };
  }

  /**
   * Extract service types from text
   * @param text The text to extract from
   * @param entities The entities array to add to
   * @param language The language of the text
   */
  private extractServiceTypes(
    text: string,
    entities: RecognizedEntity[],
    language: "en" | "ar" = "en",
  ): void {
    const serviceTypes =
      language === "en"
        ? [
            { text: "visa", confidence: 0.9 },
            { text: "passport", confidence: 0.9 },
            { text: "emirates id", confidence: 0.9 },
            { text: "driving license", confidence: 0.9 },
            { text: "business license", confidence: 0.9 },
            { text: "marriage certificate", confidence: 0.9 },
            { text: "birth certificate", confidence: 0.9 },
            { text: "death certificate", confidence: 0.9 },
            { text: "vehicle registration", confidence: 0.9 },
            { text: "traffic fine", confidence: 0.9 },
            { text: "golden visa", confidence: 0.95 },
            { text: "residence visa", confidence: 0.9 },
            { text: "tourist visa", confidence: 0.9 },
            { text: "visit visa", confidence: 0.9 },
            { text: "work permit", confidence: 0.9 },
          ]
        : [
            { text: "تأشيرة", confidence: 0.9 },
            { text: "جواز سفر", confidence: 0.9 },
            { text: "هوية إماراتية", confidence: 0.9 },
            { text: "رخصة قيادة", confidence: 0.9 },
            { text: "رخصة تجارية", confidence: 0.9 },
            { text: "شهادة زواج", confidence: 0.9 },
            { text: "شهادة ميلاد", confidence: 0.9 },
            { text: "شهادة وفاة", confidence: 0.9 },
            { text: "تسجيل مركبة", confidence: 0.9 },
            { text: "مخالفة مرورية", confidence: 0.9 },
            { text: "التأشيرة الذهبية", confidence: 0.95 },
            { text: "تأشيرة إقامة", confidence: 0.9 },
            { text: "تأشيرة سياحية", confidence: 0.9 },
            { text: "تأشيرة زيارة", confidence: 0.9 },
            { text: "تصريح عمل", confidence: 0.9 },
          ];

    for (const serviceType of serviceTypes) {
      if (text.includes(serviceType.text)) {
        entities.push({
          text: serviceType.text,
          type: "SERVICE_TYPE",
          confidence: serviceType.confidence,
          normalizedValue: serviceType.text,
          startPosition: text.indexOf(serviceType.text),
          endPosition: text.indexOf(serviceType.text) + serviceType.text.length,
        });
      }
    }
  }

  /**
   * Extract document types from text
   * @param text The text to extract from
   * @param entities The entities array to add to
   * @param language The language of the text
   */
  private extractDocumentTypes(
    text: string,
    entities: RecognizedEntity[],
    language: "en" | "ar" = "en",
  ): void {
    const documentTypes =
      language === "en"
        ? [
            { text: "passport", confidence: 0.9 },
            { text: "emirates id", confidence: 0.9 },
            { text: "driving license", confidence: 0.9 },
            { text: "birth certificate", confidence: 0.9 },
            { text: "death certificate", confidence: 0.9 },
            { text: "marriage certificate", confidence: 0.9 },
            { text: "divorce certificate", confidence: 0.9 },
            { text: "educational certificate", confidence: 0.9 },
            { text: "medical certificate", confidence: 0.9 },
          ]
        : [
            { text: "جواز سفر", confidence: 0.9 },
            { text: "هوية إماراتية", confidence: 0.9 },
            { text: "رخصة قيادة", confidence: 0.9 },
            { text: "شهادة ميلاد", confidence: 0.9 },
            { text: "شهادة وفاة", confidence: 0.9 },
            { text: "شهادة زواج", confidence: 0.9 },
            { text: "شهادة طلاق", confidence: 0.9 },
            { text: "شهادة تعليمية", confidence: 0.9 },
            { text: "شهادة طبية", confidence: 0.9 },
          ];

    for (const docType of documentTypes) {
      if (text.includes(docType.text)) {
        entities.push({
          text: docType.text,
          type: "DOCUMENT_TYPE",
          confidence: docType.confidence,
          normalizedValue: docType.text,
          startPosition: text.indexOf(docType.text),
          endPosition: text.indexOf(docType.text) + docType.text.length,
        });
      }
    }
  }

  /**
   * Extract locations from text
   * @param text The text to extract from
   * @param entities The entities array to add to
   * @param language The language of the text
   */
  private extractLocations(
    text: string,
    entities: RecognizedEntity[],
    language: "en" | "ar" = "en",
  ): void {
    const locations =
      language === "en"
        ? [
            { text: "dubai", confidence: 0.9 },
            { text: "abu dhabi", confidence: 0.9 },
            { text: "sharjah", confidence: 0.9 },
            { text: "ajman", confidence: 0.9 },
            { text: "fujairah", confidence: 0.9 },
            { text: "ras al khaimah", confidence: 0.9 },
            { text: "umm al quwain", confidence: 0.9 },
            { text: "uae", confidence: 0.9 },
            { text: "united arab emirates", confidence: 0.9 },
          ]
        : [
            { text: "دبي", confidence: 0.9 },
            { text: "أبوظبي", confidence: 0.9 },
            { text: "الشارقة", confidence: 0.9 },
            { text: "عجمان", confidence: 0.9 },
            { text: "الفجيرة", confidence: 0.9 },
            { text: "رأس الخيمة", confidence: 0.9 },
            { text: "أم القيوين", confidence: 0.9 },
            { text: "الإمارات", confidence: 0.9 },
            { text: "الإمارات العربية المتحدة", confidence: 0.9 },
          ];

    for (const location of locations) {
      if (text.includes(location.text)) {
        entities.push({
          text: location.text,
          type: "LOCATION",
          confidence: location.confidence,
          normalizedValue: location.text,
          startPosition: text.indexOf(location.text),
          endPosition: text.indexOf(location.text) + location.text.length,
        });
      }
    }
  }

  /**
   * Extract authorities from text
   * @param text The text to extract from
   * @param entities The entities array to add to
   * @param language The language of the text
   */
  private extractAuthorities(
    text: string,
    entities: RecognizedEntity[],
    language: "en" | "ar" = "en",
  ): void {
    const authorities =
      language === "en"
        ? [
            { text: "ministry of interior", confidence: 0.9, type: "MINISTRY" },
            {
              text: "ministry of foreign affairs",
              confidence: 0.9,
              type: "MINISTRY",
            },
            { text: "ministry of finance", confidence: 0.9, type: "MINISTRY" },
            { text: "ministry of economy", confidence: 0.9, type: "MINISTRY" },
            {
              text: "federal authority for identity",
              confidence: 0.9,
              type: "AUTHORITY",
            },
            {
              text: "federal tax authority",
              confidence: 0.9,
              type: "AUTHORITY",
            },
            { text: "dubai police", confidence: 0.9, type: "AUTHORITY" },
            { text: "abu dhabi police", confidence: 0.9, type: "AUTHORITY" },
            {
              text: "roads and transport authority",
              confidence: 0.9,
              type: "AUTHORITY",
            },
          ]
        : [
            { text: "وزارة الداخلية", confidence: 0.9, type: "MINISTRY" },
            { text: "وزارة الخارجية", confidence: 0.9, type: "MINISTRY" },
            { text: "وزارة المالية", confidence: 0.9, type: "MINISTRY" },
            { text: "وزارة الاقتصاد", confidence: 0.9, type: "MINISTRY" },
            {
              text: "الهيئة الاتحادية للهوية",
              confidence: 0.9,
              type: "AUTHORITY",
            },
            {
              text: "الهيئة الاتحادية للضرائب",
              confidence: 0.9,
              type: "AUTHORITY",
            },
            { text: "شرطة دبي", confidence: 0.9, type: "AUTHORITY" },
            { text: "شرطة أبوظبي", confidence: 0.9, type: "AUTHORITY" },
            {
              text: "هيئة الطرق والمواصلات",
              confidence: 0.9,
              type: "AUTHORITY",
            },
          ];

    for (const authority of authorities) {
      if (text.includes(authority.text)) {
        entities.push({
          text: authority.text,
          type: authority.type as EntityType,
          confidence: authority.confidence,
          normalizedValue: authority.text,
          startPosition: text.indexOf(authority.text),
          endPosition: text.indexOf(authority.text) + authority.text.length,
        });
      }
    }
  }

  /**
   * Determine intents from text and entities
   * @param text The text to analyze
   * @param entities The extracted entities
   * @param intents The intents array to add to
   * @param language The language of the text
   */
  private determineIntents(
    text: string,
    entities: RecognizedEntity[],
    intents: Array<{ intent: string; confidence: number }>,
    language: "en" | "ar" = "en",
  ): void {
    // Action-based intents
    const actionIntents =
      language === "en"
        ? [
            { action: "apply", intent: "APPLICATION", confidence: 0.9 },
            { action: "renew", intent: "RENEWAL", confidence: 0.9 },
            { action: "cancel", intent: "CANCELLATION", confidence: 0.9 },
            { action: "check", intent: "STATUS_CHECK", confidence: 0.9 },
            { action: "status", intent: "STATUS_CHECK", confidence: 0.9 },
            { action: "track", intent: "STATUS_CHECK", confidence: 0.9 },
            { action: "pay", intent: "PAYMENT", confidence: 0.9 },
            { action: "fee", intent: "PAYMENT", confidence: 0.9 },
            { action: "cost", intent: "PAYMENT", confidence: 0.9 },
            { action: "price", intent: "PAYMENT", confidence: 0.9 },
            {
              action: "download",
              intent: "DOCUMENT_DOWNLOAD",
              confidence: 0.9,
            },
            { action: "print", intent: "DOCUMENT_DOWNLOAD", confidence: 0.9 },
            { action: "replace", intent: "REPLACEMENT", confidence: 0.9 },
            { action: "lost", intent: "REPLACEMENT", confidence: 0.9 },
            { action: "damaged", intent: "REPLACEMENT", confidence: 0.9 },
          ]
        : [
            { action: "تقديم", intent: "APPLICATION", confidence: 0.9 },
            { action: "تجديد", intent: "RENEWAL", confidence: 0.9 },
            { action: "إلغاء", intent: "CANCELLATION", confidence: 0.9 },
            { action: "تحقق", intent: "STATUS_CHECK", confidence: 0.9 },
            { action: "حالة", intent: "STATUS_CHECK", confidence: 0.9 },
            { action: "تتبع", intent: "STATUS_CHECK", confidence: 0.9 },
            { action: "دفع", intent: "PAYMENT", confidence: 0.9 },
            { action: "رسوم", intent: "PAYMENT", confidence: 0.9 },
            { action: "تكلفة", intent: "PAYMENT", confidence: 0.9 },
            { action: "سعر", intent: "PAYMENT", confidence: 0.9 },
            { action: "تنزيل", intent: "DOCUMENT_DOWNLOAD", confidence: 0.9 },
            { action: "طباعة", intent: "DOCUMENT_DOWNLOAD", confidence: 0.9 },
            { action: "استبدال", intent: "REPLACEMENT", confidence: 0.9 },
            { action: "فقدان", intent: "REPLACEMENT", confidence: 0.9 },
            { action: "تالف", intent: "REPLACEMENT", confidence: 0.9 },
          ];

    for (const actionIntent of actionIntents) {
      if (text.includes(actionIntent.action)) {
        // Check if this intent is already added
        const existingIntent = intents.find(
          (i) => i.intent === actionIntent.intent,
        );
        if (existingIntent) {
          // Update confidence if this one is higher
          if (actionIntent.confidence > existingIntent.confidence) {
            existingIntent.confidence = actionIntent.confidence;
          }
        } else {
          // Add new intent
          intents.push({
            intent: actionIntent.intent,
            confidence: actionIntent.confidence,
          });
        }
      }
    }

    // If no specific intents were found, add a default INFORMATION intent
    if (intents.length === 0) {
      intents.push({
        intent: "INFORMATION",
        confidence: 0.7,
      });
    }
  }

  /**
   * Expand query with synonyms and related terms
   * @param query The query to expand
   * @param language The language of the query
   * @returns Expanded query
   */
  private expandQuery(query: string, language: "en" | "ar" = "en"): string {
    // In a real implementation, this would use a synonym dictionary or API
    // For demonstration purposes, we'll add some common UAE government service synonyms

    let expandedQuery = query;

    const synonymMap =
      language === "en"
        ? {
            visa: ["permit", "entry", "residence"],
            id: ["identity", "emirates id", "identification"],
            license: ["permit", "authorization", "certificate"],
            business: ["company", "trade", "commercial"],
            traffic: ["vehicle", "car", "driving"],
          }
        : {
            تأشيرة: ["إقامة", "دخول", "زيارة"],
            هوية: ["بطاقة", "إماراتية", "شخصية"],
            رخصة: ["تصريح", "إذن", "شهادة"],
            أعمال: ["شركة", "تجارة", "مؤسسة"],
            مرور: ["مركبة", "سيارة", "قيادة"],
          };

    // Add synonyms for terms in the query
    Object.entries(synonymMap).forEach(([term, synonyms]) => {
      if (query.includes(term)) {
        // Already has the main term, no need to expand
        return;
      }

      // Check if any synonym is in the query
      for (const synonym of synonyms) {
        if (query.includes(synonym)) {
          // Add the main term to the expanded query
          expandedQuery = `${expandedQuery} ${term}`;
          break;
        }
      }
    });

    return expandedQuery;
  }

  /**
   * Classify text into service categories
   * @param text The text to classify
   * @param language The language of the text
   * @returns Classification result
   */
  classifyText(
    text: string,
    language: "en" | "ar" = "en",
  ): ClassificationResult {
    const normalizedText = this.normalizeText(text, language);

    // Define categories and their keywords
    const categories =
      language === "en"
        ? {
            visa: [
              "visa",
              "entry",
              "residence",
              "permit",
              "immigration",
              "travel",
              "tourist",
              "visit",
            ],
            identity: [
              "emirates id",
              "identity",
              "identification",
              "personal",
              "biometric",
            ],
            business: [
              "business",
              "company",
              "trade",
              "license",
              "commercial",
              "corporate",
              "entrepreneur",
            ],
            traffic: [
              "traffic",
              "vehicle",
              "car",
              "driving",
              "license",
              "fine",
              "road",
              "transport",
            ],
            health: [
              "health",
              "medical",
              "insurance",
              "hospital",
              "clinic",
              "doctor",
              "treatment",
            ],
            education: [
              "education",
              "school",
              "university",
              "college",
              "student",
              "academic",
              "certificate",
            ],
            property: [
              "property",
              "real estate",
              "land",
              "building",
              "rent",
              "lease",
              "ownership",
            ],
          }
        : {
            visa: [
              "تأشيرة",
              "دخول",
              "إقامة",
              "تصريح",
              "هجرة",
              "سفر",
              "سياحة",
              "زيارة",
            ],
            identity: ["هوية إماراتية", "هوية", "تعريف", "شخصية", "بيومترية"],
            business: [
              "أعمال",
              "شركة",
              "تجارة",
              "رخصة",
              "تجارية",
              "شركات",
              "ريادة أعمال",
            ],
            traffic: [
              "مرور",
              "مركبة",
              "سيارة",
              "قيادة",
              "رخصة",
              "مخالفة",
              "طريق",
              "نقل",
            ],
            health: ["صحة", "طبي", "تأمين", "مستشفى", "عيادة", "طبيب", "علاج"],
            education: [
              "تعليم",
              "مدرسة",
              "جامعة",
              "كلية",
              "طالب",
              "أكاديمي",
              "شهادة",
            ],
            property: [
              "عقار",
              "عقارات",
              "أرض",
              "بناء",
              "إيجار",
              "تأجير",
              "ملكية",
            ],
          };

    // Calculate scores for each category
    const scores: Record<string, number> = {};
    let totalScore = 0;

    Object.entries(categories).forEach(([category, keywords]) => {
      let score = 0;

      keywords.forEach((keyword) => {
        if (normalizedText.includes(keyword)) {
          // Base score for keyword match
          score += 1;

          // Boost score for exact matches or matches at the beginning
          if (normalizedText === keyword) score += 3;
          if (normalizedText.startsWith(keyword + " ")) score += 2;
        }
      });

      scores[category] = score;
      totalScore += score;
    });

    // Find the category with the highest score
    let topCategory = "";
    let topScore = 0;

    Object.entries(scores).forEach(([category, score]) => {
      if (score > topScore) {
        topCategory = category;
        topScore = score;
      }
    });

    // If no category was found, default to "general"
    if (topCategory === "" || topScore === 0) {
      return {
        category: "general",
        confidence: 0.5,
      };
    }

    // Calculate confidence based on the score
    const confidence = Math.min(
      0.5 + (topScore / (totalScore + 1)) * 0.5,
      0.95,
    );

    // Get subcategories for the top category
    const subcategories = this.getSubcategories(
      topCategory,
      normalizedText,
      language,
    );

    return {
      category: topCategory,
      confidence,
      subcategories,
    };
  }

  /**
   * Get subcategories for a category
   * @param category The main category
   * @param text The text to analyze
   * @param language The language of the text
   * @returns Subcategories with confidence scores
   */
  private getSubcategories(
    category: string,
    text: string,
    language: "en" | "ar" = "en",
  ): Array<{ name: string; confidence: number }> {
    // Define subcategories for each main category
    const subcategoryMap =
      language === "en"
        ? {
            visa: [
              {
                name: "tourist",
                keywords: ["tourist", "visit", "short-term", "vacation"],
              },
              {
                name: "residence",
                keywords: ["residence", "long-term", "living", "stay"],
              },
              {
                name: "work",
                keywords: ["work", "employment", "job", "labor"],
              },
              {
                name: "student",
                keywords: ["student", "study", "education", "university"],
              },
              {
                name: "golden",
                keywords: ["golden", "investor", "investment", "talent"],
              },
            ],
            identity: [
              {
                name: "new",
                keywords: ["new", "first time", "application", "apply"],
              },
              {
                name: "renewal",
                keywords: ["renewal", "renew", "extend", "update"],
              },
              {
                name: "replacement",
                keywords: ["replacement", "replace", "lost", "damaged"],
              },
            ],
            business: [
              { name: "mainland", keywords: ["mainland", "local", "onshore"] },
              {
                name: "freezone",
                keywords: ["free zone", "freezone", "offshore"],
              },
              { name: "renewal", keywords: ["renewal", "renew", "extend"] },
              {
                name: "amendment",
                keywords: ["amendment", "change", "modify"],
              },
            ],
            traffic: [
              { name: "license", keywords: ["license", "driving", "driver"] },
              {
                name: "registration",
                keywords: ["registration", "register", "plate"],
              },
              {
                name: "fines",
                keywords: ["fine", "penalty", "violation", "ticket"],
              },
              { name: "inspection", keywords: ["inspection", "test", "check"] },
            ],
          }
        : {
            visa: [
              {
                name: "tourist",
                keywords: ["سياحية", "زيارة", "قصيرة المدى", "عطلة"],
              },
              {
                name: "residence",
                keywords: ["إقامة", "طويلة المدى", "معيشة", "بقاء"],
              },
              { name: "work", keywords: ["عمل", "توظيف", "وظيفة", "عمالة"] },
              {
                name: "student",
                keywords: ["طالب", "دراسة", "تعليم", "جامعة"],
              },
              {
                name: "golden",
                keywords: ["ذهبية", "مستثمر", "استثمار", "موهبة"],
              },
            ],
            identity: [
              { name: "new", keywords: ["جديدة", "أول مرة", "طلب", "تقديم"] },
              { name: "renewal", keywords: ["تجديد", "تمديد", "تحديث"] },
              { name: "replacement", keywords: ["استبدال", "فقدان", "تالف"] },
            ],
            business: [
              { name: "mainland", keywords: ["البر الرئيسي", "محلي", "داخلي"] },
              { name: "freezone", keywords: ["منطقة حرة", "خارجي"] },
              { name: "renewal", keywords: ["تجديد", "تمديد"] },
              { name: "amendment", keywords: ["تعديل", "تغيير"] },
            ],
            traffic: [
              { name: "license", keywords: ["رخصة", "قيادة", "سائق"] },
              { name: "registration", keywords: ["تسجيل", "لوحة"] },
              { name: "fines", keywords: ["مخالفة", "غرامة", "عقوبة"] },
              { name: "inspection", keywords: ["فحص", "اختبار", "تفتيش"] },
            ],
          };

    // Get subcategories for the category
    const subcategories =
      subcategoryMap[category as keyof typeof subcategoryMap];
    if (!subcategories) return [];

    // Calculate confidence for each subcategory
    return subcategories
      .map((subcategory) => {
        let matchCount = 0;

        subcategory.keywords.forEach((keyword) => {
          if (text.includes(keyword)) {
            matchCount++;
          }
        });

        const confidence =
          matchCount > 0
            ? Math.min(
                0.6 + (matchCount / subcategory.keywords.length) * 0.35,
                0.95,
              )
            : 0.3;

        return {
          name: subcategory.name,
          confidence,
        };
      })
      .filter((subcategory) => subcategory.confidence > 0.4);
  }
}

/**
 * Factory function to create a UAE government NLP processor
 */
export function createUAEGovNLPProcessor(): UAEGovNLPProcessor {
  return new UAEGovNLPProcessor();
}
