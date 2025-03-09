/**
 * Service for analyzing feedback data and generating insights
 */

import { supabase } from "../lib/supabase";

// Define response types
export interface AnalyticsResponse<T> {
  data: T | null;
  error: string | null;
}

// Define feedback analytics types
export interface FeedbackSummary {
  totalFeedback: number;
  averageRating: number;
  positivePercentage: number;
  negativePercentage: number;
  topCategories: Array<{ category: string; count: number }>;
  ratingDistribution: Record<string, number>;
}

/**
 * Get feedback analytics summary
 */
export async function getFeedbackSummary(): Promise<
  AnalyticsResponse<FeedbackSummary>
> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { data: null, error: "Database connection not available" };
    }

    // Get all feedback data from Supabase
    if (supabase.from) {
      const { data, error } = await supabase
        .from("message_feedback")
        .select("*");

      if (error) {
        console.error("Error loading feedback from database:", error);
        return { data: null, error: error.message };
      }

      // Calculate summary statistics
      const totalFeedback = data.length;
      const totalRating = data.reduce((sum, item) => sum + item.rating, 0);
      const averageRating = totalFeedback > 0 ? totalRating / totalFeedback : 0;

      const positiveCount = data.filter((item) => item.helpful).length;
      const positivePercentage =
        totalFeedback > 0 ? (positiveCount / totalFeedback) * 100 : 0;
      const negativePercentage =
        totalFeedback > 0 ? 100 - positivePercentage : 0;

      // Count categories
      const categoryCount: Record<string, number> = {};
      data.forEach((item) => {
        if (item.categories && Array.isArray(item.categories)) {
          item.categories.forEach((category) => {
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          });
        }
      });

      // Get top categories
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate rating distribution
      const ratingDistribution: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      };

      data.forEach((item) => {
        const rating = item.rating.toString();
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      });

      return {
        data: {
          totalFeedback,
          averageRating,
          positivePercentage,
          negativePercentage,
          topCategories,
          ratingDistribution,
        },
        error: null,
      };
    } else {
      // Fallback to localStorage if Supabase is not fully configured
      const storedFeedback = localStorage.getItem("message_feedback") || "[]";
      const feedbackArray = JSON.parse(storedFeedback);

      // Calculate summary statistics from localStorage data
      const totalFeedback = feedbackArray.length;
      const totalRating = feedbackArray.reduce(
        (sum: number, item: any) => sum + item.rating,
        0,
      );
      const averageRating = totalFeedback > 0 ? totalRating / totalFeedback : 0;

      const positiveCount = feedbackArray.filter(
        (item: any) => item.helpful,
      ).length;
      const positivePercentage =
        totalFeedback > 0 ? (positiveCount / totalFeedback) * 100 : 0;
      const negativePercentage =
        totalFeedback > 0 ? 100 - positivePercentage : 0;

      // Count categories
      const categoryCount: Record<string, number> = {};
      feedbackArray.forEach((item: any) => {
        if (item.categories && Array.isArray(item.categories)) {
          item.categories.forEach((category: string) => {
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          });
        }
      });

      // Get top categories
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate rating distribution
      const ratingDistribution: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      };

      feedbackArray.forEach((item: any) => {
        const rating = item.rating.toString();
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      });

      return {
        data: {
          totalFeedback,
          averageRating,
          positivePercentage,
          negativePercentage,
          topCategories,
          ratingDistribution,
        },
        error: null,
      };
    }
  } catch (error) {
    console.error("Error in getFeedbackSummary:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get feedback improvement suggestions
 */
export async function getFeedbackImprovements(): Promise<
  AnalyticsResponse<string[]>
> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { data: null, error: "Database connection not available" };
    }

    // Get improvement suggestions from Supabase
    if (supabase.from) {
      const { data, error } = await supabase
        .from("message_feedback")
        .select("improvement")
        .not("improvement", "eq", "")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Error loading feedback improvements from database:",
          error,
        );
        return { data: null, error: error.message };
      }

      // Extract improvement suggestions
      const improvements = data.map((item) => item.improvement);

      return { data: improvements, error: null };
    } else {
      // Fallback to localStorage if Supabase is not fully configured
      const storedFeedback = localStorage.getItem("message_feedback") || "[]";
      const feedbackArray = JSON.parse(storedFeedback);

      // Extract improvement suggestions
      const improvements = feedbackArray
        .filter(
          (item: any) => item.improvement && item.improvement.trim() !== "",
        )
        .map((item: any) => item.improvement);

      return { data: improvements, error: null };
    }
  } catch (error) {
    console.error("Error in getFeedbackImprovements:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get users who consented to be contacted about their feedback
 */
export async function getContactConsentUsers(): Promise<
  AnalyticsResponse<Array<{ email: string; feedback: any }>>
> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { data: null, error: "Database connection not available" };
    }

    // Get users who consented to be contacted
    if (supabase.from) {
      const { data, error } = await supabase
        .from("message_feedback")
        .select("*")
        .eq("contact_consent", true)
        .not("contact_email", "is", null);

      if (error) {
        console.error(
          "Error loading contact consent users from database:",
          error,
        );
        return { data: null, error: error.message };
      }

      // Format the data
      const contactUsers = data.map((item) => ({
        email: item.contact_email,
        feedback: item,
      }));

      return { data: contactUsers, error: null };
    } else {
      // Fallback to localStorage if Supabase is not fully configured
      const storedFeedback = localStorage.getItem("message_feedback") || "[]";
      const feedbackArray = JSON.parse(storedFeedback);

      // Extract users who consented to be contacted
      const contactUsers = feedbackArray
        .filter((item: any) => item.contactConsent && item.contactEmail)
        .map((item: any) => ({
          email: item.contactEmail,
          feedback: item,
        }));

      return { data: contactUsers, error: null };
    }
  } catch (error) {
    console.error("Error in getContactConsentUsers:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
