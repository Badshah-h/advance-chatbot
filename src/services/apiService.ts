/**
 * API Service for handling real backend interactions
 * This replaces the mock data with actual API calls
 */

import { supabase } from "../lib/supabase";
import { Message } from "../types/services";

// Define response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Save chat messages to the database
 */
export async function saveChatMessages(
  messages: Message[],
  userId: string,
): Promise<ApiResponse<null>> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { data: null, error: "Database connection not available" };
    }

    // Prepare messages for storage
    const messagesToStore = messages.map((message) => ({
      id: message.id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
      user_id: userId,
      feedback: message.feedback,
      metadata: message.metadata,
    }));

    // Store in Supabase if available, otherwise use localStorage as fallback
    if (supabase.from) {
      const { error } = await supabase
        .from("chat_messages")
        .upsert(messagesToStore, { onConflict: "id" });

      if (error) {
        console.error("Error saving messages to database:", error);
        return { data: null, error: error.message };
      }
    } else {
      // Fallback to localStorage if Supabase is not fully configured
      localStorage.setItem(
        `chat_messages_${userId}`,
        JSON.stringify(messagesToStore),
      );
    }

    return { data: null, error: null };
  } catch (error) {
    console.error("Error in saveChatMessages:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Load chat messages from the database
 */
export async function loadChatMessages(
  userId: string,
): Promise<ApiResponse<Message[]>> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { data: [], error: "Database connection not available" };
    }

    // Try to load from Supabase if available
    if (supabase.from) {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error loading messages from database:", error);
        return { data: [], error: error.message };
      }

      // Convert timestamps back to Date objects
      const messages = data.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })) as Message[];

      return { data: messages, error: null };
    } else {
      // Fallback to localStorage if Supabase is not fully configured
      const storedMessages = localStorage.getItem(`chat_messages_${userId}`);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages).map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        return { data: messages, error: null };
      }
      return { data: [], error: null };
    }
  } catch (error) {
    console.error("Error in loadChatMessages:", error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Submit user feedback for a message
 */
export async function submitFeedback(feedback: {
  messageId: string;
  rating: number;
  comment: string;
  helpful: boolean;
  userId: string;
}): Promise<ApiResponse<null>> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { data: null, error: "Database connection not available" };
    }

    // Store feedback in Supabase if available
    if (supabase.from) {
      const { error } = await supabase.from("message_feedback").insert([
        {
          message_id: feedback.messageId,
          rating: feedback.rating,
          comment: feedback.comment,
          helpful: feedback.helpful,
          user_id: feedback.userId,
          created_at: new Date(),
        },
      ]);

      if (error) {
        console.error("Error saving feedback to database:", error);
        return { data: null, error: error.message };
      }
    } else {
      // Fallback to localStorage if Supabase is not fully configured
      const storedFeedback = localStorage.getItem("message_feedback") || "[]";
      const feedbackArray = JSON.parse(storedFeedback);
      feedbackArray.push({
        ...feedback,
        created_at: new Date(),
      });
      localStorage.setItem("message_feedback", JSON.stringify(feedbackArray));
    }

    return { data: null, error: null };
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get service information from the database
 */
export async function getServiceInfo(
  serviceId: string,
): Promise<ApiResponse<any>> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { data: null, error: "Database connection not available" };
    }

    // Try to get service info from Supabase if available
    if (supabase.from) {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single();

      if (error) {
        console.error("Error loading service from database:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } else {
      // Fallback to static data from aiService
      // This would be replaced with actual API calls in a production environment
      const { serviceData } = await import("./aiService");
      return { data: serviceData[serviceId] || null, error: null };
    }
  } catch (error) {
    console.error("Error in getServiceInfo:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
