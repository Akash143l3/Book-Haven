"use client";

import { useState, useEffect } from "react";
import BookList from "@/components/BookList";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]); // Store books fetched from the server
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]); // Store filtered books

  // Fetch books on client-side when the component is mounted
  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch("/api/books"); // Replace with your actual API route
      const data = await res.json();
      setBooks(data);
    };

    fetchBooks();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter books based on title or other relevant fields
    const filtered = books.filter((book: any) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  // If no search query, display all books
  const displayBooks = searchQuery ? filteredBooks : books;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Books</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <BookList books={displayBooks} />
    </div>
  );
}
