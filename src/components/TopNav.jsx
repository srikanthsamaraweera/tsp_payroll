"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function TopNav() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const navRef = useRef(null);

  // Toggle fixed position based on scroll position
  useEffect(() => {
    const menuHeight = navRef.current ? navRef.current.offsetHeight : 60; // Default to 60px if undefined
    const scrollThreshold = menuHeight + 5; // Set threshold a little more than the menu height

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        //setIsFixed(true);
      } else {
        // setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userInitial = session?.user?.email
    ? session.user.email[0].toUpperCase()
    : null;

  return (
    <nav
      className={`bg-gray-800 text-white p-4 ${
        isFixed ? "fixed top-0 w-full shadow-md z-50" : ""
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          <Link href="/" className="hover:text-gray-300">
            MyWebsite
          </Link>
        </div>

        <div className="flex items-center space-x-4 sm:hidden">
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full text-white font-bold focus:outline-none"
            >
              {userInitial ? (
                <span>{userInitial}</span>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A11.953 11.953 0 0112 15c2.764 0 5.293.983 7.121 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg py-2">
                {session ? (
                  <>
                    <p className="px-4 py-2 text-sm truncate max-w-[200px]">
                      Email: {session.user.email}
                    </p>
                    <p className="px-4 py-2 text-sm">
                      Level: {session.user.account_type}
                    </p>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/login" });
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-600"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="hidden sm:flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          {session ? (
            <>
              <p className="truncate max-w-[200px]">
                Email: {session.user.email}
              </p>
              <p>Level: {session.user.account_type}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-700 text-white p-4 space-y-4">
          <Link href="/" className="block hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="block hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="block hover:text-gray-300">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
