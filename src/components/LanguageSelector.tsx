import React, { useEffect } from "react";
import { getCurrentLanguage, setLanguagePreference } from "../utils/i18n";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export type Language = "English" | "Arabic";

interface LanguageSelectorProps {
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
  variant?: "header" | "standalone";
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage = "English",
  onLanguageChange = () => {},
  variant = "header",
}) => {
  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = getCurrentLanguage();
    if (savedLanguage === "ar" && currentLanguage !== "Arabic") {
      onLanguageChange("Arabic");
    } else if (savedLanguage === "en" && currentLanguage !== "English") {
      onLanguageChange("English");
    }
  }, []);

  // Handle language change and save preference
  const handleLanguageChange = (language: Language) => {
    onLanguageChange(language);
    setLanguagePreference(language === "Arabic" ? "ar" : "en");
  };
  return (
    <div
      className={
        variant === "standalone"
          ? "p-2 bg-white rounded-md shadow-sm border"
          : ""
      }
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  <span>{currentLanguage}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("English")}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("Arabic")}
                >
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change language</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LanguageSelector;
