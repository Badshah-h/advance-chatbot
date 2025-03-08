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
