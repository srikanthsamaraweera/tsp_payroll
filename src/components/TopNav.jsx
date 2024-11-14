"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function TopNav() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand */}
        <div className="text-lg font-semibold">
          <Link href="/" className="hover:text-gray-300">
            MyWebsite
          </Link>
        </div>

        {/* Desktop Menu Links */}
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

        {/* User Info and Sign Out for Desktop */}
        <div className="hidden sm:flex items-center space-x-4">
          {session ? (
            <>
              <p>Email: {session.user.email}</p>
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

        {/* Hamburger Menu Icon for Mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:outline-none"
          >
            {/* Hamburger icon */}
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
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (expanded when isMobileMenuOpen is true) */}
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
          {session ? (
            <>
              <p>Email: {session.user.email}</p>
              <p>Level: {session.user.account_type}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 w-full text-center"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 w-full text-center block"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
