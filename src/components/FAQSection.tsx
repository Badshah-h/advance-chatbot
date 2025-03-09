import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  language?: "en" | "ar";
}

const FAQSection: React.FC<FAQSectionProps> = ({
  faqs,
  title = "Frequently Asked Questions",
  language = "en",
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4 mt-4">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium">{faq.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              )}
            </Button>
            {expandedIndex === index && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
