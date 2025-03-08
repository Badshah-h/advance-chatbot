import React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import LanguageSelector, { Language } from "./LanguageSelector";

interface ChatHeaderNoAuthProps {
  userName?: string;
  userAvatar?: string;
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
}

const ChatHeaderNoAuth: React.FC<ChatHeaderNoAuthProps> = ({
  userName = "Guest User",
  userAvatar = "",
  currentLanguage = "English",
  onLanguageChange = () => {},
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white w-full">
      <div className="flex items-center">
        <img
          src="/vite.svg"
          alt="Al Yalayis Logo"
          className="h-8 w-auto mr-3"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Al Yalayis Government Services
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Avatar>
                  {userAvatar ? (
                    <AvatarImage src={userAvatar} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium hidden md:inline">
                  {userName}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatHeaderNoAuth;
