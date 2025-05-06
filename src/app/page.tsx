import Link from "next/link";
import { getBooks } from "../lib/mongodb";
import BookList from "@/components/BookList";

export default async function Home() {
  const books = await getBooks();

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-800 to-purple-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            Book Haven
          </h1>
          <p className="text-xl text-white text-center mb-8">
            Your Digital Library Management System
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/books"
              className="bg-white text-purple-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Browse Books
            </Link>
            <Link
              href="/collections"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              My Collections
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Recently Added Books</h2>
        <BookList books={books.slice(0, 6)} />
      </div>

      <div className="bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Book Management</h3>
              <p className="text-gray-600">
                Add, edit, and organize your book collection with ease.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Reading Lists</h3>
              <p className="text-gray-600">
                Create custom reading lists and track your reading progress.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Cloud Sync</h3>
              <p className="text-gray-600">
                Access your library from anywhere with cloud synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
