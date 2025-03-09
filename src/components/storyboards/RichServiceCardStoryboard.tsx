import React from "react";
import RichServiceCard from "../RichServiceCard";
import ServiceCardList from "../ServiceCardList";
import RichCardRenderer from "../RichCardRenderer";
import { GovernmentService } from "../../types/services";

const RichServiceCardStoryboard = () => {
  // Sample service data
  const sampleServices: GovernmentService[] = [
    {
      id: "visa-001",
      title: "Tourist Visa Application",
      description:
        "Apply for a short-term tourist visa to visit the UAE for leisure, family visits, or business purposes.",
      authority:
        "Federal Authority for Identity, Citizenship, Customs and Port Security",
      authorityCode: "ICP",
      category: "Visa Services",
      subcategory: "Tourist Visa",
      eligibility: [
        "Citizens of non-visa exempt countries",
        "Sponsored by UAE citizens, residents, or hotels",
        "Valid passport with at least 6 months validity",
        "Return ticket to home country",
      ],
      requiredDocuments: [
        "Passport copy (valid for at least 6 months)",
        "Colored photograph with white background",
        "Return ticket",
        "Hotel booking or host's details",
        "Proof of sufficient funds",
      ],
      fees: [
        {
          amount: 300,
          currency: "AED",
          description: "Tourist visa - 30 days single entry",
        },
        {
          amount: 650,
          currency: "AED",
          description: "Tourist visa - 90 days multiple entry",
        },
        { amount: 50, currency: "AED", description: "Service fee" },
      ],
      processingTime: "24-72 hours",
      steps: [
        "Create an account on the ICP website or smart application",
        "Select 'Visa Services' then 'New Tourist Visa'",
        "Fill in the required information and upload documents",
        "Pay the fees",
        "Receive the tourist visa via email",
      ],
      url: "https://icp.gov.ae/en/services/visa-services/",
      contactInfo: {
        phone: "600 522222",
        email: "contactus@icp.gov.ae",
        website: "https://icp.gov.ae",
      },
      lastUpdated: "2023-11-20",
      language: "en",
    },
    {
      id: "id-001",
      title: "Emirates ID Renewal",
      description:
        "Renew your Emirates ID card before expiration to maintain your legal status in the UAE.",
      authority:
        "Federal Authority for Identity, Citizenship, Customs and Port Security",
      authorityCode: "ICP",
      category: "Identity Documents",
      subcategory: "Emirates ID",
      eligibility: ["UAE citizens", "UAE residents with valid residence visas"],
      requiredDocuments: [
        "Original passport",
        "Valid residence visa for expatriates",
        "Colored photograph with white background",
        "Existing Emirates ID card",
      ],
      fees: [
        { amount: 100, currency: "AED", description: "Application fee" },
        {
          amount: 100,
          currency: "AED",
          description: "Card issuance fee (5 years) for citizens",
        },
        {
          amount: 100,
          currency: "AED",
          description: "Card issuance fee (1 year) for residents",
        },
      ],
      processingTime: "3-5 working days",
      steps: [
        "Login to the ICP website or smart application",
        "Select 'Emirates ID Services' then 'Renewal'",
        "Fill in the required information and upload documents",
        "Pay the fees",
        "Visit an ICP service center for biometric capture if required",
        "Receive the Emirates ID card via Emirates Post",
      ],
      url: "https://icp.gov.ae/en/services/emirates-id-services/",
      contactInfo: {
        phone: "600 522222",
        email: "contactus@icp.gov.ae",
        website: "https://icp.gov.ae",
      },
      lastUpdated: "2023-12-01",
      language: "en",
    },
    {
      id: "business-001",
      title: "Business License Application",
      description:
        "Apply for a new business license to establish your company in the UAE mainland.",
      authority: "Ministry of Economy",
      authorityCode: "MOEC",
      category: "Business Services",
      subcategory: "Business Licensing",
      eligibility: [
        "UAE citizens and GCC nationals",
        "Foreign investors with UAE partners (51% UAE ownership required for most activities)",
        "Companies established in the UAE",
      ],
      requiredDocuments: [
        "Emirates ID of all partners",
        "Passport copies of all partners",
        "No objection certificate from sponsor (for residents)",
        "Tenancy contract (Ejari/Tawtheeq)",
        "Company memorandum of association",
        "Initial approval from relevant authorities",
      ],
      fees: [
        { amount: 600, currency: "AED", description: "Initial approval fee" },
        { amount: 2000, currency: "AED", description: "License issuance fee" },
        {
          amount: 1000,
          currency: "AED",
          description: "Chamber of Commerce membership fee",
        },
      ],
      processingTime: "2-5 working days",
      steps: [
        "Obtain initial approval for the trade name",
        "Prepare and submit the required documents",
        "Pay the initial approval fees",
        "Sign the memorandum of association",
        "Obtain external approvals (if required)",
        "Pay the license issuance fees",
        "Receive the business license",
      ],
      url: "https://www.moec.gov.ae/en/business-licensing",
      contactInfo: {
        phone: "800 665",
        email: "info@moec.gov.ae",
        website: "https://www.moec.gov.ae",
      },
      lastUpdated: "2023-12-10",
      language: "en",
    },
  ];

  const handleAction = (action: string, serviceId: string) => {
    console.log(`Action: ${action}, Service ID: ${serviceId}`);
    alert(`Action: ${action}, Service ID: ${serviceId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Rich Service Cards</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Individual Service Card
          </h2>
          <RichServiceCard
            service={sampleServices[0]}
            language="en"
            onActionClick={handleAction}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Service Card List</h2>
          <ServiceCardList
            services={sampleServices}
            language="en"
            onActionClick={handleAction}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Rich Card Renderer (Chat Message View)
          </h2>
          <div className="max-w-2xl mx-auto border border-gray-200 rounded-lg p-4">
            <RichCardRenderer
              content="Here's information about tourist visas in the UAE. I've found several services that might be helpful for your query."
              metadata={{
                services: sampleServices,
                source: "UAE Government Services",
                lastUpdated: "2023-12-15",
                language: "en",
              }}
              onActionClick={handleAction}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Arabic Version</h2>
          <RichServiceCard
            service={{
              ...sampleServices[0],
              title: "طلب تأشيرة سياحية",
              description:
                "تقديم طلب للحصول على تأشيرة سياحية قصيرة المدى لزيارة الإمارات العربية المتحدة للسياحة أو زيارة العائلة أو لأغراض تجارية.",
              language: "ar",
            }}
            language="ar"
            onActionClick={handleAction}
          />
        </div>
      </div>
    </div>
  );
};

export default RichServiceCardStoryboard;
