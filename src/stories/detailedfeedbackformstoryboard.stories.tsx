import DetailedFeedbackFormStoryboard from "../components/storyboards/DetailedFeedbackFormStoryboard.tsx";
import React from "react";

export const Feedbackform = {
  render: () => {
    return (
      <>
        <DetailedFeedbackFormStoryboard />
      </>
    );
  },
};

export default {
  title: "Tempo/Feedbackform",
  component: DetailedFeedbackFormStoryboard,
};
