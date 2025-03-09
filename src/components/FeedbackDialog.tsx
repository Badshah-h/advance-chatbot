import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import DetailedFeedbackForm from "./DetailedFeedbackForm";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: {
    rating: number;
    comment: string;
    helpful: boolean;
    messageId: string;
    categories?: string[];
    improvement?: string;
    contactConsent?: boolean;
    contactEmail?: string;
  }) => void;
  messageId: string;
  initialHelpful?: boolean;
  language?: "en" | "ar";
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  messageId,
  initialHelpful = true,
  language = "en",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (feedbackData: {
    rating: number;
    comment: string;
    helpful: boolean;
    categories: string[];
    improvement: string;
    contactConsent: boolean;
    contactEmail?: string;
  }) => {
    setIsLoading(true);
    onSubmit({
      ...feedbackData,
      messageId,
    });
    setIsLoading(false);
    onClose();
  };

  const isArabic = language === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isArabic ? "rtl" : "ltr"} size="lg">
        <DialogHeader>
          <DialogTitle>
            {isArabic ? "تقديم ملاحظات" : "Provide Feedback"}
          </DialogTitle>
          <DialogDescription>
            {isArabic
              ? "مساعدتك في تحسين خدماتنا. كيف كان هذا الرد؟"
              : "Help us improve our services. How was this response?"}
          </DialogDescription>
        </DialogHeader>

        <DetailedFeedbackForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialRating={initialHelpful ? 4 : 2}
          isLoading={isLoading}
          language={language}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
