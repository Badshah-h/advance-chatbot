import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import QuickReplies from "./QuickReplies";
import RichCardRenderer from "./RichCardRenderer";
import FeedbackDialog from "./FeedbackDialog";
import FAQSection from "./FAQSection";
import CopyToClipboardButton from "./CopyToClipboardButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { Message } from "../types/services";

type ChatMessagesProps = {
  messages?: Message[];
  onFeedback?: (messageId: string, feedback: "positive" | "negative") => void;
  onQuickReplyClick?: (reply: { id: string; text: string }) => void;
};

const ChatMessages = ({
  messages = [
    {
      id: "1",
      content: "Hello! How can I help you with government services today?",
      sender: "ai",
      timestamp: new Date(),
      metadata: {
        confidenceLevel: "high",
        quickReplies: [
          { id: "visa", text: "Visa Services" },
          { id: "id", text: "Emirates ID" },
          { id: "business", text: "Business Licensing" },
          { id: "traffic", text: "Traffic Services" },
        ],
      },
    },
  ],
  onFeedback = (messageId, feedback) =>
    console.log(`Feedback ${feedback} for message ${messageId}`),
  onQuickReplyClick = (reply) =>
    console.log(`Quick reply clicked: ${reply.text}`),
}: ChatMessagesProps) => {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [initialHelpful, setInitialHelpful] = useState(true);

  const handleFeedbackClick = (messageId: string, isPositive: boolean) => {
    // For quick feedback, just record the thumbs up/down
    onFeedback(messageId, isPositive ? "positive" : "negative");

    // Also open the detailed feedback dialog
    setSelectedMessageId(messageId);
    setInitialHelpful(isPositive);
    setFeedbackDialogOpen(true);
  };

  const handleFeedbackSubmit = async (feedback: {
    rating: number;
    comment: string;
    helpful: boolean;
    messageId: string;
    categories?: string[];
    improvement?: string;
    contactConsent?: boolean;
    contactEmail?: string;
  }) => {
    try {
      // Send the detailed feedback to the backend
      const { submitFeedback } = await import("../services/apiService");
      const { error } = await submitFeedback({
        ...feedback,
        userId: "guest", // This would be the actual user ID in a real implementation
      });

      if (error) {
        console.error("Error submitting feedback:", error);
      } else {
        // Show success toast or notification
        console.log("Feedback submitted successfully");
      }

      // Update the thumbs up/down state if it changed
      if (
        (feedback.helpful && !initialHelpful) ||
        (!feedback.helpful && initialHelpful)
      ) {
        onFeedback(
          feedback.messageId,
          feedback.helpful ? "positive" : "negative",
        );
      }
    } catch (error) {
      console.error("Error in handleFeedbackSubmit:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-md border border-gray-200">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {message.sender === "ai" && (
                  <div className="flex-shrink-0 mr-3">
                    <Avatar>
                      <AvatarImage src="/vite.svg" alt="Al Yalayis AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={`rounded-lg p-4 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {/* Check if this is a typing indicator */}
                    {message.sender === "ai" &&
                    message.metadata?.isTypingIndicator ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                        <span className="text-sm text-gray-500">
                          {message.content}
                        </span>
                      </div>
                    ) : message.sender === "ai" &&
                      message.content.includes("<rich-card>") ? (
                      <RichCardRenderer content={message.content} />
                    ) : (
                      <div className="whitespace-pre-line">
                        {message.content.split("**").map((part, index) => {
                          // Bold text for parts between ** markers (every odd index)
                          return index % 2 === 1 ? (
                            <strong key={index}>{part}</strong>
                          ) : (
                            <span key={index}>{part}</span>
                          );
                        })}

                        {/* Render FAQs if present in the message */}
                        {message.metadata?.faqs &&
                          message.metadata.faqs.length > 0 && (
                            <div className="mt-4">
                              <FAQSection
                                faqs={message.metadata.faqs}
                                title={
                                  message.metadata.faqTitle ||
                                  "Frequently Asked Questions"
                                }
                                language={message.metadata.language || "en"}
                              />
                            </div>
                          )}
                      </div>
                    )}

                    {message.sender === "ai" && message.metadata && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                        {message.metadata.fileInfo && (
                          <div className="flex flex-col gap-1 mb-2 bg-gray-50 p-2 rounded">
                            <div className="font-medium">File Information:</div>
                            <div className="flex items-center gap-1">
                              <span>Name:</span>
                              <span className="text-gray-700">
                                {message.metadata.fileInfo.fileName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Type:</span>
                              <span className="text-gray-700">
                                {message.metadata.fileInfo.fileType}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Size:</span>
                              <span className="text-gray-700">
                                {message.metadata.fileInfo.fileSize}
                              </span>
                            </div>
                          </div>
                        )}

                        {message.metadata.source && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Source:</span>
                            <span>{message.metadata.source}</span>
                            {message.metadata.lastUpdated && (
                              <span className="ml-1">
                                (Updated: {message.metadata.lastUpdated})
                              </span>
                            )}
                          </div>
                        )}
                        {message.metadata.confidenceLevel && (
                          <div className="mt-1">
                            {message.metadata.confidenceLevel === "high" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                🟢 High Confidence
                              </span>
                            )}
                            {message.metadata.confidenceLevel === "medium" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                🟡 Medium Confidence
                              </span>
                            )}
                            {message.metadata.confidenceLevel === "low" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                🟠 Low Confidence
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Replies */}
                  {message.sender === "ai" &&
                    message.metadata?.quickReplies &&
                    message.metadata.quickReplies.length > 0 && (
                      <div className="mt-2">
                        <QuickReplies
                          replies={message.metadata.quickReplies}
                          onReplyClick={onQuickReplyClick}
                        />
                      </div>
                    )}

                  <div
                    className={`mt-1 text-xs text-gray-500 ${message.sender === "user" ? "text-right" : "text-left"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {message.sender === "ai" && (
                    <div className="flex mt-1 space-x-2 justify-start">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`p-1 h-7 w-7 ${message.feedback === "positive" ? "text-green-600" : ""}`}
                              onClick={() =>
                                handleFeedbackClick(message.id, true)
                              }
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This response was helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`p-1 h-7 w-7 ${message.feedback === "negative" ? "text-red-600" : ""}`}
                              onClick={() =>
                                handleFeedbackClick(message.id, false)
                              }
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This response was not helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <CopyToClipboardButton
                        text={message.content.replace(
                          /<rich-card>.*?<\/rich-card>/s,
                          "",
                        )}
                        className="p-1 h-7 w-7"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        onSubmit={handleFeedbackSubmit}
        messageId={selectedMessageId}
        initialHelpful={initialHelpful}
        language="en"
      />
    </div>
  );
};

export default ChatMessages;
