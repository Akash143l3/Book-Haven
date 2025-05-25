// src/app/books/[id]/page.tsx
import { getBookById } from "../../../lib/mongodb";
import Image from "next/image";
import BookCollections from "@/components/BookCollections";
import BookActions from "@/components/BookActions";

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const book = await getBookById(params.id);

  if (!book) return <div className="text-center py-12">Book not found</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="bg-white border h-96 rounded-lg flex items-center justify-center">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                className="max-w-full max-h-full object-contain"
                width={300}
                height={320}
              />
            ) : (
              <div className="text-gray-400">No cover image</div>
            )}
          </div>
          <BookCollections bookId={book._id.toString()} />
        </div>

        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-4">by {book.author}</p>

          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-500">★★★★☆</span>
              <span className="text-gray-600">(4.0)</span>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-600">{book.pageCount} pages</span>
              <span className="text-gray-600">{book.publishedDate}</span>
              <span className="text-gray-600">{book.genre}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{book.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">ISBN:</p>
                <p>{book.isbn || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Publisher:</p>
                <p>{book.publisher || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Language:</p>
                <p>{book.language || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Format:</p>
                <p>{book.format || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Add Client Component here */}
          <BookActions bookId={book._id.toString()} />
        </div>
      </div>
    </div>
  );
}
