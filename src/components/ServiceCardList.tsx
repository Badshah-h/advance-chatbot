import React from "react";
import RichServiceCard from "./RichServiceCard";
import { GovernmentService } from "../types/services";
import { Button } from "./ui/button";

interface ServiceCardListProps {
  services: GovernmentService[];
  language: "en" | "ar";
  onActionClick?: (action: string, serviceId: string) => void;
  onViewAllClick?: () => void;
  maxInitialServices?: number;
}

const ServiceCardList: React.FC<ServiceCardListProps> = ({
  services,
  language,
  onActionClick,
  onViewAllClick,
  maxInitialServices = 3,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const isArabic = language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const displayedServices = showAll
    ? services
    : services.slice(0, maxInitialServices);
  const hasMoreServices = services.length > maxInitialServices;

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else {
      setShowAll(true);
    }
  };

  if (services.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg" dir={dir}>
        <p className="text-gray-500">
          {isArabic ? "لم يتم العثور على خدمات" : "No services found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir={dir}>
      {displayedServices.map((service) => (
        <RichServiceCard
          key={service.id}
          service={service}
          language={language}
          onActionClick={onActionClick}
        />
      ))}

      {hasMoreServices && !showAll && (
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={handleViewAll}>
            {isArabic
              ? `عرض جميع الخدمات (${services.length})`
              : `View All Services (${services.length})`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceCardList;
