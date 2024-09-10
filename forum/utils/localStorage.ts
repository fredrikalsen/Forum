const USER_KEY = 'user'; // Key for single user
const USERS_KEY = 'users'; // Key for multiple users
const THREADS_KEY = 'forum_threads';
const COMMENTS_KEY = 'forum_comments';

// Save a single user to local storage
export const saveUserToLocalStorage = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get the single user from local storage
export const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Remove the single user from local storage
export const removeUserFromLocalStorage = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Save a new user to the list of users in local storage
export const saveUser = (user: User): void => {
  const allUsers = getAllUsersFromLocalStorage();
  // Check if the username already exists
  if (allUsers.find(u => u.userName === user.userName)) {
    throw new Error('User already exists');
  }
  allUsers.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
};

// Get all users from local storage
export const getAllUsersFromLocalStorage = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save threads to local storage
export const saveThreadsToLocalStorage = (threads: Thread[]): void => {
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
};

// Get threads from local storage
export const getThreadsFromLocalStorage = (): Thread[] => {
  const threads = localStorage.getItem(THREADS_KEY);
  const parsedThreads: Thread[] = threads ? JSON.parse(threads) : [];

  // Calculate comment counts for each thread
  const comments = localStorage.getItem(COMMENTS_KEY);
  const allComments: ThreadComment[] = comments ? JSON.parse(comments) : [];

  return parsedThreads.map(thread => {
    const commentCount = allComments.filter(comment => comment.thread === thread.id).length;
    return { ...thread, commentCount }; // Add commentCount to each thread
  });
};

// Save a single comment to local storage
export const saveCommentToLocalStorage = (comment: ThreadComment): void => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  const allComments: ThreadComment[] = comments ? JSON.parse(comments) : [];
  allComments.push(comment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
};

// Get comments for a specific thread from local storage
export const getCommentsFromLocalStorage = (threadId: number): ThreadComment[] => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  const allComments: ThreadComment[] = comments ? JSON.parse(comments) : [];
  return allComments.filter(comment => comment.thread === threadId);
};

// Get a specific thread from local storage
export const getThreadFromLocalStorage = (threadId: number): QNAThread | null => {
  const threads = localStorage.getItem(THREADS_KEY);
  const allThreads: QNAThread[] = threads ? JSON.parse(threads) : [];
  return allThreads.find(thread => thread.id === threadId) || null;
};

// Save a specific thread to local storage
export const saveThreadToLocalStorage = (updatedThread: QNAThread): void => {
  const threads = localStorage.getItem(THREADS_KEY);
  let allThreads: QNAThread[] = threads ? JSON.parse(threads) : [];
  allThreads = allThreads.map(thread =>
    thread.id === updatedThread.id ? updatedThread : thread
  );
  localStorage.setItem(THREADS_KEY, JSON.stringify(allThreads));
};

// Mark a comment as an answer
export const markCommentAsAnswer = (threadId: number, commentId: number): void => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  if (comments) {
    const allComments: ThreadComment[] = JSON.parse(comments);
    // Set all comments in this thread to not be an answer
    const updatedComments = allComments.map(comment =>
      comment.thread === threadId
        ? { ...comment, isAnswer: comment.id === commentId }
        : comment
    );
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
  }
};
