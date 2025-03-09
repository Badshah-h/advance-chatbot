import React from "react";
import DetailedFeedbackForm from "../DetailedFeedbackForm";

const DetailedFeedbackFormStoryboard = () => {
  const handleSubmit = (data: any) => {
    console.log("Feedback submitted:", data);
    alert("Feedback submitted: " + JSON.stringify(data, null, 2));
  };

  const handleCancel = () => {
    console.log("Feedback cancelled");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Detailed Feedback Form</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">English Version</h2>
          <DetailedFeedbackForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialRating={4}
            language="en"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md rtl">
          <h2 className="text-xl font-semibold mb-4">النسخة العربية</h2>
          <DetailedFeedbackForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialRating={4}
            language="ar"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailedFeedbackFormStoryboard;
