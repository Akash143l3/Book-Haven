"use client";
import React from "react";
import { Search } from "lucide-react";
import { Book, BorrowedBook } from "../../types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface BorrowedBooksTableProps {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReturnBook: (borrowId: string) => void;
  loading: boolean;
}

const BorrowedBooksTable: React.FC<BorrowedBooksTableProps> = ({
  books,
  borrowedBooks,
  searchQuery,
  onSearchChange,
  onReturnBook,
  loading,
}) => {
  // Add this above the return block (inside the component)
const [statusFilter, setStatusFilter] = React.useState("all");

const filteredBorrowedBooks = borrowedBooks
  .filter(
    (book) =>
      (statusFilter === "all" || book.status === statusFilter) &&
      (book.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.borrowerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  .sort((a, b) => {
    const order = { borrowed: 0, overdue: 1, returned: 2 };
    return order[a.status] - order[b.status];
  });


  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <h2 className="text-2xl font-bold text-gray-800">Borrowed Books</h2>

  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
    {/* Search Input */}
    <div className="relative w-full sm:w-64">
      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm text-gray-800 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
      />
    </div>

    {/* Status Filter with shadcn/ui */}
    <Select
      value={statusFilter}
      onValueChange={(value) => setStatusFilter(value)}
    >
      <SelectTrigger className="w-full sm:w-48">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="borrowed">Borrowed</SelectItem>
        <SelectItem value="overdue">Overdue</SelectItem>
        <SelectItem value="returned">Returned</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>




      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["Borrower", "Book", "Borrow Date", "Due Date", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredBorrowedBooks.map((borrowedBook) => {
                return (
                  <tr key={borrowedBook._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">
                        {borrowedBook.borrowerName}
                      </div>
                      <div className="text-gray-500">{borrowedBook.borrowerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <div className="h-4 w-60 font-semibold truncate text-gray-800 overflow-hidden whitespace-nowrap">
                        {borrowedBook ? (
                          borrowedBook.bookTitle
                        ) : (
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        )}
                      </div>
                      <div className="text-gray-500">
                        {borrowedBook ? (
                          `by ${borrowedBook.bookAuthor}`
                        ) : (
                          <div className="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(borrowedBook.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          borrowedBook.status === "borrowed"
                            ? "bg-blue-100 text-blue-700"
                            : borrowedBook.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {borrowedBook.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {borrowedBook.status === "borrowed" && (
                        <button
                          onClick={() => onReturnBook(borrowedBook._id)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          Return Book
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredBorrowedBooks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No borrowed books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooksTable;
