import React, { useState, useEffect } from "react";
import CommentCard from "./commentCard";
import {
  getCommentsFromLocalStorage,
  saveCommentToLocalStorage,
  getUserFromLocalStorage,
  getThreadsFromLocalStorage,
  markCommentAsAnswer
} from '../utils/localStorage';

type CommentsSectionProps = {
  threadId: number;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ threadId }) => {
  const [comments, setComments] = useState<ThreadComment[]>(getCommentsFromLocalStorage(threadId));
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const user = getUserFromLocalStorage(); // Get the current logged-in user from local storage
  const [threadLocked, setThreadLocked] = useState<boolean>(false); // State to track if the thread is locked
  const [isQNA, setIsQNA] = useState<boolean>(false); // State to track if the thread is QNA

  useEffect(() => {
    const threads = getThreadsFromLocalStorage();
    const thread = threads.find((t) => t.id === threadId);
    if (thread) {
      setThreadLocked(thread.locked); // Check if the thread is locked
      setIsQNA(thread.category === "QNA"); // Check if the thread is a QNA thread
    }

    // Reload comments to reflect any changes
    const updatedComments = getCommentsFromLocalStorage(threadId);
    setComments(updatedComments);
  }, [threadId]);

  const handleAddComment = () => {
    // Check if the thread is locked
    if (threadLocked) {
      setError("This thread is locked and cannot receive new comments.");
      return;
    }

    if (!user) {
      setError("You must be logged in to comment.");
      return;
    }

    if (commentContent.trim() === "") {
      setError("Comment cannot be empty.");
      return;
    }

    const newComment: ThreadComment = {
      id: Date.now(),
      thread: threadId,
      content: commentContent,
      creator: user,
      creationDate: new Date().toISOString(),
      isAnswer: false // Default value
    };

    // Update the comments state
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setCommentContent("");

    // Save the new comment to local storage
    saveCommentToLocalStorage(newComment);

    // Clear error if the comment is successfully added
    setError(null);
  };

  const handleMarkAsAnswer = (commentId: number) => {
    if (!user) {
      setError("You must be logged in to mark comments as answers.");
      return;
    }

    if (!isQNA) {
      setError("Only QNA threads support marking comments as answers.");
      return;
    }

    // Mark the comment as an answer
    markCommentAsAnswer(threadId, commentId);

    // Reload comments to reflect the change
    const updatedComments = getCommentsFromLocalStorage(threadId);
    setComments(updatedComments);

    // Clear error if the comment is successfully marked as an answer
    setError(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Comments</h2>
      <ul>
        {comments.map(comment => (
          <CommentCard
            key={comment.id}
            comment={comment}
            isQNA={isQNA}
            onMarkAsAnswer={() => handleMarkAsAnswer(comment.id)}
          />
        ))}
      </ul>
      {threadLocked ? (
        <p className="text-red-500 mt-4">This thread is locked and cannot receive new comments.</p>
      ) : (
        <>
          <textarea
            placeholder="Add a comment"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full border rounded p-2 mt-4 text-black"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Comment
          </button>
        </>
      )}
    </div>
  );
};

export default CommentsSection;
