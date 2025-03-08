import React, { useState, useEffect } from "react";
import {
  generateAIResponse,
  processDocumentWithAI,
} from "../services/aiService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default {
  title: "Services/AIService",
  parameters: {
    layout: "centered",
  },
};

export const TestAIResponse = () => {
  const [query, setQuery] = useState("Tell me about tourist visas");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateAIResponse(query, language);
      setResponse(result);
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse({
        content: "Error generating response",
        metadata: { confidenceLevel: "low" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test AI Response Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              >
                {language === "en" ? "English" : "العربية"}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </form>

          {response && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="font-bold mb-2">Response:</h3>
              <div className="whitespace-pre-line">{response.content}</div>

              {response.metadata && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Metadata:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(response.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const TestDocumentProcessing = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const simulateDocumentUpload = async (documentType: string) => {
    setLoading(true);
    try {
      // Simulate file processing result
      const mockFileInfo = {
        text: `This is a mock ${documentType} document content.`,
        fileName: `sample-${documentType}.pdf`,
        fileType: "application/pdf",
        fileSize: "1.2 MB",
      };

      const response = await processDocumentWithAI(mockFileInfo, language);
      setResult(response);
    } catch (error) {
      console.error("Error processing document:", error);
      setResult({
        content: "Error processing document",
        metadata: { confidenceLevel: "low" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Document Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              onClick={() => simulateDocumentUpload("emirates-id")}
              disabled={loading}
            >
              Emirates ID Document
            </Button>
            <Button
              variant="outline"
              onClick={() => simulateDocumentUpload("visa")}
              disabled={loading}
            >
              Visa Document
            </Button>
            <Button
              variant="outline"
              onClick={() => simulateDocumentUpload("business")}
              disabled={loading}
            >
              Business License
            </Button>
            <Button
              variant="outline"
              onClick={() => simulateDocumentUpload("vehicle")}
              disabled={loading}
            >
              Vehicle Registration
            </Button>
            <Button
              variant="outline"
              onClick={() => simulateDocumentUpload("unknown")}
              disabled={loading}
            >
              Unknown Document
            </Button>
          </div>

          <div className="flex justify-end mb-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            >
              {language === "en"
                ? "Switch to Arabic"
                : "التبديل إلى الإنجليزية"}
            </Button>
          </div>

          {loading && <div className="text-center py-4">Processing...</div>}

          {result && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="font-bold mb-2">Response:</h3>
              <div className="whitespace-pre-line">{result.content}</div>

              {result.metadata && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Metadata:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(result.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
