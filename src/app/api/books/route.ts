// File: app/api/books/route.ts - Books API routes
import { NextRequest, NextResponse } from "next/server";
import { addBook, getBooks, searchBooks } from "../../../lib/mongodb";

// GET /api/books - Get all books or search with query
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "100");

    // If there's a query, search books, otherwise get all books
    const books = query
      ? await searchBooks(query, limit)
      : await getBooks(limit);

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
  try {
    const bookData = await request.json();

    // Basic validation for the title and author fields
    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

    // You can validate or process other fields here if needed
    if (!bookData.publishedDate) {
      bookData.publishedDate = new Date().toISOString(); // default to today's date if not provided
    }

    const result = await addBook(bookData);

    return NextResponse.json(
      { id: result.insertedId, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}
