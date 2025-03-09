/**
 * Utility for storing and retrieving chat history from localStorage
 */

// Define the message type
type Message = {
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
  };
};

// Storage keys
const CHAT_HISTORY_KEY = "al-yalayis-chat-history";
const CHAT_LANGUAGE_KEY = "al-yalayis-language";

// Maximum number of messages to store per user
const MAX_STORED_MESSAGES = 100;

// Save chat history to localStorage
export function saveChatHistory(
  messages: Message[],
  userId: string = "guest",
): void {
  try {
    // Get existing chat histories
    const allHistories = getAllChatHistories();

    // Limit the number of messages to prevent localStorage from getting too large
    const limitedMessages = messages.slice(-MAX_STORED_MESSAGES);

    // Convert Date objects to strings for storage
    const serializedMessages = limitedMessages.map((message) => ({
      ...message,
      timestamp: message.timestamp.toISOString(),
    }));

    // Update the history for this user
    allHistories[userId] = serializedMessages;

    // Save back to localStorage
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(allHistories));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

// Load chat history from localStorage
export function loadChatHistory(userId: string = "guest"): Message[] {
  try {
    const allHistories = getAllChatHistories();
    const userHistory = allHistories[userId] || [];

    // Convert string timestamps back to Date objects
    return userHistory.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
}

// Clear chat history for a specific user
export function clearChatHistory(userId: string = "guest"): void {
  try {
    const allHistories = getAllChatHistories();
    delete allHistories[userId];
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(allHistories));
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
}

// Get all chat histories
function getAllChatHistories(): Record<string, any[]> {
  try {
    const historiesJson = localStorage.getItem(CHAT_HISTORY_KEY);
    return historiesJson ? JSON.parse(historiesJson) : {};
  } catch (error) {
    console.error("Error getting all chat histories:", error);
    return {};
  }
}

// Save language preference
export function saveLanguagePreference(language: "en" | "ar"): void {
  try {
    localStorage.setItem(CHAT_LANGUAGE_KEY, language);
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
}

// Load language preference
export function loadLanguagePreference(): "en" | "ar" {
  try {
    return (localStorage.getItem(CHAT_LANGUAGE_KEY) as "en" | "ar") || "en";
  } catch (error) {
    console.error("Error loading language preference:", error);
    return "en";
  }
}

// Search within chat history
export function searchChatHistory(
  query: string,
  userId: string = "guest",
): Message[] {
  try {
    const chatHistory = loadChatHistory(userId) || [];
    const normalizedQuery = query.toLowerCase();

    return chatHistory.filter((message) =>
      message.content.toLowerCase().includes(normalizedQuery),
    );
  } catch (error) {
    console.error("Error searching chat history:", error);
    return [];
  }
}

// Add a message to the chat history
export function addMessageToChatHistory(
  message: Message,
  userId: string = "guest",
): Message[] {
  try {
    const chatHistory = loadChatHistory(userId) || [];
    const updatedHistory = [...chatHistory, message];
    saveChatHistory(updatedHistory, userId);
    return updatedHistory;
  } catch (error) {
    console.error("Error adding message to chat history:", error);
    return [];
  }
}
