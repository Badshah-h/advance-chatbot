import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";

interface DetailedFeedbackFormProps {
  onSubmit: (feedback: {
    rating: number;
    comment: string;
    helpful: boolean;
    categories: string[];
    improvement: string;
    contactConsent: boolean;
    contactEmail?: string;
  }) => void;
  onCancel: () => void;
  initialRating?: number;
  isLoading?: boolean;
  language?: "en" | "ar";
}

const DetailedFeedbackForm: React.FC<DetailedFeedbackFormProps> = ({
  onSubmit,
  onCancel,
  initialRating = 3,
  isLoading = false,
  language = "en",
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [comment, setComment] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [improvement, setImprovement] = useState<string>("");
  const [contactConsent, setContactConsent] = useState<boolean>(false);
  const [contactEmail, setContactEmail] = useState<string>("");

  const isArabic = language === "ar";

  const feedbackCategories = [
    {
      id: "accuracy",
      label: isArabic ? "دقة المعلومات" : "Information Accuracy",
    },
    {
      id: "relevance",
      label: isArabic ? "صلة المعلومات" : "Information Relevance",
    },
    {
      id: "completeness",
      label: isArabic ? "اكتمال المعلومات" : "Information Completeness",
    },
    {
      id: "clarity",
      label: isArabic ? "وضوح المعلومات" : "Information Clarity",
    },
    {
      id: "speed",
      label: isArabic ? "سرعة الاستجابة" : "Response Speed",
    },
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment,
      helpful: rating >= 3,
      categories: selectedCategories,
      improvement,
      contactConsent,
      contactEmail: contactConsent ? contactEmail : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">
          {isArabic ? "التقييم العام" : "Overall Rating"}
        </Label>
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
              {isArabic ? "متوسط - مفيد جزئيًا" : "Average - Somewhat helpful"}
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
      </div>

      <div className="space-y-2">
        <Label>
          {isArabic
            ? "ما الذي أعجبك أو لم يعجبك؟"
            : "What did you like or dislike?"}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {feedbackCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <Label htmlFor={category.id} className="text-sm">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

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
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="improvement">
          {isArabic
            ? "كيف يمكننا تحسين هذه الخدمة؟ (اختياري)"
            : "How can we improve this service? (optional)"}
        </Label>
        <Textarea
          id="improvement"
          placeholder={
            isArabic
              ? "اقتراحاتك للتحسين..."
              : "Your suggestions for improvement..."
          }
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="contact-consent"
            checked={contactConsent}
            onCheckedChange={(checked) => setContactConsent(!!checked)}
          />
          <Label htmlFor="contact-consent" className="text-sm">
            {isArabic
              ? "أود أن يتم الاتصال بي لمزيد من المعلومات حول تعليقاتي"
              : "I would like to be contacted for more information about my feedback"}
          </Label>
        </div>

        {contactConsent && (
          <div className="pl-6 space-y-2">
            <Label htmlFor="contact-email">
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </Label>
            <input
              type="email"
              id="contact-email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={
                isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email address"
              }
              required={contactConsent}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {isArabic ? "إلغاء" : "Cancel"}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isArabic ? "إرسال" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default DetailedFeedbackForm;
