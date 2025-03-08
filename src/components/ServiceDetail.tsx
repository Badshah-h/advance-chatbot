import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  ExternalLink,
  Clock,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface ServiceDetailProps {
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
    applicationSteps: string[];
    applicationUrl?: string;
    status?: "active" | "maintenance" | "new";
    lastUpdated?: string;
    source?: string;
  };
  onBack?: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
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

  return (
    <Card className="w-full overflow-hidden">
      <div className="relative">
        {service.image && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{service.title}</CardTitle>
              {service.status && (
                <Badge variant={getBadgeVariant(service.status)}>
                  {service.status.charAt(0).toUpperCase() +
                    service.status.slice(1)}
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">
              {service.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Processing Time</div>
              <div className="text-sm">{service.processingTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Fee</div>
              <div className="text-sm">{service.fee}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Eligibility Criteria</h3>
          <ul className="space-y-2">
            {service.eligibility.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Required Documents</h3>
          <ul className="space-y-2">
            {service.requiredDocuments.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Application Steps</h3>
          <ol className="space-y-2 list-decimal pl-5">
            {service.applicationSteps.map((step, index) => (
              <li key={index} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {service.applicationUrl && (
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Ready to apply?</h4>
                <p className="text-sm mb-3">
                  You can complete this application online through the official
                  portal.
                </p>
                <Button asChild>
                  <a
                    href={service.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Apply Online
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="py-3">
        <div className="w-full text-xs text-muted-foreground">
          {service.source && <div>Source: {service.source}</div>}
          {service.lastUpdated && (
            <div>Last updated: {service.lastUpdated}</div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceDetail;
