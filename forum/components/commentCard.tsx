import React from "react";
import { formatDistanceToNow } from "date-fns";

type CommentCardProps = {
  comment: ThreadComment;
  isQNA: boolean;
  onMarkAsAnswer: () => void;
};

const CommentCard: React.FC<CommentCardProps> = ({ comment, isQNA, onMarkAsAnswer }) => {
  // Provide a default date if creationDate is missing or invalid
  const creationDate = comment.creationDate ? new Date(comment.creationDate) : new Date();

  return (
    <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-2">
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <span>u/{comment.creator.userName}</span>
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(creationDate)} ago</span>
      </div>
      <p className="text-sm text-gray-800">{comment.content}</p>
      {isQNA && !comment.isAnswer && (
        <button
          onClick={onMarkAsAnswer}
          className="mt-2 px-1 py-0 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Mark as Answer
        </button>
      )}
      {comment.isAnswer && (
        <p className="text-green-500 mt-2">Marked as Answer</p>
      )}
    </div>
  );
};

export default CommentCard;
