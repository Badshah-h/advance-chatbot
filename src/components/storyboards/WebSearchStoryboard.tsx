import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const WebSearchStoryboard = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Simulate search results
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock results based on the query
      const mockResults = [];

      if (query.toLowerCase().includes("visa")) {
        mockResults.push({
          title: "Tourist Visa Services",
          snippet:
            "Apply for a new visa, renew or cancel existing visas through our online portal.",
          url: "https://icp.gov.ae/en/services/",
          source:
            "Federal Authority for Identity, Citizenship, Customs and Port Security",
        });
        mockResults.push({
          title: "Golden Visa Program",
          snippet:
            "Long-term residence visas for investors, entrepreneurs, and specialized talents.",
          url: "https://icp.gov.ae/en/services/",
          source:
            "Federal Authority for Identity, Citizenship, Customs and Port Security",
        });
      } else if (query.toLowerCase().includes("emirates id")) {
        mockResults.push({
          title: "Emirates ID Services",
          snippet:
            "Apply for a new Emirates ID card, renew or replace lost/damaged cards.",
          url: "https://icp.gov.ae/en/services/",
          source:
            "Federal Authority for Identity, Citizenship, Customs and Port Security",
        });
      } else if (query.toLowerCase().includes("business")) {
        mockResults.push({
          title: "Business Licensing Services",
          snippet:
            "Apply for new business licenses, renew or amend existing licenses.",
          url: "https://www.moec.gov.ae/en/home",
          source: "Ministry of Economy",
        });
      } else if (query.toLowerCase().includes("traffic")) {
        mockResults.push({
          title: "Traffic Services",
          snippet:
            "Pay traffic fines, check fine details and get clearance certificates.",
          url: "https://www.moi.gov.ae/en/eservices.aspx",
          source: "Ministry of Interior",
        });
      } else {
        // Generic results
        mockResults.push({
          title: "UAE Government Services",
          snippet: `Find information and services related to ${query} from official UAE government sources.`,
          url: "https://u.ae/en",
          source: "UAE Government Portal",
        });
      }

      setSearchResults(mockResults);
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        UAE Government Services Search
      </h1>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for UAE government services..."
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="flex-shrink-0"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>

        <div className="mt-2 text-xs text-blue-600">
          Try searching for: "tourist visa", "emirates id renewal", "business
          license", "traffic fines"
        </div>
      </div>

      {isSearching && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">
            Searching across UAE government sources...
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {searchResults && searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Search Results from UAE Government Sources
          </h2>

          {searchResults.map((result, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-600 hover:underline">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{result.snippet}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Source:</span>
                  <span className="ml-1">{result.source}</span>
                </div>
                <div className="mt-2">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {result.url}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchResults && searchResults.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
          <h3 className="font-semibold">No Results Found</h3>
          <p>
            No information found for "{query}" in UAE government sources. Try
            different search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default WebSearchStoryboard;
