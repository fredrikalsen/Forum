'use client';

import { useEffect, useState } from "react";
import { getThreadsFromLocalStorage, saveThreadsToLocalStorage } from "../utils/localStorage";
import Link from "next/link";
import ThreadCard from "@/components/threadCard";

const Home = () => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const storedThreads = getThreadsFromLocalStorage();
    setThreads(storedThreads);
  }, []);



  return (
    <div className="bg-gray-100 min-h-screen"> {/* Changed background color */}
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-between mb-4">
          <Link 
            href="/create-thread" 
            className="inline-block text-white bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create a New Thread
          </Link>
          
        </div>
        <ul className="space-y-4">
          {threads
            .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
            .map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
