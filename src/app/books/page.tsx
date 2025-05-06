"use client";

import { useState, useEffect } from "react";
import BookList from "@/components/BookList";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // 🔄 Loading state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
        setLoading(false); // ✅ Set loading to false once data is fetched
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setLoading(false); // Even on error, stop loading
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = books.filter((book: any) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

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
          disabled={loading} // Optionally disable search while loading
        />
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading books...</p>
      ) : (
        <BookList books={displayBooks} />
      )}
    </div>
  );
}
