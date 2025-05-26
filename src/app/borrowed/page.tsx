"use client";
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, Book, Clock } from "lucide-react";

interface BorrowedBook {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'overdue' | 'returned';
  fine?: number;
}

export default function BorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BorrowedBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const mockData: BorrowedBook[] = [
      {
        id: "1",
        borrowerName: "John Doe",
        borrowerEmail: "john@example.com",
        bookId: "B001",
        bookTitle: "The Great Gatsby",
        bookAuthor: "F. Scott Fitzgerald",
        borrowDate: "2024-01-15",
        dueDate: "2024-02-15",
        status: "borrowed"
      },
      {
        id: "2",
        borrowerName: "Jane Smith",
        borrowerEmail: "jane@example.com",
        bookId: "B002",
        bookTitle: "To Kill a Mockingbird",
        bookAuthor: "Harper Lee",
        borrowDate: "2024-01-10",
        dueDate: "2024-02-10",
        status: "overdue",
        fine: 5.50
      },
      {
        id: "3",
        borrowerName: "Mike Johnson",
        borrowerEmail: "mike@example.com",
        bookId: "B003",
        bookTitle: "1984",
        bookAuthor: "George Orwell",
        borrowDate: "2024-01-05",
        dueDate: "2024-02-05",
        returnDate: "2024-02-03",
        status: "returned"
      },
      {
        id: "4",
        borrowerName: "Sarah Wilson",
        borrowerEmail: "sarah@example.com",
        bookId: "B004",
        bookTitle: "Pride and Prejudice",
        bookAuthor: "Jane Austen",
        borrowDate: "2024-01-20",
        dueDate: "2024-02-20",
        status: "borrowed"
      },
      {
        id: "5",
        borrowerName: "Tom Brown",
        borrowerEmail: "tom@example.com",
        bookId: "B005",
        bookTitle: "The Catcher in the Rye",
        bookAuthor: "J.D. Salinger",
        borrowDate: "2024-01-01",
        dueDate: "2024-02-01",
        status: "overdue",
        fine: 12.00
      }
    ];
    
    setTimeout(() => {
      setBorrowedBooks(mockData);
      setFilteredBooks(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter books based on search term and status
  useEffect(() => {
    let filtered = borrowedBooks;

    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(book => book.status === statusFilter);
    }

    setFilteredBooks(filtered);
  }, [searchTerm, statusFilter, borrowedBooks]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'borrowed':
        return <Badge variant="default" className="bg-blue-500">Borrowed</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'returned':
        return <Badge variant="secondary" className="bg-green-500 text-white">Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading borrowed books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Borrowed Books</h1>
          <p className="text-gray-600">Manage and track all borrowed books</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{borrowedBooks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Borrowed</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {borrowedBooks.filter(book => book.status === 'borrowed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {borrowedBooks.filter(book => book.status === 'overdue').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${borrowedBooks.reduce((sum, book) => sum + (book.fine || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by borrower, book title, author, or book ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="borrowed">Borrowed</option>
                <option value="overdue">Overdue</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Borrowed Books List</CardTitle>
            <CardDescription>
              Showing {filteredBooks.length} of {borrowedBooks.length} borrowed books
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {filteredBooks.length === 0 ? "No borrowed books found." : "A list of all borrowed books."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Book ID</TableHead>
                  <TableHead>Book Details</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{book.borrowerName}</div>
                        <div className="text-sm text-gray-500">{book.borrowerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{book.bookId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{book.bookTitle}</div>
                        <div className="text-sm text-gray-500">by {book.bookAuthor}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(book.borrowDate)}</TableCell>
                    <TableCell>
                      <div>
                        {formatDate(book.dueDate)}
                        {book.status === 'overdue' && (
                          <div className="text-xs text-red-600">
                            {calculateDaysOverdue(book.dueDate)} days overdue
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {book.returnDate ? formatDate(book.returnDate) : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(book.status)}</TableCell>
                    <TableCell>
                      {book.fine ? (
                        <span className="text-red-600 font-medium">${book.fine.toFixed(2)}</span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {book.status !== 'returned' && (
                          <Button size="sm" variant="outline">
                            Mark Returned
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}