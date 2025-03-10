import FeedbackAnalyticsStoryboard from "../components/storyboards/FeedbackAnalyticsStoryboard.tsx";
import React from "react";

export const Feedbackanalytics = {
  render: () => {
    return (
      <>
        <FeedbackAnalyticsStoryboard />
      </>
    );
  },
};

export default {
  title: "Tempo/Feedbackanalytics",
  component: FeedbackAnalyticsStoryboard,
};
