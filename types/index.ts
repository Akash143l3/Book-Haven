// types/index.ts

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  publishedDate: string;
  pageCount: number;
  genre: string;
  isbn?: string;
  publisher?: string;
  language?: string;
  format?: string;
  availableStock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Collection {
  _id: string;
  name: string;
  description: string;
  userId: string;
  bookIds: string[];
  bookCount?: number;
  coverImage?: string;
  books?: Book[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BorrowedBook {
  _id: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone?: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'overdue' | 'returned';
  fine?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Additional utility types for API responses
export interface BorrowBookRequest {
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone?: string;
  bookId: string;
  dueDate: string; // ISO date string
  notes?: string;
}

export interface ReturnBookRequest {
  fine?: number;
  notes?: string;
}

export interface BorrowBookResponse {
  success: boolean;
  message: string;
  borrowId?: string;
}

export interface ReturnBookResponse {
  success: boolean;
  message: string;
}

export interface LibraryStats {
  totalBooks: number;
  totalBorrowed: number;
  currentlyBorrowed: number;
  overdueBooks: number;
  totalFines: number;
  availableBooks: number;
}

export interface Message {
  type: "success" | "error";
  text: string;
}