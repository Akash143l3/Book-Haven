"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

// Types based on your API
interface Book {
  _id: string;
  title: string;
  author: string;
  publishedDate: string;
  coverImage?: string;
  isbn?: string;
}

interface BorrowedBook {
  _id: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone?: string;
  bookId: string;
  book?: Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
  notes?: string;
  fine?: number;
}

interface BorrowBookRequest {
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone?: string;
  bookId: string;
  dueDate: string;
  notes?: string;
}

export default function LibraryManagementSystem() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "borrow" | "borrowed" | "overdue"
  >("dashboard");
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<BorrowedBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Borrow form state
  const [borrowForm, setBorrowForm] = useState<BorrowBookRequest>({
    borrowerName: "",
    borrowerEmail: "",
    borrowerPhone: "",
    bookId: "",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
    fetchOverdueBooks();
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      showMessage("error", "Failed to fetch books");
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch("/api/borrowed-books");
      const data = await response.json();
      setBorrowedBooks(data);
    } catch (error) {
      showMessage("error", "Failed to fetch borrowed books");
    }
  };

  const fetchOverdueBooks = async () => {
    try {
      const response = await fetch("/api/borrowed-books/overdue");
      const data = await response.json();
      setOverdueBooks(data);
    } catch (error) {
      showMessage("error", "Failed to fetch overdue books");
    }
  };

  const handleBorrowBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/borrowed-books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowForm),
      });

      const result = await response.json();

      if (result.success) {
        showMessage("success", "Book borrowed successfully!");
        setBorrowForm({
          borrowerName: "",
          borrowerEmail: "",
          borrowerPhone: "",
          bookId: "",
          dueDate: "",
          notes: "",
        });
        fetchBorrowedBooks();
        setCurrentView("borrowed");
      } else {
        showMessage("error", result.message || "Failed to borrow book");
      }
    } catch (error) {
      showMessage("error", "Failed to borrow book");
    }

    setLoading(false);
  };

  const handleReturnBook = async (borrowId: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/borrowed-books/return?borrowId=${borrowId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const result = await response.json();

      if (result.success) {
        showMessage("success", "Book returned successfully!");
        fetchBorrowedBooks();
        fetchOverdueBooks();
      } else {
        showMessage("error", result.message || "Failed to return book");
      }
    } catch (error) {
      showMessage("error", "Failed to return book");
    }

    setLoading(false);
  };

  const updateOverdueStatus = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/borrowed-books/overdue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ finePerDay: 0.5 }),
      });

      const result = await response.json();
      showMessage("success", result.message);
      fetchOverdueBooks();
      fetchBorrowedBooks();
    } catch (error) {
      showMessage("error", "Failed to update overdue status");
    }

    setLoading(false);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBorrowedBooks = borrowedBooks.filter(
    (book) =>
      book.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.borrowerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
    { id: "borrow", label: "Borrow Book", icon: Plus },
    { id: "borrowed", label: "Borrowed Books", icon: User },
    {
      id: "overdue",
      label: "Overdue Books",
      icon: AlertTriangle,
      isAlert: true,
    },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentView(tabId as any);
    setMobileMenuOpen(false);
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Total Books</h3>
            <p className="text-3xl font-bold">{books.length}</p>
          </div>
          <BookOpen className="h-12 w-12 opacity-80" />
        </div>
      </div>

      <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Currently Borrowed</h3>
            <p className="text-3xl font-bold">
              {borrowedBooks.filter((b) => b.status === "borrowed").length}
            </p>
          </div>
          <User className="h-12 w-12 opacity-80" />
        </div>
      </div>

      <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Overdue Books</h3>
            <p className="text-3xl font-bold">{overdueBooks.length}</p>
          </div>
          <AlertTriangle className="h-12 w-12 opacity-80" />
        </div>
      </div>

      <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Total Returns</h3>
            <p className="text-3xl font-bold">
              {borrowedBooks.filter((b) => b.status === "returned").length}
            </p>
          </div>
          <CheckCircle className="h-12 w-12 opacity-80" />
        </div>
      </div>
    </div>
  );

  const renderBorrowForm = () => (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentView("dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Borrow a Book</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Borrower Name *
              </label>
              <input
                type="text"
                required
                value={borrowForm.borrowerName}
                onChange={(e) =>
                  setBorrowForm({ ...borrowForm, borrowerName: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter borrower name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={borrowForm.borrowerEmail}
                onChange={(e) =>
                  setBorrowForm({
                    ...borrowForm,
                    borrowerEmail: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={borrowForm.borrowerPhone}
                onChange={(e) =>
                  setBorrowForm({
                    ...borrowForm,
                    borrowerPhone: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Due Date *
              </label>
              <input
                type="date"
                required
                value={borrowForm.dueDate}
                onChange={(e) =>
                  setBorrowForm({ ...borrowForm, dueDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="h-4 w-4 inline mr-2" />
              Select Book *
            </label>
            <select
              required
              value={borrowForm.bookId}
              onChange={(e) =>
                setBorrowForm({ ...borrowForm, bookId: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a book...</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={borrowForm.notes}
              onChange={(e) =>
                setBorrowForm({ ...borrowForm, notes: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <button
            type="button"
            onClick={handleBorrowBook}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? "Processing..." : "Borrow Book"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderBorrowedBooks = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Borrowed Books</h2>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search borrowed books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrow Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrowedBooks.map((borrowedBook) => {
                const book = books.find((b) => b._id === borrowedBook.bookId);
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {book?.title || "Unknown Book"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {book?.author || "Unknown Author"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(borrowedBook.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          borrowedBook.status === "borrowed"
                            ? "bg-green-100 text-green-800"
                            : borrowedBook.status === "overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {borrowedBook.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {borrowedBook.status === "borrowed" && (
                        <button
                          onClick={() => handleReturnBook(borrowedBook._id)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          Return Book
                        </button>
                      )}
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

  const renderOverdueBooks = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-red-600">Overdue Books</h2>
        <button
          onClick={updateOverdueStatus}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm sm:text-base"
        >
          Update Overdue Status
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
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
                  Fine
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
                    (1000 * 3600 * 24)
                );
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {book?.title || "Unknown Book"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {book?.author || "Unknown Author"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {new Date(borrowedBook.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                      {daysOverdue} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                      ₹ {borrowedBook.fine?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleReturnBook(borrowedBook._id)}
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop tabs */}
            <div className="hidden lg:block">
              <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                        currentView === tab.id
                          ? tab.isAlert
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Mobile tabs */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                        currentView === tab.id
                          ? tab.isAlert
                            ? "bg-red-50 text-red-700 border-l-4 border-red-600"
                            : "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" && (
          <div>
            {renderDashboard()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Borrowed Books
                </h3>
                <div className="space-y-3">
                  {borrowedBooks.slice(0, 5).map((borrowedBook) => {
                    const book = books.find(
                      (b) => b._id === borrowedBook.bookId
                    );
                    return (
                      <div
                        key={borrowedBook._id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div>
                          <div className="font-medium">
                            {book?.title || "Unknown Book"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {borrowedBook.borrowerName}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            borrowedBook.status === "borrowed"
                              ? "bg-green-100 text-green-800"
                              : borrowedBook.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {borrowedBook.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentView("borrow")}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center"
                  >
                    <Plus className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-blue-600">
                      Borrow a New Book
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentView("borrowed")}
                    className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg flex items-center"
                  >
                    <BookOpen className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-green-600">
                      View All Borrowed Books
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentView("overdue")}
                    className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg flex items-center"
                  >
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                    <span className="font-medium text-red-600">
                      Check Overdue Books
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === "borrow" && renderBorrowForm()}
        {currentView === "borrowed" && renderBorrowedBooks()}
        {currentView === "overdue" && renderOverdueBooks()}
      </div>
    </div>
  );
}
