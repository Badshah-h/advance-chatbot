import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInputBar from "./ChatInputBar";
import AuthModal from "../components/auth/AuthModal";
import ServiceCategoryButtons from "./ServiceCategoryButtons";
import QuickReplies from "./QuickReplies";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { processFile } from "../utils/fileProcessor";
import { saveChatHistory, loadChatHistory } from "../utils/chatStorage";

import { Message } from "../types/services";

interface ChatInterfaceProps {
  initialMessages?: Message[];
  userName?: string;
  userAvatar?: string;
  currentLanguage?: "English" | "Arabic";
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialMessages = [
    {
      id: "1",
      content: "Hello! How can I help you with government services today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ],
  userName = "Guest User",
  userAvatar = "",
  currentLanguage = "English",
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [language, setLanguage] = useState<"English" | "Arabic">(
    currentLanguage,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showServiceCategories, setShowServiceCategories] = useState(true);

  // Load chat history from database or localStorage on component mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const userId = user ? user.id : "guest";

        // Try to load from API first (which falls back to localStorage if needed)
        const { loadChatMessages } = await import("../services/apiService");
        const { data: apiMessages, error } = await loadChatMessages(userId);

        if (error) {
          console.error(
            "Error loading messages from API, falling back to localStorage",
          );
          // Fall back to localStorage
          const savedMessages = loadChatHistory(userId);
          if (savedMessages && savedMessages.length > 0) {
            setMessages(savedMessages);
            return;
          }
        } else if (apiMessages && apiMessages.length > 0) {
          setMessages(apiMessages);
          return;
        }

        // If no messages were found or there was an error, and user is logged in
        if (user) {
          // Add personalized welcome message for logged in users with no history
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            content: `Welcome back, ${user.name}! How can I assist you with government services today?`,
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    loadMessages();
  }, [user]);

  // Save chat history to database or localStorage whenever messages change
  useEffect(() => {
    const saveMessages = async () => {
      if (messages.length > 0) {
        const userId = user ? user.id : "guest";

        try {
          // Try to save to API first (which falls back to localStorage if needed)
          const { saveChatMessages } = await import("../services/apiService");
          const { error } = await saveChatMessages(messages, userId);

          if (error) {
            console.error(
              "Error saving messages to API, falling back to localStorage",
            );
            // Fall back to localStorage
            saveChatHistory(messages, userId);
          }
        } catch (error) {
          console.error("Error saving chat history:", error);
          // Fall back to localStorage
          saveChatHistory(messages, userId);
        }
      }
    };

    saveMessages();
  }, [messages, user]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    const typingIndicatorId = (Date.now() + 1).toString();
    const typingIndicator: Message = {
      id: typingIndicatorId,
      content: language === "English" ? "Thinking..." : "جاري التفكير...",
      sender: "ai",
      timestamp: new Date(),
      metadata: {
        isTypingIndicator: true,
      },
    };

    setMessages((prev) => [...prev, typingIndicator]);

    // Generate real AI response
    try {
      const response = await generateResponse(content);

      // Replace typing indicator with actual response
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response.content,
        sender: "ai",
        timestamp: new Date(),
        metadata: response.metadata,
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== typingIndicatorId).concat(aiMessage),
      );
    } catch (error) {
      console.error("Error in AI response:", error);

      // Replace typing indicator with error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content:
          language === "English"
            ? "I'm sorry, I encountered an error. Please try again."
            : "آسف، واجهت خطأ. يرجى المحاولة مرة أخرى.",
        sender: "ai",
        timestamp: new Date(),
        metadata: {
          confidenceLevel: "low",
        },
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== typingIndicatorId).concat(errorMessage),
      );
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);

    // If turning off recording, simulate receiving a voice message
    if (isRecording) {
      handleSendMessage("This is a simulated voice message.");
    }
  };

  const handleFeedback = (
    messageId: string,
    feedback: "positive" | "negative",
  ) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, feedback } : message,
      ),
    );
  };

  const handleLanguageChange = (newLanguage: "English" | "Arabic") => {
    setLanguage(newLanguage);
  };

  // Use the real AI service instead of mock responses
  const generateResponse = async (
    query: string,
  ): Promise<{ content: string; metadata?: any }> => {
    // Get the language code
    const langCode = language === "English" ? "en" : "ar";

    try {
      // First, check if this is a query about UAE government services
      try {
        const { searchGovernmentServices } = await import(
          "../services/uaeGovServices"
        );
        return await searchGovernmentServices(query, langCode);
      } catch (govError) {
        console.warn(
          "UAE Government search unavailable, trying OpenAI:",
          govError,
        );

        // Try to use OpenAI service if government search fails
        try {
          const { generateOpenAIResponse } = await import(
            "../services/openaiService"
          );
          return await generateOpenAIResponse(query, langCode);
        } catch (openaiError) {
          console.warn(
            "OpenAI service unavailable, falling back to mock AI:",
            openaiError,
          );

          // Fall back to mock AI service
          const { generateAIResponse } = await import("../services/aiService");
          return await generateAIResponse(query, langCode);
        }
      }
    } catch (error) {
      console.error("Error generating AI response:", error);

      // Fallback response in case of error
      return {
        content:
          language === "English"
            ? "I'm sorry, I encountered an error processing your request. Please try again."
            : "آسف، واجهت خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
        metadata: {
          confidenceLevel: "low",
        },
      };
    }
  };

  // Add a function to handle search-specific queries
  const handleSearchQuery = async (query: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show searching indicator
    const searchingId = (Date.now() + 1).toString();
    const searchingIndicator: Message = {
      id: searchingId,
      content:
        language === "English"
          ? "Searching UAE government sources..."
          : "جاري البحث في مصادر حكومة الإمارات...",
      sender: "ai",
      timestamp: new Date(),
      metadata: {
        isTypingIndicator: true,
      },
    };

    setMessages((prev) => [...prev, searchingIndicator]);

    try {
      // Use the government services search directly
      const { searchGovernmentServices } = await import(
        "../services/uaeGovServices"
      );
      const response = await searchGovernmentServices(
        query,
        language === "English" ? "en" : "ar",
      );

      // Replace searching indicator with actual response
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response.content,
        sender: "ai",
        timestamp: new Date(),
        metadata: response.metadata,
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== searchingId).concat(aiMessage),
      );
    } catch (error) {
      console.error("Error in web search:", error);

      // Fall back to regular response generation
      handleSendMessage(query);
    }
  };

  const handleAuthSuccess = () => {
    // Refresh the interface after successful authentication
    console.log("Authentication successful");
  };

  // Check if user needs to authenticate for certain queries
  const checkAuthRequired = (query: string): boolean => {
    const authRequiredKeywords = [
      "personal",
      "my application",
      "my visa",
      "my id",
      "my license",
      "my profile",
      "my account",
    ];

    return authRequiredKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword),
    );
  };

  // Override handleSendMessage to check for auth
  const handleSendMessageWithAuth = async (content: string) => {
    if (!user && checkAuthRequired(content)) {
      // Show auth modal for queries requiring authentication
      setIsAuthModalOpen(true);

      // Add a message explaining why auth is needed
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      };

      const authMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "To access personal information or services, please sign in or create an account first.",
        sender: "ai",
        timestamp: new Date(),
        metadata: {
          confidenceLevel: "high",
          quickReplies: [
            { id: "signin", text: "Sign In" },
            { id: "register", text: "Register" },
            { id: "continue", text: "Continue as Guest" },
          ],
        },
      };

      setMessages((prev) => [...prev, userMessage, authMessage]);
    } else {
      // Normal message handling
      handleSendMessage(content);
    }
  };

  // Handle quick reply clicks
  const handleQuickReplyClick = (reply: { id: string; text: string }) => {
    if (reply.id === "signin") {
      setIsAuthModalOpen(true);
    } else if (reply.id === "register") {
      setIsAuthModalOpen(true);
    } else if (reply.id === "clear_history") {
      // Clear chat history
      const newMessage: Message = {
        id: Date.now().toString(),
        content:
          language === "English"
            ? "Chat history cleared."
            : "تم مسح سجل المحادثة.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages([newMessage]);
    } else if (
      reply.id.includes("visa") ||
      reply.id.includes("id") ||
      reply.id.includes("business") ||
      reply.id.includes("traffic") ||
      reply.id.includes("health") ||
      reply.id.includes("education")
    ) {
      // For service-specific quick replies, use the search function
      handleSearchQuery(reply.text);
    } else {
      // For other quick replies, send as a user message
      handleSendMessage(reply.text);
    }
  };

  // Handle file uploads with real AI processing
  const handleFileUpload = async (file: File) => {
    // Add a user message indicating file upload
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `I'm uploading a file: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Show processing message
      const processingId = (Date.now() + 1).toString();
      const processingMessage: Message = {
        id: processingId,
        content:
          language === "English"
            ? "Processing your document..."
            : "جاري معالجة المستند الخاص بك...",
        sender: "ai",
        timestamp: new Date(),
        metadata: {
          isTypingIndicator: true,
        },
      };

      setMessages((prev) => [...prev, processingMessage]);

      // Process the file
      const result = await processFile(file);

      // Try to use OpenAI service first for document processing
      let aiResponse;
      try {
        const { processDocumentWithOpenAI } = await import(
          "../services/openaiService"
        );
        aiResponse = await processDocumentWithOpenAI(
          result,
          language === "English" ? "en" : "ar",
        );
      } catch (openaiError) {
        console.warn(
          "OpenAI document processing unavailable, falling back to mock processing:",
          openaiError,
        );

        // Fall back to mock document processing
        const { processDocumentWithAI } = await import("../services/aiService");
        aiResponse = await processDocumentWithAI(
          result,
          language === "English" ? "en" : "ar",
        );
      }

      // Replace the processing message with the AI response
      const responseMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponse.content,
        sender: "ai",
        timestamp: new Date(),
        metadata: {
          ...aiResponse.metadata,
          fileInfo: {
            fileName: result.fileName,
            fileType: result.fileType,
            fileSize: result.fileSize,
          },
        },
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== processingId).concat(responseMessage),
      );
    } catch (error) {
      console.error("Error processing document:", error);

      // Handle errors
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content:
          language === "English"
            ? "Sorry, I couldn't process your document. Please try again with a different file."
            : "عذرًا، لم أتمكن من معالجة المستند الخاص بك. يرجى المحاولة مرة أخرى باستخدام ملف مختلف.",
        sender: "ai",
        timestamp: new Date(),
        metadata: {
          confidenceLevel: "low",
        },
      };

      setMessages((prev) =>
        prev
          .filter((msg) => msg.metadata?.isTypingIndicator !== true)
          .concat(errorMessage),
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <ChatHeader
        userName={user ? user.name : userName}
        userAvatar={user ? user.avatar_url : userAvatar}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
      />

      {!user && (
        <div className="bg-blue-50 p-3 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">
              Sign in to access personalized government services and save your
              conversation history.
            </p>
            <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>
              Sign In
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden p-4">
        <ChatMessages
          messages={messages}
          onFeedback={handleFeedback}
          onQuickReplyClick={handleQuickReplyClick}
        />

        {showServiceCategories && messages.length <= 1 && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium mb-3">
              {language === "English" ? "Common Services" : "الخدمات الشائعة"}
            </h3>
            <ServiceCategoryButtons
              language={language === "English" ? "en" : "ar"}
              onSelectCategory={(category) => {
                setShowServiceCategories(false);
                handleSendMessage(`Tell me about ${category.name}`);
              }}
            />
          </div>
        )}
      </div>

      <ChatInputBar
        onSendMessage={handleSendMessageWithAuth}
        onVoiceInput={handleVoiceInput}
        onFileUpload={handleFileUpload}
        onSearchQuery={handleSearchQuery}
        isRecording={isRecording}
        placeholder={
          language === "English"
            ? "Type your question here..."
            : "اكتب سؤالك هنا..."
        }
        language={language === "English" ? "en" : "ar"}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
        onRegisterSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default ChatInterface;
