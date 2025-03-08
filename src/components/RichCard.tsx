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
import {
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";

type CardAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
};

type CardDetail = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

interface RichCardProps {
  title: string;
  description?: string;
  image?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  };
  details?: CardDetail[];
  actions?: CardAction[];
  footer?: React.ReactNode;
  className?: string;
}

const RichCard: React.FC<RichCardProps> = ({
  title,
  description,
  image,
  badge,
  details = [],
  actions = [],
  footer,
  className = "",
}) => {
  return (
    <Card className={`w-full overflow-hidden ${className}`}>
      {image && (
        <div className="relative w-full h-40 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {badge && (
            <div className="absolute top-2 right-2">
              <Badge variant={badge.variant || "default"}>{badge.text}</Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className={image ? "pt-4" : "pt-6"}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {!image && badge && (
            <Badge variant={badge.variant || "default"}>{badge.text}</Badge>
          )}
        </div>
      </CardHeader>

      {details.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="text-muted-foreground mt-0.5">
                  {detail.icon || <ChevronRight className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{detail.label}:</span>{" "}
                  {detail.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      {actions.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2 pt-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              size="sm"
              onClick={action.onClick}
              asChild={!!action.href}
            >
              {action.href ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  {action.icon}
                  {action.label}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ) : (
                <span className="flex items-center gap-1">
                  {action.icon}
                  {action.label}
                </span>
              )}
            </Button>
          ))}
        </CardFooter>
      )}

      {footer && (
        <div className="px-6 pb-4 pt-0 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default RichCard;

// Helper function to create common detail types
export const createLocationDetail = (location: string): CardDetail => ({
  label: "Location",
  value: location,
  icon: <MapPin className="h-4 w-4" />,
});

export const createDateDetail = (date: string): CardDetail => ({
  label: "Date",
  value: date,
  icon: <Calendar className="h-4 w-4" />,
});

export const createTimeDetail = (time: string): CardDetail => ({
  label: "Time",
  value: time,
  icon: <Clock className="h-4 w-4" />,
});

export const createDocumentDetail = (document: string): CardDetail => ({
  label: "Document",
  value: document,
  icon: <FileText className="h-4 w-4" />,
});

export const createFeeDetail = (fee: string): CardDetail => ({
  label: "Fee",
  value: fee,
  icon: <CreditCard className="h-4 w-4" />,
});
