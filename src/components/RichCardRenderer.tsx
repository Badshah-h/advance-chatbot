import React from "react";
import RichCard from "./RichCard";
import ServiceCard from "./ServiceCard";
import ServiceDetail from "./ServiceDetail";
import {
  ExternalLink,
  Clock,
  CreditCard,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface RichCardRendererProps {
  content: string;
}

const RichCardRenderer: React.FC<RichCardRendererProps> = ({ content }) => {
  // Extract the rich card data from the content
  const extractCardData = (content: string) => {
    try {
      const cardMatch = content.match(/<rich-card>(.*?)<\/rich-card>/s);
      if (!cardMatch) return null;

      const cardJson = cardMatch[1].trim();
      return JSON.parse(cardJson);
    } catch (error) {
      console.error("Error parsing rich card data:", error);
      return null;
    }
  };

  const cardData = extractCardData(content);
  if (!cardData) return <div>{content}</div>;

  // Render different card types based on the type property
  switch (cardData.type) {
    case "service":
      return (
        <ServiceCard
          service={cardData.data}
          onSelect={() => console.log("Service selected:", cardData.data.id)}
        />
      );

    case "serviceDetail":
      return (
        <ServiceDetail
          service={cardData.data}
          onBack={() => console.log("Back clicked")}
        />
      );

    case "generic":
      return (
        <RichCard
          title={cardData.data.title}
          description={cardData.data.description}
          image={cardData.data.image}
          badge={cardData.data.badge}
          details={cardData.data.details}
          actions={cardData.data.actions}
          footer={cardData.data.footer && <div>{cardData.data.footer}</div>}
        />
      );

    default:
      // If type is not recognized, just render the content as text
      return <div>{content.replace(/<rich-card>.*?<\/rich-card>/s, "")}</div>;
  }
};

export default RichCardRenderer;
