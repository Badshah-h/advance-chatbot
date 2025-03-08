import React from "react";
import QuickReplies from "../components/QuickReplies";

export default {
  title: "Components/QuickReplies",
  component: QuickReplies,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  const replies = [
    { id: "1", text: "Yes" },
    { id: "2", text: "No" },
    { id: "3", text: "Maybe" },
  ];

  return (
    <div className="p-4 max-w-md">
      <QuickReplies
        replies={replies}
        onReplyClick={(reply) => console.log("Clicked:", reply)}
      />
    </div>
  );
};

export const ServiceCategories = () => {
  const replies = [
    { id: "visa", text: "Visa Services" },
    { id: "id", text: "Emirates ID" },
    { id: "business", text: "Business Licensing" },
    { id: "traffic", text: "Traffic Services" },
  ];

  return (
    <div className="p-4 max-w-md">
      <QuickReplies
        replies={replies}
        onReplyClick={(reply) => console.log("Selected category:", reply)}
      />
    </div>
  );
};

export const LongReplies = () => {
  const replies = [
    { id: "1", text: "Tell me more about tourist visas" },
    { id: "2", text: "How do I renew my Emirates ID?" },
    { id: "3", text: "What are the requirements for a business license?" },
    { id: "4", text: "How can I pay my traffic fines?" },
  ];

  return (
    <div className="p-4 max-w-md">
      <QuickReplies
        replies={replies}
        onReplyClick={(reply) => console.log("Clicked:", reply)}
      />
    </div>
  );
};

export const ArabicReplies = () => {
  const replies = [
    { id: "1", text: "خدمات التأشيرة" },
    { id: "2", text: "الهوية الإماراتية" },
    { id: "3", text: "تراخيص الأعمال" },
    { id: "4", text: "خدمات المرور" },
  ];

  return (
    <div className="p-4 max-w-md" dir="rtl">
      <QuickReplies
        replies={replies}
        onReplyClick={(reply) => console.log("Clicked:", reply)}
      />
    </div>
  );
};
