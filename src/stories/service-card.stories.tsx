import React from "react";
import ServiceCard from "../components/ServiceCard";

export default {
  title: "Components/ServiceCard",
  component: ServiceCard,
  parameters: {
    layout: "centered",
  },
};

const sampleService = {
  id: "tourist-visa",
  title: "Tourist Visa",
  description: "Short-term visa for tourists visiting the UAE",
  category: "visa",
  image:
    "https://images.unsplash.com/photo-1576413326475-ea6c788332fb?w=600&q=80",
  fee: "AED 300 - 500",
  processingTime: "3-5 business days",
  eligibility: [
    "Valid passport with minimum 6 months validity",
    "Return ticket",
    "Hotel booking or host invitation",
    "Sufficient funds for the stay",
  ],
  requiredDocuments: [
    "Passport copy",
    "Passport-sized photograph",
    "Travel itinerary",
    "Hotel booking confirmation",
  ],
  applicationUrl: "#",
  status: "active",
};

export const Default = () => (
  <div className="w-96">
    <ServiceCard
      service={sampleService}
      onSelect={(id) => console.log(`Selected service: ${id}`)}
    />
  </div>
);

export const NewService = () => (
  <div className="w-96">
    <ServiceCard
      service={{
        ...sampleService,
        id: "golden-visa",
        title: "Golden Visa",
        description:
          "Long-term residence visa for investors and talented individuals",
        image:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
        fee: "AED 2,500 - 4,500",
        processingTime: "30-60 days",
        status: "new",
      }}
      onSelect={(id) => console.log(`Selected service: ${id}`)}
    />
  </div>
);

export const MaintenanceMode = () => (
  <div className="w-96">
    <ServiceCard
      service={{
        ...sampleService,
        id: "business-visa",
        title: "Business Visa",
        description: "For business professionals visiting the UAE",
        image:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
        status: "maintenance",
        applicationUrl: undefined,
      }}
      onSelect={(id) => console.log(`Selected service: ${id}`)}
    />
  </div>
);

export const NoImage = () => (
  <div className="w-96">
    <ServiceCard
      service={{
        ...sampleService,
        image: undefined,
      }}
      onSelect={(id) => console.log(`Selected service: ${id}`)}
    />
  </div>
);
