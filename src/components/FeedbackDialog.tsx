import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: {
    rating: number;
    comment: string;
    helpful: boolean;
    messageId: string;
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
  const [rating, setRating] = useState<number>(initialHelpful ? 4 : 2);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = () => {
    onSubmit({
      rating,
      comment,
      helpful: rating >= 3,
      messageId,
    });
    onClose();
  };

  const isArabic = language === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isArabic ? "rtl" : "ltr"}>
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

        <div className="py-4 space-y-4">
          <RadioGroup
            defaultValue={rating.toString()}
            onValueChange={(value) => setRating(parseInt(value))}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="r5" />
              <Label htmlFor="r5">
                {isArabic ? "ممتاز - مفيد للغاية" : "Excellent - Very helpful"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r4" />
              <Label htmlFor="r4">
                {isArabic ? "جيد - مفيد" : "Good - Helpful"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">
                {isArabic
                  ? "متوسط - مفيد جزئيًا"
                  : "Average - Somewhat helpful"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">
                {isArabic ? "ضعيف - غير مفيد" : "Poor - Not helpful"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">
                {isArabic
                  ? "سيء جدًا - غير دقيق أو مضلل"
                  : "Very poor - Inaccurate or misleading"}
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="comment">
              {isArabic
                ? "تعليقات إضافية (اختياري)"
                : "Additional comments (optional)"}
            </Label>
            <Textarea
              id="comment"
              placeholder={
                isArabic
                  ? "أخبرنا بالمزيد عن تجربتك..."
                  : "Tell us more about your experience..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit}>
            {isArabic ? "إرسال" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
