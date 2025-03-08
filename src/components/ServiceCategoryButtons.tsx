import React from "react";
import { Button } from "./ui/button";
import { CreditCard, Car, FileText, Landmark } from "lucide-react";

type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

interface ServiceCategoryButtonsProps {
  onSelectCategory?: (category: ServiceCategory) => void;
  language?: "en" | "ar";
}

const ServiceCategoryButtons: React.FC<ServiceCategoryButtonsProps> = ({
  onSelectCategory = () => {},
  language = "en",
}) => {
  const categories: ServiceCategory[] = [
    {
      id: "visa",
      name: language === "en" ? "Visa Services" : "خدمات التأشيرة",
      icon: <Landmark className="h-5 w-5" />,
      description:
        language === "en"
          ? "Tourist, residence, visit and golden visas"
          : "تأشيرات سياحية وإقامة وزيارة وذهبية",
    },
    {
      id: "emirates-id",
      name: language === "en" ? "Emirates ID" : "الهوية الإماراتية",
      icon: <CreditCard className="h-5 w-5" />,
      description:
        language === "en"
          ? "New applications, renewals and replacements"
          : "طلبات جديدة وتجديد واستبدال",
    },
    {
      id: "business",
      name: language === "en" ? "Business Licensing" : "تراخيص الأعمال",
      icon: <FileText className="h-5 w-5" />,
      description:
        language === "en"
          ? "Free zone, mainland, renewals and fees"
          : "المنطقة الحرة، البر الرئيسي، التجديدات والرسوم",
    },
    {
      id: "traffic",
      name: language === "en" ? "Traffic Services" : "خدمات المرور",
      icon: <Car className="h-5 w-5" />,
      description:
        language === "en"
          ? "Fines, vehicle registration and licenses"
          : "الغرامات وتسجيل المركبات والرخص",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className="flex items-center justify-start gap-3 p-4 h-auto text-left"
            onClick={() => onSelectCategory(category)}
          >
            <div className="bg-primary/10 p-2 rounded-full">
              {category.icon}
            </div>
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category.description}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategoryButtons;
