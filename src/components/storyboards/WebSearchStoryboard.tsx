import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, Search } from "lucide-react";
import { searchWeb } from "../../services/webSearchService";
import { AIResponse } from "../../services/aiService";
import RichCardRenderer from "../RichCardRenderer";

const WebSearchStoryboard = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResponse = await searchWeb(query, language);
      setResponse(searchResponse);
    } catch (error) {
      console.error("Error searching the web:", error);
      setResponse({
        content:
          language === "en"
            ? "Sorry, I encountered an error while searching. Please try again."
            : "عذرًا، واجهت خطأ أثناء البحث. يرجى المحاولة مرة أخرى.",
        metadata: {
          confidenceLevel: "low",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuickReplyClick = (reply: { id: string; text: string }) => {
    setQuery(reply.text);
    handleSearch();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Web Search Demo</h1>

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1">
            <Input
              placeholder={
                language === "en" ? "Search the web..." : "ابحث في الويب..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Searching..." : "جاري البحث..."}
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {language === "en" ? "Search" : "بحث"}
              </>
            )}
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
            <Button
              variant={language === "ar" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("ar")}
            >
              العربية
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Search Results" : "نتائج البحث"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {response ? (
              <div
                className="space-y-4"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <RichCardRenderer
                  content={response.content}
                  metadata={response.metadata}
                  onActionClick={() => {}}
                  onQuickReplyClick={handleQuickReplyClick}
                />
              </div>
            ) : (
              <div
                className="text-center p-8 text-gray-500"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {loading
                  ? language === "en"
                    ? "Searching..."
                    : "جاري البحث..."
                  : language === "en"
                    ? "Enter a search term to find information."
                    : "أدخل مصطلح البحث للعثور على المعلومات."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {language === "en" ? "How It Works" : "كيف يعمل"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "en" ? "1. Web Search" : "١. البحث في الويب"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-sm text-gray-600"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {language === "en"
                  ? "The system searches the web for relevant information about your query."
                  : "يبحث النظام في الويب عن معلومات ذات صلة بطلب البحث الخاص بك."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "en"
                  ? "2. Government Services"
                  : "٢. الخدمات الحكومية"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-sm text-gray-600"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {language === "en"
                  ? "Searches UAE government services database for official information."
                  : "يبحث في قاعدة بيانات الخدمات الحكومية الإماراتية للحصول على معلومات رسمية."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "en"
                  ? "3. Combined Results"
                  : "٣. النتائج المدمجة"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-sm text-gray-600"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {language === "en"
                  ? "Combines and ranks results from multiple sources to provide the most relevant information."
                  : "يجمع ويصنف النتائج من مصادر متعددة لتقديم المعلومات الأكثر صلة."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebSearchStoryboard;
