import React from "react";
import FeedbackAnalytics from "../FeedbackAnalytics";

const FeedbackAnalyticsStoryboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Feedback Analytics Dashboard</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">English Version</h2>
          <FeedbackAnalytics language="en" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-right">
            النسخة العربية
          </h2>
          <FeedbackAnalytics language="ar" />
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalyticsStoryboard;
