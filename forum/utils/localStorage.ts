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

// Get threads from local storage (with comment count and locked state)
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
  const thread = getThreadFromLocalStorage(comment.thread);

  // Check if the thread is locked before saving the comment
  if (thread?.locked) {
    throw new Error('This thread is locked. No comments can be added.');
  }

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

// Get a specific thread from local storage (with locked property)
export const getThreadFromLocalStorage = (threadId: number): Thread | null => {
  const threads = localStorage.getItem(THREADS_KEY);
  const allThreads: Thread[] = threads ? JSON.parse(threads) : [];
  return allThreads.find(thread => thread.id === threadId) || null;
};

// Save a specific thread to local storage (including locked state)
export const saveThreadToLocalStorage = (updatedThread: Thread): void => {
  const threads = localStorage.getItem(THREADS_KEY);
  let allThreads: Thread[] = threads ? JSON.parse(threads) : [];
  allThreads = allThreads.map(thread =>
    thread.id === updatedThread.id ? updatedThread : thread
  );
  localStorage.setItem(THREADS_KEY, JSON.stringify(allThreads));
};

// Toggle thread locked status
export const toggleThreadLock = (threadId: number): void => {
  const thread = getThreadFromLocalStorage(threadId);
  if (thread) {
    const updatedThread = { ...thread, locked: !thread.locked };
    saveThreadToLocalStorage(updatedThread);
  }
};

// Mark a comment as an answer (with locked thread check)
export const markCommentAsAnswer = (threadId: number, commentId: number): void => {
  const thread = getThreadFromLocalStorage(threadId);

  // Check if the thread is locked before marking an answer
  if (thread?.locked) {
    throw new Error('This thread is locked. No changes can be made.');
  }

  const comments = localStorage.getItem(COMMENTS_KEY);
  if (comments) {
    const allComments: ThreadComment[] = JSON.parse(comments);
    
    // Check if the comment to be toggled is already marked as an answer
    const commentIsAlreadyMarked = allComments.some(comment => comment.thread === threadId && comment.id === commentId && comment.isAnswer);
    
    // Toggle the isAnswer property
    const updatedComments = allComments.map(comment =>
      comment.thread === threadId
        ? { ...comment, isAnswer: comment.id === commentId ? !commentIsAlreadyMarked : comment.isAnswer }
        : comment
    );
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
  }
};


