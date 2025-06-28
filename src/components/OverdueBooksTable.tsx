"use client";
import React from "react";
import { Book, BorrowedBook } from "../../types";

interface OverdueBooksTableProps {
  books: Book[];
  overdueBooks: BorrowedBook[];
  onReturnBook: (borrowId: string) => void;
  onUpdateOverdueStatus: () => void;
  loading: boolean;
}

const OverdueBooksTable: React.FC<OverdueBooksTableProps> = ({
  books,
  overdueBooks,
  onReturnBook,
  onUpdateOverdueStatus,
  loading,
}) => {
  const FINE_PER_DAY = 50; // ₹50 per day fine rate

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-red-600">Overdue Books</h2>
        <button
          onClick={onUpdateOverdueStatus}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm sm:text-base"
        >
          Update Overdue Status
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="w-full bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Days Overdue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Fine (₹50/day)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overdueBooks.map((borrowedBook) => {
                const book = books.find((b) => b._id === borrowedBook.bookId);
                const daysOverdue = Math.ceil(
                  (new Date().getTime() -
                    new Date(borrowedBook.dueDate).getTime()) /
                    (1000 * 60 * 60 * 24) // Fixed: Changed 3600 to 60 * 60 for consistency
                );
                
                // Calculate fine based on days overdue
                const calculatedFine = daysOverdue * FINE_PER_DAY;
                const displayFine = calculatedFine;
                
                return (
                  <tr key={borrowedBook._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {borrowedBook.borrowerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {borrowedBook.borrowerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap ">
                      <div className="text-sm font-medium text-gray-900 w-80 truncate">
                        {borrowedBook.bookTitle || "Unknown Book"}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {borrowedBook.bookAuthor || "Unknown Author"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {new Date(borrowedBook.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                      {daysOverdue} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                      ₹ {displayFine.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onReturnBook(borrowedBook._id)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverdueBooksTable;