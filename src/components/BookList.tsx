import Link from "next/link";
import { Book } from "../../types";
import Image from "next/image";

interface BookListProps {
  books: Book[];
}

export default function BookList({ books }: BookListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
      {books.map((book) => {
        const isSoldOut = book.availableStock === 0;

        const cardContent = (
          <div
            className={`border border-gray-200 rounded-lg overflow-hidden transition bg-white relative 
              ${isSoldOut ? "opacity-60 grayscale pointer-events-none" : "hover:shadow-md"}
            `}
          >
            <div className="h-80 bg-gray-50 flex items-center justify-center overflow-hidden relative">
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

              {isSoldOut && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="p-4 mt-4">
              <h3 className="font-semibold text-lg truncate">{book.title}</h3>
              <p className="text-gray-600 mt-1 truncate">{book.author}</p>
              <p className={`mt-1 text-sm font-medium ${isSoldOut ? "text-red-600" : "text-gray-600"}`}>
                {isSoldOut ? "Currently Unavailable" : `Available Stock: ${book.availableStock}`}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500 text-sm">★★★★☆</span>
                <span className="text-gray-600 text-sm">(4.0)</span>
              </div>
            </div>
          </div>
        );

        return isSoldOut ? (
          <div key={book._id}>{cardContent}</div>
        ) : (
          <Link href={`/books/${book._id}`} key={book._id}>
            {cardContent}
          </Link>
        );
      })}
    </div>
  );
}
