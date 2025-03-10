import React from "react";
import ServiceCard from "./ServiceCard";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  fee: string;
  processingTime: string;
  eligibility: string[];
  requiredDocuments: string[];
  applicationUrl?: string;
  status?: "active" | "maintenance" | "new";
}

interface ServiceCardListProps {
  services: Service[];
  onSelect?: (serviceId: string) => void;
}

const ServiceCardList: React.FC<ServiceCardListProps> = ({
  services,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default ServiceCardList;
