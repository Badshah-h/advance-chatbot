import { supabase } from "../lib/supabase";
import { Message } from "../types/services";
import { loadChatHistory, saveChatHistory } from "../utils/chatStorage";

/**
 * Save chat messages to the database
 * @param messages The messages to save
 * @param userId The user ID
 * @returns Success status and any error
 */
export async function saveChatMessages(
  messages: Message[],
  userId: string,
): Promise<{ success: boolean; error?: any }> {
  try {
    // If Supabase is not available, fall back to localStorage
    if (!supabase) {
      saveChatHistory(messages, userId);
      return { success: true };
    }

    // Check if a chat history record already exists for this user
    const { data: existingChat, error: fetchError } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is expected if no chat exists yet
      console.error("Error fetching chat history:", fetchError);
      // Fall back to localStorage
      saveChatHistory(messages, userId);
      return { success: false, error: fetchError };
    }

    if (existingChat) {
      // Update existing chat history
      const { error: updateError } = await supabase
        .from("chat_history")
        .update({
          messages: messages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingChat.id);

      if (updateError) {
        console.error("Error updating chat history:", updateError);
        // Fall back to localStorage
        saveChatHistory(messages, userId);
        return { success: false, error: updateError };
      }
    } else {
      // Create new chat history
      const { error: insertError } = await supabase
        .from("chat_history")
        .insert([
          {
            user_id: userId,
            messages: messages,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("Error creating chat history:", insertError);
        // Fall back to localStorage
        saveChatHistory(messages, userId);
        return { success: false, error: insertError };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in saveChatMessages:", error);
    // Fall back to localStorage
    saveChatHistory(messages, userId);
    return { success: false, error };
  }
}

/**
 * Load chat messages from the database
 * @param userId The user ID
 * @returns The messages and any error
 */
export async function loadChatMessages(
  userId: string,
): Promise<{ data: Message[] | null; error?: any }> {
  try {
    // If Supabase is not available, fall back to localStorage
    if (!supabase) {
      const messages = loadChatHistory(userId);
      return { data: messages };
    }

    // Get chat history from Supabase
    const { data, error } = await supabase
      .from("chat_history")
      .select("messages")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No chat history found, return empty array
        return { data: [] };
      }
      console.error("Error loading chat messages:", error);
      // Fall back to localStorage
      const messages = loadChatHistory(userId);
      return { data: messages, error };
    }

    return { data: data.messages as Message[] };
  } catch (error) {
    console.error("Error in loadChatMessages:", error);
    // Fall back to localStorage
    const messages = loadChatHistory(userId);
    return { data: messages, error };
  }
}

/**
 * Save feedback to the database
 * @param feedback The feedback data
 * @param userId The user ID (optional)
 * @returns Success status and any error
 */
export async function saveFeedback(
  feedback: {
    messageId: string;
    rating: number;
    comment: string;
    helpful: boolean;
    categories?: string[];
    improvement?: string;
    contactConsent?: boolean;
    contactEmail?: string;
  },
  userId?: string,
): Promise<{ success: boolean; error?: any }> {
  try {
    // If Supabase is not available, just log the feedback
    if (!supabase) {
      console.log("Feedback received (no database):", feedback);
      return { success: true };
    }

    // Save feedback to Supabase
    const { error } = await supabase.from("feedback").insert([
      {
        user_id: userId || null,
        message_id: feedback.messageId,
        rating: feedback.rating,
        comment: feedback.comment,
        helpful: feedback.helpful,
        categories: feedback.categories,
        improvement: feedback.improvement,
        contact_consent: feedback.contactConsent,
        contact_email: feedback.contactEmail,
      },
    ]);

    if (error) {
      console.error("Error saving feedback:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in saveFeedback:", error);
    return { success: false, error };
  }
}

/**
 * Save user preferences to the database
 * @param preferences The user preferences
 * @param userId The user ID
 * @returns Success status and any error
 */
export async function saveUserPreferences(
  preferences: {
    language: string;
    theme?: string;
    notificationsEnabled?: boolean;
  },
  userId: string,
): Promise<{ success: boolean; error?: any }> {
  try {
    // If Supabase is not available, just log the preferences
    if (!supabase) {
      console.log("User preferences (no database):", preferences);
      return { success: true };
    }

    // Check if preferences already exist for this user
    const { data: existingPrefs, error: fetchError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user preferences:", fetchError);
      return { success: false, error: fetchError };
    }

    if (existingPrefs) {
      // Update existing preferences
      const { error: updateError } = await supabase
        .from("user_preferences")
        .update({
          language: preferences.language,
          theme: preferences.theme,
          notifications_enabled: preferences.notificationsEnabled,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPrefs.id);

      if (updateError) {
        console.error("Error updating user preferences:", updateError);
        return { success: false, error: updateError };
      }
    } else {
      // Create new preferences
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert([
          {
            user_id: userId,
            language: preferences.language,
            theme: preferences.theme,
            notifications_enabled: preferences.notificationsEnabled || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("Error creating user preferences:", insertError);
        return { success: false, error: insertError };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in saveUserPreferences:", error);
    return { success: false, error };
  }
}

/**
 * Load user preferences from the database
 * @param userId The user ID
 * @returns The user preferences and any error
 */
export async function loadUserPreferences(userId: string): Promise<{
  data: {
    language: string;
    theme?: string;
    notificationsEnabled?: boolean;
  } | null;
  error?: any;
}> {
  try {
    // If Supabase is not available, return default preferences
    if (!supabase) {
      return {
        data: {
          language: "en",
          theme: "light",
          notificationsEnabled: true,
        },
      };
    }

    // Get user preferences from Supabase
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No preferences found, return defaults
        return {
          data: {
            language: "en",
            theme: "light",
            notificationsEnabled: true,
          },
        };
      }
      console.error("Error loading user preferences:", error);
      return { data: null, error };
    }

    return {
      data: {
        language: data.language,
        theme: data.theme,
        notificationsEnabled: data.notifications_enabled,
      },
    };
  } catch (error) {
    console.error("Error in loadUserPreferences:", error);
    return { data: null, error };
  }
}
