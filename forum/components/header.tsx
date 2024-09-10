'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { FiSearch } from 'react-icons/fi';
import Image from "next/image";
import { getUserFromLocalStorage, removeUserFromLocalStorage } from '../utils/localStorage'; // Adjust the path as needed

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if a user is logged in when the component mounts
    const loggedInUser = getUserFromLocalStorage();
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    removeUserFromLocalStorage();
    setUser(null);
  };

  return (
    <header
      className="px-4 py-4 flex justify-between items-center w-full"
      style={{ boxShadow: '0px 1px 0px rgba(229, 231, 235, 0.5)' }} // Simulating a 0.5px border with shadow
    >
      <div className="flex-1">
        <Link href="/">
          <div className="cursor-pointer">
            <Image
              src="/räddit.png" // Path to the image in the public folder
              alt="Räddit Logo"
              width={100} // Set the desired width of the logo
              height={40} // Set the desired height of the logo
            />
          </div>
        </Link>
      </div>

      <div className="flex-1 text-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="border rounded-full pl-10 pr-3 py-2 w-full text-sm text-white bg-gray-800"
          />
        </div>
      </div>

      <div className="flex-1 text-right">
        {user ? (
          <button 
            onClick={handleLogout} 
            className="bg-red-600 text-white rounded-full hover:bg-red-700 px-4 py-2 text-sm"
          >
            Log out
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-red-600 text-white rounded-full hover:bg-red-700 px-4 py-2 text-sm">
              Log in
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
