'use client';

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaRegCommentAlt } from "react-icons/fa";

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const { creator, creationDate, title, description, commentCount } = thread;
  const username = creator.userName; // Get the username from the creator field

  return (
    <li>
      <Link
        href={`/${thread.id}`}
        className="block bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-300 transition duration-200 ease-in-out"
      >
        <p className="text-xs font-bold text-gray-600 mb-1">r/{thread.category}</p>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>u/{username}</span>
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(new Date(creationDate))} ago</span>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 transition-colors">
          {title}
        </h2>
        <p className="text-sm text-gray-700 line-clamp-3">{description}</p>

        <div className="flex items-center text-xs text-gray-500 mt-2">
          <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-400 transition-colors">
            <FaRegCommentAlt className="text-lg mr-1.5 text-gray-700" />
            <span className="text-sm font-semibold text-gray-700">{commentCount}</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ThreadCard;
