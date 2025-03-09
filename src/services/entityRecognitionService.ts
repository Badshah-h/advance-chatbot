/**
 * Entity Recognition Service
 * Provides advanced entity extraction and classification for government service queries
 */

// Define entity types for government services
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

export interface RecognizedEntity {
  text: string;
  type: EntityType;
  confidence: number;
  normalizedValue?: string;
  startPosition?: number;
  endPosition?: number;
}

export interface EntityRecognitionResult {
  entities: RecognizedEntity[];
  intents: Array<{ intent: string; confidence: number }>;
  expandedQuery: string;
  originalQuery: string;
}

// Synonym mapping for query expansion
const synonymMap: Record<string, string[]> = {
  // Service types
  visa: [
    "entry permit",
    "residence permit",
    "visit visa",
    "tourist visa",
    "entry permission",
  ],
  passport: ["travel document", "passport renewal", "passport application"],
  "emirates id": [
    "national id",
    "identity card",
    "eid",
    "id card",
    "identification",
  ],
  "driving license": [
    "driver license",
    "driving permit",
    "driver permit",
    "driving licence",
  ],
  "business license": [
    "trade license",
    "commercial license",
    "business permit",
    "commercial registration",
  ],
  marriage: [
    "wedding",
    "matrimony",
    "marriage certificate",
    "marriage registration",
  ],
  "birth certificate": [
    "birth registration",
    "birth document",
    "newborn registration",
  ],
  "death certificate": ["death registration", "death document"],
  "vehicle registration": [
    "car registration",
    "auto registration",
    "vehicle permit",
  ],
  "traffic fine": [
    "traffic violation",
    "traffic penalty",
    "driving fine",
    "road fine",
  ],

  // Ministries and authorities
  "ministry of interior": ["moi", "interior ministry", "police"],
  "ministry of foreign affairs": ["mofa", "foreign ministry", "diplomatic"],
  "federal authority for identity": [
    "identity authority",
    "ica",
    "immigration",
  ],

  // Actions
  renew: ["renewal", "extend", "update"],
  apply: ["application", "request", "submit", "issuance", "issue", "get"],
  cancel: ["cancellation", "terminate", "revoke"],
  modify: ["change", "update", "amend", "edit"],
  "check status": ["track", "status inquiry", "application status"],

  // Locations
  dubai: ["dxb"],
  "abu dhabi": ["abudhabi", "ad", "abu"],
  sharjah: ["shj"],
  ajman: ["ajm"],
  "ras al khaimah": ["rak", "ras alkhaimah"],
  fujairah: ["fuj"],
  "umm al quwain": ["uaq"],
};

/**
 * Extract entities from a user query with advanced recognition
 * @param query The user's query text
 * @returns Recognized entities and intents
 */
export function extractEntities(query: string): EntityRecognitionResult {
  const normalizedQuery = query.toLowerCase();
  const entities: RecognizedEntity[] = [];
  const intents: Array<{ intent: string; confidence: number }> = [];

  // Expanded query for better matching
  let expandedQuery = expandQuery(normalizedQuery);

  // Extract service types
  extractServiceTypes(normalizedQuery, entities);

  // Extract document types
  extractDocumentTypes(normalizedQuery, entities);

  // Extract locations (emirates)
  extractLocations(normalizedQuery, entities);

  // Extract person types
  extractPersonTypes(normalizedQuery, entities);

  // Extract ministries and authorities
  extractOrganizations(normalizedQuery, entities);

  // Extract time periods
  extractTimePeriods(normalizedQuery, entities);

  // Determine intents based on query and entities
  determineIntents(normalizedQuery, entities, intents);

  return {
    entities,
    intents,
    expandedQuery,
    originalQuery: query,
  };
}

/**
 * Expand query with synonyms for better matching
 */
export function expandQuery(query: string): string {
  let expandedQuery = query;

  // Replace terms with their synonyms
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
 * Extract service types from the query
 */
function extractServiceTypes(
  query: string,
  entities: RecognizedEntity[],
): void {
  const serviceTypes = [
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
    { text: "family visa", confidence: 0.9 },
    { text: "student visa", confidence: 0.9 },
    { text: "retirement visa", confidence: 0.9 },
    { text: "investor visa", confidence: 0.9 },
    { text: "property owner visa", confidence: 0.9 },
    { text: "employment visa", confidence: 0.9 },
    { text: "entry permit", confidence: 0.85 },
    { text: "exit permit", confidence: 0.85 },
    { text: "visa extension", confidence: 0.85 },
    { text: "visa cancellation", confidence: 0.85 },
    { text: "visa status", confidence: 0.8 },
    { text: "visa validity", confidence: 0.8 },
    { text: "visa requirements", confidence: 0.8 },
    { text: "visa fees", confidence: 0.8 },
    { text: "visa application", confidence: 0.8 },
    { text: "visa renewal", confidence: 0.85 },
    { text: "id renewal", confidence: 0.85 },
    { text: "id replacement", confidence: 0.85 },
    { text: "id application", confidence: 0.85 },
    { text: "license renewal", confidence: 0.85 },
    { text: "business setup", confidence: 0.85 },
    { text: "company registration", confidence: 0.85 },
    { text: "trade license", confidence: 0.85 },
    { text: "commercial license", confidence: 0.85 },
    { text: "professional license", confidence: 0.85 },
    { text: "industrial license", confidence: 0.85 },
    { text: "health card", confidence: 0.85 },
    { text: "labor card", confidence: 0.85 },
    { text: "establishment card", confidence: 0.85 },
    { text: "certificate attestation", confidence: 0.85 },
    { text: "document attestation", confidence: 0.85 },
    { text: "good conduct certificate", confidence: 0.85 },
    { text: "police clearance", confidence: 0.85 },
    { text: "medical test", confidence: 0.8 },
    { text: "medical certificate", confidence: 0.8 },
    { text: "fitness certificate", confidence: 0.8 },
    { text: "insurance", confidence: 0.7 },
    { text: "health insurance", confidence: 0.85 },
    { text: "car insurance", confidence: 0.85 },
    { text: "vehicle insurance", confidence: 0.85 },
    { text: "property registration", confidence: 0.85 },
    { text: "land registration", confidence: 0.85 },
    { text: "property ownership", confidence: 0.85 },
    { text: "title deed", confidence: 0.85 },
    { text: "ejari", confidence: 0.9 },
    { text: "tenancy contract", confidence: 0.85 },
    { text: "rental agreement", confidence: 0.85 },
    { text: "tawtheeq", confidence: 0.9 },
    { text: "tax registration", confidence: 0.85 },
    { text: "tax certificate", confidence: 0.85 },
    { text: "tax refund", confidence: 0.85 },
    { text: "vat registration", confidence: 0.9 },
    { text: "vat return", confidence: 0.9 },
    { text: "customs clearance", confidence: 0.85 },
    { text: "import permit", confidence: 0.85 },
    { text: "export permit", confidence: 0.85 },
    { text: "port services", confidence: 0.8 },
    { text: "shipping services", confidence: 0.8 },
    { text: "logistics services", confidence: 0.8 },
    { text: "education services", confidence: 0.8 },
    { text: "school registration", confidence: 0.85 },
    { text: "university admission", confidence: 0.85 },
    { text: "scholarship", confidence: 0.85 },
    { text: "student services", confidence: 0.8 },
    { text: "equivalency certificate", confidence: 0.85 },
    { text: "degree attestation", confidence: 0.85 },
    { text: "healthcare services", confidence: 0.8 },
    { text: "hospital services", confidence: 0.8 },
    { text: "clinic services", confidence: 0.8 },
    { text: "vaccination", confidence: 0.85 },
    { text: "covid test", confidence: 0.9 },
    { text: "covid certificate", confidence: 0.9 },
    { text: "al hosn", confidence: 0.9 },
    { text: "judicial services", confidence: 0.8 },
    { text: "legal services", confidence: 0.8 },
    { text: "notary services", confidence: 0.85 },
    { text: "power of attorney", confidence: 0.85 },
    { text: "legal translation", confidence: 0.85 },
    { text: "court services", confidence: 0.8 },
    { text: "case filing", confidence: 0.85 },
    { text: "legal advice", confidence: 0.8 },
    { text: "utility services", confidence: 0.8 },
    { text: "electricity connection", confidence: 0.85 },
    { text: "water connection", confidence: 0.85 },
    { text: "gas connection", confidence: 0.85 },
    { text: "internet connection", confidence: 0.85 },
    { text: "telecom services", confidence: 0.8 },
    { text: "mobile services", confidence: 0.8 },
    { text: "sim card", confidence: 0.85 },
    { text: "postal services", confidence: 0.8 },
    { text: "p.o. box", confidence: 0.85 },
    { text: "courier services", confidence: 0.8 },
    { text: "banking services", confidence: 0.8 },
    { text: "account opening", confidence: 0.85 },
    { text: "loan services", confidence: 0.85 },
    { text: "credit card", confidence: 0.85 },
    { text: "financial services", confidence: 0.8 },
    { text: "investment services", confidence: 0.8 },
    { text: "pension services", confidence: 0.85 },
    { text: "retirement benefits", confidence: 0.85 },
    { text: "social security", confidence: 0.85 },
    { text: "welfare services", confidence: 0.8 },
    { text: "charity registration", confidence: 0.85 },
    { text: "donation permit", confidence: 0.85 },
    { text: "volunteering permit", confidence: 0.85 },
    { text: "environmental services", confidence: 0.8 },
    { text: "waste management", confidence: 0.85 },
    { text: "recycling services", confidence: 0.85 },
    { text: "environmental permit", confidence: 0.85 },
    { text: "agricultural services", confidence: 0.8 },
    { text: "farming permit", confidence: 0.85 },
    { text: "fishing permit", confidence: 0.85 },
    { text: "hunting permit", confidence: 0.85 },
    { text: "animal services", confidence: 0.8 },
    { text: "pet registration", confidence: 0.85 },
    { text: "pet import", confidence: 0.85 },
    { text: "veterinary services", confidence: 0.85 },
    { text: "cultural services", confidence: 0.8 },
    { text: "event permit", confidence: 0.85 },
    { text: "entertainment permit", confidence: 0.85 },
    { text: "filming permit", confidence: 0.85 },
    { text: "tourism services", confidence: 0.8 },
    { text: "hotel license", confidence: 0.85 },
    { text: "tour operator license", confidence: 0.85 },
    { text: "travel agency license", confidence: 0.85 },
    { text: "transportation services", confidence: 0.8 },
    { text: "public transport", confidence: 0.85 },
    { text: "taxi license", confidence: 0.85 },
    { text: "driver permit", confidence: 0.85 },
    { text: "aviation services", confidence: 0.8 },
    { text: "air transport", confidence: 0.85 },
    { text: "airport services", confidence: 0.85 },
    { text: "maritime services", confidence: 0.8 },
    { text: "port services", confidence: 0.85 },
    { text: "shipping services", confidence: 0.85 },
    { text: "boat registration", confidence: 0.85 },
    { text: "marine license", confidence: 0.85 },
    { text: "real estate services", confidence: 0.8 },
    { text: "property services", confidence: 0.8 },
    { text: "construction permit", confidence: 0.85 },
    { text: "building permit", confidence: 0.85 },
    { text: "planning permission", confidence: 0.85 },
    { text: "demolition permit", confidence: 0.85 },
    { text: "renovation permit", confidence: 0.85 },
    { text: "occupancy certificate", confidence: 0.85 },
    { text: "safety certificate", confidence: 0.85 },
    { text: "civil defense approval", confidence: 0.85 },
    { text: "fire safety", confidence: 0.85 },
    { text: "security services", confidence: 0.8 },
    { text: "security guard license", confidence: 0.85 },
    { text: "security company license", confidence: 0.85 },
    { text: "weapons permit", confidence: 0.85 },
    { text: "ammunition permit", confidence: 0.85 },
    { text: "defense services", confidence: 0.8 },
    { text: "military services", confidence: 0.8 },
    { text: "national service", confidence: 0.85 },
    { text: "diplomatic services", confidence: 0.8 },
    { text: "consular services", confidence: 0.8 },
    { text: "embassy services", confidence: 0.8 },
    { text: "apostille", confidence: 0.85 },
    { text: "legalization", confidence: 0.85 },
    { text: "authentication", confidence: 0.85 },
    { text: "citizenship services", confidence: 0.85 },
    { text: "naturalization", confidence: 0.85 },
    { text: "passport renewal", confidence: 0.85 },
    { text: "passport application", confidence: 0.85 },
    { text: "passport replacement", confidence: 0.85 },
    { text: "lost passport", confidence: 0.85 },
    { text: "damaged passport", confidence: 0.85 },
    { text: "emergency passport", confidence: 0.85 },
    { text: "travel document", confidence: 0.85 },
    { text: "emergency travel document", confidence: 0.85 },
    { text: "exit permit", confidence: 0.85 },
    { text: "re-entry permit", confidence: 0.85 },
    { text: "out pass", confidence: 0.85 },
    { text: "immigration services", confidence: 0.8 },
    { text: "residency services", confidence: 0.8 },
    { text: "citizenship application", confidence: 0.85 },
    { text: "nationality services", confidence: 0.8 },
    { text: "identity verification", confidence: 0.85 },
    { text: "biometric services", confidence: 0.85 },
    { text: "fingerprinting", confidence: 0.85 },
    { text: "eye scan", confidence: 0.85 },
    { text: "facial recognition", confidence: 0.85 },
    { text: "digital identity", confidence: 0.85 },
    { text: "uaepass", confidence: 0.9 },
    { text: "digital signature", confidence: 0.85 },
    { text: "electronic services", confidence: 0.8 },
    { text: "smart services", confidence: 0.8 },
    { text: "mobile app services", confidence: 0.8 },
    { text: "online services", confidence: 0.8 },
    { text: "payment services", confidence: 0.8 },
    { text: "fine payment", confidence: 0.85 },
    { text: "fee payment", confidence: 0.85 },
    { text: "service charges", confidence: 0.85 },
    { text: "administrative fees", confidence: 0.85 },
    { text: "processing fees", confidence: 0.85 },
    { text: "application fees", confidence: 0.85 },
    { text: "renewal fees", confidence: 0.85 },
    { text: "cancellation fees", confidence: 0.85 },
    { text: "amendment fees", confidence: 0.85 },
    { text: "replacement fees", confidence: 0.85 },
    { text: "urgent service fees", confidence: 0.85 },
    { text: "express service", confidence: 0.85 },
    { text: "priority service", confidence: 0.85 },
    { text: "vip service", confidence: 0.85 },
    { text: "service centers", confidence: 0.8 },
    { text: "customer happiness centers", confidence: 0.85 },
    { text: "service delivery", confidence: 0.8 },
    { text: "appointment booking", confidence: 0.85 },
    { text: "service tracking", confidence: 0.85 },
    { text: "status inquiry", confidence: 0.85 },
    { text: "complaint services", confidence: 0.8 },
    { text: "feedback services", confidence: 0.8 },
    { text: "suggestion services", confidence: 0.8 },
    { text: "customer support", confidence: 0.8 },
    { text: "help desk", confidence: 0.8 },
    { text: "information services", confidence: 0.8 },
    { text: "advisory services", confidence: 0.8 },
    { text: "consultation services", confidence: 0.8 },
  ];

  for (const serviceType of serviceTypes) {
    if (query.includes(serviceType.text)) {
      entities.push({
        text: serviceType.text,
        type: "SERVICE_TYPE",
        confidence: serviceType.confidence,
        normalizedValue: serviceType.text,
        startPosition: query.indexOf(serviceType.text),
        endPosition: query.indexOf(serviceType.text) + serviceType.text.length,
      });
    } else {
      // Check for synonyms
      const synonyms = synonymMap[serviceType.text] || [];
      for (const synonym of synonyms) {
        if (query.includes(synonym)) {
          entities.push({
            text: synonym,
            type: "SERVICE_TYPE",
            confidence: serviceType.confidence * 0.9, // Slightly lower confidence for synonyms
            normalizedValue: serviceType.text, // Normalize to the main term
            startPosition: query.indexOf(synonym),
            endPosition: query.indexOf(synonym) + synonym.length,
          });
          break; // Only add the first matching synonym
        }
      }
    }
  }
}

/**
 * Extract document types from the query
 */
function extractDocumentTypes(
  query: string,
  entities: RecognizedEntity[],
): void {
  const documentTypes = [
    { text: "passport", confidence: 0.9 },
    { text: "emirates id", confidence: 0.9 },
    { text: "driving license", confidence: 0.9 },
    { text: "birth certificate", confidence: 0.9 },
    { text: "death certificate", confidence: 0.9 },
    { text: "marriage certificate", confidence: 0.9 },
    { text: "divorce certificate", confidence: 0.9 },
    { text: "educational certificate", confidence: 0.9 },
    { text: "medical certificate", confidence: 0.9 },
    { text: "police clearance", confidence: 0.9 },
    { text: "good conduct certificate", confidence: 0.9 },
    { text: "visa", confidence: 0.9 },
    { text: "residence permit", confidence: 0.9 },
    { text: "work permit", confidence: 0.9 },
    { text: "business license", confidence: 0.9 },
    { text: "trade license", confidence: 0.9 },
    { text: "commercial license", confidence: 0.9 },
    { text: "professional license", confidence: 0.9 },
    { text: "industrial license", confidence: 0.9 },
    { text: "vehicle registration", confidence: 0.9 },
    { text: "property deed", confidence: 0.9 },
    { text: "tenancy contract", confidence: 0.9 },
    { text: "ejari", confidence: 0.9 },
    { text: "tawtheeq", confidence: 0.9 },
    { text: "power of attorney", confidence: 0.9 },
    { text: "legal translation", confidence: 0.9 },
    { text: "attestation", confidence: 0.9 },
    { text: "authentication", confidence: 0.9 },
    { text: "legalization", confidence: 0.9 },
    { text: "apostille", confidence: 0.9 },
    { text: "insurance policy", confidence: 0.9 },
    { text: "health insurance", confidence: 0.9 },
    { text: "car insurance", confidence: 0.9 },
    { text: "tax certificate", confidence: 0.9 },
    { text: "vat registration", confidence: 0.9 },
    { text: "customs declaration", confidence: 0.9 },
    { text: "import permit", confidence: 0.9 },
    { text: "export permit", confidence: 0.9 },
    { text: "health card", confidence: 0.9 },
    { text: "labor card", confidence: 0.9 },
    { text: "establishment card", confidence: 0.9 },
    { text: "family book", confidence: 0.9 },
    { text: "khulasat al qaid", confidence: 0.9 },
  ];

  for (const docType of documentTypes) {
    if (query.includes(docType.text)) {
      entities.push({
        text: docType.text,
        type: "DOCUMENT_TYPE",
        confidence: docType.confidence,
        normalizedValue: docType.text,
        startPosition: query.indexOf(docType.text),
        endPosition: query.indexOf(docType.text) + docType.text.length,
      });
    }
  }
}

/**
 * Extract locations (emirates) from the query
 */
function extractLocations(query: string, entities: RecognizedEntity[]): void {
  const locations = [
    { text: "dubai", confidence: 0.9 },
    { text: "abu dhabi", confidence: 0.9 },
    { text: "sharjah", confidence: 0.9 },
    { text: "ajman", confidence: 0.9 },
    { text: "fujairah", confidence: 0.9 },
    { text: "ras al khaimah", confidence: 0.9 },
    { text: "umm al quwain", confidence: 0.9 },
    { text: "uae", confidence: 0.9 },
    { text: "united arab emirates", confidence: 0.9 },
  ];

  for (const location of locations) {
    if (query.includes(location.text)) {
      entities.push({
        text: location.text,
        type: "LOCATION",
        confidence: location.confidence,
        normalizedValue: location.text,
        startPosition: query.indexOf(location.text),
        endPosition: query.indexOf(location.text) + location.text.length,
      });
    } else {
      // Check for synonyms
      const synonyms = synonymMap[location.text] || [];
      for (const synonym of synonyms) {
        if (query.includes(synonym)) {
          entities.push({
            text: synonym,
            type: "LOCATION",
            confidence: location.confidence * 0.9,
            normalizedValue: location.text,
            startPosition: query.indexOf(synonym),
            endPosition: query.indexOf(synonym) + synonym.length,
          });
          break;
        }
      }
    }
  }
}

/**
 * Extract person types from the query
 */
function extractPersonTypes(query: string, entities: RecognizedEntity[]): void {
  const personTypes = [
    { text: "citizen", confidence: 0.9 },
    { text: "resident", confidence: 0.9 },
    { text: "tourist", confidence: 0.9 },
    { text: "visitor", confidence: 0.9 },
    { text: "investor", confidence: 0.9 },
    { text: "businessman", confidence: 0.9 },
    { text: "businesswoman", confidence: 0.9 },
    { text: "entrepreneur", confidence: 0.9 },
    { text: "student", confidence: 0.9 },
    { text: "worker", confidence: 0.9 },
    { text: "employee", confidence: 0.9 },
    { text: "employer", confidence: 0.9 },
    { text: "sponsor", confidence: 0.9 },
    { text: "dependent", confidence: 0.9 },
    { text: "spouse", confidence: 0.9 },
    { text: "child", confidence: 0.9 },
    { text: "parent", confidence: 0.9 },
    { text: "minor", confidence: 0.9 },
    { text: "adult", confidence: 0.9 },
    { text: "senior", confidence: 0.9 },
    { text: "person of determination", confidence: 0.9 },
    { text: "disabled", confidence: 0.9 },
    { text: "foreigner", confidence: 0.9 },
    { text: "expat", confidence: 0.9 },
    { text: "gcc national", confidence: 0.9 },
    { text: "emirati", confidence: 0.9 },
    { text: "uae national", confidence: 0.9 },
  ];

  for (const personType of personTypes) {
    if (query.includes(personType.text)) {
      entities.push({
        text: personType.text,
        type: "PERSON_TYPE",
        confidence: personType.confidence,
        normalizedValue: personType.text,
        startPosition: query.indexOf(personType.text),
        endPosition: query.indexOf(personType.text) + personType.text.length,
      });
    }
  }
}

/**
 * Extract ministries and authorities from the query
 */
function extractOrganizations(
  query: string,
  entities: RecognizedEntity[],
): void {
  const organizations = [
    { text: "ministry of interior", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of foreign affairs", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of finance", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of economy", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of health", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of education", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of justice", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of human resources", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of climate change", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of energy", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of culture", confidence: 0.9, type: "MINISTRY" },
    {
      text: "ministry of community development",
      confidence: 0.9,
      type: "MINISTRY",
    },
    { text: "ministry of cabinet affairs", confidence: 0.9, type: "MINISTRY" },
    {
      text: "ministry of presidential affairs",
      confidence: 0.9,
      type: "MINISTRY",
    },
    { text: "ministry of defense", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of tolerance", confidence: 0.9, type: "MINISTRY" },
    { text: "ministry of happiness", confidence: 0.9, type: "MINISTRY" },
    {
      text: "ministry of artificial intelligence",
      confidence: 0.9,
      type: "MINISTRY",
    },
    { text: "ministry of possibilities", confidence: 0.9, type: "MINISTRY" },
    {
      text: "federal authority for identity",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "federal tax authority", confidence: 0.9, type: "AUTHORITY" },
    { text: "federal transport authority", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "securities and commodities authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "general civil aviation authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "telecommunications regulatory authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "insurance authority", confidence: 0.9, type: "AUTHORITY" },
    { text: "federal customs authority", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "federal electricity and water authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "general authority of sports", confidence: 0.9, type: "AUTHORITY" },
    { text: "general authority of youth", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "general authority of islamic affairs",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "general pension and social security authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "federal demographic council", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "federal competitiveness and statistics authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "federal authority for government human resources",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "federal authority for nuclear regulation",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai police", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi police", confidence: 0.9, type: "AUTHORITY" },
    { text: "sharjah police", confidence: 0.9, type: "AUTHORITY" },
    { text: "ajman police", confidence: 0.9, type: "AUTHORITY" },
    { text: "fujairah police", confidence: 0.9, type: "AUTHORITY" },
    { text: "ras al khaimah police", confidence: 0.9, type: "AUTHORITY" },
    { text: "umm al quwain police", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai municipality", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi municipality", confidence: 0.9, type: "AUTHORITY" },
    { text: "sharjah municipality", confidence: 0.9, type: "AUTHORITY" },
    { text: "ajman municipality", confidence: 0.9, type: "AUTHORITY" },
    { text: "fujairah municipality", confidence: 0.9, type: "AUTHORITY" },
    { text: "ras al khaimah municipality", confidence: 0.9, type: "AUTHORITY" },
    { text: "umm al quwain municipality", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai economic department", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "abu dhabi economic department",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "sharjah economic department", confidence: 0.9, type: "AUTHORITY" },
    { text: "ajman economic department", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "fujairah economic department",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "ras al khaimah economic department",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "umm al quwain economic department",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai land department", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi housing authority", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai health authority", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi health authority", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "dubai roads and transport authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "abu dhabi department of transport",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "dubai electricity and water authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "abu dhabi distribution company",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai courts", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "abu dhabi judicial department",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai civil defense", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi civil defense", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai customs", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi customs", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai chamber of commerce", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "abu dhabi chamber of commerce",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai tourism", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi tourism", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai culture", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi culture", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai sports council", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi sports council", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "dubai knowledge and human development authority",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "abu dhabi education council", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai media city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai internet city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai silicon oasis", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "dubai multi commodities centre",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "dubai international financial centre",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "abu dhabi global market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai free zone", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi free zone", confidence: 0.9, type: "AUTHORITY" },
    { text: "jebel ali free zone", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai south", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai world central", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai maritime city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai healthcare city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai academic city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai design district", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai production city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai studio city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai industrial city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai investment park", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai world trade centre", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai airport free zone", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai gold and diamond park", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai flower centre", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai textile city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai outsource city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai science park", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai knowledge park", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "dubai international academic city",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "dubai international humanitarian city",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai international city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai motor city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai sports city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai techno park", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "dubai biotechnology and research park",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "dubai car and automotive city free zone",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai logistics city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai aid city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai health care city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai humanitarian city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai industrial park", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai wholesale city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai food park", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai creek harbour", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai hills estate", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai marina", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai downtown", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai palm jumeirah", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai palm jebel ali", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai palm deira", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai world islands", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai waterfront", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai business bay", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai international airport", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "abu dhabi international airport",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    {
      text: "sharjah international airport",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai port", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi port", confidence: 0.9, type: "AUTHORITY" },
    { text: "sharjah port", confidence: 0.9, type: "AUTHORITY" },
    { text: "jebel ali port", confidence: 0.9, type: "AUTHORITY" },
    { text: "fujairah port", confidence: 0.9, type: "AUTHORITY" },
    { text: "ras al khaimah port", confidence: 0.9, type: "AUTHORITY" },
    { text: "umm al quwain port", confidence: 0.9, type: "AUTHORITY" },
    { text: "ajman port", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai metro", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai tram", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi metro", confidence: 0.9, type: "AUTHORITY" },
    { text: "etihad rail", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai bus", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi bus", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai taxi", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi taxi", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai ferry", confidence: 0.9, type: "AUTHORITY" },
    { text: "abu dhabi ferry", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai water taxi", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai abra", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai water bus", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai water canal", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai creek", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai fountain", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai mall", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai opera", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai frame", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai museum", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai aquarium", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai zoo", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai safari park", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai miracle garden", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai butterfly garden", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai garden glow", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai dolphinarium", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai aquaventure", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai wild wadi", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai ski", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai ice rink", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai autodrome", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai international stadium", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai tennis stadium", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai world cup", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai duty free", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai festival city", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai outlet mall", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai gold souk", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai spice souk", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai textile souk", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai perfume souk", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai fish market", confidence: 0.9, type: "AUTHORITY" },
    {
      text: "dubai fruit and vegetable market",
      confidence: 0.9,
      type: "AUTHORITY",
    },
    { text: "dubai flower market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai carpet market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai camel market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai horse market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai falcon market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai bird market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai fish market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai meat market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai vegetable market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai fruit market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai date market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai carpet market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai antique market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai flea market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai night market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai farmers market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai organic market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai art market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai craft market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai book market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai food market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai fish market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai meat market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai vegetable market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai fruit market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai date market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai carpet market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai antique market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai flea market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai night market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai farmers market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai organic market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai art market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai craft market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai book market", confidence: 0.9, type: "AUTHORITY" },
    { text: "dubai food market", confidence: 0.9, type: "AUTHORITY" },
  ];

  for (const org of organizations) {
    if (query.includes(org.text)) {
      entities.push({
        text: org.text,
        type: org.type as EntityType,
        confidence: org.confidence,
        normalizedValue: org.text,
        startPosition: query.indexOf(org.text),
        endPosition: query.indexOf(org.text) + org.text.length,
      });
    } else {
      // Check for synonyms
      const synonyms = synonymMap[org.text] || [];
      for (const synonym of synonyms) {
        if (query.includes(synonym)) {
          entities.push({
            text: synonym,
            type: org.type as EntityType,
            confidence: org.confidence * 0.9,
            normalizedValue: org.text,
            startPosition: query.indexOf(synonym),
            endPosition: query.indexOf(synonym) + synonym.length,
          });
          break;
        }
      }
    }
  }
}

/**
 * Extract time periods from the query
 */
function extractTimePeriods(query: string, entities: RecognizedEntity[]): void {
  const timePeriods = [
    { text: "today", confidence: 0.9 },
    { text: "tomorrow", confidence: 0.9 },
    { text: "yesterday", confidence: 0.9 },
    { text: "this week", confidence: 0.9 },
    { text: "next week", confidence: 0.9 },
    { text: "last week", confidence: 0.9 },
    { text: "this month", confidence: 0.9 },
    { text: "next month", confidence: 0.9 },
    { text: "last month", confidence: 0.9 },
    { text: "this year", confidence: 0.9 },
    { text: "next year", confidence: 0.9 },
    { text: "last year", confidence: 0.9 },
    { text: "day", confidence: 0.8 },
    { text: "week", confidence: 0.8 },
    { text: "month", confidence: 0.8 },
    { text: "year", confidence: 0.8 },
    { text: "hour", confidence: 0.8 },
    { text: "minute", confidence: 0.8 },
    { text: "second", confidence: 0.8 },
    { text: "morning", confidence: 0.8 },
    { text: "afternoon", confidence: 0.8 },
    { text: "evening", confidence: 0.8 },
    { text: "night", confidence: 0.8 },
    { text: "midnight", confidence: 0.8 },
    { text: "noon", confidence: 0.8 },
    { text: "weekend", confidence: 0.8 },
    { text: "weekday", confidence: 0.8 },
    { text: "holiday", confidence: 0.8 },
    { text: "vacation", confidence: 0.8 },
    { text: "break", confidence: 0.8 },
    { text: "season", confidence: 0.8 },
    { text: "winter", confidence: 0.8 },
    { text: "spring", confidence: 0.8 },
    { text: "summer", confidence: 0.8 },
    { text: "fall", confidence: 0.8 },
    { text: "autumn", confidence: 0.8 },
    { text: "january", confidence: 0.9 },
    { text: "february", confidence: 0.9 },
    { text: "march", confidence: 0.9 },
    { text: "april", confidence: 0.9 },
    { text: "may", confidence: 0.9 },
    { text: "june", confidence: 0.9 },
    { text: "july", confidence: 0.9 },
    { text: "august", confidence: 0.9 },
    { text: "september", confidence: 0.9 },
    { text: "october", confidence: 0.9 },
    { text: "november", confidence: 0.9 },
    { text: "december", confidence: 0.9 },
    { text: "monday", confidence: 0.9 },
    { text: "tuesday", confidence: 0.9 },
    { text: "wednesday", confidence: 0.9 },
    { text: "thursday", confidence: 0.9 },
    { text: "friday", confidence: 0.9 },
    { text: "saturday", confidence: 0.9 },
    { text: "sunday", confidence: 0.9 },
  ];

  for (const timePeriod of timePeriods) {
    if (query.includes(timePeriod.text)) {
      entities.push({
        text: timePeriod.text,
        type: "TIME_PERIOD",
        confidence: timePeriod.confidence,
        normalizedValue: timePeriod.text,
        startPosition: query.indexOf(timePeriod.text),
        endPosition: query.indexOf(timePeriod.text) + timePeriod.text.length,
      });
    }
  }

  // Extract date patterns (e.g., DD/MM/YYYY, MM-DD-YYYY)
  const datePatterns = [
    /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, // DD/MM/YYYY or MM/DD/YYYY
    /\b\d{2,4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g, // YYYY/MM/DD
    /\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4}\b/gi, // DD MMM YYYY
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}\s*,?\s*\d{2,4}\b/gi, // MMM DD, YYYY
  ];

  for (const pattern of datePatterns) {
    const matches = query.match(pattern);
    if (matches) {
      for (const match of matches) {
        entities.push({
          text: match,
          type: "TIME_PERIOD",
          confidence: 0.9,
          normalizedValue: match,
          startPosition: query.indexOf(match),
          endPosition: query.indexOf(match) + match.length,
        });
      }
    }
  }

  // Extract time patterns (e.g., HH:MM, HH:MM:SS)
  const timePatterns = [
    /\b\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?\b/gi, // HH:MM, HH:MM:SS, HH:MM AM/PM
    /\b\d{1,2}\s*[ap]m\b/gi, // HH AM/PM
  ];

  for (const pattern of timePatterns) {
    const matches = query.match(pattern);
    if (matches) {
      for (const match of matches) {
        entities.push({
          text: match,
          type: "TIME_PERIOD",
          confidence: 0.9,
          normalizedValue: match,
          startPosition: query.indexOf(match),
          endPosition: query.indexOf(match) + match.length,
        });
      }
    }
  }
}

/**
 * Determine intents based on query and entities
 */
function determineIntents(
  query: string,
  entities: RecognizedEntity[],
  intents: Array<{ intent: string; confidence: number }>,
): void {
  // Action-based intents
  const actionIntents = [
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
    { action: "charge", intent: "PAYMENT", confidence: 0.9 },
    { action: "download", intent: "DOCUMENT_DOWNLOAD", confidence: 0.9 },
    { action: "print", intent: "DOCUMENT_DOWNLOAD", confidence: 0.9 },
    { action: "replace", intent: "REPLACEMENT", confidence: 0.9 },
    { action: "lost", intent: "REPLACEMENT", confidence: 0.9 },
    { action: "damaged", intent: "REPLACEMENT", confidence: 0.9 },
    { action: "stolen", intent: "REPLACEMENT", confidence: 0.9 },
    { action: "extend", intent: "EXTENSION", confidence: 0.9 },
    { action: "extension", intent: "EXTENSION", confidence: 0.9 },
    { action: "prolong", intent: "EXTENSION", confidence: 0.9 },
    { action: "update", intent: "UPDATE", confidence: 0.9 },
    { action: "change", intent: "UPDATE", confidence: 0.9 },
    { action: "modify", intent: "UPDATE", confidence: 0.9 },
    { action: "edit", intent: "UPDATE", confidence: 0.9 },
    { action: "amend", intent: "UPDATE", confidence: 0.9 },
    { action: "correct", intent: "UPDATE", confidence: 0.9 },
    { action: "book", intent: "APPOINTMENT", confidence: 0.9 },
    { action: "appointment", intent: "APPOINTMENT", confidence: 0.9 },
    { action: "schedule", intent: "APPOINTMENT", confidence: 0.9 },
    { action: "reserve", intent: "APPOINTMENT", confidence: 0.9 },
    { action: "visit", intent: "APPOINTMENT", confidence: 0.9 },
    { action: "meet", intent: "APPOINTMENT", confidence: 0.9 },
    { action: "consult", intent: "APPOINTMENT", confidence: 0.9 },
    { action: "verify", intent: "VERIFICATION", confidence: 0.9 },
    { action: "validate", intent: "VERIFICATION", confidence: 0.9 },
    { action: "authenticate", intent: "VERIFICATION", confidence: 0.9 },
    { action: "confirm", intent: "VERIFICATION", confidence: 0.9 },
    { action: "certify", intent: "VERIFICATION", confidence: 0.9 },
    { action: "attest", intent: "VERIFICATION", confidence: 0.9 },
    { action: "legalize", intent: "VERIFICATION", confidence: 0.9 },
    { action: "notarize", intent: "VERIFICATION", confidence: 0.9 },
    { action: "apostille", intent: "VERIFICATION", confidence: 0.9 },
    { action: "register", intent: "REGISTRATION", confidence: 0.9 },
    { action: "enroll", intent: "REGISTRATION", confidence: 0.9 },
    { action: "sign up", intent: "REGISTRATION", confidence: 0.9 },
    { action: "join", intent: "REGISTRATION", confidence: 0.9 },
    { action: "subscribe", intent: "REGISTRATION", confidence: 0.9 },
    { action: "unregister", intent: "DEREGISTRATION", confidence: 0.9 },
    { action: "deregister", intent: "DEREGISTRATION", confidence: 0.9 },
    { action: "unsubscribe", intent: "DEREGISTRATION", confidence: 0.9 },
    { action: "withdraw", intent: "DEREGISTRATION", confidence: 0.9 },
    { action: "remove", intent: "DEREGISTRATION", confidence: 0.9 },
    { action: "delete", intent: "DEREGISTRATION", confidence: 0.9 },
    { action: "transfer", intent: "TRANSFER", confidence: 0.9 },
    { action: "move", intent: "TRANSFER", confidence: 0.9 },
    { action: "relocate", intent: "TRANSFER", confidence: 0.9 },
    { action: "shift", intent: "TRANSFER", confidence: 0.9 },
    { action: "transport", intent: "TRANSFER", confidence: 0.9 },
    { action: "convert", intent: "CONVERSION", confidence: 0.9 },
    { action: "transform", intent: "CONVERSION", confidence: 0.9 },
    { action: "change", intent: "CONVERSION", confidence: 0.9 },
    { action: "switch", intent: "CONVERSION", confidence: 0.9 },
    { action: "exchange", intent: "CONVERSION", confidence: 0.9 },
    { action: "appeal", intent: "APPEAL", confidence: 0.9 },
    { action: "dispute", intent: "APPEAL", confidence: 0.9 },
    { action: "challenge", intent: "APPEAL", confidence: 0.9 },
    { action: "contest", intent: "APPEAL", confidence: 0.9 },
    { action: "object", intent: "APPEAL", confidence: 0.9 },
    { action: "protest", intent: "APPEAL", confidence: 0.9 },
    { action: "complain", intent: "COMPLAINT", confidence: 0.9 },
    { action: "grievance", intent: "COMPLAINT", confidence: 0.9 },
    { action: "dissatisfaction", intent: "COMPLAINT", confidence: 0.9 },
    { action: "unhappy", intent: "COMPLAINT", confidence: 0.9 },
    { action: "disappointed", intent: "COMPLAINT", confidence: 0.9 },
    { action: "feedback", intent: "FEEDBACK", confidence: 0.9 },
    { action: "suggest", intent: "FEEDBACK", confidence: 0.9 },
    { action: "recommend", intent: "FEEDBACK", confidence: 0.9 },
    { action: "advise", intent: "FEEDBACK", confidence: 0.9 },
    { action: "propose", intent: "FEEDBACK", confidence: 0.9 },
    { action: "help", intent: "HELP", confidence: 0.9 },
    { action: "assist", intent: "HELP", confidence: 0.9 },
    { action: "support", intent: "HELP", confidence: 0.9 },
    { action: "guide", intent: "HELP", confidence: 0.9 },
    { action: "direct", intent: "HELP", confidence: 0.9 },
    { action: "navigate", intent: "HELP", confidence: 0.9 },
    { action: "find", intent: "SEARCH", confidence: 0.9 },
    { action: "search", intent: "SEARCH", confidence: 0.9 },
    { action: "look", intent: "SEARCH", confidence: 0.9 },
    { action: "locate", intent: "SEARCH", confidence: 0.9 },
    { action: "discover", intent: "SEARCH", confidence: 0.9 },
    { action: "explore", intent: "SEARCH", confidence: 0.9 },
    { action: "browse", intent: "SEARCH", confidence: 0.9 },
    { action: "information", intent: "INFORMATION", confidence: 0.9 },
    { action: "details", intent: "INFORMATION", confidence: 0.9 },
    { action: "explain", intent: "INFORMATION", confidence: 0.9 },
    { action: "tell", intent: "INFORMATION", confidence: 0.9 },
    { action: "describe", intent: "INFORMATION", confidence: 0.9 },
    { action: "elaborate", intent: "INFORMATION", confidence: 0.9 },
    { action: "clarify", intent: "INFORMATION", confidence: 0.9 },
    { action: "what", intent: "INFORMATION", confidence: 0.9 },
    { action: "how", intent: "INFORMATION", confidence: 0.9 },
    { action: "when", intent: "INFORMATION", confidence: 0.9 },
    { action: "where", intent: "INFORMATION", confidence: 0.9 },
    { action: "who", intent: "INFORMATION", confidence: 0.9 },
    { action: "why", intent: "INFORMATION", confidence: 0.9 },
    { action: "which", intent: "INFORMATION", confidence: 0.9 },
    { action: "compare", intent: "COMPARISON", confidence: 0.9 },
    { action: "contrast", intent: "COMPARISON", confidence: 0.9 },
    { action: "difference", intent: "COMPARISON", confidence: 0.9 },
    { action: "similarity", intent: "COMPARISON", confidence: 0.9 },
    { action: "versus", intent: "COMPARISON", confidence: 0.9 },
    { action: "vs", intent: "COMPARISON", confidence: 0.9 },
    { action: "better", intent: "COMPARISON", confidence: 0.9 },
    { action: "best", intent: "COMPARISON", confidence: 0.9 },
    { action: "worst", intent: "COMPARISON", confidence: 0.9 },
    { action: "cheaper", intent: "COMPARISON", confidence: 0.9 },
    { action: "faster", intent: "COMPARISON", confidence: 0.9 },
    { action: "easier", intent: "COMPARISON", confidence: 0.9 },
    { action: "harder", intent: "COMPARISON", confidence: 0.9 },
    { action: "more", intent: "COMPARISON", confidence: 0.9 },
    { action: "less", intent: "COMPARISON", confidence: 0.9 },
    { action: "thank", intent: "GRATITUDE", confidence: 0.9 },
    { action: "thanks", intent: "GRATITUDE", confidence: 0.9 },
    { action: "appreciate", intent: "GRATITUDE", confidence: 0.9 },
    { action: "grateful", intent: "GRATITUDE", confidence: 0.9 },
    { action: "hello", intent: "GREETING", confidence: 0.9 },
    { action: "hi", intent: "GREETING", confidence: 0.9 },
    { action: "hey", intent: "GREETING", confidence: 0.9 },
    { action: "greetings", intent: "GREETING", confidence: 0.9 },
    { action: "good morning", intent: "GREETING", confidence: 0.9 },
    { action: "good afternoon", intent: "GREETING", confidence: 0.9 },
    { action: "good evening", intent: "GREETING", confidence: 0.9 },
    { action: "goodbye", intent: "FAREWELL", confidence: 0.9 },
    { action: "bye", intent: "FAREWELL", confidence: 0.9 },
    { action: "see you", intent: "FAREWELL", confidence: 0.9 },
    { action: "farewell", intent: "FAREWELL", confidence: 0.9 },
    { action: "take care", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a nice day", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good day", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a great day", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a wonderful day", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a pleasant day", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good one", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good time", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good weekend", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good week", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good month", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good year", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good holiday", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good vacation", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good trip", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good journey", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good flight", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good drive", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good ride", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good stay", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good visit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good meeting", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good appointment", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good consultation", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good session", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good interview", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good exam", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good test", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good assessment", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good evaluation", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good inspection", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good audit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good review", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good analysis", intent: "FAREWELL", confidence: 0.9 },
    {
      action: "have a good investigation",
      intent: "FAREWELL",
      confidence: 0.9,
    },
    { action: "have a good inquiry", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good survey", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good study", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good research", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good experiment", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good trial", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good hearing", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good case", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good lawsuit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good litigation", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good arbitration", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good mediation", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good negotiation", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good settlement", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good agreement", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good contract", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good deal", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good transaction", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good purchase", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good sale", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good trade", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good exchange", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good transfer", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good payment", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good receipt", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good invoice", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good bill", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good statement", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good account", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good balance", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good credit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good debit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good deposit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good withdrawal", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good transfer", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good remittance", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good wire", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good swift", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good iban", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good bic", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good sort code", intent: "FAREWELL", confidence: 0.9 },
    {
      action: "have a good routing number",
      intent: "FAREWELL",
      confidence: 0.9,
    },
    {
      action: "have a good account number",
      intent: "FAREWELL",
      confidence: 0.9,
    },
    { action: "have a good card number", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good pin", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good cvv", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good expiry date", intent: "FAREWELL", confidence: 0.9 },
    {
      action: "have a good expiration date",
      intent: "FAREWELL",
      confidence: 0.9,
    },
    {
      action: "have a good security code",
      intent: "FAREWELL",
      confidence: 0.9,
    },
    {
      action: "have a good verification code",
      intent: "FAREWELL",
      confidence: 0.9,
    },
    {
      action: "have a good authentication code",
      intent: "FAREWELL",
      confidence: 0.9,
    },
    { action: "have a good otp", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good password", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good passcode", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good pin code", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good secret code", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good access code", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good login", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good logout", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good sign in", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good sign out", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good log in", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good log out", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good sign up", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good register", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good unregister", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good deregister", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good subscribe", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good unsubscribe", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good enroll", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good unenroll", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good join", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good leave", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good quit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good exit", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good cancel", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good terminate", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good end", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good finish", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good complete", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good conclude", intent: "FAREWELL", confidence: 0.9 },
    { action: "have a good close", intent: "FAREWELL", confidence: 0.9 },
  ];

  for (const actionIntent of actionIntents) {
    if (query.includes(actionIntent.action)) {
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
