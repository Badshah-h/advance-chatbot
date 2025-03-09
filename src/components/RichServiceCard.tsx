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
  Clock,
  FileText,
  Users,
  CreditCard,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GovernmentService } from "../types/services";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface RichServiceCardProps {
  service: GovernmentService;
  language: "en" | "ar";
  onActionClick?: (action: string, serviceId: string) => void;
}

const RichServiceCard: React.FC<RichServiceCardProps> = ({
  service,
  language,
  onActionClick = () => {},
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isArabic = language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  // Determine card accent color based on service category
  const getCategoryColor = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes("visa") || lowerCategory.includes("residence")) {
      return "border-blue-500 bg-blue-50";
    } else if (
      lowerCategory.includes("id") ||
      lowerCategory.includes("identity")
    ) {
      return "border-green-500 bg-green-50";
    } else if (
      lowerCategory.includes("business") ||
      lowerCategory.includes("license")
    ) {
      return "border-purple-500 bg-purple-50";
    } else if (
      lowerCategory.includes("traffic") ||
      lowerCategory.includes("vehicle")
    ) {
      return "border-orange-500 bg-orange-50";
    } else if (
      lowerCategory.includes("health") ||
      lowerCategory.includes("medical")
    ) {
      return "border-red-500 bg-red-50";
    } else if (
      lowerCategory.includes("education") ||
      lowerCategory.includes("school")
    ) {
      return "border-yellow-500 bg-yellow-50";
    }
    return "border-gray-300";
  };

  return (
    <Card
      className={`mb-4 overflow-hidden border-l-4 ${getCategoryColor(service.category)}`}
      dir={dir}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{service.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {service.authority}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {service.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm mb-3">{service.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          {service.processingTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {isArabic ? "وقت المعالجة: " : "Processing Time: "}
                {service.processingTime}
              </span>
            </div>
          )}

          {service.fees && service.fees.length > 0 && (
            <div className="flex items-center">
              <CreditCard className="h-3 w-3 mr-1" />
              <span>
                {isArabic ? "الرسوم: " : "Fees: "}
                {service.fees[0].amount} {service.fees[0].currency}
                {service.fees.length > 1 && "+"}
              </span>
            </div>
          )}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex justify-between items-center text-xs p-1 h-auto"
            >
              <span>{isArabic ? "عرض التفاصيل" : "View Details"}</span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-2">
            {service.eligibility && service.eligibility.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold mb-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {isArabic ? "الأهلية:" : "Eligibility:"}
                </h4>
                <ul className="text-xs list-disc list-inside">
                  {service.eligibility.slice(0, 3).map((item, index) => (
                    <li key={index} className="mb-1">
                      {item}
                    </li>
                  ))}
                  {service.eligibility.length > 3 && (
                    <li
                      className="text-blue-600 cursor-pointer"
                      onClick={() => onActionClick("eligibility", service.id)}
                    >
                      {isArabic ? "عرض المزيد..." : "View more..."}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {service.requiredDocuments &&
              service.requiredDocuments.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-1 flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {isArabic ? "المستندات المطلوبة:" : "Required Documents:"}
                  </h4>
                  <ul className="text-xs list-disc list-inside">
                    {service.requiredDocuments
                      .slice(0, 3)
                      .map((item, index) => (
                        <li key={index} className="mb-1">
                          {item}
                        </li>
                      ))}
                    {service.requiredDocuments.length > 3 && (
                      <li
                        className="text-blue-600 cursor-pointer"
                        onClick={() => onActionClick("documents", service.id)}
                      >
                        {isArabic ? "عرض المزيد..." : "View more..."}
                      </li>
                    )}
                  </ul>
                </div>
              )}

            {service.steps && service.steps.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold mb-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {isArabic ? "خطوات التقديم:" : "Application Steps:"}
                </h4>
                <ol className="text-xs list-decimal list-inside">
                  {service.steps.slice(0, 3).map((item, index) => (
                    <li key={index} className="mb-1">
                      {item}
                    </li>
                  ))}
                  {service.steps.length > 3 && (
                    <li
                      className="text-blue-600 cursor-pointer"
                      onClick={() => onActionClick("steps", service.id)}
                    >
                      {isArabic ? "عرض المزيد..." : "View more..."}
                    </li>
                  )}
                </ol>
              </div>
            )}

            {service.contactInfo && (
              <div className="text-xs">
                <h4 className="font-semibold mb-1">
                  {isArabic ? "معلومات الاتصال:" : "Contact Information:"}
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {service.contactInfo.phone && (
                    <div>
                      {isArabic ? "الهاتف: " : "Phone: "}
                      {service.contactInfo.phone}
                    </div>
                  )}
                  {service.contactInfo.email && (
                    <div>
                      {isArabic ? "البريد الإلكتروني: " : "Email: "}
                      {service.contactInfo.email}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <div className="text-xs text-gray-500">
          {isArabic ? "آخر تحديث: " : "Last Updated: "}
          {service.lastUpdated}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-8"
          onClick={() => window.open(service.url, "_blank")}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          {isArabic ? "الموقع الرسمي" : "Official Website"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RichServiceCard;
