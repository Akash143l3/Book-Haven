// LibraryManagementSystem.tsx (Main Component)
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import MessageAlert from "@/components/MessageAlert";
import Dashboard from "@/components/Dashboard";
import BorrowForm from "@/components/BorrowForm";
import BorrowedBooksTable from "@/components/BorrowedBooksTable";
import OverdueBooksTable from "@/components/OverdueBooksTable";
import { Book, BorrowedBook, BorrowBookRequest, Message } from "../../../types";

export default function LibraryManagementSystem() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "borrow" | "borrowed" | "overdue"
  >("dashboard");
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<BorrowedBook[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error("Failed to fetch books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetch borrowed books from API
  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch("/api/borrowed-books");
      if (response.ok) {
        const data = await response.json();
        setBorrowedBooks(data);
      } else {
        console.error("Failed to fetch borrowed books");
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  };

  // Fetch overdue books from API
  const fetchOverdueBooks = async () => {
    try {
      const response = await fetch("/api/borrowed-books/overdue");
      if (response.ok) {
        const data = await response.json();
        setOverdueBooks(data);
      } else {
        console.error("Failed to fetch overdue books");
      }
    } catch (error) {
      console.error("Error fetching overdue books:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
    fetchOverdueBooks();
  }, []);

  const handleTabClick = (tabId: string) => {
    setCurrentView(tabId as "dashboard" | "borrow" | "borrowed" | "overdue");
    setMobileMenuOpen(false);
  };

  const handleBorrowBook = async (formData: BorrowBookRequest) => {
    setLoading(true);
    try {
      const response = await fetch("/api/borrowed-books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: "success", text: "Book borrowed successfully!" });
        await fetchBorrowedBooks(); // Refresh borrowed books
        setCurrentView("dashboard");
      } else {
        setMessage({ 
          type: "error", 
          text: result.message || "Failed to borrow book. Please try again." 
        });
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      setMessage({ type: "error", text: "Failed to borrow book. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/borrowed-books/return?borrowId=${borrowId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnDate: new Date().toISOString().split('T')[0]
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: "success", text: "Book returned successfully!" });
        await fetchBorrowedBooks(); // Refresh borrowed books
        await fetchOverdueBooks(); // Refresh overdue books
      } else {
        setMessage({ 
          type: "error", 
          text: result.message || "Failed to return book. Please try again." 
        });
      }
    } catch (error) {
      console.error("Error returning book:", error);
      setMessage({ type: "error", text: "Failed to return book. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOverdueStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/borrowed-books/overdue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          finePerDay: 50 // ₹10 per day fine
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ 
          type: "success", 
          text: result.message || "Overdue status updated successfully!" 
        });
        await fetchBorrowedBooks(); // Refresh borrowed books
        await fetchOverdueBooks(); // Refresh overdue books
      } else {
        setMessage({ 
          type: "error", 
          text: result.message || "Failed to update overdue status." 
        });
      }
    } catch (error) {
      console.error("Error updating overdue status:", error);
      setMessage({ type: "error", text: "Failed to update overdue status." });
    } finally {
      setLoading(false);
    }
  };

  // Handle search for borrowed books
  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      try {
        const response = await fetch(`/api/borrowed-books?search=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setBorrowedBooks(data);
        }
      } catch (error) {
        console.error("Error searching borrowed books:", error);
      }
    } else {
      // If search is empty, fetch all borrowed books
      await fetchBorrowedBooks();
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            books={books}
            borrowedBooks={borrowedBooks}
            overdueBooks={overdueBooks}
            onViewChange={setCurrentView}
          />
        );
      case "borrow":
        return (
          <BorrowForm
            books={books}
            onSubmit={handleBorrowBook}
            onBack={() => setCurrentView("dashboard")}
            loading={loading}
          />
        );
      case "borrowed":
        return (
          <BorrowedBooksTable
            books={books}
            borrowedBooks={borrowedBooks}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onReturnBook={handleReturnBook}
            loading={loading}
          />
        );
      case "overdue":
        return (
          <OverdueBooksTable
            books={books}
            overdueBooks={overdueBooks}
            onReturnBook={handleReturnBook}
            onUpdateOverdueStatus={handleUpdateOverdueStatus}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentView={currentView}
        onTabClick={handleTabClick}
      />
      
      <MessageAlert message={message} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}