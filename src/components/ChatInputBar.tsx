import React, { useState, useRef } from "react";
import { Send, Mic, MicOff, Paperclip, Search } from "lucide-react";
import { Button } from "./ui/button";
import DocumentUpload from "./DocumentUpload";
import VoiceInput from "./VoiceInput";

interface ChatInputBarProps {
  onSendMessage: (message: string) => void;
  onVoiceInput?: () => void;
  onFileUpload?: (file: File) => void;
  onSearchQuery?: (query: string) => void;
  isRecording?: boolean;
  placeholder?: string;
  language?: "en" | "ar";
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  onVoiceInput = () => {},
  onFileUpload = () => {},
  onSearchQuery,
  isRecording = false,
  placeholder = "Type your message...",
  language = "en",
}) => {
  const [message, setMessage] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      if (isSearchMode && onSearchQuery) {
        onSearchQuery(message.trim());
      } else {
        onSendMessage(message.trim());
      }
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        if (isSearchMode && onSearchQuery) {
          onSearchQuery(message.trim());
        } else {
          onSendMessage(message.trim());
        }
        setMessage("");
      }
    }
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="border-t bg-white p-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isSearchMode
                ? language === "en"
                  ? "Search UAE government services..."
                  : "البحث في خدمات حكومة الإمارات..."
                : placeholder
            }
            className={`w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none min-h-[40px] max-h-[120px] overflow-y-auto ${isSearchMode ? "border-blue-500 bg-blue-50" : ""}`}
            rows={1}
            style={{
              height: "40px",
              maxHeight: "120px",
            }}
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            {onFileUpload && (
              <DocumentUpload onFileSelect={onFileUpload} language={language} />
            )}
          </div>
        </div>

        {onSearchQuery && (
          <Button
            type="button"
            variant={isSearchMode ? "default" : "outline"}
            size="icon"
            onClick={toggleSearchMode}
            className="flex-shrink-0"
            title={
              language === "en"
                ? "Search UAE Government Services"
                : "البحث في خدمات حكومة الإمارات"
            }
          >
            <Search className="h-5 w-5" />
          </Button>
        )}

        {onVoiceInput && (
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={onVoiceInput}
            className={`flex-shrink-0 ${isRecording ? "animate-pulse" : ""}`}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        )}

        <Button
          type="submit"
          disabled={!message.trim()}
          className="flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>

      {isRecording && <VoiceInput language={language} />}

      {isSearchMode && (
        <div className="mt-2 text-xs text-blue-600">
          {language === "en"
            ? "Search mode active: Searching across official UAE government sources"
            : "وضع البحث نشط: البحث عبر مصادر حكومة الإمارات الرسمية"}
        </div>
      )}
    </div>
  );
};

export default ChatInputBar;
