import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, Search, Globe, Database, Code } from "lucide-react";
import { searchUAEGovServices } from "../../services/uaeGovSearchService";
import { SearchResult } from "../../services/searchEngine";
import RichServiceCard from "../RichServiceCard";

const WebSearchDemoStoryboard = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await searchUAEGovServices(query, { language });
      setResults(searchResults);
    } catch (error) {
      console.error("Error searching for services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        UAE Government Services Web Search
      </h1>

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search for UAE government services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">
              <Search className="mr-2 h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="scraper">
              <Globe className="mr-2 h-4 w-4" />
              Web Scraper
            </TabsTrigger>
            <TabsTrigger value="nlp">
              <Database className="mr-2 h-4 w-4" />
              NLP Processing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <RichServiceCard
                        key={result.service.id}
                        service={result.service}
                        language={language}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    {loading
                      ? "Searching..."
                      : query
                        ? "No results found. Try a different search term."
                        : "Enter a search term to find UAE government services."}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scraper" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Web Scraper</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    The web scraper component allows you to extract information
                    from UAE government websites. It handles both static HTML
                    and JavaScript-rendered content using a dual-approach
                    system.
                  </p>

                  <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Features:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>
                        Static HTML scraping with lightweight HTTP requests
                      </li>
                      <li>
                        Dynamic content scraping with headless browser
                        automation
                      </li>
                      <li>Rate limiting and exponential backoff</li>
                      <li>User agent rotation and proxy support</li>
                      <li>Robots.txt compliance</li>
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" disabled>
                      <Code className="mr-2 h-4 w-4" />
                      Scraper Demo (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nlp" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>NLP Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    The NLP processing component analyzes search queries to
                    extract entities, determine intent, and classify content
                    into relevant service categories.
                  </p>

                  <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Capabilities:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>
                        Entity extraction (service types, document types,
                        locations)
                      </li>
                      <li>
                        Intent classification (application, renewal, payment,
                        etc.)
                      </li>
                      <li>Query expansion with synonyms and related terms</li>
                      <li>Bilingual support (English/Arabic)</li>
                      <li>Text normalization and stopword removal</li>
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" disabled>
                      <Database className="mr-2 h-4 w-4" />
                      NLP Demo (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Web Scraping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our system scrapes UAE government websites using both static and
                dynamic approaches. It respects rate limits and follows ethical
                scraping practices while extracting structured service
                information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. NLP Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Search queries are analyzed using NLP techniques to extract
                entities, determine user intent, and classify content. This
                helps match queries to the most relevant government services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Search Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our search engine uses inverted indices, entity indexing, and
                relevance ranking algorithms to deliver the most accurate
                results. It supports both English and Arabic queries.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebSearchDemoStoryboard;
