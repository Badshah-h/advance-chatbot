import React from "react";
import RichCard from "./RichCard";
import {
  FileText,
  ExternalLink,
  Clock,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

interface ServiceCardProps {
  service: {
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
  };
  onSelect?: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const getBadgeVariant = (status?: "active" | "maintenance" | "new") => {
    switch (status) {
      case "new":
        return "default";
      case "maintenance":
        return "destructive";
      case "active":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getBadgeText = (status?: "active" | "maintenance" | "new") => {
    switch (status) {
      case "new":
        return "New";
      case "maintenance":
        return "Maintenance";
      case "active":
        return "Active";
      default:
        return "";
    }
  };

  return (
    <RichCard
      title={service.title}
      description={service.description}
      image={service.image}
      badge={
        service.status
          ? {
              text: getBadgeText(service.status),
              variant: getBadgeVariant(service.status),
            }
          : undefined
      }
      details={[
        {
          label: "Processing Time",
          value: service.processingTime,
          icon: <Clock className="h-4 w-4" />,
        },
        {
          label: "Fee",
          value: service.fee,
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          label: "Required Documents",
          value: `${service.requiredDocuments.length} documents`,
          icon: <FileText className="h-4 w-4" />,
        },
      ]}
      actions={[
        {
          label: "View Details",
          onClick: () => onSelect?.(service.id),
          variant: "outline",
        },
        ...(service.applicationUrl
          ? [
              {
                label: "Apply Online",
                href: service.applicationUrl,
                variant: "default",
                icon: <ExternalLink className="h-4 w-4 mr-1" />,
              },
            ]
          : []),
      ]}
      footer={
        <div className="mt-2">
          <div className="font-medium mb-1">Eligibility:</div>
          <ul className="list-none pl-0 space-y-1">
            {service.eligibility.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-start gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-xs">{item}</span>
              </li>
            ))}
            {service.eligibility.length > 2 && (
              <li className="text-xs text-muted-foreground">
                +{service.eligibility.length - 2} more criteria
              </li>
            )}
          </ul>
        </div>
      }
    />
  );
};

export default ServiceCard;
