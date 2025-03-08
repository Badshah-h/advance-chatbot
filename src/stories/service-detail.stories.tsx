import React from "react";
import ServiceDetail from "../components/ServiceDetail";

export default {
  title: "Components/ServiceDetail",
  component: ServiceDetail,
  parameters: {
    layout: "centered",
  },
};

const sampleService = {
  id: "tourist-visa",
  title: "Tourist Visa",
  description:
    "Short-term visa for tourists visiting the UAE for leisure, sightseeing, or visiting friends and family.",
  category: "visa",
  image:
    "https://images.unsplash.com/photo-1576413326475-ea6c788332fb?w=800&q=80",
  fee: "AED 300 (14 days), AED 500 (30 days), AED 1,000 (90 days)",
  processingTime: "3-5 business days",
  eligibility: [
    "Valid passport with minimum 6 months validity",
    "Return ticket",
    "Hotel booking or host invitation",
    "Sufficient funds for the stay",
    "Health insurance covering the UAE",
  ],
  requiredDocuments: [
    "Passport copy (valid for at least 6 months)",
    "Passport-sized photograph with white background",
    "Travel itinerary including flight details",
    "Hotel booking confirmation or host's Emirates ID and address",
    "Bank statement for the last 3 months (if requested)",
  ],
  applicationSteps: [
    "Create an account on the Federal Authority for Identity and Citizenship website",
    "Fill in the application form with personal details",
    "Upload the required documents",
    "Pay the applicable visa fees",
    "Wait for application processing",
    "Download and print the e-visa once approved",
  ],
  applicationUrl: "#",
  status: "active",
  lastUpdated: "January 15, 2023",
  source:
    "Federal Authority for Identity, Citizenship, Customs & Port Security",
};

export const Default = () => (
  <div className="w-full max-w-3xl">
    <ServiceDetail
      service={sampleService}
      onBack={() => console.log("Back clicked")}
    />
  </div>
);

export const GoldenVisa = () => (
  <div className="w-full max-w-3xl">
    <ServiceDetail
      service={{
        ...sampleService,
        id: "golden-visa",
        title: "Golden Visa",
        description:
          "Long-term residence visa for investors, entrepreneurs, and specialized talents in the UAE.",
        image:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
        fee: "AED 2,500 (5 years), AED 4,500 (10 years)",
        processingTime: "30-60 days",
        eligibility: [
          "Investors (minimum AED 2 million in property or business)",
          "Entrepreneurs with approved project or existing business",
          "Specialized talents (scientists, doctors, artists, etc.)",
          "Outstanding students with minimum 95% in secondary school or 3.75 GPA in university",
          "Specialized professionals in priority fields",
        ],
        requiredDocuments: [
          "Passport copy",
          "Investment proof or talent verification",
          "Bank statements (for investors)",
          "CV and certificates (for specialized talents)",
          "Medical fitness certificate",
          "Emirates ID application",
        ],
        applicationSteps: [
          "Submit nomination or application through ICP website",
          "Receive initial approval",
          "Complete medical fitness test",
          "Apply for Emirates ID",
          "Receive Golden Visa",
        ],
        status: "new",
      }}
      onBack={() => console.log("Back clicked")}
    />
  </div>
);

export const NoImage = () => (
  <div className="w-full max-w-3xl">
    <ServiceDetail
      service={{
        ...sampleService,
        image: undefined,
      }}
      onBack={() => console.log("Back clicked")}
    />
  </div>
);

export const MaintenanceMode = () => (
  <div className="w-full max-w-3xl">
    <ServiceDetail
      service={{
        ...sampleService,
        status: "maintenance",
        applicationUrl: undefined,
        description:
          "This service is currently undergoing maintenance. Please check back later.",
      }}
      onBack={() => console.log("Back clicked")}
    />
  </div>
);
