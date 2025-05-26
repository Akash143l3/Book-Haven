"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow-md w-full sticky top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 p-4 ">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Book Haven
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/books"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 py-2 px-4 rounded-md hover:bg-blue-100"
            >
              Books
            </Link>
            <Link
              href="/collections"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 py-2 px-4 rounded-md hover:bg-blue-100"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 py-2 px-4 rounded-md hover:bg-blue-100"
            >
              About
            </Link>
             <Link
              href="/borrowed"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 py-2 px-4 rounded-md hover:bg-blue-100"
            >
              Borrowed
            </Link>
            <Link href="/books/add">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
                Add Book
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          {
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          }
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 mt-2">
          <div className="px-4 space-y-4">
            <Link
              href="/books"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Books
            </Link>
            <Link
              href="/collections"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/borrowed"
              className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Borrowed
            </Link>
            <Link href="/books/add">
              <button
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Book
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
