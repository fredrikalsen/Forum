'use client';

import React, { useState } from 'react';
import { getAllUsersFromLocalStorage, saveUserToLocalStorage, removeUserFromLocalStorage, getUserFromLocalStorage } from '../../utils/localStorage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = () => {
    const allUsers = getAllUsersFromLocalStorage();
    const user = allUsers.find(u => u.userName === userName && u.password === password);
    
    if (user) {
      saveUserToLocalStorage(user);
      router.push('/'); // Redirect to homepage after successful login
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        {getUserFromLocalStorage() ? (
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Welcome back, {getUserFromLocalStorage()?.userName}!</p>
            <button 
              onClick={() => {
                removeUserFromLocalStorage();
                router.push('/login'); // Redirect to login page after logout
              }}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
            <p className="text-center text-sm mt-4">
              If you don’t have an account, <Link href="/register" className="text-blue-600 hover:underline">register here</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
