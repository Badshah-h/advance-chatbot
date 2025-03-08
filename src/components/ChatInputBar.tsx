import React, { useState } from "react";
import { Mic, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import VoiceInput from "./VoiceInput";
import DocumentUpload from "./DocumentUpload";

interface ChatInputBarProps {
  onSendMessage?: (message: string) => void;
  onVoiceInput?: () => void;
  onFileUpload?: (file: File) => void;
  isRecording?: boolean;
  placeholder?: string;
  language?: "en" | "ar";
}

const ChatInputBar = ({
  onSendMessage = () => {},
  onVoiceInput = () => {},
  onFileUpload = () => {},
  isRecording = false,
  placeholder = "Type your question here...",
  language = "en",
}: ChatInputBarProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 p-4 rounded-b-lg shadow-sm">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        {isRecording ? (
          <div className="flex-1">
            <VoiceInput
              isRecording={isRecording}
              onToggleRecording={onVoiceInput}
              onTranscription={(text) => {
                setMessage(text);
                // Small delay to allow the user to see the transcription before sending
                setTimeout(() => {
                  handleSendMessage();
                }, 500);
              }}
              language={language === "ar" ? "ar" : "en"}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="pr-10 py-6"
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onVoiceInput}
                    className="text-gray-500 hover:text-primary hover:bg-gray-100"
                  >
                    <Mic size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice input</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DocumentUpload
              onFileSelect={onFileUpload}
              language={language}
              maxSizeMB={5}
              acceptedFileTypes={[
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/jpg",
              ]}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-4 py-6"
                  >
                    <Send size={18} className="mr-2" />
                    Send
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInputBar;
