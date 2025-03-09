import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface FeedbackAnalyticsProps {
  language?: "en" | "ar";
}

const FeedbackAnalytics: React.FC<FeedbackAnalyticsProps> = ({
  language = "en",
}) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const { getFeedbackSummary, getFeedbackImprovements } = await import(
          "../services/feedbackAnalyticsService"
        );

        // Get feedback summary
        const { data: summaryData, error: summaryError } =
          await getFeedbackSummary();
        if (summaryError) {
          setError(summaryError);
          return;
        }

        // Get improvement suggestions
        const { data: improvementsData, error: improvementsError } =
          await getFeedbackImprovements();
        if (improvementsError) {
          setError(improvementsError);
          return;
        }

        setAnalyticsData(summaryData);
        setImprovements(improvementsData || []);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error("Error loading analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const isArabic = language === "ar";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="font-semibold">
          {isArabic ? "خطأ في تحميل البيانات" : "Error Loading Data"}
        </h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
        <h3 className="font-semibold">
          {isArabic ? "لا توجد بيانات" : "No Data Available"}
        </h3>
        <p>
          {isArabic
            ? "لم يتم العثور على بيانات التحليلات."
            : "No analytics data found."}
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${isArabic ? "rtl" : "ltr"}`}>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            {isArabic ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="ratings">
            {isArabic ? "التقييمات" : "Ratings"}
          </TabsTrigger>
          <TabsTrigger value="improvements">
            {isArabic ? "اقتراحات التحسين" : "Improvement Suggestions"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {isArabic ? "إجمالي التعليقات" : "Total Feedback"}
                </CardTitle>
                <CardDescription>
                  {isArabic
                    ? "عدد التعليقات المستلمة"
                    : "Number of feedback received"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analyticsData.totalFeedback}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {isArabic ? "متوسط التقييم" : "Average Rating"}
                </CardTitle>
                <CardDescription>
                  {isArabic ? "على مقياس من 1 إلى 5" : "On a scale of 1 to 5"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analyticsData.averageRating.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {isArabic ? "نسبة الرضا" : "Satisfaction Rate"}
                </CardTitle>
                <CardDescription>
                  {isArabic
                    ? "النسبة المئوية للتعليقات الإيجابية"
                    : "Percentage of positive feedback"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analyticsData.positivePercentage.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? "أهم الفئات" : "Top Categories"}
              </CardTitle>
              <CardDescription>
                {isArabic
                  ? "الفئات الأكثر ذكرًا في التعليقات"
                  : "Most mentioned categories in feedback"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.topCategories.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.topCategories.map((category: any) => (
                    <div key={category.category} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {translateCategory(category.category, isArabic)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {category.count}
                        </span>
                      </div>
                      <Progress
                        value={
                          (category.count / analyticsData.totalFeedback) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  {isArabic
                    ? "لا توجد بيانات فئات متاحة"
                    : "No category data available"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? "توزيع التقييمات" : "Rating Distribution"}
              </CardTitle>
              <CardDescription>
                {isArabic
                  ? "عدد التعليقات لكل مستوى تقييم"
                  : "Number of feedback for each rating level"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analyticsData.ratingDistribution)
                  .sort((a, b) => Number(b[0]) - Number(a[0]))
                  .map(([rating, count]) => (
                    <div key={rating} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {getRatingLabel(Number(rating), isArabic)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {count} (
                          {analyticsData.totalFeedback > 0
                            ? (
                                (Number(count) / analyticsData.totalFeedback) *
                                100
                              ).toFixed(1)
                            : 0}
                          %)
                        </span>
                      </div>
                      <Progress
                        value={
                          analyticsData.totalFeedback > 0
                            ? (Number(count) / analyticsData.totalFeedback) *
                              100
                            : 0
                        }
                        className={`h-2 ${getRatingColorClass(Number(rating))}`}
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? "اقتراحات التحسين" : "Improvement Suggestions"}
              </CardTitle>
              <CardDescription>
                {isArabic
                  ? "اقتراحات المستخدمين لتحسين الخدمة"
                  : "User suggestions for service improvement"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {improvements.length > 0 ? (
                <ul className="space-y-3">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="p-3 bg-muted rounded-md">
                      <p className="text-sm">"{improvement}"</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  {isArabic
                    ? "لا توجد اقتراحات تحسين متاحة"
                    : "No improvement suggestions available"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions
function translateCategory(category: string, isArabic: boolean): string {
  const translations: Record<string, string> = {
    accuracy: "دقة المعلومات",
    relevance: "صلة المعلومات",
    completeness: "اكتمال المعلومات",
    clarity: "وضوح المعلومات",
    speed: "سرعة الاستجابة",
  };

  return isArabic ? translations[category] || category : category;
}

function getRatingLabel(rating: number, isArabic: boolean): string {
  if (isArabic) {
    switch (rating) {
      case 5:
        return "ممتاز - مفيد للغاية";
      case 4:
        return "جيد - مفيد";
      case 3:
        return "متوسط - مفيد جزئيًا";
      case 2:
        return "ضعيف - غير مفيد";
      case 1:
        return "سيء جدًا - غير دقيق أو مضلل";
      default:
        return `تقييم ${rating}`;
    }
  } else {
    switch (rating) {
      case 5:
        return "Excellent - Very helpful";
      case 4:
        return "Good - Helpful";
      case 3:
        return "Average - Somewhat helpful";
      case 2:
        return "Poor - Not helpful";
      case 1:
        return "Very poor - Inaccurate or misleading";
      default:
        return `Rating ${rating}`;
    }
  }
}

function getRatingColorClass(rating: number): string {
  switch (rating) {
    case 5:
      return "bg-green-500";
    case 4:
      return "bg-green-400";
    case 3:
      return "bg-yellow-400";
    case 2:
      return "bg-orange-400";
    case 1:
      return "bg-red-500";
    default:
      return "";
  }
}

export default FeedbackAnalytics;
