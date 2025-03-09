/**
 * Type definitions for government services
 */

export type ServiceCategory = "visa" | "emirates-id" | "business" | "traffic";

export interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  fee: string;
  processingTime: string;
  eligibility: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  applicationUrl?: string;
  status?: "active" | "maintenance" | "new";
  lastUpdated?: string;
  source?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  feedback?: "positive" | "negative";
  metadata?: {
    source?: string;
    lastUpdated?: string;
    confidenceLevel?: "high" | "medium" | "low";
    quickReplies?: Array<{ id: string; text: string }>;
    fileInfo?: {
      fileName: string;
      fileType: string;
      fileSize: string;
    };
    isTypingIndicator?: boolean;
  };
}

export interface AIResponse {
  content: string;
  metadata?: {
    confidenceLevel?: "high" | "medium" | "low";
    source?: string;
    lastUpdated?: string;
    quickReplies?: Array<{ id: string; text: string }>;
    entities?: any[];
    intents?: any[];
    [key: string]: any;
  };
}

export interface GovernmentService {
  id: string;
  title: string;
  description: string;
  authority: string;
  authorityCode: string;
  category: string;
  subcategory?: string;
  eligibility?: string[];
  requiredDocuments?: string[];
  fees?: {
    amount: number;
    currency: string;
    description: string;
  }[];
  processingTime?: string;
  steps?: string[];
  url: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  lastUpdated: string;
  language: "en" | "ar";
}
