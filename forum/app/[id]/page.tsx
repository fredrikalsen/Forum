'use client';
import { getCommentsFromLocalStorage, getThreadsFromLocalStorage, saveCommentToLocalStorage, saveThreadsToLocalStorage, getUserFromLocalStorage, toggleThreadLock } from "@/utils/localStorage";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ThreadDetailHeader from "@/components/threadDetailHeader";
import CommentsSection from "@/components/commentsSection";

const ThreadPage = () => {
  const { id } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Get current user

  useEffect(() => {
    const user = getUserFromLocalStorage(); // Get the logged-in user from local storage
    setCurrentUser(user);

    if (id) {
      const storedThreads = getThreadsFromLocalStorage();
      const selectedThread = storedThreads.find(t => t.id === Number(id));
      setThread(selectedThread || null);

      const threadComments = getCommentsFromLocalStorage(Number(id));
      setComments(threadComments);
    }
  }, [id]);

  const handleAddComment = (newComment: ThreadComment) => {
    if (thread?.locked) {
      alert("This thread is locked. No comments can be added.");
      return;
    }
    saveCommentToLocalStorage(newComment);
    setComments([...comments, newComment]);

    if (thread) {
      const updatedThread = { ...thread, commentCount: thread.commentCount + 1 };
      setThread(updatedThread);

      const storedThreads = getThreadsFromLocalStorage();
      const updatedThreads = storedThreads.map(t => 
        t.id === updatedThread.id ? updatedThread : t
      );
      saveThreadsToLocalStorage(updatedThreads);
    }
  };

  const handleLockToggle = () => {
    if (thread) {
      toggleThreadLock(thread.id); // Toggle the locked state
      setThread(prev => prev ? { ...prev, locked: !prev.locked } : null); // Update UI
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

  // Check if the current user is the thread's creator
  const isCreator = currentUser && thread.creator.userName === currentUser.userName;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ThreadDetailHeader 
        thread={thread} 
        onCommentIconClick={scrollToComments} 
        onLockToggle={handleLockToggle} 
        isCreator={isCreator} // Pass the creator check
      />
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
