'use client';
import { getCommentsFromLocalStorage, getThreadsFromLocalStorage, saveCommentToLocalStorage, saveThreadsToLocalStorage } from "@/utils/localStorage";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ThreadDetailHeader from "@/components/threadDetailHeader";
import CommentsSection from "@/components/commentsSection";

const ThreadPage = () => {
  const { id } = useParams();

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const storedThreads = getThreadsFromLocalStorage();
      const selectedThread = storedThreads.find(t => t.id === Number(id));
      setThread(selectedThread || null);

      const threadComments = getCommentsFromLocalStorage(Number(id));
      setComments(threadComments);
    }
  }, [id]);

  const handleAddComment = (newComment: ThreadComment) => {
    saveCommentToLocalStorage(newComment);
    setComments([...comments, newComment]);

    // Update the thread's comment count
    if (thread) {
      const updatedThread = { ...thread, commentCount: thread.commentCount + 1 };
      setThread(updatedThread);

      // Update the threads in local storage
      const storedThreads = getThreadsFromLocalStorage();
      const updatedThreads = storedThreads.map(t => 
        t.id === updatedThread.id ? updatedThread : t
      );
      saveThreadsToLocalStorage(updatedThreads);
    }
  };

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ThreadDetailHeader thread={thread} onCommentIconClick={scrollToComments} />
      <div ref={commentsRef}>
        <CommentsSection 
          threadId={thread.id} 
          initialComments={comments} 
          onAddComment={handleAddComment} 
        />
      </div>
    </div>
  );
};

export default ThreadPage;
