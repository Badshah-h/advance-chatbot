import React, { useState } from "react";
import FeedbackDialog from "../components/FeedbackDialog";
import { Button } from "../components/ui/button";

export default {
  title: "Components/FeedbackDialog",
  component: FeedbackDialog,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleSubmit = (data: any) => {
    setFeedback(data);
    setIsOpen(false);
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Open Feedback Dialog</Button>

      <FeedbackDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        messageId="test-message-id"
        initialHelpful={true}
        language="en"
      />

      {feedback && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="font-bold mb-2">Submitted Feedback:</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(feedback, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const ArabicVersion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4" dir="rtl">
      <Button onClick={() => setIsOpen(true)}>فتح نافذة التعليقات</Button>

      <FeedbackDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => console.log(data)}
        messageId="test-message-id"
        initialHelpful={false}
        language="ar"
      />
    </div>
  );
};

export const NegativeFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Open Feedback Dialog (Negative)
      </Button>

      <FeedbackDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => console.log(data)}
        messageId="test-message-id"
        initialHelpful={false}
        language="en"
      />
    </div>
  );
};
