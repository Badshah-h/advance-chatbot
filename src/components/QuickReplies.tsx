import React from "react";
import { Button } from "./ui/button";

interface QuickReply {
  id: string;
  text: string;
}

interface QuickRepliesProps {
  replies: QuickReply[];
  onReplyClick: (reply: QuickReply) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({
  replies = [],
  onReplyClick,
}) => {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {replies.map((reply) => (
        <Button
          key={reply.id}
          variant="outline"
          size="sm"
          className="rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20"
          onClick={() => onReplyClick(reply)}
        >
          {reply.text}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplies;
