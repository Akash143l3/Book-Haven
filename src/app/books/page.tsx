"use client";

import { useState, useEffect } from "react";
import BookList from "@/components/BookList";
import { useToast } from "@/components/ui/use-toast"; // ✅ Toast import
import { Skeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast(); // ✅ Use toast

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        toast({
          title: "Error loading books",
          description: "Something went wrong while fetching the book list.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [toast]);

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
          className="w-full sm:w-80 md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={handleSearch}
          disabled={loading}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <Skeleton className="h-64 w-full" /> {/* Image area */}
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" /> {/* Title */}
                <Skeleton className="h-4 w-1/2" /> {/* Author */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" /> {/* Stars */}
                  <Skeleton className="h-4 w-8" /> {/* Rating */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BookList books={displayBooks} />
      )}
    </div>
  );
}
